'use client';

import React from 'react';
import {
  Minus,
  Plus,
  Trash2,
  Zap,
  Clock,
  Flame,
  Lightbulb,
  Fan,
  Tv,
  Refrigerator,
  Wind,
  Droplets,
  Laptop,
  HelpCircle,
} from 'lucide-react';
import { Appliance } from '../types/solar';

interface ApplianceItemProps {
  appliance: Appliance;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onUpdateHours: (id: string, newHours: number) => void;
  onDeleteCustom?: (id: string) => void;
  isDarkMode?: boolean;
}

export const ApplianceItem: React.FC<ApplianceItemProps> = ({
  appliance,
  onUpdateQuantity,
  onUpdateHours,
  onDeleteCustom,
  isDarkMode = true,
}) => {
  const {
    id,
    name,
    ratedWatts,
    hoursPerDay,
    surgeFactor,
    quantity,
    isCustom,
    category,
  } = appliance;

  // Total running watts for this appliance line item
  const itemRunningWatts = quantity * ratedWatts;
  // Daily Wh for this line item
  const itemDailyWh = itemRunningWatts * hoursPerDay;

  // Category Icon resolver
  const getIcon = () => {
    if (id.includes('light')) return <Lightbulb className="w-5 h-5 text-amber-400" />;
    if (id.includes('fan')) return <Fan className="w-5 h-5 text-sky-400" />;
    if (id.includes('tv')) return <Tv className="w-5 h-5 text-indigo-400" />;
    if (id.includes('fridge')) return <Refrigerator className="w-5 h-5 text-teal-400" />;
    if (id.includes('ac')) return <Wind className="w-5 h-5 text-cyan-400" />;
    if (id.includes('pump')) return <Droplets className="w-5 h-5 text-blue-400" />;
    if (id.includes('laptop')) return <Laptop className="w-5 h-5 text-purple-400" />;
    if (category === 'lighting') return <Lightbulb className="w-5 h-5 text-amber-400" />;
    if (category === 'cooling') return <Wind className="w-5 h-5 text-sky-400" />;
    if (category === 'refrigeration') return <Refrigerator className="w-5 h-5 text-teal-400" />;
    if (category === 'electronics') return <Tv className="w-5 h-5 text-indigo-400" />;
    if (category === 'pumps') return <Droplets className="w-5 h-5 text-blue-400" />;
    return <Zap className="w-5 h-5 text-yellow-400" />;
  };

  const isHighSurge = surgeFactor >= 3.0;
  const isModerateSurge = surgeFactor > 1.2 && surgeFactor < 3.0;

  return (
    <div
      className={`relative group rounded-xl p-4 transition-all border ${
        quantity > 0
          ? isDarkMode
            ? 'bg-slate-800/90 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
            : 'bg-white border-amber-400 shadow-md ring-1 ring-amber-400/30'
          : isDarkMode
          ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left Side: Icon & Title & Badges */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`p-2.5 rounded-lg flex-shrink-0 ${
              quantity > 0
                ? 'bg-slate-950/80 border border-slate-700/80 shadow-inner'
                : 'bg-slate-800/50 border border-slate-800'
            }`}
          >
            {getIcon()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`text-sm font-semibold truncate ${
                  quantity > 0
                    ? isDarkMode
                      ? 'text-white'
                      : 'text-slate-900'
                    : isDarkMode
                    ? 'text-slate-300'
                    : 'text-slate-700'
                }`}
              >
                {name}
              </h3>

              {/* Custom badge */}
              {isCustom && (
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Custom
                </span>
              )}

              {/* Surge Badge */}
              {surgeFactor > 1.0 && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    isHighSurge
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : isModerateSurge
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-slate-700/50 text-slate-400 border-slate-600/30'
                  }`}
                  title={`Surge multiplier: ${surgeFactor}x rated power`}
                >
                  <Flame className="w-3 h-3 fill-current" />
                  {surgeFactor}x Surge
                  {isHighSurge && <span className="font-bold"> (High)</span>}
                </span>
              )}
            </div>

            {/* Subtitle specifications */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
              <span className="font-medium text-slate-300">
                <span className="text-amber-400 font-bold">{ratedWatts} W</span> rated
              </span>
              <span>•</span>
              <span>
                Peak Surge:{' '}
                <strong className="text-rose-400">
                  {Math.round(ratedWatts * surgeFactor)} W
                </strong>
              </span>
              {quantity > 0 && (
                <>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">
                    Line Total: {(itemDailyWh / 1000).toFixed(2)} kWh/day
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quantity Stepper & Delete */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-700/50">
          
          {/* Stepper Controls */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-700/80 shadow-inner">
            <button
              onClick={() => onUpdateQuantity(id, Math.max(0, quantity - 1))}
              disabled={quantity <= 0}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90"
              title="Decrease quantity"
              type="button"
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>

            <input
              type="number"
              min={0}
              max={999}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateQuantity(id, isNaN(val) ? 0 : Math.max(0, val));
              }}
              className="w-12 text-center text-sm font-bold text-amber-400 bg-transparent focus:outline-none"
            />

            <button
              onClick={() => onUpdateQuantity(id, quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all active:scale-90 shadow-sm"
              title="Increase quantity"
              type="button"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Custom item delete button */}
          {isCustom && onDeleteCustom && (
            <button
              onClick={() => onDeleteCustom(id)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Remove custom appliance"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Daily Operating Hours Control (Visible when quantity > 0 or always enabled) */}
      <div
        className={`mt-3 pt-3 border-t border-slate-700/40 transition-all ${
          quantity > 0 ? 'opacity-100' : 'opacity-60 hover:opacity-100'
        }`}
      >
        <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
          <label
            htmlFor={`hours-slider-${id}`}
            className="flex items-center gap-1.5 text-slate-300 font-medium"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Daily Runtime:
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={24}
              value={hoursPerDay}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateHours(id, isNaN(val) ? 1 : Math.min(24, Math.max(1, val)));
              }}
              className="w-12 text-center text-xs font-bold text-amber-300 bg-slate-950 border border-slate-700 rounded py-0.5 focus:outline-none focus:border-amber-500"
            />
            <span className="text-slate-400 font-medium">hrs / day</span>
          </div>
        </div>

        <input
          id={`hours-slider-${id}`}
          type="range"
          min={1}
          max={24}
          step={1}
          value={hoursPerDay}
          onChange={(e) => onUpdateHours(id, parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
        />
        
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>1h</span>
          <span>6h</span>
          <span>12h</span>
          <span>18h</span>
          <span>24h</span>
        </div>
      </div>
    </div>
  );
};
