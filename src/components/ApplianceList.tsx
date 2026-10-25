'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Trash2,
  RotateCcw,
  Zap,
  CheckCircle2,
  Filter,
  Layers,
} from 'lucide-react';
import { Appliance } from '../types/solar';
import { ApplianceItem } from './ApplianceItem';

interface ApplianceListProps {
  appliances: Appliance[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onUpdateHours: (id: string, hours: number) => void;
  onDeleteCustom: (id: string) => void;
  onOpenAddCustom: () => void;
  onZeroAll: () => void;
  onResetHoursToDefault: () => void;
  isDarkMode?: boolean;
}

export const ApplianceList: React.FC<ApplianceListProps> = ({
  appliances,
  onUpdateQuantity,
  onUpdateHours,
  onDeleteCustom,
  onOpenAddCustom,
  onZeroAll,
  onResetHoursToDefault,
  isDarkMode = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories list
  const categories = [
    { id: 'all', label: 'All appliances' },
    { id: 'cooling', label: 'Cooling & AC' },
    { id: 'refrigeration', label: 'Refrigeration' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'pumps', label: 'Pumps & Motors' },
    { id: 'custom', label: 'Custom items' },
  ];

  const filteredAppliances = useMemo(() => {
    return appliances.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'custom') return Boolean(item.isCustom);
      return item.category === selectedCategory;
    });
  }, [appliances, searchTerm, selectedCategory]);

  const activeCount = useMemo(() => {
    return appliances.filter((item) => item.quantity > 0).length;
  }, [appliances]);

  const totalApplianceCount = useMemo(() => {
    return appliances.reduce((sum, item) => sum + item.quantity, 0);
  }, [appliances]);

  return (
    <div className="space-y-4">
      
      {/* Header & Quick Action Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Appliance load audit
              </h2>
              {activeCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {totalApplianceCount} {totalApplianceCount === 1 ? 'Unit' : 'Units'} ({activeCount} {activeCount === 1 ? 'Type' : 'Types'})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Set how many units run each day and for how many hours.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddCustom}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Custom Appliance</span>
            </button>
          </div>
        </div>

        {/* Search & Categories Filter */}
        <div className="mt-3.5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search appliances (e.g. AC, Fridge, Fan, Pump)..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-xs rounded-lg whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Utility Toolbar */}
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">
            Showing {filteredAppliances.length} of {appliances.length} items
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetHoursToDefault}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
              title="Reset runtime hours of all items to default"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Hours
            </button>
            <button
              onClick={onZeroAll}
              className="hover:text-rose-400 transition-colors flex items-center gap-1 text-slate-400"
              title="Set all quantities to zero"
            >
              <Trash2 className="w-3 h-3" />
              Clear Quantities
            </button>
          </div>
        </div>
      </div>

      {/* Appliance Items List */}
      <div className="space-y-3">
        {filteredAppliances.length > 0 ? (
          filteredAppliances.map((item) => (
            <ApplianceItem
              key={item.id}
              appliance={item}
              onUpdateQuantity={onUpdateQuantity}
              onUpdateHours={onUpdateHours}
              onDeleteCustom={onDeleteCustom}
              isDarkMode={isDarkMode}
            />
          ))
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Search className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
            <h3 className="text-sm font-semibold text-slate-300">
              No appliances match your search
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Clear your search filter or add a custom appliance with its rated wattage.
            </p>
            <button
              onClick={onOpenAddCustom}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Add Custom Appliance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
