import { create } from 'zustand';
import { UIState, Facility, Task, Position } from '../types';

interface UIStore extends UIState {
  setSelectedFacility: (facility: Facility | null) => void;
  setSelectedPosition: (position: Position | null) => void;
  setShowBuildPanel: (show: boolean) => void;
  setShowTaskDetails: (task: Task | null) => void;
  setShowSaveDialog: (show: boolean) => void;
  setShowLoadDialog: (show: boolean) => void;
  setNotification: (message: string | null) => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
  clearAll: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedFacility: null,
  selectedPosition: null,
  showBuildPanel: false,
  showTaskDetails: null,
  showSaveDialog: false,
  showLoadDialog: false,
  notification: null,
  activeTab: 'map',

  setSelectedFacility: (facility) => set({ selectedFacility: facility }),
  
  setSelectedPosition: (position) => set({ 
    selectedPosition: position,
    showBuildPanel: position !== null 
  }),
  
  setShowBuildPanel: (show) => set({ showBuildPanel: show }),
  
  setShowTaskDetails: (task) => set({ showTaskDetails: task }),
  
  setShowSaveDialog: (show) => set({ showSaveDialog: show }),
  
  setShowLoadDialog: (show) => set({ showLoadDialog: show }),
  
  setNotification: (message) => {
    set({ notification: message });
    if (message) {
      setTimeout(() => set({ notification: null }), 3000);
    }
  },
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  clearAll: () => set({
    selectedFacility: null,
    selectedPosition: null,
    showBuildPanel: false,
    showTaskDetails: null,
    showSaveDialog: false,
    showLoadDialog: false,
    notification: null,
  }),
}));
