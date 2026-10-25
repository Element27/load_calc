'use client';

import React, { useState } from 'react';
import { X, Sliders, RotateCcw, Check, Sun, Battery, Zap } from 'lucide-react';
import { SystemSettings } from '../types/solar';
import { DEFAULT_SETTINGS } from '../constants/defaults';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SystemSettings;
  onSaveSettings: (newSettings: SystemSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [form, setForm] = useState<SystemSettings>(settings);

  if (!isOpen) return null;

  const handleChange = (key: keyof SystemSettings, val: number) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setForm(DEFAULT_SETTINGS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sliders className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sizing Rules & Engineering Constants</h3>
              <p className="text-xs text-slate-400">Adjust peak sun hours, battery depth-of-discharge, and safety margins</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Solar PV Parameters */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
              <Sun className="w-4 h-4" />
              Solar Panel & Sunlight Settings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Peak Sun Hours (PSH)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={1}
                  max={12}
                  value={form.peakSunHours}
                  onChange={(e) => handleChange('peakSunHours', parseFloat(e.target.value) || 4.5)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs font-bold text-sky-300 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Default: 4.5 hrs/day</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  System Derate Factor
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={0.5}
                  max={1.0}
                  value={form.systemDerate}
                  onChange={(e) => handleChange('systemDerate', parseFloat(e.target.value) || 0.75)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs font-bold text-sky-300 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Default: 0.75 (75%)</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Standard Panel Rating
                </label>
                <input
                  type="number"
                  step="5"
                  min={100}
                  max={700}
                  value={form.panelWattage}
                  onChange={(e) => handleChange('panelWattage', parseInt(e.target.value, 10) || 450)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs font-bold text-sky-300 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Default: 450 W</span>
              </div>
            </div>
          </div>

          {/* Inverter Sizing Parameters */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
              <Zap className="w-4 h-4" />
              Inverter & Electrical Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Inverter Headroom Multiplier
                </label>
                <input
                  type="number"
                  step="0.05"
                  min={1.0}
                  max={2.0}
                  value={form.inverterHeadroom}
                  onChange={(e) => handleChange('inverterHeadroom', parseFloat(e.target.value) || 1.25)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-300 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Default: 1.25 (25% Headroom)</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Power Factor (PF)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min={0.5}
                  max={1.0}
                  value={form.inverterPowerFactor}
                  onChange={(e) => handleChange('inverterPowerFactor', parseFloat(e.target.value) || 0.8)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-300 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Default: 0.8 PF</span>
              </div>
            </div>
          </div>

          {/* Battery Bank Parameters */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
              <Battery className="w-4 h-4" />
              LiFePO4 Lithium Battery Storage
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Depth of Discharge (DoD)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min={0.5}
                  max={1.0}
                  value={form.batteryDoD}
                  onChange={(e) => handleChange('batteryDoD', parseFloat(e.target.value) || 0.85)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-300 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Default: 0.85 (85% DoD)</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Round-Trip Efficiency
                </label>
                <input
                  type="number"
                  step="0.05"
                  min={0.7}
                  max={1.0}
                  value={form.batteryEfficiency}
                  onChange={(e) => handleChange('batteryEfficiency', parseFloat(e.target.value) || 0.9)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-300 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">Default: 0.90 (90% Eff.)</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Apply Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
