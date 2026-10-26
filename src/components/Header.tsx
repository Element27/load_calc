'use client';

import React from 'react';
import {
  Sun,
  RotateCcw,
  SlidersHorizontal,
  FolderOpen,
  Plus,
  FileSpreadsheet,
} from 'lucide-react';
import { PRESET_PROFILES } from '../constants/defaults';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  clientName: string;
  setClientName: (name: string) => void;
  onResetAll: () => void;
  onOpenAddCustom: () => void;
  onOpenSettings: () => void;
  onOpenProjects: () => void;
  onOpenProposal: () => void;
  onApplyPreset: (presetId: string) => void;
  activePreset: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  clientName,
  setClientName,
  onResetAll,
  onOpenAddCustom,
  onOpenSettings,
  onOpenProjects,
  onOpenProposal,
  onApplyPreset,
  activePreset,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-md text-foreground transition-colors duration-150 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          {/* Brand & Console Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-muted text-solar transition-colors"
                aria-hidden="true"
              >
                <Sun className="w-5 h-5 stroke-[2.25]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight text-foreground">SolarSpec</span>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md border border-border bg-muted text-muted-foreground">
                    Load Audit Console
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Photovoltaic, battery storage, and inverter capacity sizing
                </p>
              </div>
            </div>

            {/* Mobile quick toggles */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <ThemeToggle variant="compact" />
              <button
                type="button"
                onClick={onOpenSettings}
                className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Sizing parameters (sun hours, derate, headroom)"
                aria-label="Open engineering settings"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Site Metadata & Engineering Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Client / Site Name */}
            <div className="relative flex-1 min-w-[170px] max-w-xs">
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Site address or client identifier"
                className="w-full h-9 rounded-lg px-3 text-xs border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-solar focus:ring-1 focus:ring-solar/20 focus:outline-none transition-colors"
              />
            </div>

            {/* Presets Menu */}
            <div className="relative min-w-[140px]">
              <select
                aria-label="Load preset load schedule"
                value={activePreset || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    onApplyPreset(e.target.value);
                  }
                }}
                className="w-full h-9 rounded-lg px-2.5 text-xs font-medium border border-input bg-background text-foreground hover:border-border focus:border-solar focus:outline-none cursor-pointer transition-colors"
              >
                <option value="" disabled>
                  Load profile template...
                </option>
                {PRESET_PROFILES.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Custom Load */}
            <button
              type="button"
              onClick={onOpenAddCustom}
              className="h-9 inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Custom Load</span>
            </button>

            {/* Proposal / Report Generator */}
            <button
              type="button"
              onClick={onOpenProposal}
              className="h-9 inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-medium border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Generate printable specification and client proposal"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-solar" />
              <span className="hidden sm:inline">Proposal Report</span>
            </button>

            {/* Saved Projects */}
            <button
              type="button"
              onClick={onOpenProjects}
              className="h-9 hidden md:inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-medium border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="View saved site load snapshots"
            >
              <FolderOpen className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Saved Audits</span>
            </button>

            {/* Engineering Sizing Settings */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="h-9 hidden lg:inline-flex items-center justify-center px-2.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Engineering constants (PSH, Derate, Inverter Headroom, DoD)"
              aria-label="Engineering Settings"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Accessible Segmented Theme Toggle */}
            <div className="hidden lg:inline-flex">
              <ThemeToggle variant="segmented" />
            </div>

            {/* Reset All */}
            <button
              type="button"
              onClick={onResetAll}
              className="h-9 inline-flex items-center gap-1.5 px-2.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors cursor-pointer"
              title="Reset all quantities, runtimes, and client info"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
