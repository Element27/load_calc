'use client';

import React from 'react';
import {
  Sun,
  Zap,
  RotateCcw,
  Sliders,
  FolderOpen,
  Plus,
  Share2,
  FileText,
  Moon,
  Sparkles,
} from 'lucide-react';
import { PRESET_PROFILES } from '../constants/defaults';

interface HeaderProps {
  clientName: string;
  setClientName: (name: string) => void;
  onResetAll: () => void;
  onOpenAddCustom: () => void;
  onOpenSettings: () => void;
  onOpenProjects: () => void;
  onOpenProposal: () => void;
  onApplyPreset: (presetId: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
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
  isDarkMode,
  setIsDarkMode,
  activePreset,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-amber-500/20 bg-slate-900/95 backdrop-blur-md text-white shadow-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Application Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30">
                <Sun className="w-6 h-6 animate-pulse" />
                <Zap className="w-3.5 h-3.5 absolute -bottom-0.5 -right-0.5 text-amber-950 fill-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent">
                    SolarSpec
                  </h1>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Field calculator
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Solar load calculator for inverters, batteries, and panels
                </p>
              </div>
            </div>

            {/* Mobile quick actions */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={() => setIsDarkMode((prev) => !prev)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700"
                title="Sizing parameters (sun hours, derate)"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Client Input & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Client Name Input */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client or site address..."
                className="w-full bg-slate-800/90 border border-slate-700 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
              />
            </div>

            {/* Quick Presets Dropdown */}
            <div className="relative min-w-[130px]">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onApplyPreset(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full bg-slate-800 border border-slate-700 hover:border-amber-500 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  Sample property presets...
                </option>
                {PRESET_PROFILES.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Add Custom Button */}
            <button
              onClick={onOpenAddCustom}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Add Custom</span>
            </button>

            {/* Full Field Proposal Modal Button */}
            <button
              onClick={onOpenProposal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-slate-700 hover:border-amber-400 transition-all"
              title="View site proposal & PDF summary"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Site Proposal</span>
            </button>

            {/* Saved Projects Button */}
            <button
              onClick={onOpenProjects}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
              title="View saved site audits"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Saved Audits</span>
            </button>

            {/* Advanced Settings Button */}
            <button
              onClick={onOpenSettings}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
              title="Sizing parameters (sun hours, derate)"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode((prev) => !prev)}
              className="hidden md:inline-flex items-center justify-center p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 border border-slate-700 transition-all"
              title="Toggle Light/Dark Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Reset All Button */}
            <button
              onClick={onResetAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-rose-300 bg-rose-950/40 border border-rose-800/40 hover:bg-rose-900/60 hover:text-rose-200 transition-all"
              title="Reset all entries to default"
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
