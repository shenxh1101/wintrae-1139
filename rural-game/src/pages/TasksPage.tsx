import { useGameStore } from '../stores/gameStore';
import { TASK_TYPES } from '../utils/calculations';
import { CheckCircle, Clock, AlertCircle, Leaf, Truck, Heart, CloudRain } from 'lucide-react';

const taskIcons = {
  environment: Leaf,
  agriculture: Truck,
  eldercare: Heart,
  flood: CloudRain,
};

export default function TasksPage() {
  const { currentTasks, completedTasks, acceptTask, completeTask, failTask } = useGameStore();

  const getTaskIcon = (type: keyof typeof TASK_TYPES) => {
    return taskIcons[type as keyof typeof taskIcons];
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-800 mb-2">📋 任务中心</h2>
          <p className="text-gray-600">完成各类任务获得奖励，提升村庄发展</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-800">进行中</h3>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {currentTasks.length} 个任务
              </span>
            </div>
            <div className="space-y-3">
              {currentTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">暂无进行中的任务</p>
              ) : (
                currentTasks.map(task => {
                  const Icon = getTaskIcon(task.type);
                  const config = TASK_TYPES[task.type];
                  
                  return (
                    <div
                      key={task.id}
                      className="bg-white p-4 rounded-lg shadow-sm border-l-4"
                      style={{ borderLeftColor: config.color }}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: config.color }}
                        >
                          <Icon size={20} color="white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg mb-1">{task.title}</div>
                          <div className="text-sm text-gray-600 mb-2">{task.description}</div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock size={16} className="text-gray-500" />
                              <span className={task.deadline <= 3 ? 'text-red-600 font-bold' : 'text-gray-600'}>
                                剩余 {task.deadline} 天
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {task.reward.money && (
                                <span className="text-sm bg-yellow-100 px-2 py-1 rounded">
                                  💰 {task.reward.money}
                                </span>
                              )}
                              {task.reward.materials && (
                                <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                                  📦 {task.reward.materials}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        {task.status === 'pending' && (
                          <button
                            onClick={() => acceptTask(task.id)}
                            className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                          >
                            接受任务
                          </button>
                        )}
                        {task.status === 'in_progress' && (
                          <>
                            <button
                              onClick={() => completeTask(task.id)}
                              className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                              <CheckCircle size={20} />
                              <span>完成任务</span>
                            </button>
                            <button
                              onClick={() => failTask(task.id)}
                              className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                            >
                              放弃
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">已完成</h3>
              <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm">
                {completedTasks.length} 个任务
              </span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {completedTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">暂无已完成的任务</p>
              ) : (
                completedTasks.slice(-10).reverse().map(task => {
                  const Icon = getTaskIcon(task.type);
                  const config = TASK_TYPES[task.type];
                  
                  return (
                    <div
                      key={task.id}
                      className="bg-white p-4 rounded-lg shadow-sm opacity-75"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: config.color }}
                        >
                          <Icon size={20} color="white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-bold text-lg">{task.title}</span>
                            {task.status === 'completed' ? (
                              <CheckCircle size={20} className="text-green-600" />
                            ) : (
                              <AlertCircle size={20} className="text-red-600" />
                            )}
                          </div>
                          <div className="text-sm text-gray-600">{task.description}</div>
                          <div className="flex items-center space-x-2 mt-2 text-sm">
                            {task.reward.money && (
                              <span className="bg-yellow-100 px-2 py-1 rounded">
                                💰 {task.reward.money}
                              </span>
                            )}
                            {task.reward.materials && (
                              <span className="bg-blue-100 px-2 py-1 rounded">
                                📦 {task.reward.materials}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">任务类型说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(TASK_TYPES).map(([type, config]) => {
              const Icon = taskIcons[type as keyof typeof taskIcons];
              
              return (
                <div key={type} className="p-4 border-2 border-gray-200 rounded-lg">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: config.color }}
                  >
                    <Icon size={24} color="white" />
                  </div>
                  <div className="font-bold text-lg mb-1">{config.name}</div>
                  <div className="text-sm text-gray-600">
                    {type === 'environment' && '改善村庄环境，提升生态评分'}
                    {type === 'agriculture' && '帮助农民销售农产品，增加收入'}
                    {type === 'eldercare' && '关心老年人，提升村民满意度'}
                    {type === 'flood' && '做好防汛准备，减少风险事件'}
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
