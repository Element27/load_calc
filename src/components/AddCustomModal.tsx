'use client';

import React, { useState } from 'react';
import { X, Plus, Zap, Clock, Flame, Tag } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add Custom Appliance</h3>
              <p className="text-xs text-slate-400">Enter rated wattage and run hours for equipment not in the default list</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-800/50 rounded-xl">
              {error}
            </div>
          )}

          {/* Appliance Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Appliance / Equipment Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Microwave Oven, Deep Freezer, Electric Gate"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rated Watts */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
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
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm font-semibold text-amber-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="e.g. 1200"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                  W
                </span>
              </div>
            </div>

            {/* Default Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Initial Quantity
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Daily Hours */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Estimated Daily Hours (1-24)
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
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm font-semibold text-sky-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Surge Multiplier */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Surge Multiplier (default 1.0x)
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
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm font-semibold text-rose-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="1.0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                  x
                </span>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-purple-400" />
              Equipment Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Appliance['category'])}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="other">Other / Heavy Appliance</option>
              <option value="cooling">Cooling & AC</option>
              <option value="refrigeration">Refrigeration</option>
              <option value="lighting">Lighting</option>
              <option value="electronics">Electronics</option>
              <option value="pumps">Pumps & Motors</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              Add to Load Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
