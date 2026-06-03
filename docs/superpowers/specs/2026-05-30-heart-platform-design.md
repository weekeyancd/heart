# Heart 平台设计文档

> 心脏解剖与血液循环互动教学平台 — 完整设计规格

## 项目定位

心脏解剖与血液循环互动教学平台，面向通用科普，前后端分离架构。MVP 聚焦 3D 心脏探索 + 血液循环动画 + 学习引导。后续迭代扩展知识测验、心动周期演示、临床关联等内容。

## 整体架构

```
┌──────────────────────────────────────────────────┐
│  Frontend (React 19 + R3F + Zustand)             │
│  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ 3D Heart Scene   │  │ 2D UI Overlay        │  │
│  │ - HeartModel     │  │ - InfoPanel          │  │
│  │ - BloodFlow      │  │ - GuidedModePanel    │  │
│  │ - Animations     │  │ - Toolbar            │  │
│  └────────┬─────────┘  └─────────┬────────────┘  │
│           │                      │                │
│  ┌────────▼──────────────────────▼────────────┐  │
│  │          Interaction Layer                  │  │
│  │  hover(partId) / select(partId) / clear()  │  │
│  └────────────────────┬───────────────────────┘  │
│  ┌────────────────────▼───────────────────────┐  │
│  │          State Layer (Zustand)              │  │
│  │  hoverId: string | null                     │  │
│  │  selectedId: string | null                  │  │
│  │  guidedStep: number | null                  │  │
│  └────────────────────┬───────────────────────┘  │
│  ┌────────────────────▼───────────────────────┐  │
│  │       Render Resolver (纯函数)              │  │
│  │  getRenderState(partId, state) =>           │  │
│  │    { emissive, opacity, scale, pulse }      │  │
│  └────────────────────┬───────────────────────┘  │
│  ┌────────────────────▼───────────────────────┐  │
│  │       MaterialController (抽象层)           │  │
│  │  setState(partId, renderState)              │  │
│  │  内部: onBeforeCompile → 未来 ShaderMaterial│  │
│  └────────────────────────────────────────────┘  │
└─────────────────────┬────────────────────────────┘
                      │ REST API (JSON only)
┌─────────────────────▼────────────────────────────┐
│  Backend (Spring Boot 3.3 + Java 17)             │
│  GET  /api/parts       → 批量部位信息+关系网络    │
│  GET  /api/parts/:id   → 单个部位详情(备用)       │
│  GET  /api/circulation → 血液循环 PathGraph 数据  │
│  GET  /api/quizzes     → 测验题库                 │
│  GET  /api/progress    → 学习进度                 │
│  GET  /api/models/meta → 模型分区元数据            │
│  POST /api/auth        → 用户认证                 │
└───────────────────────────────────────────────────┘
```

## 三层状态架构

### Interaction Layer（只产出意图）

```
onPointerOver  → hover(partId)
onPointerOut   → clearHover()
onClick        → select(partId)
guidedNext     → select(step.partId)
```

不直接操作任何材质或视觉属性。

### State Layer (Zustand)

```typescript
interface HeartState {
  hoverId: string | null
  selectedId: string | null
  guidedStep: number | null  // null = 自由模式
}
```

单一数据源，驱动所有 UI 和渲染。

### Render Resolver（纯函数）

```typescript
function getRenderState(
  partId: string,
  state: { hoverId: string | null; selectedId: string | null },
  occlusionMap: Record<string, string[]>
): RenderState {
  if (state.selectedId === partId) {
    return { emissive: 0.6, opacity: 1.0, scale: 1.02, pulse: true }
  }
  if (state.selectedId !== null) {
    const occluders = occlusionMap[state.selectedId] || []
    if (occluders.includes(partId)) {
      return { emissive: 0.0, opacity: 0.12, scale: 1.0, pulse: false } // 遮挡层
    }
    if (sameRegion(state.selectedId, partId)) {
      return { emissive: 0.0, opacity: 0.35, scale: 1.0, pulse: false } // 同区域
    }
    return { emissive: 0.0, opacity: 0.6, scale: 1.0, pulse: false }    // 远端
  }
  if (state.hoverId === partId) {
    return { emissive: 0.3, opacity: 1.0, scale: 1.0, pulse: false }
  }
  return { emissive: 0.0, opacity: 1.0, scale: 1.0, pulse: false }
}
```

优先级：selected > occluder > same-region > far > hover > default。无副作用，可单元测试。

### 遮挡关系

选中内部结构时，外层和前方部位自动高度透明，让视线穿透。

| 部位类型 | 选中时行为 | opacity |
|---------|----------|---------|
| 遮挡层（在选中部位前方/外侧） | 高度透明穿透 | 0.1-0.15 |
| 同区域（如选中左心室，左心房） | 中度 dim | 0.35 |
| 远端（如选中左心室，右心房） | 轻度 dim | 0.6 |

遮挡关系数据由后端提供（`/api/models/meta`）：

```json
{
  "occlusionMap": {
    "left-ventricle": ["septum", "left-atrium"],
    "right-ventricle": ["septum", "right-atrium"],
    "left-atrium": ["aorta", "pulmonary-vein"],
    "right-atrium": ["superior-vena-cava", "inferior-vena-cava"]
  }
}
```

`sameRegion` 判断基于 `type` 字段：chamber 与 chamber 同区域，vessel 与 vessel 同区域。

### MaterialController（抽象层）

```typescript
class MaterialController {
  setState(partId: string, renderState: RenderState): void
}
```

MVP：`MeshStandardMaterial` + `onBeforeCompile` 注入 `highlight` / `dim` uniform。
后续：迁移纯 `ShaderMaterial`，只改 Controller 实现。
UI 层永远不直接操作 material。

## 模型方案

- **来源**：免费模型库获取 + glTF CLI 标注分区，或 `pygltflib` 程序化生成
- **格式**：GLB，存放 `frontend/public/models/heart.glb`
- **前端直接加载**，后端不转发模型文件

### 分区标识

每个解剖部位为独立 mesh，通过 glTF `extras` 标注：

```json
{ "extras": { "partId": "left-ventricle", "type": "chamber" } }
```

前端统一用 `mesh.userData.partId` 读取，不依赖 `mesh.name`。

### 14 个分区 mesh

| partId | 解剖部位 | type |
|--------|---------|------|
| `left-atrium` | 左心房 | chamber |
| `left-ventricle` | 左心室 | chamber |
| `right-atrium` | 右心房 | chamber |
| `right-ventricle` | 右心室 | chamber |
| `aorta` | 主动脉 | vessel |
| `pulmonary-artery` | 肺动脉 | vessel |
| `superior-vena-cava` | 上腔静脉 | vessel |
| `inferior-vena-cava` | 下腔静脉 | vessel |
| `pulmonary-vein` | 肺静脉 | vessel |
| `tricuspid-valve` | 三尖瓣 | valve |
| `mitral-valve` | 二尖瓣 | valve |
| `pulmonary-valve` | 肺动脉瓣 | valve |
| `aortic-valve` | 主动脉瓣 | valve |
| `septum` | 室间隔 | structure |

## 3D 交互设计

### 交互状态

| 状态 | emissive | opacity | scale | pulse |
|------|----------|---------|-------|-------|
| default | 0.0 | 1.0 | 1.0 | 否 |
| hover | 0.3 | 1.0 | 1.0 | 否 |
| selected | 0.6 | 1.0 | 1.02 | 是（心跳感） |
| occluder（遮挡层） | 0.0 | 0.12 | 1.0 | 否 |
| same-region（同区域） | 0.0 | 0.35 | 1.0 | 否 |
| far（远端） | 0.0 | 0.6 | 1.0 | 否 |

### 选中态视觉隔离

- camera subtle dolly in
- 遮挡层高度透明（opacity 0.1-0.15），穿透显示内部结构
- 同区域部位中度 dim，远端部位轻度 dim
- 选中部位 emissive pulse

### hover 稳定性

- 目标锁定 100-200ms debounce
- 鼠标位移阈值 < 2px 不触发 raycast

## Raycast 性能优化

1. `requestAnimationFrame` throttle，不每帧 raycast
2. 鼠标位移 < 2px 跳过
3. `three-mesh-bvh` 加速
4. Hit Cache Layer：相机未变且鼠标位移小时复用上次 hit 结果

```typescript
hitCache = {
  ray: Vector3,
  result: mesh | null
}
// camera 变化 或 鼠标位移 > 阈值 → 重新 raycast
// 否则 → 复用 cache
```

## 材质策略

- 1-3 个材质，按血流类型分组：含氧血（红）/ 脱氧血（蓝紫）/ 结构（粉白）
- MaterialController 抽象层：UI 不直接操作 material
- MVP：`MeshStandardMaterial` + `onBeforeCompile` 注入 uniform
- 后续：迁移纯 `ShaderMaterial`，只改 Controller 实现

## 数据模型

### 部位数据

`GET /api/parts` 批量预加载，前端 `Map<string, PartInfo>` 缓存，hover/click 只读缓存。

```json
{
  "version": "1.0",
  "updatedAt": "2026-05-30",
  "data": [
    {
      "id": "left-ventricle",
      "nameZh": "左心室",
      "nameEn": "Left Ventricle",
      "type": "chamber",
      "layers": {
        "anatomy": "左心室是心脏最厚的心腔，壁厚约 13-15mm...",
        "physiology": "负责将含氧血通过主动脉泵向全身各器官..."
      },
      "relations": {
        "connectsTo": ["aortic-valve"],
        "supplies": ["aorta"],
        "receivesFrom": ["left-atrium"],
        "affectedBy": []
      },
      "circulationPaths": ["systemic-loop", "pulmonary-return"],
      "funFact": "左心室壁厚度是右心室的3倍..."
    }
  ]
}
```

- `layers.anatomy` + `layers.phiology` — MVP 实现
- `layers.clinical` — 留扩展位，后续补充
- `relations.affectedBy` — 临床扩展字段留位

## 血液循环 PathGraph

```typescript
interface PathGraph {
  id: string
  nameZh: string
  nameEn: string
  nodes: {
    partId: string
    position: Vector3
  }[]
  edges: {
    from: string
    to: string
    direction: 'oxy' | 'deoxy'
    duration: number       // 粒子流过该段所需秒数
    delay: number          // 相对于路径开始的延迟秒数
    oxygenLevel: number    // 0-1, 驱动粒子颜色渐变
  }[]
  animationSpeed: number
}
```

### MVP 两条核心路径

1. **体循环**（systemic-loop）：左心室 → 主动脉 → 全身 → 上/下腔静脉 → 右心房
2. **肺循环**（pulmonary-loop）：右心室 → 肺动脉 → 肺部 → 肺静脉 → 左心房

### 支持能力

- 粒子沿路径流动动画
- 多路径高亮
- 逐步播放（学习模式）
- `oxygenLevel` 驱动粒子颜色渐变（含氧红 → 脱氧蓝紫）

## 学习引导系统（Guided Mode）

轻量版加入 MVP，引导学生逐步探索。用户可随时跳过进入自由模式。

### 引导步骤

| Step | 指令 | 触发 |
|------|------|------|
| 1 | "点击左心房开始探索" | 高亮左心房 |
| 2 | "血液从肺静脉流入左心房" | 播放肺静脉→左心房粒子动画 |
| 3 | "点击左心室，看血液如何泵出" | 高亮左心室 |
| 4 | "含氧血经主动脉流向全身" | 播放体循环路径 |
| 5 | "脱氧血经上/下腔静脉回到右心房" | 播放回程动画 |
| 6 | "现在自由探索心脏吧！" | 退出引导，进入自由模式 |

### Guided Mode UI

```
┌─────────────────────────────────────┐
│  Guided Mode Panel                  │
│                                     │
│  Step 1/6: 认识左心房               │
│  "肺部的含氧血通过肺静脉流入左心房"  │
│                                     │
│  [跳过引导]        [下一步 →]       │
└─────────────────────────────────────┘
```

引导状态存入 Zustand：`guidedStep: number | null`（null = 自由模式）。

## API 设计

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/parts` | GET | 批量获取所有部位信息 + relations |
| `/api/parts/:id` | GET | 单个部位详情（备用） |
| `/api/circulation` | GET | 血液循环 PathGraph 数据（体循环+肺循环） |
| `/api/models/meta` | GET | 模型分区 ID 列表 + 材质/颜色映射 + 遮挡关系 |
| `/api/quizzes` | GET | 测验题库（后续） |
| `/api/progress` | GET/POST | 学习进度（后续） |
| `/api/auth` | POST | 用户认证（后续） |

### 响应格式

```json
{
  "success": boolean,
  "version": "1.0",
  "updatedAt": "2026-05-30",
  "data": T,
  "error": string | null
}
```

## MVP 范围

### 做

- 3D 心脏模型加载与交互（旋转/缩放/点击探索）
- 三层状态架构（Interaction → State → Render Resolver）
- MaterialController 抽象层
- 交互状态机（hover/selected/dimmed）+ 视觉隔离
- InfoPanel（解剖 + 生理两层信息 + relations 关系网络）
- 血液循环动画（体循环 + 肺循环粒子动画，含时间维度）
- 学习引导系统（Guided Mode，6 步引导流程）
- 后端部位数据 API + 循环路径 API + 批量预加载
- Raycast 优化（RAF throttle + 位移阈值 + BVH + Hit Cache）

### 不做（后续迭代）

- 知识测验模块
- 心动周期演示
- 临床关联信息层（`layers.clinical` + `affectedBy`）
- 纯 ShaderMaterial 迁移
- LOD
- 用户系统 / 学习进度
- Instanced Picking Layer（mesh 数量 > 30 时引入）
