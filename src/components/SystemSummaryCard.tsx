'use client';

import React, { useState } from 'react';
import {
  Zap,
  BatteryCharging,
  Sun,
  Activity,
  Copy,
  Check,
  FileSpreadsheet,
  BookmarkPlus,
  ShieldCheck,
  AlertCircle,
  Cpu,
} from 'lucide-react';
import { CalculationResults, SystemSettings, Appliance } from '../types/solar';

interface SystemSummaryCardProps {
  results: CalculationResults;
  settings: SystemSettings;
  appliances: Appliance[];
  clientName: string;
  onOpenProposal: () => void;
  onSaveSnapshot: () => void;
}

export const SystemSummaryCard: React.FC<SystemSummaryCardProps> = ({
  results,
  settings,
  appliances,
  clientName,
  onOpenProposal,
  onSaveSnapshot,
}) => {
  const [copied, setCopied] = useState(false);

  const activeAppliances = appliances.filter((a) => a.quantity > 0);
  const hasLoad = results.totalRunningWatts > 0;

  // Clean ASCII technical summary formatted for WhatsApp/Email
  const handleCopyQuote = () => {
    const title = clientName
      ? `SOLAR LOAD AUDIT & SPECIFICATION: ${clientName.toUpperCase()}`
      : 'SOLAR LOAD AUDIT & SYSTEM SPECIFICATION';

    let text = `--------------------------------------------------\n`;
    text += `${title}\n`;
    text += `Generated: ${new Date().toLocaleDateString()} | SolarSpec Console\n`;
    text += `--------------------------------------------------\n\n`;

    text += `1. ELECTRICAL LOAD PROFILE\n`;
    text += `   - Continuous Demand: ${results.totalRunningWatts.toLocaleString()} W\n`;
    text += `   - Peak Startup Surge: ${results.peakSurgeWatts.toLocaleString()} W\n`;
    text += `   - Daily Energy Consumption: ${results.dailyEnergyKWh.toFixed(2)} kWh/day\n\n`;

    text += `2. RECOMMENDED HARDWARE SIZING\n`;
    text += `   - Inverter: ${results.inverterLabel || 'None'}\n`;
    text += `     Raw demand: ${results.rawInverterKVA.toFixed(2)} kVA with ${(settings.inverterHeadroom * 100 - 100).toFixed(0)}% continuous margin\n`;
    text += `   - Battery Bank (LiFePO4): ${results.batteryConfigLabel}\n`;
    text += `     Total capacity: ${results.actualBatteryKWh.toFixed(2)} kWh (${results.requiredBatteryKWh.toFixed(2)} kWh usable @ ${(settings.batteryDoD * 100).toFixed(0)}% DoD)\n`;
    text += `   - Photovoltaic Array: ${results.panelCount}x ${settings.panelWattage}W modules\n`;
    text += `     Array rating: ${results.actualPVKWp.toFixed(2)} kWp (${results.dailyPVGenerationKWh.toFixed(2)} kWh/day est. @ ${settings.peakSunHours} PSH)\n`;
    text += `   - Nominal DC System Voltage: ${results.recommendedDCVoltage} V\n\n`;

    if (activeAppliances.length > 0) {
      text += `3. AUDITED APPLIANCE SCHEDULE (${activeAppliances.length} items)\n`;
      activeAppliances.forEach((item) => {
        const itemWh = item.quantity * item.ratedWatts * item.hoursPerDay;
        text += `   - ${item.quantity}x ${item.name} (${item.ratedWatts}W) @ ${item.hoursPerDay}h/d -> ${(itemWh / 1000).toFixed(2)} kWh/day\n`;
      });
      text += `\n`;
    }

    text += `Preliminary engineering sizing. Final wire sizing and OCPD to be verified on site.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3.5">
      {/* Engineering Spec Placard */}
      <div className="rounded-xl p-4 sm:p-5 border border-border bg-card text-foreground transition-colors shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-solar" />
              <h2 className="text-sm font-bold tracking-tight text-foreground">System Specification Sheet</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Derived from active load audit, motor inrush margins, and battery reserves.
            </p>
          </div>

          <div>
            {hasLoad ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-solar/10 text-solar border border-solar/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Spec Computed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono text-muted-foreground border border-border bg-muted">
                <AlertCircle className="w-3.5 h-3.5" />
                Awaiting Loads
              </span>
            )}
          </div>
        </div>

        {/* 3 Core Hardware Placards */}
        <div className="space-y-3">
          {/* Inverter Sizing Placard */}
          <div className="rounded-lg p-3.5 border border-border bg-muted/30 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md border border-border bg-card text-solar shadow-xs">
                  <Zap className="w-4 h-4 stroke-[2.25]" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Inverter Sizing
                  </div>
                  <div className="text-lg font-bold tracking-tight text-foreground mt-0.5">
                    {hasLoad ? results.inverterLabel : '0 kVA (No active loads)'}
                  </div>
                </div>
              </div>

              {hasLoad && (
                <div className="text-right font-mono text-xs">
                  <span className="text-[10px] text-muted-foreground block uppercase">Raw Demand</span>
                  <span className="font-semibold text-foreground">
                    {results.rawInverterKVA.toFixed(2)} kVA
                  </span>
                </div>
              )}
            </div>

            {hasLoad && (
              <div className="mt-3 pt-2.5 border-t border-border grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="text-muted-foreground">
                  <span className="text-[10px] text-muted-foreground block">Continuous Power</span>
                  <span className="font-semibold text-foreground">
                    {results.totalRunningWatts.toLocaleString()} W
                  </span>
                </div>
                <div className="text-muted-foreground">
                  <span className="text-[10px] text-muted-foreground block">Peak Inrush Surge</span>
                  <span className="font-semibold text-foreground">
                    {results.peakSurgeWatts.toLocaleString()} W
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Battery Bank Placard (Clean Grid / Storage Accent) */}
          <div className="rounded-lg p-3.5 border border-storage/25 bg-storage/5 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md border border-storage/30 bg-card text-storage shadow-xs">
                  <BatteryCharging className="w-4 h-4 stroke-[2.25]" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-storage/90">
                    LiFePO4 Storage Bank
                  </div>
                  <div className="text-base font-bold tracking-tight text-foreground mt-0.5">
                    {hasLoad ? results.batteryConfigLabel : '0 modules (No active loads)'}
                  </div>
                </div>
              </div>

              {hasLoad && (
                <div className="text-right font-mono text-xs">
                  <span className="text-[10px] text-storage/80 block uppercase">Installed Bank</span>
                  <span className="font-semibold text-storage">
                    {results.actualBatteryKWh.toFixed(2)} kWh
                  </span>
                </div>
              )}
            </div>

            {hasLoad && (
              <div className="mt-3 pt-2.5 border-t border-storage/20 flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>
                  Usable Required: <strong className="text-foreground">{results.requiredBatteryKWh.toFixed(2)} kWh</strong>
                </span>
                <span className="text-storage font-medium">
                  {(settings.batteryDoD * 100).toFixed(0)}% DoD Limit
                </span>
              </div>
            )}
          </div>

          {/* Solar PV Array Placard */}
          <div className="rounded-lg p-3.5 border border-border bg-muted/30 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md border border-border bg-card text-solar shadow-xs">
                  <Sun className="w-4 h-4 stroke-[2.25]" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Photovoltaic Array (PV)
                  </div>
                  <div className="text-base font-bold tracking-tight text-foreground mt-0.5">
                    {hasLoad
                      ? `${results.panelCount}x ${settings.panelWattage}W Modules`
                      : '0 modules (No active loads)'}
                  </div>
                </div>
              </div>

              {hasLoad && (
                <div className="text-right font-mono text-xs">
                  <span className="text-[10px] text-muted-foreground block uppercase">Array Size</span>
                  <span className="font-semibold text-foreground">
                    {results.actualPVKWp.toFixed(2)} kWp
                  </span>
                </div>
              )}
            </div>

            {hasLoad && (
              <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>
                  Est. Daily Yield: <strong className="text-foreground">{results.dailyPVGenerationKWh.toFixed(2)} kWh/day</strong>
                </span>
                <span className="text-muted-foreground">
                  {settings.peakSunHours} PSH
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Load Telemetry Strip */}
        <div className="mt-4 pt-3.5 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-muted-foreground" />
              Site Demand Telemetry
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              Live calculation
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2.5 rounded-lg border border-border bg-muted/50">
              <div className="text-[10px] text-muted-foreground uppercase">Continuous</div>
              <div className="text-sm font-bold text-foreground mt-0.5">
                {results.totalRunningWatts.toLocaleString()} <span className="text-[10px] text-muted-foreground">W</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-border bg-muted/50">
              <div className="text-[10px] text-muted-foreground uppercase">Max Surge</div>
              <div className="text-sm font-bold text-foreground mt-0.5">
                {results.peakSurgeWatts.toLocaleString()} <span className="text-[10px] text-muted-foreground">W</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-solar/20 bg-solar/10 text-solar">
              <div className="text-[10px] text-solar/80 uppercase font-medium">Daily Demand</div>
              <div className="text-sm font-bold text-solar mt-0.5">
                {results.dailyEnergyKWh.toFixed(2)} <span className="text-[10px] text-solar/80">kWh</span>
              </div>
            </div>
          </div>

          {/* Surge details note */}
          {results.largestSurgeAppliance && results.largestSurgeAdder > 0 && (
            <div className="p-2.5 rounded-lg text-xs font-mono border border-border bg-muted/40 text-muted-foreground">
              Largest inductive surge: +{results.largestSurgeAdder}W from{' '}
              <span className="font-semibold text-foreground">{results.largestSurgeAppliance}</span>
            </div>
          )}
        </div>

        {/* Primary Field Technician Actions */}
        <div className="mt-4 pt-3.5 border-t border-border flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyQuote}
            disabled={!hasLoad}
            className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-lg text-xs font-medium border border-border bg-card text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-solar" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
            <span>{copied ? 'Spec Copied' : 'Copy Spec Summary'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenProposal}
            disabled={!hasLoad}
            className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Generate Proposal</span>
          </button>

          <button
            type="button"
            onClick={onSaveSnapshot}
            disabled={!hasLoad}
            className="h-9 px-2.5 inline-flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Save current site audit to local storage"
            aria-label="Save site snapshot"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
