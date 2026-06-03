# Heart — 心脏解剖与血液循环互动教学平台

一个帮助学生直观学习心脏各部位功能以及血液、氧气循环过程的互动网站。

## 技术栈

- **前端**: React + TypeScript + Vite
- **后端**: Spring Boot 3.3 + Java 17 + JPA
- **数据库**: H2 (开发) / PostgreSQL (生产)

## 开发

### 前端

```bash
cd frontend
npm install
npm run dev        # 启动开发服务器 (http://localhost:5173)
npm run build      # 构建生产版本
npm run test       # 运行测试
npm run lint       # 代码检查
```

### 后端

```bash
cd backend
./mvnw spring-boot:run                    # 启动后端服务 (http://localhost:8080)
./mvnw test                               # 运行所有测试
./mvnw test -Dtest=HeartApplicationTests  # 运行单个测试类
./mvnw clean package                      # 构建 JAR
```

## 项目结构

```
heart/
├── frontend/          # React + TypeScript 前端
│   ├── src/
│   │   ├── components/   # UI 组件
│   │   ├── hooks/        # 自定义 Hooks
│   │   ├── lib/          # 工具函数和 API 客户端
│   │   └── pages/        # 页面组件
│   └── ...
├── backend/           # Spring Boot 后端
│   └── src/main/java/com/heart/
│       ├── controller/   # REST 控制器
│       ├── service/      # 业务逻辑
│       ├── model/        # 实体和 DTO
│       ├── repository/   # 数据访问层
│       └── config/       # 配置类
└── ...
```
