import { Facility, Season, Villager, Statistics, AnnualRating } from '../types';

export const FACILITY_CONFIG = {
  farm: {
    name: '农田',
    baseOutput: 100,
    baseCost: 500,
    maintenanceCost: 50,
    satisfactionBonus: 5,
    color: '#8B4513',
    icon: 'wheat',
  },
  homestay: {
    name: '民宿',
    baseOutput: 150,
    baseCost: 800,
    maintenanceCost: 80,
    satisfactionBonus: 10,
    color: '#E67E22',
    icon: 'home',
  },
  warehouse: {
    name: '仓储',
    baseOutput: 0,
    baseCost: 400,
    maintenanceCost: 30,
    satisfactionBonus: 3,
    color: '#95A5A6',
    icon: 'package',
  },
  clinic: {
    name: '卫生站',
    baseOutput: 0,
    baseCost: 600,
    maintenanceCost: 60,
    satisfactionBonus: 15,
    color: '#E74C3C',
    icon: 'heart',
  },
  square: {
    name: '文化广场',
    baseOutput: 0,
    baseCost: 700,
    maintenanceCost: 70,
    satisfactionBonus: 20,
    color: '#9B59B6',
    icon: 'users',
  },
};

export const SEASON_MULTIPLIERS: Record<Season, number> = {
  spring: 1.0,
  summer: 1.2,
  autumn: 1.5,
  winter: 0.6,
};

export const SEASON_NAMES: Record<Season, string> = {
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
  winter: '冬季',
};

export const TASK_TYPES = {
  environment: {
    name: '环境整治',
    color: '#27AE60',
    icon: 'leaf',
  },
  agriculture: {
    name: '助农销售',
    color: '#F39C12',
    icon: 'truck',
  },
  eldercare: {
    name: '老人关怀',
    color: '#E74C3C',
    icon: 'heart',
  },
  flood: {
    name: '防汛巡查',
    color: '#3498DB',
    icon: 'cloud-rain',
  },
};

export const SKILLS = [
  '农业技术',
  '医疗服务',
  '旅游服务',
  '工程建设',
  '文化教育',
  '行政管理',
];

export const VILLAGER_NEEDS = [
  '住房改善',
  '教育培训',
  '医疗保障',
  '文化娱乐',
  '就业机会',
  '收入提高',
];

export function calculateSeasonOutput(facilities: Facility[], season: Season): number {
  return facilities.reduce((total, facility) => {
    if (facility.type === 'farm') {
      const multiplier = SEASON_MULTIPLIERS[season];
      return total + facility.output * facility.level * multiplier;
    }
    if (facility.type === 'homestay') {
      const multiplier = SEASON_MULTIPLIERS[season];
      return total + facility.output * facility.level * multiplier;
    }
    return total;
  }, 0);
}

export function calculatePublicServiceCoverage(facilities: Facility[], villagerCount: number): number {
  if (villagerCount === 0) return 100;
  
  const clinicCount = facilities.filter(f => f.type === 'clinic').length;
  const squareCount = facilities.filter(f => f.type === 'square').length;
  
  const clinicCoverage = Math.min(clinicCount * 20, 100);
  const squareCoverage = Math.min(squareCount * 15, 100);
  
  return (clinicCoverage + squareCoverage) / 2;
}

export function calculateEcologicalScore(facilities: Facility[]): number {
  const farmCount = facilities.filter(f => f.type === 'farm').length;
  const squareCount = facilities.filter(f => f.type === 'square').length;
  
  let score = 50;
  score += farmCount * 5;
  score += squareCount * 10;
  
  return Math.min(score, 100);
}

export function calculateAnnualRating(statistics: Statistics): AnnualRating {
  const incomeScore = Math.min((statistics.totalIncome / 10000) * 30, 30);
  const serviceScore = statistics.publicServiceCoverage * 0.25;
  const ecoScore = statistics.ecologicalScore * 0.25;
  const riskScore = Math.max(20 - statistics.riskEvents * 2, 0);
  
  const totalScore = incomeScore + serviceScore + ecoScore + riskScore;
  
  if (totalScore >= 90) return 'S';
  if (totalScore >= 75) return 'A';
  if (totalScore >= 60) return 'B';
  if (totalScore >= 40) return 'C';
  return 'D';
}

export function calculateSatisfactionChange(villagers: Villager[], facilities: Facility[]): number {
  let change = 0;
  
  const avgSatisfaction = villagers.reduce((sum, v) => sum + v.satisfaction, 0) / villagers.length;
  const facilityBonus = facilities.reduce((sum, f) => sum + f.satisfactionBonus * f.level, 0);
  
  if (avgSatisfaction < 50) change -= 2;
  if (avgSatisfaction > 80) change += 1;
  
  change += Math.min(facilityBonus / 10, 5);
  
  return change;
}

export function generateRandomTasks(count: number): any[] {
  const tasks = [];
  const taskTypes = ['environment', 'agriculture', 'eldercare', 'flood'] as const;
  
  const taskTemplates = {
    environment: [
      { title: '清理村庄垃圾', description: '组织村民清理道路两旁的垃圾' },
      { title: '植树造林活动', description: '在荒地上种植树苗，美化环境' },
      { title: '污水处理', description: '修建污水处理设施，保护水源' },
    ],
    agriculture: [
      { title: '帮助农户销售', description: '协助农民将农产品销售到城里' },
      { title: '开拓新市场', description: '寻找新的销售渠道，扩大市场' },
      { title: '技术培训', description: '组织农业技术培训，提高产量' },
    ],
    eldercare: [
      { title: '走访慰问老人', description: '上门探访独居老人，送去温暖' },
      { title: '健康体检', description: '为老年人提供免费健康检查' },
      { title: '生活帮助', description: '帮助老人打扫卫生、购物等' },
    ],
    flood: [
      { title: '堤坝检查', description: '巡查村边堤坝，排除安全隐患' },
      { title: '储备物资', description: '准备防汛物资，应对突发情况' },
      { title: '撤离演练', description: '组织村民进行防汛撤离演练' },
    ],
  };
  
  for (let i = 0; i < count; i++) {
    const type = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const templates = taskTemplates[type];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    const reward = {
      money: Math.floor(Math.random() * 200) + 100,
      materials: Math.floor(Math.random() * 50) + 20,
    };
    
    tasks.push({
      id: `task_${Date.now()}_${i}`,
      type,
      ...template,
      deadline: 7 + Math.floor(Math.random() * 7),
      reward,
      status: 'pending',
    });
  }
  
  return tasks;
}

export function generateInitialVillagers(count: number): Villager[] {
  const names = [
    '张明', '李华', '王强', '刘芳', '陈伟', '杨丽', '赵磊', '周静',
    '吴涛', '郑雪', '孙浩', '马燕', '朱杰', '胡梅', '郭峰', '林萍'
  ];
  
  const villagers: Villager[] = [];
  
  for (let i = 0; i < count; i++) {
    const skillCount = Math.floor(Math.random() * 2) + 1;
    const skills: string[] = [];
    for (let j = 0; j < skillCount; j++) {
      const skill = SKILLS[Math.floor(Math.random() * SKILLS.length)];
      if (!skills.includes(skill)) skills.push(skill);
    }
    
    const needCount = Math.floor(Math.random() * 2) + 1;
    const needs: string[] = [];
    for (let j = 0; j < needCount; j++) {
      const need = VILLAGER_NEEDS[Math.floor(Math.random() * VILLAGER_NEEDS.length)];
      if (!needs.includes(need)) needs.push(need);
    }
    
    villagers.push({
      id: `villager_${i}`,
      name: names[i % names.length],
      age: 25 + Math.floor(Math.random() * 40),
      satisfaction: 60 + Math.floor(Math.random() * 20),
      skills,
      needs,
      participation: 50 + Math.floor(Math.random() * 30),
      health: 70 + Math.floor(Math.random() * 30),
    });
  }
  
  return villagers;
}
