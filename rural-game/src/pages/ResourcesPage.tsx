import { useGameStore } from '../stores/gameStore';
import { SEASON_NAMES, SEASON_MULTIPLIERS, FACILITY_CONFIG } from '../utils/calculations';
import { DollarSign, Users, Package, TrendingUp, Wheat, Sun, Leaf, Snowflake } from 'lucide-react';

export default function ResourcesPage() {
  const { money, labor, materials, season, year, day, facilities, statistics } = useGameStore();

  const totalIncome = statistics.totalIncome;
  const totalExpense = statistics.totalExpense;
  const netIncome = totalIncome - totalExpense;

  const farmCount = facilities.filter(f => f.type === 'farm').length;
  const homestayCount = facilities.filter(f => f.type === 'homestay').length;
  const warehouseCount = facilities.filter(f => f.type === 'warehouse').length;

  const seasonalMultiplier = SEASON_MULTIPLIERS[season];
  const farmOutput = farmCount * 100 * seasonalMultiplier;
  const homestayOutput = homestayCount * 150 * seasonalMultiplier;
  const totalSeasonOutput = farmOutput + homestayOutput;

  const maintenanceCost = facilities.reduce((sum, f) => sum + f.maintenanceCost, 0);

  const getSeasonIcon = () => {
    switch (season) {
      case 'spring':
        return <Wheat size={32} />;
      case 'summer':
        return <Sun size={32} />;
      case 'autumn':
        return <Leaf size={32} />;
      case 'winter':
        return <Snowflake size={32} />;
    }
  };

  const getSeasonColor = () => {
    switch (season) {
      case 'spring':
        return 'from-green-400 to-green-600';
      case 'summer':
        return 'from-yellow-400 to-orange-500';
      case 'autumn':
        return 'from-orange-400 to-red-500';
      case 'winter':
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-2">📦 资源管理</h2>
          <p className="text-gray-600">查看和管理村庄的各项资源</p>
        </div>

        <div className={`bg-gradient-to-r ${getSeasonColor()} p-6 rounded-xl shadow-lg mb-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg opacity-90 mb-1">当前季节</div>
              <div className="text-4xl font-bold mb-2">
                {getSeasonIcon()} {SEASON_NAMES[season]}
              </div>
              <div className="text-sm opacity-90">
                第 {year} 年 · 第 {day} 天
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg opacity-90 mb-1">季节产出倍率</div>
              <div className="text-4xl font-bold">×{seasonalMultiplier}</div>
              <div className="text-sm opacity-90 mt-2">
                {season === 'spring' && '万物复苏，生产正常'}
                {season === 'summer' && '阳光充足，产出增加'}
                {season === 'autumn' && '丰收季节，产出最高'}
                {season === 'winter' && '寒冬来临，产出减少'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm opacity-90 mb-1">💰 资金</div>
                <div className="text-3xl font-bold">¥{money.toLocaleString()}</div>
              </div>
              <DollarSign size={48} className="opacity-50" />
            </div>
            <div className="space-y-2 text-sm bg-white/20 p-3 rounded-lg">
              <div className="flex justify-between">
                <span>总收入:</span>
                <span className="font-bold">¥{totalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>总支出:</span>
                <span className="font-bold">¥{totalExpense.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-white/30 pt-2">
                <span>净收益:</span>
                <span className="font-bold">
                  {netIncome >= 0 ? '+' : ''}¥{netIncome.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm opacity-90 mb-1">👷 人力</div>
                <div className="text-3xl font-bold">{labor} 人</div>
              </div>
              <Users size={48} className="opacity-50" />
            </div>
            <div className="space-y-2 text-sm bg-white/20 p-3 rounded-lg">
              <div className="flex justify-between">
                <span>可用劳动力:</span>
                <span className="font-bold">{labor} 人</span>
              </div>
              <div className="flex justify-between">
                <span>任务需求:</span>
                <span className="font-bold">{Math.floor(labor * 0.3)} 人</span>
              </div>
              <div className="flex justify-between">
                <span>空闲人力:</span>
                <span className="font-bold">{Math.ceil(labor * 0.7)} 人</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm opacity-90 mb-1">📦 物资</div>
                <div className="text-3xl font-bold">{materials}</div>
              </div>
              <Package size={48} className="opacity-50" />
            </div>
            <div className="space-y-2 text-sm bg-white/20 p-3 rounded-lg">
              <div className="flex justify-between">
                <span>当前库存:</span>
                <span className="font-bold">{materials}</span>
              </div>
              <div className="flex justify-between">
                <span>存储上限:</span>
                <span className="font-bold">{100 + warehouseCount * 50}</span>
              </div>
              <div className="flex justify-between">
                <span>使用率:</span>
                <span className="font-bold">{Math.min(100, (materials / (100 + warehouseCount * 50)) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <TrendingUp size={24} className="text-green-600" />
              <span>本季度预计产出</span>
            </h3>
            <div className="text-sm text-gray-600">
              基于 {SEASON_NAMES[season]} ×{seasonalMultiplier} 倍率
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Wheat size={24} color="white" />
                </div>
                <div>
                  <div className="font-bold text-lg">农田产出</div>
                  <div className="text-sm text-gray-600">{farmCount} 个农田</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-700">
                ¥{farmOutput.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                基础产出 ¥100 × {farmCount} 个 × {seasonalMultiplier}
              </div>
            </div>

            <div className="border-2 border-orange-200 bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Package size={24} color="white" />
                </div>
                <div>
                  <div className="font-bold text-lg">民宿收入</div>
                  <div className="text-sm text-gray-600">{homestayCount} 个民宿</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-700">
                ¥{homestayOutput.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                基础产出 ¥150 × {homestayCount} 个 × {seasonalMultiplier}
              </div>
            </div>

            <div className="border-2 border-red-200 bg-red-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} color="white" />
                </div>
                <div>
                  <div className="font-bold text-lg">维护成本</div>
                  <div className="text-sm text-gray-600">{facilities.length} 个设施</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-red-700">
                -¥{maintenanceCost.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                每日维护费用
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">本季度净收益预计</div>
              <div className="text-3xl font-bold text-green-800">
                ¥{totalSeasonOutput - maintenanceCost > 0 ? '+' : ''}
                {(totalSeasonOutput - maintenanceCost).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">设施统计</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(FACILITY_CONFIG).map(([type, config]) => {
              const count = facilities.filter(f => f.type === type).length;
              
              return (
                <div key={type} className="border-2 border-gray-200 p-4 rounded-lg text-center">
                  <div
                    className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center mb-2"
                    style={{ backgroundColor: config.color }}
                  >
                    <span className="text-3xl font-bold text-white">
                      {count}
                    </span>
                  </div>
                  <div className="font-bold">{config.name}</div>
                  <div className="text-sm text-gray-600">
                    总产出: ¥{count * config.baseOutput}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
