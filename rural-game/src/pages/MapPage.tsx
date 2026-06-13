import { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUIStore } from '../stores/uiStore';
import { FACILITY_CONFIG } from '../utils/calculations';
import { FacilityType } from '../types';
import { Wheat, Home, Package, Heart, Users, X } from 'lucide-react';

const GRID_SIZE = 10;

export default function MapPage() {
  const { facilities, buildFacility, upgradeFacility, demolishFacility, money } = useGameStore();
  const {
    selectedPosition,
    selectedFacilityId,
    showBuildPanel,
    setSelectedPosition,
    setSelectedFacilityId,
    setShowBuildPanel,
  } = useUIStore();

  const [grid, setGrid] = useState<Array<Array<{ occupied: boolean; x: number; y: number }>>>([]);

  const currentSelectedFacility = selectedFacilityId 
    ? facilities.find(f => f.id === selectedFacilityId) 
    : null;

  useEffect(() => {
    const newGrid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        const isOccupied = facilities.some(
          f => f.position.x === i && f.position.y === j
        );
        row.push({ occupied: isOccupied, x: i, y: j });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  }, [facilities]);

  useEffect(() => {
    if (currentSelectedFacility) {
      const stillExists = facilities.some(f => f.id === currentSelectedFacility.id);
      if (!stillExists) {
        setSelectedFacilityId(null);
      }
    }
  }, [facilities, currentSelectedFacility, setSelectedFacilityId]);

  const handleCellClick = (x: number, y: number) => {
    const facility = facilities.find(f => f.position.x === x && f.position.y === y);
    
    if (facility) {
      setSelectedFacilityId(facility.id);
      setSelectedPosition(null);
      setShowBuildPanel(false);
    } else {
      setSelectedPosition({ x, y });
      setSelectedFacilityId(null);
      setShowBuildPanel(true);
    }
  };

  const handleBuild = (type: FacilityType) => {
    if (selectedPosition) {
      buildFacility(type, selectedPosition);
      setSelectedPosition(null);
      setShowBuildPanel(false);
    }
  };

  const handleUpgrade = (id: string) => {
    upgradeFacility(id);
  };

  const handleDemolish = (id: string) => {
    demolishFacility(id);
    setSelectedFacilityId(null);
  };

  const getFacilityIcon = (type: FacilityType) => {
    const icons = {
      farm: Wheat,
      homestay: Home,
      warehouse: Package,
      clinic: Heart,
      square: Users,
    };
    return icons[type];
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4">🏘️ 乡村地图</h2>
          
          <div className="grid grid-cols-10 gap-1 bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-lg">
            {grid.map((row, i) =>
              row.map((cell, j) => {
                const facility = facilities.find(
                  f => f.position.x === i && f.position.y === j
                );
                const Icon = facility ? getFacilityIcon(facility.type) : null;
                const config = facility ? FACILITY_CONFIG[facility.type] : null;

                return (
                  <div
                    key={`${i}-${j}`}
                    onClick={() => handleCellClick(i, j)}
                    className={`h-16 rounded-lg cursor-pointer transition-all flex items-center justify-center ${
                      facility
                        ? 'shadow-md'
                        : 'bg-white/50 hover:bg-white/80 border-2 border-dashed border-green-300'
                    } ${selectedPosition?.x === i && selectedPosition?.y === j ? 'ring-4 ring-blue-500' : ''} ${currentSelectedFacility?.position.x === i && currentSelectedFacility?.position.y === j ? 'ring-4 ring-yellow-500' : ''}`}
                    style={{
                      backgroundColor: facility ? config?.color : undefined,
                    }}
                  >
                    {facility && Icon && (
                      <div className="flex flex-col items-center">
                        <Icon size={24} color="white" />
                        {facility.level > 1 && (
                          <span className="text-xs text-white font-bold">
                            Lv.{facility.level}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            {Object.entries(FACILITY_CONFIG).map(([type, config]) => {
              const Icon = {
                farm: Wheat,
                homestay: Home,
                warehouse: Package,
                clinic: Heart,
                square: Users,
              }[type as FacilityType];
              
              return (
                <div key={type} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ backgroundColor: config.color }}
                  >
                    <Icon size={20} color="white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{config.name}</div>
                    <div className="text-gray-600">💰 {config.baseCost}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showBuildPanel && selectedPosition && (
        <div className="w-80 bg-white shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-green-800">建设设施</h3>
            <button
              onClick={() => {
                setShowBuildPanel(false);
                setSelectedPosition(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            位置: ({selectedPosition.x}, {selectedPosition.y})
          </p>

          <div className="space-y-3">
            {Object.entries(FACILITY_CONFIG).map(([type, config]) => {
              const Icon = {
                farm: Wheat,
                homestay: Home,
                warehouse: Package,
                clinic: Heart,
                square: Users,
              }[type as FacilityType];
              
              const canAfford = money >= config.baseCost;

              return (
                <button
                  key={type}
                  onClick={() => handleBuild(type as FacilityType)}
                  disabled={!canAfford}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    canAfford
                      ? 'border-green-300 hover:border-green-500 hover:shadow-md bg-green-50'
                      : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: config.color }}
                    >
                      <Icon size={28} color="white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-lg">{config.name}</div>
                      <div className="text-sm text-gray-600">
                        产出: {config.baseOutput} | 维护: {config.maintenanceCost}
                      </div>
                      <div className="text-sm font-medium text-green-700">
                        💰 {config.baseCost}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {currentSelectedFacility && (
        <div className="w-80 bg-white shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-green-800">设施详情</h3>
            <button
              onClick={() => {
                setSelectedFacilityId(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: FACILITY_CONFIG[currentSelectedFacility.type].color }}
                >
                  {(() => {
                    const Icon = getFacilityIcon(currentSelectedFacility.type);
                    return <Icon size={32} color="white" />;
                  })()}
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {FACILITY_CONFIG[currentSelectedFacility.type].name}
                  </div>
                  <div className="text-sm text-gray-600">
                    等级 Lv.{currentSelectedFacility.level}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>📍 位置: ({currentSelectedFacility.position.x}, {currentSelectedFacility.position.y})</div>
                <div>📈 产出: {currentSelectedFacility.output}</div>
                <div>🔧 维护费: {currentSelectedFacility.maintenanceCost}</div>
                <div>😊 满意度: +{currentSelectedFacility.satisfactionBonus}</div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleUpgrade(currentSelectedFacility.id)}
                disabled={money < currentSelectedFacility.cost * currentSelectedFacility.level}
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
              >
                升级 (💰 {currentSelectedFacility.cost * currentSelectedFacility.level})
              </button>
              <button
                onClick={() => handleDemolish(currentSelectedFacility.id)}
                className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                拆除 (返还 💰 {Math.floor(currentSelectedFacility.cost * 0.5)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
