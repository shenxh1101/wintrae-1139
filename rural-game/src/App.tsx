import Navigation from './components/Navigation';
import MapPage from './pages/MapPage';
import TasksPage from './pages/TasksPage';
import ResourcesPage from './pages/ResourcesPage';
import VillagersPage from './pages/VillagersPage';
import AchievementsPage from './pages/AchievementsPage';
import { useUIStore } from './stores/uiStore';
import { useGameStore } from './stores/gameStore';

function App() {
  const { activeTab, notification, setNotification } = useUIStore();
  const { isPaused } = useGameStore();

  const renderPage = () => {
    switch (activeTab) {
      case 'map':
        return <MapPage />;
      case 'tasks':
        return <TasksPage />;
      case 'resources':
        return <ResourcesPage />;
      case 'villagers':
        return <VillagersPage />;
      case 'achievements':
        return <AchievementsPage />;
      default:
        return <MapPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation />
      
      <main className="pt-20">
        {renderPage()}
      </main>

      {notification && (
        <div className="fixed bottom-4 right-4 bg-white px-6 py-3 rounded-lg shadow-xl border-l-4 border-green-500 z-50 animate-pulse">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span className="font-medium text-gray-800">{notification}</span>
          </div>
        </div>
      )}

      {isPaused && (
        <div className="fixed bottom-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <span className="font-medium">⏸️ 游戏已暂停</span>
        </div>
      )}
    </div>
  );
}

export default App;
