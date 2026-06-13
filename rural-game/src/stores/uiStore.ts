import { create } from 'zustand';
import { UIState, Position } from '../types';

interface UIStore extends UIState {
  setSelectedFacility: (facility: any) => void;
  setSelectedPosition: (position: Position | null) => void;
  setShowBuildPanel: (show: boolean) => void;
  setShowTaskDetails: (task: any) => void;
  setShowSaveDialog: (show: boolean) => void;
  setShowLoadDialog: (show: boolean) => void;
  setNotification: (message: string | null) => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
  setSelectedFacilityId: (id: string | null) => void;
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
  selectedFacilityId: null,

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
  
  setSelectedFacilityId: (id) => set({ selectedFacilityId: id }),
  
  clearAll: () => set({
    selectedFacility: null,
    selectedPosition: null,
    showBuildPanel: false,
    showTaskDetails: null,
    showSaveDialog: false,
    showLoadDialog: false,
    notification: null,
    selectedFacilityId: null,
  }),
}));
