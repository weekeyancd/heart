# Step 0 研究报告

> 心脏解剖与血液循环互动教学平台 — 技术选型与复用研究

## 1. 现有开源项目评估

### 结论：无单一项目可 fork，需组合复用

| 项目 | Stars | 技术栈 | 亮点 | 缺口 | 复用价值 |
|------|-------|--------|------|------|----------|
| **Human-Organ3D** | 5 | HTML/Three.js | 3D 心脏+器官动画，教育导向 | 无血流、无后端 | 动画模式参考 |
| **Bio_animations** | 0 | React+Vite+R3F | 技术栈完全匹配，可点击标注 | 早期阶段 | 架构参考 |
| **Interactive-heart** | 0 | HTML/CSS/JS | 解剖+血流+ECG 内容最全 | 单文件、2D | 教学内容提取 |
| **pvc-heart-tool** | 2 | TypeScript | 3D 心脏查看器，ECG 关联 | EP 专用 | TypeScript 模式 |
| **AnatomyWorld3D** | 0 | Next.js+Three.js+Supabase | 测验+进度面板 | 技术栈不匹配 | 教育功能参考 |
| **Blood-Flow-Animation** | 2 | JavaScript | 唯一专注血流粒子动画 | 血管级非心脏级 | 粒子动画技术 |
| **OPANEX** | 7 | TypeScript (Apache 2.0) | Web 解剖图谱查看器 | 通用非心脏专用 | 架构参考 |

**复用策略**：
- 3D 心脏模型 + 动画 → 参考 Human-Organ3D / Bio_animations
- 血流粒子动画 → 参考 Blood-Flow-Animation
- 教育功能（测验、进度）→ 参考 AnatomyWorld3D
- React Three Fiber 基础 → 参考 Bio_animations（技术栈完全匹配）
- 教学内容 → 从 Interactive-heart 提取

## 2. 前端 3D 库选型

### 结论：React Three Fiber + Drei（确认与现有设计一致）

| 方案 | 评分 | 适配度 |
|------|------|--------|
| **R3F + Drei** | 82 | React 一等公民、内置射线检测、glTF 加载、生态最全 |
| Three.js 原生 | 64 | 需手写 Raycaster/生命周期管理 |
| Babylon.js | 61 | React 集成弱、包体大（4MB） |
| Cesium | 23 | 地理专用，不适用 |
| A-Frame | 34 | HTML 优先，与 React 冲突 |

**推荐依赖栈**（与设计文档一致）：

```
@react-three/fiber@9     — React 渲染器
@react-three/drei@9      — useGLTF, OrbitControls, Html, Outline
@react-three/postprocessing — 选中高亮效果
three@0.170+             — 底层 3D 引擎
zustand                  — 状态管理
```

### R3F 关键实现模式

**射线检测（与设计文档 Raycast 优化方案互补）**：
- R3F 内置 `onClick`/`onPointerOver` 事件，基于 Three.js Raycaster
- `e.stopPropagation()` 阻止事件冒泡（关键：心脏模型部位重叠）
- `e.object.name` 识别部位
- 设计文档的 RAF throttle + 位移阈值 + BVH + Hit Cache 在 R3F 的 `useFrame` 中实现

**粒子路径动画**：
- `CatmullRomCurve3` 定义循环路径
- `InstancedMesh` 批量渲染粒子（设计文档已采用此方案）
- `useFrame` 逐帧推进粒子 `t` 参数
- 三方库 `three.quarks` + `quarks.r3f`（MIT，有 R3F 集成）可作为备选，但 MVP 用原生 `InstancedMesh` 即可

**glTF 加载**：
- `useGLTF` hook 加载模型，按名访问 `nodes.leftVentricle`
- Draco 压缩（`useGLTF.preload` 支持），设计文档的 pipeline 已采用
- `<Suspense>` 包裹异步加载

## 3. 3D 心脏模型资源

### 与设计文档模型方案的对照

设计文档采用**参数化建模 + Phase 2 替换高质量外部模型**的演进路线。研究确认此策略合理，并提供 Phase 2 可用资源：

| 来源 | 许可证 | 说明 | 适用阶段 |
|------|--------|------|----------|
| 参数化生成（trimesh） | 自有 | 14 分区，17KB Draco 压缩 | Phase 1（当前） |
| Sketchfab "Beating-heart" | CC BY 4.0 | 含心跳动画，可下载 glTF | Phase 2 候选 |
| Sketchfab "Realistic Human Heart" | CC BY 4.0 | 静态高精度，11K 顶点 | Phase 2 候选 |
| BodyParts3D (GitHub 111★) | CC BY-SA 2.1 JP | 934 个 STL，心脏子结构齐全 | Phase 2 候选（需转 glTF） |
| Z-Anatomy "Angiology" | CC BY-SA 4.0 | 完整血管系统（200万+顶点） | Phase 2 血管补充 |

**Phase 2 替换策略补充**：
- 设计文档的 Segmentation Engine（空间规则分割）是正确方向
- BodyParts3D 已按 FMA 本体分好子结构（心脏、左心室、主动脉等），可跳过分割直接使用
- Sketchfab 的 CC BY 4.0 模型需要 Blender 手动分区 + extras 标注，工作量较大

### 血流粒子库评估

| 库 | 许可证 | R3F 兼容 | 评价 |
|----|--------|----------|------|
| **原生 InstancedMesh + CatmullRomCurve3** | 无依赖 | 原生 | MVP 推荐，简单可控 |
| three.quarks + quarks.r3f | MIT | 有集成 | 成熟粒子系统，备选 |
| r3f-particle-system | MIT | 原生 | FBO 模拟，实验性 |
| hz-particles | - | 有 | WebGPU only，兼容性差 |

**结论**：MVP 用原生方案，与设计文档一致。后续如需更丰富的粒子效果（发射器、生命周期），可引入 three.quarks。

## 4. 后端架构

### 与设计文档现有方案的对照

| 决策 | 设计文档方案 | 研究建议 | 是否需要调整 |
|------|-------------|---------|-------------|
| 层级建模 | 硬编码 14 部位 | 邻接表 self-ref FK + JPA | Phase 1 用硬编码合理；引入 DB 时用邻接表 |
| 跨引用关系 | JSON 内嵌 relations | 单 PartRelation 表 + type 枚举 | Phase 1 内嵌即可；DB 化时建议拆表 |
| API 端点 | `/api/parts`, `/api/circulation`, `/api/models/meta` | `/api/anatomy/**`, `/api/circulation/**`, `/api/knowledge/**` | 建议按领域分组，更清晰 |
| 种子数据 | 硬编码 DataInitializer | `data.sql` + slug 子查询 | Phase 1 硬编码；DB 化时迁移到 SQL |
| 进度追踪 | 未涉及 | session UUID + ManyToMany | MVP 不做；Phase 4 知识引导可用 Zustand 本地状态 |
| API 信封 | `{ success, version, updatedAt, data, error }` | 与 contracts.ts 完全一致 | 无需调整 |

**建议的 API 端点重构**（更 RESTful，按资源分组）：

```
/api/anatomy/parts           → 批量部位
/api/anatomy/parts/{slug}    → 单个部位
/api/anatomy/tree            → 层级树
/api/anatomy/meta            → 模型元数据（颜色映射+遮挡）
/api/circulation/paths       → 循环路径列表
/api/circulation/paths/{id}  → 单条路径
/api/knowledge/{sessionId}   → 学习状态（后续）
```

### Phase 1 保持不变

设计文档的 Phase 1 方案（硬编码 DataInitializer、内存数据）完全合理。研究确认：
- 14 个部位数据量小，硬编码比引入 DB 更简单
- 后端 API 骨架先搭好，数据源后续可替换
- MVP 不需要 JPA/H2，减少复杂度

## 5. 研究结论与设计文档的一致性

| 维度 | 设计文档 | 研究结论 | 一致性 |
|------|---------|---------|--------|
| 3D 库 | R3F + Drei | R3F + Drei（评分 82，远超备选） | 完全一致 |
| 状态管理 | Zustand | Zustand | 完全一致 |
| 模型格式 | GLB + extras partId | GLB + extras partId | 完全一致 |
| 粒子方案 | InstancedMesh | InstancedMesh（MVP），three.quarks（备选） | 一致，补充备选 |
| Raycast 优化 | RAF throttle + BVH + Hit Cache | R3F useFrame 中实现，模式相同 | 一致，补充 R3F 事件桥接 |
| 材质策略 | MeshStandardMaterial + onBeforeCompile | 同 | 完全一致 |
| 后端数据 | 硬编码 MVP | 硬编码 MVP 合理，DB 化建议邻接表 | 一致，补充演进路径 |
| API 端点 | /api/parts 等 | 建议按 /api/anatomy/** 分组 | 微调建议 |

**总体结论**：设计文档的技术选型经过研究验证，全部合理。无需推翻重选。研究补充了 Phase 2 模型资源、粒子库备选、后端 DB 化演进路径，以及 API 分组建议。
