'use client';

import React, { useState } from 'react';
import { X, SlidersHorizontal, RotateCcw, Check, Sun, Battery, Zap } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-card">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-muted border border-border text-solar">
              <SlidersHorizontal className="w-4 h-4 stroke-[2.25]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Engineering Sizing Constants</h3>
              <p className="text-xs text-muted-foreground">
                Calibrate regional insolation, system derating, and battery boundaries.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Solar PV Parameters */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-solar flex items-center gap-1.5 border-b border-border pb-1">
              <Sun className="w-3.5 h-3.5" />
              Photovoltaic & Solar Insolation
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Peak Sun Hours (PSH)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={1}
                  max={12}
                  value={form.peakSunHours}
                  onChange={(e) => handleChange('peakSunHours', parseFloat(e.target.value) || 4.5)}
                  className="w-full h-9 bg-background border border-input focus:border-solar rounded-lg px-3 text-xs font-mono font-bold text-foreground focus:outline-none transition-colors"
                />
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">Standard: 4.5 hrs/day</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  System Derate Factor
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={0.5}
                  max={1.0}
                  value={form.systemDerate}
                  onChange={(e) => handleChange('systemDerate', parseFloat(e.target.value) || 0.75)}
                  className="w-full h-9 bg-background border border-input focus:border-solar rounded-lg px-3 text-xs font-mono font-bold text-foreground focus:outline-none transition-colors"
                />
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">Standard: 0.75 (75%)</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Module Rating (W)
                </label>
                <input
                  type="number"
                  step="5"
                  min={100}
                  max={700}
                  value={form.panelWattage}
                  onChange={(e) => handleChange('panelWattage', parseInt(e.target.value, 10) || 450)}
                  className="w-full h-9 bg-background border border-input focus:border-solar rounded-lg px-3 text-xs font-mono font-bold text-foreground focus:outline-none transition-colors"
                />
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">Standard: 450 W</span>
              </div>
            </div>
          </div>

          {/* Inverter Sizing Parameters */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-solar flex items-center gap-1.5 border-b border-border pb-1">
              <Zap className="w-3.5 h-3.5" />
              Inverter & Continuous Headroom
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Inverter Headroom Margin
                </label>
                <input
                  type="number"
                  step="0.05"
                  min={1.0}
                  max={2.0}
                  value={form.inverterHeadroom}
                  onChange={(e) => handleChange('inverterHeadroom', parseFloat(e.target.value) || 1.25)}
                  className="w-full h-9 bg-background border border-input focus:border-solar rounded-lg px-3 text-xs font-mono font-bold text-foreground focus:outline-none transition-colors"
                />
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">
                  1.25 = +25% continuous safety headroom
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Inverter Power Factor (PF)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min={0.6}
                  max={1.0}
                  value={form.inverterPowerFactor}
                  onChange={(e) => handleChange('inverterPowerFactor', parseFloat(e.target.value) || 0.8)}
                  className="w-full h-9 bg-background border border-input focus:border-solar rounded-lg px-3 text-xs font-mono font-bold text-foreground focus:outline-none transition-colors"
                />
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">
                  Standard: 0.80 inductive power factor
                </span>
              </div>
            </div>
          </div>

          {/* Battery Storage Parameters */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-storage flex items-center gap-1.5 border-b border-border pb-1">
              <Battery className="w-3.5 h-3.5" />
              LiFePO4 Storage Boundaries
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Maximum Depth-of-Discharge (DoD)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min={0.5}
                  max={0.95}
                  value={form.batteryDoD}
                  onChange={(e) => handleChange('batteryDoD', parseFloat(e.target.value) || 0.85)}
                  className="w-full h-9 bg-background border border-input focus:border-solar rounded-lg px-3 text-xs font-mono font-bold text-foreground focus:outline-none transition-colors"
                />
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">
                  Standard: 0.85 (85% usable capacity for cell preservation)
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Roundtrip Storage Efficiency
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={0.7}
                  max={0.98}
                  value={form.batteryEfficiency}
                  onChange={(e) => handleChange('batteryEfficiency', parseFloat(e.target.value) || 0.90)}
                  className="w-full h-9 bg-background border border-input focus:border-solar rounded-lg px-3 text-xs font-mono font-bold text-foreground focus:outline-none transition-colors"
                />
                <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">
                  Standard: 0.90 (90% LiFePO4 roundtrip efficiency)
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-8 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-8 inline-flex items-center gap-1.5 px-4 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Save Constants</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
