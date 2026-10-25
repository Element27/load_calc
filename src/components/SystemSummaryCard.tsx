'use client';

import React, { useState } from 'react';
import {
  Zap,
  BatteryCharging,
  Sun,
  Activity,
  Copy,
  Check,
  FileText,
  BookmarkPlus,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Info,
  Layers,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CalculationResults, SystemSettings, Appliance } from '../types/solar';

interface SystemSummaryCardProps {
  results: CalculationResults;
  settings: SystemSettings;
  appliances: Appliance[];
  clientName: string;
  onOpenProposal: () => void;
  onSaveSnapshot: () => void;
  isDarkMode?: boolean;
}

export const SystemSummaryCard: React.FC<SystemSummaryCardProps> = ({
  results,
  settings,
  appliances,
  clientName,
  onOpenProposal,
  onSaveSnapshot,
  isDarkMode = true,
}) => {
  const [copied, setCopied] = useState(false);

  const activeAppliances = appliances.filter((a) => a.quantity > 0);

  // Generate text quotation snippet for quick copy (WhatsApp / Email)
  const handleCopyQuote = () => {
    const title = clientName ? `SOLAR SYSTEM SIZING FOR ${clientName.toUpperCase()}` : 'SOLAR SYSTEM SIZING SUMMARY';
    
    let text = `=====================================\n`;
    text += `☀️ ${title}\n`;
    text += `=====================================\n\n`;
    
    text += `📊 SITE LOAD SUMMARY:\n`;
    text += `• Continuous Power: ${results.totalRunningWatts.toLocaleString()} W\n`;
    text += `• Estimated Startup Surge: ${results.peakSurgeWatts.toLocaleString()} W\n`;
    text += `• Daily Energy Demand: ${results.dailyEnergyKWh.toFixed(2)} kWh/day\n\n`;

    text += `⚙️ RECOMMENDED EQUIPMENT:\n`;
    text += `1️⃣ INVERTER: ${results.inverterLabel || 'None'}\n`;
    text += `   - Raw Load Demand: ${results.rawInverterKVA.toFixed(2)} kVA (${settings.inverterHeadroom * 100 - 100}% continuous safety margin)\n`;
    text += `2️⃣ BATTERY STORAGE (LiFePO4):\n`;
    text += `   - Usable Storage Required: ${results.requiredBatteryKWh.toFixed(2)} kWh\n`;
    text += `   - Recommended Bank: ${results.batteryConfigLabel} (${results.actualBatteryKWh.toFixed(2)} kWh total)\n`;
    text += `3️⃣ SOLAR ARRAY:\n`;
    text += `   - Array Size: ${results.rawPVArrayKWp.toFixed(2)} kWp\n`;
    text += `   - Panels: ${results.panelCount}x ${settings.panelWattage}W modules (${results.actualPVKWp.toFixed(2)} kWp total)\n\n`;

    if (activeAppliances.length > 0) {
      text += `📋 APPLIANCE BREAKDOWN (${activeAppliances.length} items):\n`;
      activeAppliances.forEach((item) => {
        const itemWh = item.quantity * item.ratedWatts * item.hoursPerDay;
        text += `• ${item.quantity}x ${item.name} (${item.ratedWatts}W) @ ${item.hoursPerDay}h/day = ${(itemWh / 1000).toFixed(2)} kWh/d\n`;
      });
      text += `\n`;
    }

    text += `Calculated with SolarSpec`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const hasLoad = results.totalRunningWatts > 0;

  return (
    <div className="space-y-4">
      
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 shadow-2xl backdrop-blur-md">
        
        {/* Glow background effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Recommended equipment sizing
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hardware sizes based on continuous wattage, surge spikes, and battery reserve.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasLoad ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sizing calculated
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                <Info className="w-3.5 h-3.5" />
                Add appliances to calculate
              </span>
            )}
          </div>
        </div>

        {/* 3 Main Specification Cards */}
        <div className="space-y-3.5">
          
          {/* Card 1: Recommended Inverter */}
          <div className="relative group rounded-xl p-4 bg-slate-950/80 border border-amber-500/40 hover:border-amber-400 transition-all shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20">
                  <Zap className="w-6 h-6 fill-current stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Recommended Inverter
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
                    {hasLoad ? results.inverterLabel : '0 kVA (No active loads)'}
                  </div>
                </div>
              </div>

              {hasLoad && (
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400 block">Raw kVA Req.</span>
                  <span className="text-sm font-bold text-amber-300">
                    {results.rawInverterKVA.toFixed(2)} kVA
                  </span>
                </div>
              )}
            </div>

            {hasLoad && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">
                    Running Watts
                  </span>
                  <span className="text-sm font-bold text-slate-100">
                    {results.totalRunningWatts.toLocaleString()} W
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">
                    Max Surge Watts
                  </span>
                  <span className="text-sm font-bold text-rose-400">
                    {results.peakSurgeWatts.toLocaleString()} W
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Recommended Battery Bank */}
          <div className="relative group rounded-xl p-4 bg-slate-950/80 border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20">
                  <BatteryCharging className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Battery Storage (LiFePO4)
                  </span>
                  <div className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
                    {hasLoad ? results.batteryConfigLabel : '0 modules (No active loads)'}
                  </div>
                </div>
              </div>

              {hasLoad && (
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400 block">Total Storage</span>
                  <span className="text-sm font-bold text-emerald-300">
                    {results.actualBatteryKWh.toFixed(2)} kWh
                  </span>
                </div>
              )}
            </div>

            {hasLoad && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>
                  Req. Storage: <strong className="text-white">{results.requiredBatteryKWh.toFixed(2)} kWh</strong>
                </span>
                <span>
                  Specs: {settings.batteryDoD * 100}% DoD | {settings.batteryEfficiency * 100}% Eff.
                </span>
              </div>
            )}
          </div>

          {/* Card 3: Recommended Solar Array */}
          <div className="relative group rounded-xl p-4 bg-slate-950/80 border border-sky-500/40 hover:border-sky-400 transition-all shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-slate-950 shadow-md shadow-sky-500/20">
                  <Sun className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                    Solar Array (PV)
                  </span>
                  <div className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
                    {hasLoad
                      ? `${results.panelCount}x ${settings.panelWattage}W Panels (${results.actualPVKWp.toFixed(2)} kWp)`
                      : '0 panels (No active loads)'}
                  </div>
                </div>
              </div>

              {hasLoad && (
                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400 block">Required kWp</span>
                  <span className="text-sm font-bold text-sky-300">
                    {results.rawPVArrayKWp.toFixed(2)} kWp
                  </span>
                </div>
              )}
            </div>

            {hasLoad && (
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>
                  Est. Generation:{' '}
                  <strong className="text-sky-300">
                    {results.dailyPVGenerationKWh.toFixed(2)} kWh/day
                  </strong>
                </span>
                <span>
                  {settings.peakSunHours} PSH @ {settings.systemDerate * 100}% Derate
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Diagnostic Breakdown Card */}
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              Site load totals
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Calculated live
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">
                Continuous load
              </span>
              <span className="text-base font-extrabold text-white font-mono mt-0.5 block">
                {results.totalRunningWatts.toLocaleString()} <span className="text-xs text-amber-400">W</span>
              </span>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">
                Peak motor surge
              </span>
              <span className="text-base font-extrabold text-rose-400 font-mono mt-0.5 block">
                {results.peakSurgeWatts.toLocaleString()} <span className="text-xs">W</span>
              </span>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">
                Daily energy demand
              </span>
              <span className="text-base font-extrabold text-emerald-400 font-mono mt-0.5 block">
                {results.dailyEnergyKWh.toFixed(2)} <span className="text-xs">kWh</span>
              </span>
            </div>
          </div>

          {/* Surge details alert if any */}
          {results.largestSurgeAppliance && results.largestSurgeAdder > 0 && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <Flame className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                Largest motor startup spike:{' '}
                <strong>+{results.largestSurgeAdder}W</strong> from the{' '}
                <strong className="text-white">{results.largestSurgeAppliance}</strong>.
              </span>
            </div>
          )}
        </div>

        {/* Field Installer Action Toolbar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          
          <button
            onClick={handleCopyQuote}
            disabled={!hasLoad}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy text quote'}</span>
          </button>

          <button
            onClick={onOpenProposal}
            disabled={!hasLoad}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-40 transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
            <span>Site Proposal</span>
          </button>

          <button
            onClick={onSaveSnapshot}
            disabled={!hasLoad}
            className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 transition-all"
            title="Save site audit"
          >
            <BookmarkPlus className="w-4 h-4 text-sky-400" />
          </button>

        </div>

      </div>
    </div>
  );
};
