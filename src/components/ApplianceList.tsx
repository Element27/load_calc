'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Trash2,
  RotateCcw,
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
}

export const ApplianceList: React.FC<ApplianceListProps> = ({
  appliances,
  onUpdateQuantity,
  onUpdateHours,
  onDeleteCustom,
  onOpenAddCustom,
  onZeroAll,
  onResetHoursToDefault,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Loads' },
    { id: 'cooling', label: 'Cooling & AC' },
    { id: 'refrigeration', label: 'Refrigeration' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'pumps', label: 'Pumps & Motors' },
    { id: 'custom', label: 'Custom' },
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

  const totalRunningWatts = useMemo(() => {
    return appliances.reduce((sum, item) => sum + item.quantity * item.ratedWatts, 0);
  }, [appliances]);

  return (
    <div className="space-y-3.5">
      {/* Schedule Header & Filter Card */}
      <div className="rounded-xl p-4 sm:p-4.5 border border-border bg-card text-foreground transition-colors shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-foreground">Appliance Load Schedule</h2>
              {activeCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-md bg-solar/10 text-solar border border-solar/20">
                  {totalApplianceCount} active {totalApplianceCount === 1 ? 'unit' : 'units'} ({totalRunningWatts.toLocaleString()}W)
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify active quantities and daily operating hours for each item.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAddCustom}
              className="h-8 inline-flex items-center gap-1.5 px-2.5 text-xs font-semibold rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5] text-solar" />
              <span>Add Custom</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-3 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter appliances (e.g., Inverter AC, Fridge, Water Pump, Fan)..."
              className="w-full h-9 rounded-lg pl-9 pr-14 text-xs border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-solar focus:ring-1 focus:ring-solar/20 focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`h-7 px-2.5 text-xs rounded-md whitespace-nowrap transition-colors border font-medium cursor-pointer ${
                    isActive
                      ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                      : 'bg-muted/70 text-muted-foreground border-border hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule Sub-Toolbar */}
        <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono text-[11px]">
            {filteredAppliances.length} of {appliances.length} items listed
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onResetHoursToDefault}
              className="hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset daily operating hours to standard defaults"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Standard Runtimes</span>
            </button>
            <button
              type="button"
              onClick={onZeroAll}
              className="hover:text-destructive transition-colors flex items-center gap-1 cursor-pointer"
              title="Clear all selected item quantities"
            >
              <Trash2 className="w-3 h-3" />
              <span>Zero All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appliance Items List */}
      <div className="space-y-2">
        {filteredAppliances.length > 0 ? (
          filteredAppliances.map((item) => (
            <ApplianceItem
              key={item.id}
              appliance={item}
              onUpdateQuantity={onUpdateQuantity}
              onUpdateHours={onUpdateHours}
              onDeleteCustom={onDeleteCustom}
            />
          ))
        ) : (
          <div className="text-center py-10 px-4 rounded-xl border border-border bg-card/60 text-muted-foreground">
            <p className="text-xs font-medium">No appliances match &quot;{searchTerm}&quot;</p>
            <button
              type="button"
              onClick={onOpenAddCustom}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Custom Appliance</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
