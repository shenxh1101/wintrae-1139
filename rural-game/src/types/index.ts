export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type FacilityType = 'farm' | 'homestay' | 'warehouse' | 'clinic' | 'square';
export type TaskType = 'environment' | 'agriculture' | 'eldercare' | 'flood';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type FacilityStatus = 'normal' | 'upgrading' | 'maintenance';
export type AnnualRating = 'S' | 'A' | 'B' | 'C' | 'D';

export interface Position {
  x: number;
  y: number;
}

export interface Facility {
  id: string;
  type: FacilityType;
  position: Position;
  level: number;
  status: FacilityStatus;
  output: number;
  cost: number;
  maintenanceCost: number;
  satisfactionBonus: number;
}

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  deadline: number;
  reward: {
    money?: number;
    labor?: number;
    materials?: number;
  };
  status: TaskStatus;
  requiredSkill?: string;
}

export interface Villager {
  id: string;
  name: string;
  age: number;
  satisfaction: number;
  skills: string[];
  needs: string[];
  participation: number;
  health: number;
}

export interface Statistics {
  totalIncome: number;
  totalExpense: number;
  publicServiceCoverage: number;
  ecologicalScore: number;
  riskEvents: number;
  completedTasks: number;
  failedTasks: number;
  builtFacilities: number;
}

export interface GameState {
  year: number;
  season: Season;
  day: number;
  money: number;
  labor: number;
  materials: number;
  facilities: Facility[];
  villagers: Villager[];
  currentTasks: Task[];
  completedTasks: Task[];
  statistics: Statistics;
  isPaused: boolean;
  gameSpeed: number;
}

export interface Archive {
  id: string;
  saveTime: string;
  gameState: GameState;
  year: number;
  season: Season;
}

export interface GameStore extends GameState {
  buildFacility: (type: FacilityType, position: Position) => void;
  upgradeFacility: (id: string) => void;
  demolishFacility: (id: string) => void;
  acceptTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  failTask: (taskId: string) => void;
  advanceDay: () => void;
  advanceSeason: () => void;
  updateVillagerSatisfaction: (delta: number) => void;
  saveGame: () => void;
  loadGame: (archive: Archive) => void;
  resetGame: () => void;
  generateNewTasks: () => void;
  calculateSeasonOutput: () => void;
}

export interface UIState {
  selectedFacility: Facility | null;
  selectedPosition: Position | null;
  showBuildPanel: boolean;
  showTaskDetails: Task | null;
  showSaveDialog: boolean;
  showLoadDialog: boolean;
  notification: string | null;
  activeTab: 'map' | 'tasks' | 'resources' | 'villagers' | 'achievements';
}
