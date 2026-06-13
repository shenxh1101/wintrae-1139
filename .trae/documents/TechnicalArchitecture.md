# 数字乡村桌面游戏 - 技术架构文档

## 1. 架构设计

```
┌─────────────────────────────────────────┐
│              前端应用层                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│  │  地图   │ │  任务   │ │  资源   │ │
│  │  界面   │ │  界面   │ │  界面   │ │
│  └────┬────┘ └────┬────┘ └────┬────┘ │
│  ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ │
│  │  村民   │ │  成果   │ │  导航   │ │
│  │  界面   │ │  界面   │ │  组件   │ │
│  └────┬────┘ └────┬────┘ └────┬────┘ │
│       └───────────┼───────────┘       │
│  ┌────────────────┼──────────────────┐│
│  │        状态管理层 (Zustand)        ││
│  │  ┌──────────┐ ┌──────────────┐   ││
│  │  │GameState │ │ UIState      │   ││
│  │  └──────────┘ └──────────────┘   ││
│  └────────────────┼──────────────────┘│
│                   │                    │
│  ┌────────────────┼──────────────────┐│
│  │        数据持久层 (LocalStorage)   ││
│  │  ┌──────────┐ ┌──────────────┐   ││
│  │  │ Archive  │ │ Settings     │   ││
│  │  └──────────┘ └──────────────┘   ││
│  └───────────────────────────────────┘│
└───────────────────────────────────────┘
```

## 2. 技术栈

- **前端框架**：React 18
- **类型系统**：TypeScript
- **样式方案**：Tailwind CSS
- **状态管理**：Zustand
- **路由管理**：React Router v6
- **构建工具**：Vite
- **包管理器**：npm（Windows环境）

## 3. 路由定义

| 路由路径 | 页面组件 | 功能描述 |
|---------|---------|---------|
| /map | MapPage | 地图主界面，展示乡村全景和设施 |
| /tasks | TasksPage | 任务列表，接收和处理任务 |
| /resources | ResourcesPage | 资源管理，查看资金、人力、物资 |
| /villagers | VillagersPage | 村民信息，满意度、技能、需求 |
| /achievements | AchievementsPage | 成果统计，年度评价和存档 |

## 4. 核心数据结构

### 4.1 游戏状态（GameState）
```typescript
interface GameState {
  year: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  day: number;
  money: number;
  labor: number;
  materials: number;
  facilities: Facility[];
  villagers: Villager[];
  currentTasks: Task[];
  completedTasks: Task[];
  archives: Archive[];
  achievements: Achievement[];
  statistics: Statistics;
}

interface Facility {
  id: string;
  type: 'farm' | 'homestay' | 'warehouse' | 'clinic' | 'square';
  position: { x: number; y: number };
  level: number;
  status: 'normal' | 'upgrading' | 'maintenance';
  output: number;
  cost: number;
}

interface Task {
  id: string;
  type: 'environment' | 'agriculture' | 'eldercare' | 'flood';
  title: string;
  description: string;
  deadline: number;
  reward: { money?: number; labor?: number; materials?: number };
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

interface Villager {
  id: string;
  name: string;
  satisfaction: number;
  skills: string[];
  needs: string[];
  participation: number;
}

interface Statistics {
  totalIncome: number;
  publicServiceCoverage: number;
  ecologicalScore: number;
  riskEvents: number;
  annualRating: 'S' | 'A' | 'B' | 'C' | 'D';
}
```

### 4.2 存档结构（Archive）
```typescript
interface Archive {
  id: string;
  saveTime: string;
  gameState: GameState;
  thumbnail?: string;
}
```

## 5. 组件层级结构

```
App
├── Navigation (Tab导航)
├── Layout
│   ├── Sidebar (侧边栏)
│   └── Content
│       ├── MapPage
│       │   ├── MapCanvas (地图画布)
│       │   ├── FacilityMarker (设施标记)
│       │   └── BuildPanel (建设面板)
│       ├── TasksPage
│       │   ├── TaskList (任务列表)
│       │   └── TaskCard (任务卡片)
│       ├── ResourcesPage
│       │   ├── ResourceCard (资源卡片)
│       │   └── SeasonPanel (季节面板)
│       ├── VillagersPage
│       │   ├── VillagerList (村民列表)
│       │   └── VillagerCard (村民卡片)
│       └── AchievementsPage
│           ├── StatisticsBoard (统计面板)
│           ├── RatingDisplay (年度评价)
│           └── ArchiveManager (存档管理)
```

## 6. 状态管理设计

### 6.1 全局状态（useGameStore）
- 管理游戏核心数据
- 提供游戏逻辑操作方法
- 处理存档读写

### 6.2 UI状态（useUIStore）
- 管理当前选中项
- 处理弹窗和提示
- 控制加载状态

## 7. 关键业务逻辑

### 7.1 季度结算
- 每30天触发一次
- 计算设施产出和成本
- 更新村民满意度
- 生成新任务

### 7.2 任务处理
- 自动刷新任务池
- 验证任务完成条件
- 发放任务奖励
- 记录任务历史

### 7.3 建设系统
- 验证建设条件（资金、位置）
- 扣除建设成本
- 添加新设施
- 更新资源产出

### 7.4 年度评价
- 收集四个维度数据
- 计算加权得分
- 评定等级
- 更新成就

## 8. 性能优化策略

- 使用React.memo优化组件渲染
- 状态更新使用Immer保证不可变性
- 地图使用虚拟滚动处理大量设施
- 图片资源使用懒加载
- CSS使用Tailwind的purge功能减少包体积

## 9. 文件结构

```
src/
├── components/
│   ├── Navigation.tsx
│   ├── Map/
│   │   ├── MapCanvas.tsx
│   │   ├── FacilityMarker.tsx
│   │   └── BuildPanel.tsx
│   ├── Tasks/
│   │   ├── TaskList.tsx
│   │   └── TaskCard.tsx
│   ├── Resources/
│   │   ├── ResourceCard.tsx
│   │   └── SeasonPanel.tsx
│   ├── Villagers/
│   │   ├── VillagerList.tsx
│   │   └── VillagerCard.tsx
│   └── Achievements/
│       ├── StatisticsBoard.tsx
│       ├── RatingDisplay.tsx
│       └── ArchiveManager.tsx
├── pages/
│   ├── MapPage.tsx
│   ├── TasksPage.tsx
│   ├── ResourcesPage.tsx
│   ├── VillagersPage.tsx
│   └── AchievementsPage.tsx
├── stores/
│   ├── gameStore.ts
│   └── uiStore.ts
├── utils/
│   ├── gameLogic.ts
│   ├── saveLoad.ts
│   └── calculations.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```
