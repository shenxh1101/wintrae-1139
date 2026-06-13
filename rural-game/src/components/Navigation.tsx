import { Map, ClipboardList, Package, Users, Trophy } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import { useGameStore } from '../stores/gameStore';

const tabs = [
  { id: 'map' as const, label: '地图', icon: Map },
  { id: 'tasks' as const, label: '任务', icon: ClipboardList },
  { id: 'resources' as const, label: '资源', icon: Package },
  { id: 'villagers' as const, label: '村民', icon: Users },
  { id: 'achievements' as const, label: '成果', icon: Trophy },
];

export default function Navigation() {
  const { activeTab, setActiveTab } = useUIStore();
  const { year, season, day, isPaused, advanceDay } = useGameStore();

  const seasonNames = {
    spring: '春',
    summer: '夏',
    autumn: '秋',
    winter: '冬',
  };

  const handleTabClick = (tabId: typeof tabs[number]['id']) => {
    setActiveTab(tabId);
  };

  const handleTimeControl = () => {
    if (isPaused) {
      const interval = setInterval(() => {
        advanceDay();
      }, 1000);
      (window as any).__gameInterval = interval;
      useGameStore.setState({ isPaused: false });
    } else {
      if ((window as any).__gameInterval) {
        clearInterval((window as any).__gameInterval);
      }
      useGameStore.setState({ isPaused: true });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-800 to-green-900 shadow-lg z-50">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🏡</div>
          <h1 className="text-xl font-bold text-white">数字乡村</h1>
        </div>

        <div className="flex items-center space-x-4 bg-green-700/50 px-4 py-2 rounded-lg">
          <div className="text-white font-medium">
            第{year}年 {seasonNames[season]} 第{day}天
          </div>
          <button
            onClick={handleTimeControl}
            className={`px-4 py-1 rounded ${
              isPaused
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-red-500 hover:bg-red-600'
            } text-white font-medium transition-colors`}
          >
            {isPaused ? '▶ 开始' : '⏸ 暂停'}
          </button>
        </div>

        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-green-800 shadow-md'
                    : 'text-white hover:bg-green-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
