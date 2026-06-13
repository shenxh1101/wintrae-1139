import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameState,
  GameStore,
  Facility,
  FacilityType,
  Position,
  Task,
  Season,
  Archive,
} from '../types';
import {
  FACILITY_CONFIG,
  calculateSeasonOutput,
  calculatePublicServiceCoverage,
  calculateEcologicalScore,
  calculateSatisfactionChange,
  generateRandomTasks,
  generateInitialVillagers,
  calculateAnnualRating,
} from '../utils/calculations';

const STORAGE_KEY = 'rural-game-archives';

const createInitialState = (): GameState => ({
  year: 1,
  season: 'spring',
  day: 1,
  money: 5000,
  labor: 10,
  materials: 100,
  facilities: [],
  villagers: generateInitialVillagers(10),
  currentTasks: generateRandomTasks(5),
  completedTasks: [],
  statistics: {
    totalIncome: 0,
    totalExpense: 0,
    publicServiceCoverage: 0,
    ecologicalScore: 50,
    riskEvents: 0,
    completedTasks: 0,
    failedTasks: 0,
    builtFacilities: 0,
  },
  isPaused: true,
  gameSpeed: 1,
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      buildFacility: (type: FacilityType, position: Position) => {
        const state = get();
        const config = FACILITY_CONFIG[type];
        
        if (state.money < config.baseCost) {
          console.warn('资金不足');
          return;
        }

        const newFacility: Facility = {
          id: `facility_${Date.now()}_${Math.random()}`,
          type,
          position,
          level: 1,
          status: 'normal',
          output: config.baseOutput,
          cost: config.baseCost,
          maintenanceCost: config.maintenanceCost,
          satisfactionBonus: config.satisfactionBonus,
        };

        set({
          money: state.money - config.baseCost,
          facilities: [...state.facilities, newFacility],
          statistics: {
            ...state.statistics,
            builtFacilities: state.statistics.builtFacilities + 1,
            totalExpense: state.statistics.totalExpense + config.baseCost,
          },
        });
      },

      upgradeFacility: (id: string) => {
        const state = get();
        const facility = state.facilities.find(f => f.id === id);
        
        if (!facility) return;
        
        const upgradeCost = facility.cost * facility.level;
        if (state.money < upgradeCost) {
          console.warn('资金不足');
          return;
        }

        const config = FACILITY_CONFIG[facility.type];
        
        set({
          money: state.money - upgradeCost,
          facilities: state.facilities.map(f =>
            f.id === id
              ? {
                  ...f,
                  level: f.level + 1,
                  output: config.baseOutput * (f.level + 1),
                  satisfactionBonus: config.satisfactionBonus * (f.level + 1),
                }
              : f
          ),
          statistics: {
            ...state.statistics,
            totalExpense: state.statistics.totalExpense + upgradeCost,
          },
        });
      },

      demolishFacility: (id: string) => {
        const state = get();
        const facility = state.facilities.find(f => f.id === id);
        
        if (!facility) return;

        const refund = Math.floor(facility.cost * 0.5);

        set({
          money: state.money + refund,
          facilities: state.facilities.filter(f => f.id !== id),
          statistics: {
            ...state.statistics,
            builtFacilities: Math.max(0, state.statistics.builtFacilities - 1),
          },
        });
      },

      acceptTask: (taskId: string) => {
        set(state => ({
          currentTasks: state.currentTasks.map(task =>
            task.id === taskId ? { ...task, status: 'in_progress' as const } : task
          ),
        }));
      },

      completeTask: (taskId: string) => {
        const state = get();
        const task = state.currentTasks.find(t => t.id === taskId);
        
        if (!task) return;

        const rewards = task.reward;

        set({
          money: state.money + (rewards.money || 0),
          labor: state.labor + (rewards.labor || 0),
          materials: state.materials + (rewards.materials || 0),
          currentTasks: state.currentTasks.filter(t => t.id !== taskId),
          completedTasks: [...state.completedTasks, { ...task, status: 'completed' as const }],
          statistics: {
            ...state.statistics,
            totalIncome: state.statistics.totalIncome + (rewards.money || 0),
            completedTasks: state.statistics.completedTasks + 1,
          },
        });
      },

      failTask: (taskId: string) => {
        const state = get();
        const task = state.currentTasks.find(t => t.id === taskId);
        
        if (!task) return;

        set({
          currentTasks: state.currentTasks.filter(t => t.id !== taskId),
          completedTasks: [...state.completedTasks, { ...task, status: 'failed' as const }],
          statistics: {
            ...state.statistics,
            failedTasks: state.statistics.failedTasks + 1,
          },
        });

        const updatedVillagers = state.villagers.map(v => ({
          ...v,
          satisfaction: Math.max(0, v.satisfaction - 5),
        }));
        set({ villagers: updatedVillagers });
      },

      advanceDay: () => {
        const state = get();
        const newDay = state.day + 1;
        
        if (newDay > 30) {
          get().advanceSeason();
          return;
        }

        const maintenanceCost = state.facilities.reduce(
          (sum, f) => sum + f.maintenanceCost,
          0
        );
        
        const seasonOutput = calculateSeasonOutput(state.facilities, state.season);
        const publicServiceCoverage = calculatePublicServiceCoverage(
          state.facilities,
          state.villagers.length
        );
        const ecologicalScore = calculateEcologicalScore(state.facilities);

        const tasksToFail: string[] = [];
        const updatedTasks = state.currentTasks.map(task => {
          if (task.status === 'in_progress') {
            const newDeadline = task.deadline - 1;
            if (newDeadline <= 0) {
              tasksToFail.push(task.id);
              return null;
            }
            return { ...task, deadline: newDeadline };
          }
          return task;
        }).filter(task => task !== null);

        tasksToFail.forEach(taskId => {
          get().failTask(taskId);
        });

        const satisfactionChange = calculateSatisfactionChange(state.villagers, state.facilities);
        const updatedVillagers = satisfactionChange !== 0
          ? state.villagers.map(v => ({
              ...v,
              satisfaction: Math.max(0, Math.min(100, v.satisfaction + satisfactionChange)),
            }))
          : state.villagers;

        set({
          day: newDay,
          money: state.money - maintenanceCost + seasonOutput,
          currentTasks: updatedTasks,
          villagers: updatedVillagers,
          statistics: {
            ...state.statistics,
            totalExpense: state.statistics.totalExpense + maintenanceCost,
            publicServiceCoverage,
            ecologicalScore,
          },
        });

        if (state.currentTasks.length < 5) {
          get().generateNewTasks();
        }
      },

      advanceSeason: () => {
        const state = get();
        const seasons: Season[] = ['spring', 'summer', 'autumn', 'winter'];
        const currentSeasonIndex = seasons.indexOf(state.season);
        const nextSeasonIndex = (currentSeasonIndex + 1) % 4;
        const isNewYear = nextSeasonIndex === 0;

        if (isNewYear) {
          const rating = calculateAnnualRating(state.statistics);
          console.log(`年度评价: ${rating}`);
        }

        set({
          year: isNewYear ? state.year + 1 : state.year,
          season: seasons[nextSeasonIndex],
          day: 1,
          currentTasks: state.currentTasks.filter(t => t.status === 'in_progress'),
        });
      },

      updateVillagerSatisfaction: (delta: number) => {
        set(state => ({
          villagers: state.villagers.map(v => ({
            ...v,
            satisfaction: Math.max(0, Math.min(100, v.satisfaction + delta)),
          })),
        }));
      },

      generateNewTasks: () => {
        const newTasks = generateRandomTasks(3);
        set(state => ({
          currentTasks: [...state.currentTasks, ...newTasks].slice(0, 8),
        }));
      },

      calculateSeasonOutput: () => {
        const state = get();
        const output = calculateSeasonOutput(state.facilities, state.season);
        return output;
      },

      saveGame: () => {
        const state = get();
        const archive: Archive = {
          id: `archive_${Date.now()}`,
          saveTime: new Date().toISOString(),
          gameState: {
            year: state.year,
            season: state.season,
            day: state.day,
            money: state.money,
            labor: state.labor,
            materials: state.materials,
            facilities: state.facilities,
            villagers: state.villagers,
            currentTasks: state.currentTasks,
            completedTasks: state.completedTasks,
            statistics: state.statistics,
            isPaused: true,
            gameSpeed: state.gameSpeed,
          },
          year: state.year,
          season: state.season,
        };
        
        const savedArchives = localStorage.getItem(STORAGE_KEY);
        const archives: Archive[] = savedArchives ? JSON.parse(savedArchives) : [];
        archives.push(archive);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(archives));
        
        console.log('游戏已保存', archive);
        return archive.id;
      },

      loadGame: (archive: Archive) => {
        const gameState = archive.gameState;
        set({
          year: gameState.year,
          season: gameState.season,
          day: gameState.day,
          money: gameState.money,
          labor: gameState.labor,
          materials: gameState.materials,
          facilities: gameState.facilities,
          villagers: gameState.villagers,
          currentTasks: gameState.currentTasks,
          completedTasks: gameState.completedTasks,
          statistics: gameState.statistics,
          isPaused: true,
          gameSpeed: gameState.gameSpeed || 1,
        });
        console.log('游戏已加载', archive);
      },

      resetGame: () => {
        set(createInitialState());
        console.log('游戏已重置');
      },
    }),
    {
      name: 'rural-game-storage',
      partialize: (state) => ({
        year: state.year,
        season: state.season,
        day: state.day,
        money: state.money,
        labor: state.labor,
        materials: state.materials,
        facilities: state.facilities,
        villagers: state.villagers,
        currentTasks: state.currentTasks,
        completedTasks: state.completedTasks,
        statistics: state.statistics,
      }),
    }
  )
);

export const getSavedArchives = (): Archive[] => {
  const savedData = localStorage.getItem(STORAGE_KEY);
  return savedData ? JSON.parse(savedData) : [];
};

export const deleteArchive = (archiveId: string) => {
  const archives = getSavedArchives().filter(a => a.id !== archiveId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(archives));
};
