import { useGameStore } from '../stores/gameStore';
import { SKILLS, VILLAGER_NEEDS } from '../utils/calculations';
import { Users, Heart, Star, Briefcase, Home, GraduationCap, Activity, Music, Coffee } from 'lucide-react';

const needIcons: Record<string, any> = {
  '住房改善': Home,
  '教育培训': GraduationCap,
  '医疗保障': Activity,
  '文化娱乐': Music,
  '就业机会': Briefcase,
  '收入提高': Coffee,
};

export default function VillagersPage() {
  const { villagers, facilities } = useGameStore();

  const avgSatisfaction = villagers.reduce((sum, v) => sum + v.satisfaction, 0) / villagers.length;
  const avgParticipation = villagers.reduce((sum, v) => sum + v.participation, 0) / villagers.length;
  const avgHealth = villagers.reduce((sum, v) => sum + v.health, 0) / villagers.length;

  const getSatisfactionColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSatisfactionEmoji = (score: number) => {
    if (score >= 80) return '😊';
    if (score >= 60) return '🙂';
    if (score >= 40) return '😐';
    return '😟';
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600';
    if (health >= 60) return 'text-blue-600';
    if (health >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const allNeeds = Array.from(new Set(villagers.flatMap(v => v.needs)));
  const needCounts = allNeeds.map(need => ({
    need,
    count: villagers.filter(v => v.needs.includes(need)).length,
  }));

  const allSkills = Array.from(new Set(villagers.flatMap(v => v.skills)));
  const skillCounts = allSkills.map(skill => ({
    skill,
    count: villagers.filter(v => v.skills.includes(skill)).length,
  }));

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-2">👥 村民管理</h2>
          <p className="text-gray-600">了解村民需求，提升村庄凝聚力</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-400 to-green-600 p-5 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">平均满意度</div>
              <Heart size={24} className="opacity-50" />
            </div>
            <div className="text-3xl font-bold mb-1">{avgSatisfaction.toFixed(0)}%</div>
            <div className="text-sm opacity-90">
              {getSatisfactionEmoji(avgSatisfaction)} {avgSatisfaction >= 80 ? '非常满意' : avgSatisfaction >= 60 ? '满意' : avgSatisfaction >= 40 ? '一般' : '不满意'}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-5 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">平均参与度</div>
              <Star size={24} className="opacity-50" />
            </div>
            <div className="text-3xl font-bold mb-1">{avgParticipation.toFixed(0)}%</div>
            <div className="text-sm opacity-90">村民参与公共事务</div>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-5 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">平均健康</div>
              <Activity size={24} className="opacity-50" />
            </div>
            <div className="text-3xl font-bold mb-1">{avgHealth.toFixed(0)}%</div>
            <div className="text-sm opacity-90">村民健康水平</div>
          </div>

          <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-5 rounded-xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90">村民总数</div>
              <Users size={24} className="opacity-50" />
            </div>
            <div className="text-3xl font-bold mb-1">{villagers.length}</div>
            <div className="text-sm opacity-90">村庄人口</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Users size={24} className="text-green-600" />
              <span>村民列表</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {villagers.map(villager => (
                <div key={villager.id} className="border-2 border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-lg">{villager.name}</div>
                      <div className="text-sm text-gray-600">年龄: {villager.age}岁</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getSatisfactionColor(villager.satisfaction)}`}>
                      {getSatisfactionEmoji(villager.satisfaction)} {villager.satisfaction}%
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="text-sm">
                      <span className="text-gray-600">技能: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {villager.skills.map((skill, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">需求: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {villager.needs.map((need, idx) => (
                          <span key={idx} className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs">
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`${getHealthColor(villager.health)} bg-gray-50 p-2 rounded`}>
                      ❤️ 健康: {villager.health}%
                    </div>
                    <div className="text-blue-600 bg-gray-50 p-2 rounded">
                      ⭐ 参与: {villager.participation}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">村民需求分布</h3>
              <div className="space-y-3">
                {needCounts
                  .sort((a, b) => b.count - a.count)
                  .map(({ need, count }) => {
                    const Icon = needIcons[need] || Home;
                    const percentage = (count / villagers.length) * 100;
                    
                    return (
                      <div key={need}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <Icon size={16} className="text-orange-600" />
                            <span className="text-sm font-medium">{need}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {count} 人 ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">村民技能分布</h3>
              <div className="space-y-3">
                {skillCounts
                  .sort((a, b) => b.count - a.count)
                  .map(({ skill, count }) => {
                    const percentage = (count / villagers.length) * 100;
                    
                    return (
                      <div key={skill}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{skill}</span>
                          <span className="text-sm text-gray-600">
                            {count} 人
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">提升村民满意度建议</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {avgSatisfaction < 60 && (
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <div className="font-bold text-blue-800 mb-2">🏥 建设卫生站</div>
                <div className="text-sm text-gray-600">
                  卫生站能显著提升村民健康水平和满意度
                </div>
              </div>
            )}
            {avgSatisfaction < 70 && (
              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                <div className="font-bold text-purple-800 mb-2">🎭 建设文化广场</div>
                <div className="text-sm text-gray-600">
                  文化广场能丰富村民精神生活
                </div>
              </div>
            )}
            {needCounts[0]?.count > villagers.length * 0.5 && (
              <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                <div className="font-bold text-orange-800 mb-2">🏠 关注住房需求</div>
                <div className="text-sm text-gray-600">
                  半数以上村民有住房改善需求
                </div>
              </div>
            )}
            {facilities.filter(f => f.type === 'homestay').length < 2 && (
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                <div className="font-bold text-yellow-800 mb-2">🏡 建设民宿</div>
                <div className="text-sm text-gray-600">
                  民宿能提供就业机会，增加收入
                </div>
              </div>
            )}
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <div className="font-bold text-green-800 mb-2">🌾 发展农业</div>
              <div className="text-sm text-gray-600">
                农田是村庄收入的重要来源
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
