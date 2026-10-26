'use client';

import React from 'react';
import {
  Minus,
  Plus,
  Trash2,
  Zap,
  Clock,
  Activity,
  Lightbulb,
  Fan,
  Tv,
  Refrigerator,
  Wind,
  Droplets,
  Laptop,
} from 'lucide-react';
import { Appliance } from '../types/solar';

interface ApplianceItemProps {
  appliance: Appliance;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onUpdateHours: (id: string, newHours: number) => void;
  onDeleteCustom?: (id: string) => void;
}

export const ApplianceItem: React.FC<ApplianceItemProps> = ({
  appliance,
  onUpdateQuantity,
  onUpdateHours,
  onDeleteCustom,
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

  const itemRunningWatts = quantity * ratedWatts;
  const itemDailyWh = itemRunningWatts * hoursPerDay;

  // Single-family monochrome icon resolver
  const renderIcon = () => {
    const iconClass = `w-4 h-4 ${quantity > 0 ? 'text-solar' : 'text-muted-foreground'}`;

    if (id.includes('light') || category === 'lighting') return <Lightbulb className={iconClass} />;
    if (id.includes('fan') || category === 'cooling') return <Fan className={iconClass} />;
    if (id.includes('tv') || category === 'electronics') return <Tv className={iconClass} />;
    if (id.includes('fridge') || category === 'refrigeration') return <Refrigerator className={iconClass} />;
    if (id.includes('ac')) return <Wind className={iconClass} />;
    if (id.includes('pump') || category === 'pumps') return <Droplets className={iconClass} />;
    if (id.includes('laptop')) return <Laptop className={iconClass} />;
    return <Zap className={iconClass} />;
  };

  const isHighSurge = surgeFactor >= 3.0;

  return (
    <div
      className={`rounded-lg p-3.5 transition-colors duration-150 border ${
        quantity > 0
          ? 'bg-card border-solar/40 shadow-xs ring-1 ring-solar/10'
          : 'bg-card/60 border-border hover:border-border/80'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Side: Category Icon, Name, Electrical Specs */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`p-2 rounded-md flex-shrink-0 border transition-colors ${
              quantity > 0
                ? 'bg-solar/10 border-solar/20'
                : 'bg-muted border-border'
            }`}
          >
            {renderIcon()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-sm font-semibold truncate ${
                  quantity > 0 ? 'text-foreground' : 'text-foreground/80'
                }`}
              >
                {name}
              </span>

              {isCustom && (
                <span className="text-[10px] font-mono font-medium uppercase px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border">
                  Custom
                </span>
              )}

              {surgeFactor > 1.0 && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    isHighSurge
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                  }`}
                  title={`${surgeFactor}× inrush startup multiplier`}
                >
                  <Activity className="w-2.5 h-2.5 stroke-[2.5]" />
                  {surgeFactor}× Inrush Surge
                </span>
              )}
            </div>

            {/* Electrical Ratings Line */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-0.5 text-xs font-mono text-muted-foreground">
              <span className="font-semibold text-foreground">
                {ratedWatts} W <span className="font-normal text-muted-foreground">rated</span>
              </span>
              <span className="text-border">•</span>
              <span>
                Peak: <strong className="text-foreground font-semibold">{Math.round(ratedWatts * surgeFactor)} W</strong>
              </span>
              {quantity > 0 && (
                <>
                  <span className="text-border">•</span>
                  <span className="text-solar font-semibold">
                    {(itemDailyWh / 1000).toFixed(2)} kWh/day
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quantity Stepper & Delete */}
        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-border">
          <div className="flex items-center h-8 rounded-md border border-border bg-background">
            <button
              type="button"
              onClick={() => onUpdateQuantity(id, Math.max(0, quantity - 1))}
              disabled={quantity <= 0}
              className="w-7 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-25 disabled:hover:bg-transparent rounded-l transition-colors cursor-pointer"
              title="Decrease quantity"
              aria-label={`Decrease ${name} quantity`}
            >
              <Minus className="w-3.5 h-3.5 stroke-[2]" />
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
              className="w-10 text-center text-xs font-mono font-bold text-solar bg-transparent focus:outline-none"
              aria-label={`${name} quantity`}
            />

            <button
              type="button"
              onClick={() => onUpdateQuantity(id, quantity + 1)}
              className="w-7 h-full flex items-center justify-center text-primary-foreground bg-primary hover:bg-primary-hover rounded-r font-bold transition-colors cursor-pointer"
              title="Increase quantity"
              aria-label={`Increase ${name} quantity`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {isCustom && onDeleteCustom && (
            <button
              type="button"
              onClick={() => onDeleteCustom(id)}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors cursor-pointer"
              title="Remove custom appliance"
              aria-label={`Remove custom ${name}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Operating Hours Slider */}
      <div
        className={`mt-2.5 pt-2.5 border-t border-border transition-opacity ${
          quantity > 0 ? 'opacity-100' : 'opacity-60 hover:opacity-100'
        }`}
      >
        <div className="flex items-center justify-between text-xs mb-1">
          <label
            htmlFor={`hours-input-${id}`}
            className="flex items-center gap-1.5 text-muted-foreground font-medium text-[11px]"
          >
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span>Daily Runtime:</span>
          </label>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <input
              id={`hours-input-${id}`}
              type="number"
              min={1}
              max={24}
              value={hoursPerDay}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateHours(id, isNaN(val) ? 1 : Math.min(24, Math.max(1, val)));
              }}
              className="w-9 text-center text-xs font-bold text-solar bg-background border border-border rounded py-0.5 focus:outline-none focus:border-solar"
            />
            <span className="text-muted-foreground">hrs/day</span>
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
          className="w-full"
          aria-label={`${name} runtime hours`}
        />

        <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5 font-mono">
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
