'use client';

import React, { useState } from 'react';
import { X, Plus, Zap, Clock, Activity, Tag } from 'lucide-react';
import { Appliance } from '../types/solar';

interface AddCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppliance: (newAppliance: Omit<Appliance, 'id'>) => void;
}

export const AddCustomModal: React.FC<AddCustomModalProps> = ({
  isOpen,
  onClose,
  onAddAppliance,
}) => {
  const [name, setName] = useState('');
  const [ratedWatts, setRatedWatts] = useState<number | ''>(100);
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);
  const [surgeFactor, setSurgeFactor] = useState<number>(1.0);
  const [category, setCategory] = useState<Appliance['category']>('other');
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Appliance name is required');
      return;
    }

    const watts = Number(ratedWatts);
    if (isNaN(watts) || watts <= 0) {
      setError('Rated watts must be a positive number');
      return;
    }

    if (hoursPerDay < 1 || hoursPerDay > 24) {
      setError('Daily operating hours must be between 1 and 24');
      return;
    }

    if (surgeFactor < 1.0) {
      setError('Surge multiplier cannot be less than 1.0');
      return;
    }

    onAddAppliance({
      name: name.trim(),
      ratedWatts: watts,
      defaultHours: hoursPerDay,
      hoursPerDay,
      surgeFactor,
      quantity,
      isCustom: true,
      category,
    });

    // Reset form
    setName('');
    setRatedWatts(100);
    setHoursPerDay(8);
    setSurgeFactor(1.0);
    setQuantity(1);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-muted border border-border text-solar">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Add Custom Appliance</h3>
              <p className="text-xs text-muted-foreground">
                Specify rated wattage and duty cycle for non-standard equipment.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 text-xs font-mono text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              {error}
            </div>
          )}

          {/* Appliance Name */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Appliance / Load Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Deep Freezer, Borehole Pump, Arc Welder"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 bg-background border border-input focus:border-solar rounded-lg px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Rated Watts */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1 flex items-center gap-1">
                <Zap className="w-3 h-3 text-solar" />
                Rated Power (Watts) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  required
                  value={ratedWatts}
                  onChange={(e) =>
                    setRatedWatts(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full h-9 bg-background border border-input focus:border-solar rounded-lg pl-3 pr-8 text-xs font-mono font-bold text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors"
                  placeholder="1200"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                  W
                </span>
              </div>
            </div>

            {/* Default Quantity */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Initial Quantity
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full h-9 bg-background border border-input focus:border-solar rounded-lg px-3 text-xs font-mono font-bold text-foreground focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Daily Hours */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                Daily Operating Hours (1–24)
              </label>
              <input
                type="number"
                min={1}
                max={24}
                value={hoursPerDay}
                onChange={(e) =>
                  setHoursPerDay(
                    Math.min(24, Math.max(1, parseInt(e.target.value, 10) || 1))
                  )
                }
                className="w-full h-9 bg-background border border-input focus:border-solar rounded-lg px-3 text-xs font-mono font-bold text-foreground focus:outline-none transition-colors"
              />
            </div>

            {/* Surge Multiplier */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1 flex items-center gap-1">
                <Activity className="w-3 h-3 text-muted-foreground" />
                Startup Inrush Multiplier
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1.0}
                  step={0.1}
                  value={surgeFactor}
                  onChange={(e) =>
                    setSurgeFactor(Math.max(1.0, parseFloat(e.target.value) || 1.0))
                  }
                  className="w-full h-9 bg-background border border-input focus:border-solar rounded-lg pl-3 pr-6 text-xs font-mono font-bold text-foreground focus:outline-none transition-colors"
                  placeholder="1.0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                  ×
                </span>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-muted-foreground" />
              Load Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Appliance['category'])}
              className="w-full h-9 bg-background border border-input focus:border-solar rounded-lg px-2.5 text-xs font-medium text-foreground focus:outline-none cursor-pointer transition-colors"
            >
              <option value="other">General / Heavy Appliance</option>
              <option value="cooling">Cooling & Air Conditioning</option>
              <option value="refrigeration">Refrigeration</option>
              <option value="lighting">Lighting</option>
              <option value="electronics">Electronics</option>
              <option value="pumps">Pumps & Motor Drives</option>
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3.5 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer shadow-xs"
            >
              Add to Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
