import { useGameStore } from '../stores/gameStore';
import { calculateAnnualRating } from '../utils/calculations';
import { Trophy, TrendingUp, Leaf, AlertTriangle, CheckCircle, Save, FolderOpen, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function AchievementsPage() {
  const {
    year,
    season,
    statistics,
    facilities,
    villagers,
    currentTasks,
    completedTasks,
    saveGame,
    loadGame,
    resetGame,
  } = useGameStore();

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showLoadConfirm, setShowLoadConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const publicServiceCoverage = facilities.length > 0
    ? Math.min(
        (facilities.filter(f => f.type === 'clinic' || f.type === 'square').length /
          villagers.length) *
          100,
        100
      )
    : 0;

  const rating = calculateAnnualRating(statistics);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'S':
        return 'from-purple-500 to-pink-500';
      case 'A':
        return 'from-green-500 to-emerald-500';
      case 'B':
        return 'from-blue-500 to-cyan-500';
      case 'C':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-red-500 to-rose-500';
    }
  };

  const getRatingText = (rating: string) => {
    switch (rating) {
      case 'S':
        return '卓越';
      case 'A':
        return '优秀';
      case 'B':
        return '良好';
      case 'C':
        return '合格';
      default:
        return '待改进';
    }
  };

  const handleSave = () => {
    saveGame();
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 2000);
  };

  const handleLoad = () => {
    const savedData = localStorage.getItem('rural-game-state');
    if (savedData) {
      const archives = JSON.parse(savedData);
      if (archives.length > 0) {
        loadGame(archives[archives.length - 1]);
        setShowLoadConfirm(true);
        setTimeout(() => setShowLoadConfirm(false), 2000);
      }
    }
  };

  const handleReset = () => {
    resetGame();
    setShowResetConfirm(true);
    setTimeout(() => setShowResetConfirm(false), 2000);
  };

  const achievementItems = [
    {
      icon: TrendingUp,
      label: '总收入',
      value: `¥${statistics.totalIncome.toLocaleString()}`,
      color: 'text-green-600 bg-green-100',
      description: '历年累计收入',
    },
    {
      icon: CheckCircle,
      label: '完成任务',
      value: `${statistics.completedTasks} 个`,
      color: 'text-blue-600 bg-blue-100',
      description: '成功完成的任务数',
    },
    {
      icon: Leaf,
      label: '生态评分',
      value: `${statistics.ecologicalScore.toFixed(0)}分`,
      color: 'text-emerald-600 bg-emerald-100',
      description: '绿化率和环境质量',
    },
    {
      icon: AlertTriangle,
      label: '风险事件',
      value: `${statistics.riskEvents} 次`,
      color: 'text-red-600 bg-red-100',
      description: '发生的突发事件',
    },
  ];

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-2">🏆 成果展示</h2>
          <p className="text-gray-600">查看年度评价和游戏成就</p>
        </div>

        <div className={`bg-gradient-to-br ${getRatingColor(rating)} p-8 rounded-2xl shadow-xl mb-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg opacity-90 mb-2">第 {year} 年度评价</div>
              <div className="text-6xl font-bold mb-2">{rating} 级</div>
              <div className="text-2xl font-semibold">{getRatingText(rating)}</div>
            </div>
            <Trophy size={120} className="opacity-50" />
          </div>
          <div className="mt-6 bg-white/20 p-4 rounded-lg">
            <div className="text-sm opacity-90 mb-2">评价标准</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div>收入贡献</div>
                <div className="font-bold">30%</div>
              </div>
              <div>
                <div>公共服务</div>
                <div className="font-bold">25%</div>
              </div>
              <div>
                <div>生态评分</div>
                <div className="font-bold">25%</div>
              </div>
              <div>
                <div>风险控制</div>
                <div className="font-bold">20%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {achievementItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-white p-5 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-lg ${item.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs text-gray-500">{item.description}</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">{item.value}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">年度统计</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">总支出</span>
                <span className="font-bold text-red-600">
                  -¥{statistics.totalExpense.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">公共服务覆盖率</span>
                <span className="font-bold text-blue-600">
                  {publicServiceCoverage.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">失败任务</span>
                <span className="font-bold text-orange-600">
                  {statistics.failedTasks} 个
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">建设设施</span>
                <span className="font-bold text-purple-600">
                  {statistics.builtFacilities} 个
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">当前任务</span>
                <span className="font-bold text-green-600">
                  {currentTasks.length} 个进行中
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">设施建设</h3>
            <div className="space-y-3">
              {['farm', 'homestay', 'warehouse', 'clinic', 'square'].map(type => {
                const count = facilities.filter(f => f.type === type).length;
                const names = {
                  farm: '农田',
                  homestay: '民宿',
                  warehouse: '仓储',
                  clinic: '卫生站',
                  square: '文化广场',
                };
                const colors = {
                  farm: 'bg-amber-500',
                  homestay: 'bg-orange-500',
                  warehouse: 'bg-gray-500',
                  clinic: 'bg-red-500',
                  square: 'bg-purple-500',
                };

                return (
                  <div key={type} className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${colors[type as keyof typeof colors]} flex items-center justify-center text-white font-bold`}>
                      {count}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{names[type as keyof typeof names]}</div>
                      <div className="text-sm text-gray-500">
                        {count === 0 ? '尚未建设' : `已建设 ${count} 个`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">游戏存档</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleSave}
              className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Save size={24} />
              <span className="font-bold">保存游戏</span>
            </button>
            <button
              onClick={handleLoad}
              className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <FolderOpen size={24} />
              <span className="font-bold">读取存档</span>
            </button>
            <button
              onClick={handleReset}
              className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw size={24} />
              <span className="font-bold">重新开始</span>
            </button>
          </div>

          {showSaveConfirm && (
            <div className="mt-4 p-3 bg-green-100 border-2 border-green-500 rounded-lg text-green-800 text-center font-medium">
              ✅ 游戏已保存成功！
            </div>
          )}
          {showLoadConfirm && (
            <div className="mt-4 p-3 bg-blue-100 border-2 border-blue-500 rounded-lg text-blue-800 text-center font-medium">
              ✅ 游戏已加载成功！
            </div>
          )}
          {showResetConfirm && (
            <div className="mt-4 p-3 bg-orange-100 border-2 border-orange-500 rounded-lg text-orange-800 text-center font-medium">
              ✅ 游戏已重置！
            </div>
          )}
        </div>

        <div className="mt-6 bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-green-800 mb-3">💡 发展建议</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {statistics.ecologicalScore < 60 && (
              <div className="bg-white p-3 rounded-lg">
                🌱 建议增加绿化和文化设施，提升生态评分
              </div>
            )}
            {publicServiceCoverage < 50 && (
              <div className="bg-white p-3 rounded-lg">
                🏥 建议建设更多卫生站和广场，提升公共服务
              </div>
            )}
            {statistics.riskEvents > 3 && (
              <div className="bg-white p-3 rounded-lg">
                ⚠️ 风险事件较多，建议加强防范措施
              </div>
            )}
            {facilities.filter(f => f.type === 'farm').length < 3 && (
              <div className="bg-white p-3 rounded-lg">
                🌾 建议发展农业，增加稳定收入来源
              </div>
            )}
            {facilities.filter(f => f.type === 'homestay').length < 2 && (
              <div className="bg-white p-3 rounded-lg">
                🏡 建议建设民宿，发展乡村旅游
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
