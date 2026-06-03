# Heart 平台 MVP 实现计划

> 基于 `docs/superpowers/specs/2026-05-30-heart-platform-design.md` 设计文档

## 阶段概览

| Phase | 内容 | 预估文件数 |
|-------|------|-----------|
| 1 | 共享契约 + 前端基础设施 + 后端 API 骨架 | ~18 |
| 2 | 3D 心脏模型加载 + 交互状态机 | ~15 |
| 3 | 血液循环动画系统 | ~10 |
| 4 | 学习引导 + UI 打磨 | ~8 |

## 系统依赖图

```
Contract Layer (类型契约)
    ↓
SemanticMeshLayer (模型语义层)
    ↓
Interaction System (交互层)
    ↓
Material System (材质系统)
    ↓
Circulation System (循环动画)
    ↙          ↘
FlowScheduler   ParticleSystem
    ↓
Guided System (引导系统)
    ↓
Knowledge State (学习状态)
```

关键依赖规则：
- 不允许跳层依赖（如 Guided 不直接操作 Mesh）
- 每层只依赖下一层的抽象接口
- Contract Layer 无依赖，所有模块依赖它

## 模型演进路线图

项目核心是 `mesh → partId → interaction → blood flow graph`，焦点在语义结构而非建模能力。

```
Phase 1（当前 MVP）: 参数化模型 → semantic GLB
  - trimesh 参数化生成（旋转体/圆柱体/圆环）
  - 天然分区，extras 标注 partId + type
  - 验证交互架构，形态概念性

Phase 2（增强）: 外部 OBJ/STL → semantic GLB
  - 从免费模型库获取高质量医学心脏模型
  - Segmentation Engine 按空间规则分区
  - 替换参数化模型，前端代码无需修改

Phase 3（长期）: CT/MRI 体素重建
  - 公开医学影像数据集（BodyParts3D / NIH Visible Human）
  - Marching Cubes → mesh cleanup → 分区
  - 医学级解剖精度
```

### 模型 Pipeline（已验证）

```
trimesh 参数化建模 → Scene 组装 → GLB 导出
    → pygltflib 标注 extras { partId, type }
    → Topology Validator（验证 14 个分区完整性）
    → gltf-transform Draco 压缩优化
    → frontend/public/models/heart.glb
```

验证结果：
- 14 个分区 mesh 全部生成
- extras 标注 partId + type 全部正确
- 压缩前 155KB → Draco 压缩后 17KB
- 每个部位 ~1000-2000 面（可调）

### 已知风险

| 风险 | 说明 | 缓解 |
|------|------|------|
| 外部模型通常不分区 | 获取的 OBJ/STL 可能是整体 mesh | Phase 2 引入 Segmentation Engine，基于空间规则分割 |
| 参数化模型形态概念性 | 旋转体/圆柱体不像真实心脏 | Phase 2 替换为高质量外部模型 |
| extras 在某些 pipeline 下可能丢失 | glTF loader 行为差异 | SemanticMeshLayer 加载后强制重建映射 |

### Segmentation Engine 策略（Phase 2 预留）

引入外部模型时的分割策略优先级：
1. 基于 mesh name — 简单但不可靠
2. **基于空间规则**（推荐）— 按坐标/法线方向判断分区，可控
3. 基于几何聚类 — 医学级方案，k-means / region growing

---

## Phase 1: 基础设施

### Step 1.0: 共享类型契约（最优先）

前后端统一类型定义，后续所有模块直接依赖。

**产出文件**：
- `frontend/src/lib/contracts.ts` — 完整类型定义

```typescript
// 核心类型契约
interface HeartPart {
  id: string
  nameZh: string
  nameEn: string
  type: 'chamber' | 'vessel' | 'valve' | 'structure'
  layers: {
    anatomy: string
    physiology: string
    clinical?: string  // 留扩展位
  }
  relations: {
    connectsTo: string[]
    supplies: string[]
    receivesFrom: string[]
    affectedBy: string[]  // 留扩展位
  }
  circulationPaths: string[]
  funFact: string
}

interface CirculationPath {
  id: string
  nameZh: string
  nameEn: string
  nodes: { partId: string; position: [number, number, number] }[]
  edges: {
    from: string
    to: string
    direction: 'oxy' | 'deoxy'
    duration: number
    delay: number
    oxygenLevel: number
  }[]
  animationSpeed: number
}

interface ModelMeta {
  partIds: string[]
  colorMapping: Record<string, { base: string; oxy: string; deoxy: string }>
  occlusionMap: Record<string, string[]>
}

interface ApiResponse<T> {
  success: boolean
  version: string
  updatedAt: string
  data: T
  error: string | null
}

interface RenderState {
  baseColor: Color
  emissive: number
  opacity: number
  scale: number
  pulse: boolean
  oxygenLevel: number       // 预留，MVP 不使用
  bloodFlowIntensity: number // 预留，MVP 不使用
}

interface FlowSchedule {
  loop: 'systemic' | 'pulmonary'
  startTime: number
  duration: number
  phaseOffset: number
}

interface KnowledgeState {
  visitedParts: Set<string>
  completedGuidedSteps: number
}
```

后端 DTO 严格对齐此契约的字段名和结构。

### Step 1.1: 前端依赖安装与配置

安装 R3F 核心依赖和工具库：

```bash
cd frontend
npm install three @react-three/fiber @react-three/drei zustand
npm install -D @types/three vitest @testing-library/react
```

配置 Vitest（`frontend/vite.config.ts` 增加 test 配置）。

**产出文件**：
- `frontend/package.json` — 更新依赖
- `frontend/vite.config.ts` — 增加 vitest 配置
- `frontend/tsconfig.app.json` — 确保 three 类型可用

### Step 1.2: 后端数据模型 + API

创建心脏部位实体、DTO、Repository、Service、Controller。数据硬编码初始化（MVP 用内存数据，不走数据库）。DTO 严格对齐 contracts.ts 中 HeartPart 类型。

**产出文件**：
- `backend/src/main/java/com/heart/model/HeartPart.java` — 实体
- `backend/src/main/java/com/heart/model/dto/HeartPartDto.java` — DTO（含 layers、relations）
- `backend/src/main/java/com/heart/model/dto/ApiResponse.java` — 统一响应
- `backend/src/main/java/com/heart/repository/HeartPartRepository.java` — 暂用内存 Map
- `backend/src/main/java/com/heart/service/HeartPartService.java` — 业务逻辑
- `backend/src/main/java/com/heart/controller/HeartPartController.java` — REST 端点
- `backend/src/main/java/com/heart/service/DataInitializer.java` — 14 个部位数据初始化

### Step 1.3: 后端循环路径 API

创建 PathGraph 数据模型和 API 端点，返回体循环和肺循环的节点/边/时间信息。DTO 对齐 CirculationPath 契约。

**产出文件**：
- `backend/src/main/java/com/heart/model/dto/CirculationPathDto.java` — PathGraph DTO
- `backend/src/main/java/com/heart/service/CirculationService.java` — 路径数据
- `backend/src/main/java/com/heart/controller/CirculationController.java` — 端点

### Step 1.4: 后端模型元数据 API

返回分区 ID 列表、材质颜色映射、遮挡关系图。DTO 对齐 ModelMeta 契约。

**产出文件**：
- `backend/src/main/java/com/heart/model/dto/ModelMetaDto.java` — 元数据 DTO
- `backend/src/main/java/com/heart/service/ModelMetaService.java` — 遮挡关系+颜色映射
- `backend/src/main/java/com/heart/controller/ModelMetaController.java` — 端点

### Step 1.5: 前端 API 客户端 + Zustand Store

创建统一 API 客户端和 Zustand store。所有类型从 contracts.ts 导入。

**产出文件**：
- `frontend/src/lib/api.ts` — API 客户端（fetch 封装，类型化，返回类型对齐 ApiResponse<T>）
- `frontend/src/store/heartStore.ts` — Zustand store（hoverId、selectedId、guidedStep + actions）
- `frontend/src/store/knowledgeStore.ts` — 学习状态 store（visitedParts、completedGuidedSteps）

**Step 1.5 测试**：
- `frontend/src/store/__tests__/heartStore.test.ts` — store actions 单元测试
- `frontend/src/store/__tests__/knowledgeStore.test.ts` — 学习状态测试
- `frontend/src/lib/__tests__/api.test.ts` — API 客户端 mock 测试

---

## Phase 2: 3D 心脏模型 + 交互

### Step 2.1: 心脏参数化模型 + Pipeline 脚本

使用 trimesh 参数化生成心脏模型（旋转体心腔 + 圆柱体血管 + 圆环瓣膜），pygltflib 标注 extras，gltf-transform 优化。Topology Validator 验证 14 个分区完整性。

**产出文件**：
- `frontend/public/models/heart.glb` — 参数化心脏模型
- `scripts/generate_heart_model.py` — 完整 pipeline 脚本（trimesh → pygltflib → gltf-transform）
- `scripts/validate_topology.py` — Topology Validator（验证分区完整性、extras 正确性）

### Step 2.2: 心脏 3D 场景搭建 + SemanticMeshLayer

创建 R3F Canvas 场景，加载 glTF 模型。加载后立即构建 SemanticMeshLayer——统一管理 rawMesh / segments / mapping / occlusionMap。后续所有交互只通过 SemanticMeshLayer 访问，不遍历 scene。

**产出文件**：
- `frontend/src/components/heart/HeartScene.tsx` — R3F Canvas + 灯光 + 相机 + OrbitControls
- `frontend/src/components/heart/HeartModel.tsx` — glTF 加载 + SemanticMeshLayer 构建
- `frontend/src/lib/semanticMeshLayer.ts` — SemanticMeshLayer 类

```typescript
interface SemanticMeshLayer {
  rawMeshes: Map<string, Mesh>              // partId → 原始 mesh
  segments: Map<string, PartInfo>           // partId → 分区信息
  mapping: Map<Mesh, string>                // mesh → partId 反查
  occlusionMap: Record<string, string[]>    // 遮挡关系

  get(partId: string): Mesh | undefined
  getAll(): Map<string, Mesh>
  getByType(type: string): Mesh[]
  getPartId(mesh: Mesh): string | undefined
}
```

**强制规则**：Interaction / Material / Circulation 层只通过 SemanticMeshLayer 访问 mesh，不允许直接遍历 scene.children。

### Step 2.3: Render Resolver + MaterialController

实现纯函数 Render Resolver（含遮挡逻辑）和 MaterialController 抽象层。MaterialController 使用完整 MaterialState schema，MVP 只填充前 5 个字段（baseColor、emissive、opacity、scale、pulse）。

**产出文件**：
- `frontend/src/lib/renderResolver.ts` — getRenderState 纯函数（含遮挡 + sameRegion 判断）
- `frontend/src/lib/materialController.ts` — MaterialController 类（onBeforeCompile 实现，完整 MaterialState 接口）

**Step 2.3 测试**：
- `frontend/src/lib/__tests__/renderResolver.test.ts` — 所有状态组合单元测试（选中/遮挡/同区域/远端/hover/default）

### Step 2.4: 交互层 + Pointer Buffer + Raycast 优化

实现 Interaction Layer 事件绑定、Pointer Event Buffer（每帧只处理最后一次事件）、hover debounce、raycast throttle + Hit Cache + BVH。

**事件流**：
```
PointerEvent → InputBuffer → RAF flush → RaycastEngine → Store
```

**产出文件**：
- `frontend/src/lib/inputBuffer.ts` — Pointer 事件缓冲（latestEvent + RAF flush）
- `frontend/src/lib/raycastEngine.ts` — raycast 引擎（throttle + 位移阈值 + Hit Cache + BVH）
- `frontend/src/hooks/useHeartInteraction.ts` — 自定义 hook 封装交互逻辑（通过 SemanticMeshLayer）

**Step 2.4 测试**：
- `frontend/src/lib/__tests__/raycastEngine.test.ts` — Hit Cache 逻辑单元测试
- `frontend/src/lib/__tests__/inputBuffer.test.ts` — Buffer flush 逻辑测试

### Step 2.5: InfoPanel UI

右侧信息面板，显示选中部位的解剖/生理信息 + 关系网络。已访问部位显示标记（通过 KnowledgeStore）。

**产出文件**：
- `frontend/src/components/ui/InfoPanel.tsx` — 信息面板组件
- `frontend/src/components/ui/PartRelations.tsx` — 关系网络可视化（连接列表）

### Step 2.6: 主页面集成

整合所有组件到主页面，实现完整数据流：API → 缓存 → 交互 → 渲染。

**产出文件**：
- `frontend/src/pages/HeartPage.tsx` — 主页面（场景 + UI Overlay）
- `frontend/src/App.tsx` — 更新入口，替换 Vite 默认内容
- `frontend/src/index.css` — 全局样式重写

---

## Phase 3: 血液循环动画

### Step 3.1: PathGraph 渲染器 + Flow Scheduler

根据 PathGraph 数据生成粒子路径。Flow Scheduler 控制全局时间调度——体循环和肺循环的启动时间、相位偏移、同步/异步播放。

**产出文件**：
- `frontend/src/lib/flowScheduler.ts` — FlowScheduler 类（schedule 管理、时间同步、step play）
- `frontend/src/lib/circulationRenderer.ts` — PathGraph → 粒子路径计算
- `frontend/src/lib/particleSystem.ts` — 粒子系统（InstancedMesh、颜色渐变、oxygenLevel 映射）

**Step 3.1 测试**：
- `frontend/src/lib/__tests__/flowScheduler.test.ts` — 调度逻辑测试（同步/异步/step play）
- `frontend/src/lib/__tests__/circulationRenderer.test.ts` — PathGraph 路径计算测试

### Step 3.2: 循环动画控制

播放/暂停/重置控制，逐步播放（学习模式），Flow Schedule 可视化。

**产出文件**：
- `frontend/src/components/circulation/CirculationScene.tsx` — 血液循环 R3F 场景层
- `frontend/src/components/circulation/CirculationControls.tsx` — 播放控制 UI
- `frontend/src/hooks/useCirculationAnimation.ts` — 动画控制 hook（对接 FlowScheduler）
- `frontend/src/store/circulationStore.ts` — 循环动画状态（Zustand）

**Step 3.2 测试**：
- `frontend/src/store/__tests__/circulationStore.test.ts` — 动画状态测试

### Step 3.3: 体循环 + 肺循环集成

将两条核心路径集成到心脏场景中，粒子从心腔流向血管。通过 FlowScheduler 控制同步播放。

**产出文件**：
- 更新 `frontend/src/components/heart/HeartScene.tsx` — 集成循环动画层

---

## Phase 4: 学习引导 + UI 打磨

### Step 4.1: Guided Mode + Knowledge State

6 步引导流程，逐步高亮部位 + 播放动画。Knowledge State 追踪已访问部位和引导进度。

**产出文件**：
- `frontend/src/components/guided/GuidedModePanel.tsx` — 引导面板 UI
- `frontend/src/lib/guidedSteps.ts` — 6 步引导配置数据
- `frontend/src/hooks/useGuidedMode.ts` — 引导逻辑 hook（对接 KnowledgeStore）

### Step 4.2: Toolbar + 整体 UI

顶部工具栏（循环路径切换、引导入口、重置视图）。

**产出文件**：
- `frontend/src/components/ui/Toolbar.tsx` — 工具栏
- `frontend/src/components/ui/PathSelector.tsx` — 循环路径选择器

### Step 4.3: 样式打磨

全局样式、响应式布局、过渡动画。

**产出文件**：
- 更新 `frontend/src/index.css` — 全局样式
- `frontend/src/components/ui/InfoPanel.tsx` — 样式优化
- `frontend/src/components/ui/GuidedModePanel.tsx` — 样式优化

### Step 4.4: 测试

Playwright E2E 测试（核心用户流程）+ 2D UI overlay 视觉回归截图。

**产出文件**：
- `frontend/e2e/heart-exploration.spec.ts` — 3D 探索流程
- `frontend/e2e/circulation-animation.spec.ts` — 血流动画流程
- `frontend/e2e/guided-mode.spec.ts` — 引导流程
- `frontend/e2e/visual-regression.spec.ts` — UI overlay 截图对比（InfoPanel、GuidedModePanel）

---

## 构建顺序（依赖链）

```
Phase 1:
  Step 1.0 (contracts) ──────────────────┐
  Step 1.1 (deps) ───────────────────────┤
  Step 1.2 (backend parts) ──────────────┤→ Step 1.5 (API client + stores)
  Step 1.3 (backend circulation) ────────┤
  Step 1.4 (backend model meta) ─────────┘

Phase 2:
  Step 2.1 (parametric model + pipeline script)
    → Step 2.2 (scene + SemanticMeshLayer)
    → Step 2.3 (Render Resolver + MaterialController)
    → Step 2.4 (Interaction + Pointer Buffer + Raycast)
    → Step 2.5 (InfoPanel)
    → Step 2.6 (main page integration)

Phase 3:
  Step 3.1 (Flow Scheduler + PathGraph renderer)
    → Step 3.2 (animation controls)
    → Step 3.3 (integration into scene)

Phase 4:
  Step 4.1 (Guided Mode + Knowledge State)
    → Step 4.2 (Toolbar)
    → Step 4.3 (styles)
    → Step 4.4 (tests)
```

Phase 1 中 1.0 必须最先完成，1.2/1.3/1.4 可并行，1.5 依赖 1.0+1.2+1.3+1.4。

## 关键风险

| 风险 | 缓解 |
|------|------|
| 参数化模型形态概念性 | MVP 验证架构，Phase 2 替换高质量外部模型，前端代码无需修改 |
| 外部模型通常不分区 | Phase 2 引入 Segmentation Engine，基于空间规则分割（推荐策略） |
| extras 在某些 pipeline 下可能丢失 | SemanticMeshLayer 加载后强制重建映射，不依赖 extras 作为唯一来源 |
| onBeforeCompile 在 Three.js 升级时 break | MaterialController 抽象层隔离，完整 MaterialState schema 预留扩展字段 |
| 血液粒子动画性能 | 限制粒子数量，使用 InstancedMesh |
| Raycast 性能 | BVH + Hit Cache + throttle + Pointer Buffer 四重保障 |
| 前后端类型不一致 | Contract First：contracts.ts 为唯一类型源，后端 DTO 对齐 |
| 血流动画不同步 | FlowScheduler 全局时间调度，控制相位偏移 |
