'use client';

import React from 'react';
import {
  X,
  Printer,
  Sun,
  Zap,
  BatteryCharging,
  ShieldCheck,
  Calendar,
  User,
  Info,
} from 'lucide-react';
import { CalculationResults, SystemSettings, Appliance } from '../types/solar';

interface ProposalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: CalculationResults;
  settings: SystemSettings;
  appliances: Appliance[];
  clientName: string;
}

export const ProposalReportModal: React.FC<ProposalReportModalProps> = ({
  isOpen,
  onClose,
  results,
  settings,
  appliances,
  clientName,
}) => {
  if (!isOpen) return null;

  const activeAppliances = appliances.filter((a) => a.quantity > 0);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden text-foreground my-6 print:border-none print:shadow-none print:bg-white print:text-slate-900 print:my-0">
        {/* Top Action Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-solar">
              SolarSpec
            </span>
            <span className="text-border">•</span>
            <h3 className="text-sm font-semibold text-foreground">
              System Sizing Proposal & Load Schedule
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="h-8 inline-flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 stroke-[2.25]" />
              <span>Print / Export PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
              aria-label="Close proposal modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-6 sm:p-8 space-y-6 print:p-6 print:text-slate-900 font-sans">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-border print:border-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center text-solar font-bold text-lg print:border-slate-400 print:bg-slate-100">
                <Sun className="w-5 h-5 stroke-[2.25]" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-foreground print:text-slate-900">
                  Solar Equipment Proposal & Electrical Load Audit
                </h1>
                <p className="text-xs text-muted-foreground print:text-slate-600">
                  Engineering calculation based on on-site electrical survey.
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-muted-foreground print:text-slate-700 font-mono space-y-0.5">
              <div className="flex items-center sm:justify-end gap-1.5 font-semibold text-foreground print:text-slate-900">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Client / Site: {clientName || 'Not specified'}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5 text-muted-foreground print:text-slate-600 text-[11px]">
                <Calendar className="w-3 h-3" />
                <span>Date: {currentDate}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Recommended Hardware Specifications */}
          <div>
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-solar print:text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              1. Recommended Hardware Sizing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Inverter */}
              <div className="p-3.5 rounded-lg bg-muted/40 border border-border print:bg-slate-50 print:border-slate-300">
                <div className="flex items-center gap-1.5 text-muted-foreground print:text-slate-700 text-[11px] font-mono font-medium uppercase">
                  <Zap className="w-3.5 h-3.5 text-solar" />
                  Inverter Unit
                </div>
                <div className="text-base font-bold text-foreground print:text-slate-900 mt-1">
                  {results.inverterLabel || 'None'}
                </div>
                <p className="text-[11px] text-muted-foreground print:text-slate-600 mt-0.5 font-mono">
                  Raw requirement: {results.rawInverterKVA.toFixed(2)} kVA
                </p>
                <div className="mt-2 pt-2 border-t border-border print:border-slate-300 text-[10px] text-muted-foreground print:text-slate-700 flex justify-between font-mono">
                  <span>Continuous: {results.totalRunningWatts}W</span>
                  <span>Peak Surge: {results.peakSurgeWatts}W</span>
                </div>
              </div>

              {/* Battery */}
              <div className="p-3.5 rounded-lg bg-storage/5 border border-storage/25 print:bg-slate-50 print:border-slate-300">
                <div className="flex items-center gap-1.5 text-storage/90 print:text-slate-700 text-[11px] font-mono font-medium uppercase">
                  <BatteryCharging className="w-3.5 h-3.5 text-storage" />
                  LiFePO4 Storage
                </div>
                <div className="text-base font-bold text-foreground print:text-slate-900 mt-1">
                  {results.batteryConfigLabel}
                </div>
                <p className="text-[11px] text-muted-foreground print:text-slate-600 mt-0.5 font-mono">
                  Bank capacity: {results.actualBatteryKWh.toFixed(2)} kWh
                </p>
                <div className="mt-2 pt-2 border-t border-border print:border-slate-300 text-[10px] text-muted-foreground print:text-slate-700 flex justify-between font-mono">
                  <span>Usable: {results.requiredBatteryKWh.toFixed(2)} kWh</span>
                  <span>{(settings.batteryDoD * 100).toFixed(0)}% Max DoD</span>
                </div>
              </div>

              {/* Solar Array */}
              <div className="p-3.5 rounded-lg bg-muted/40 border border-border print:bg-slate-50 print:border-slate-300">
                <div className="flex items-center gap-1.5 text-muted-foreground print:text-slate-700 text-[11px] font-mono font-medium uppercase">
                  <Sun className="w-3.5 h-3.5 text-solar" />
                  Photovoltaic Array
                </div>
                <div className="text-base font-bold text-foreground print:text-slate-900 mt-1">
                  {results.panelCount}x {settings.panelWattage}W Modules
                </div>
                <p className="text-[11px] text-muted-foreground print:text-slate-600 mt-0.5 font-mono">
                  Array power: {results.actualPVKWp.toFixed(2)} kWp
                </p>
                <div className="mt-2 pt-2 border-t border-border print:border-slate-300 text-[10px] text-muted-foreground print:text-slate-700 flex justify-between font-mono">
                  <span>Yield: {results.dailyPVGenerationKWh.toFixed(2)} kWh/d</span>
                  <span>{settings.peakSunHours} PSH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Appliance Electrical Schedule Table */}
          <div>
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-solar print:text-slate-900 mb-3">
              2. Appliance Load Schedule
            </h2>

            <div className="overflow-x-auto rounded-lg border border-border print:border-slate-300">
              <table className="w-full text-xs text-left text-foreground print:text-slate-800">
                <thead className="bg-muted text-muted-foreground print:bg-slate-100 print:text-slate-900 font-mono text-[11px] border-b border-border print:border-slate-300">
                  <tr>
                    <th className="px-3.5 py-2 font-semibold">Load Item</th>
                    <th className="px-2.5 py-2 text-center font-semibold">Qty</th>
                    <th className="px-2.5 py-2 text-right font-semibold">Rated Power</th>
                    <th className="px-2.5 py-2 text-right font-semibold">Surge Factor</th>
                    <th className="px-2.5 py-2 text-right font-semibold">Daily Hours</th>
                    <th className="px-3.5 py-2 text-right font-semibold">Daily Energy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border print:divide-slate-200 font-mono">
                  {activeAppliances.length > 0 ? (
                    activeAppliances.map((item) => {
                      const itemRunning = item.quantity * item.ratedWatts;
                      const itemDailyWh = itemRunning * item.hoursPerDay;
                      return (
                        <tr key={item.id} className="hover:bg-muted/30">
                          <td className="px-3.5 py-2 font-sans font-medium text-foreground print:text-slate-900">
                            {item.name}
                          </td>
                          <td className="px-2.5 py-2 text-center font-bold">
                            {item.quantity}
                          </td>
                          <td className="px-2.5 py-2 text-right">
                            {item.ratedWatts} W
                          </td>
                          <td className="px-2.5 py-2 text-right text-muted-foreground print:text-slate-700">
                            {item.surgeFactor}x
                          </td>
                          <td className="px-2.5 py-2 text-right">
                            {item.hoursPerDay} hrs/d
                          </td>
                          <td className="px-3.5 py-2 text-right font-semibold text-foreground print:text-slate-900">
                            {(itemDailyWh / 1000).toFixed(2)} kWh
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-muted-foreground font-sans">
                        No active appliances audited for this site.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-muted font-mono text-xs font-bold border-t border-border print:bg-slate-100 print:border-slate-300">
                  <tr>
                    <td colSpan={2} className="px-3.5 py-2.5 font-sans text-foreground print:text-slate-900">
                      Audit Totals
                    </td>
                    <td className="px-2.5 py-2.5 text-right text-foreground print:text-slate-900">
                      {results.totalRunningWatts.toLocaleString()} W
                    </td>
                    <td className="px-2.5 py-2.5 text-right text-muted-foreground print:text-slate-700">
                      Peak: {results.peakSurgeWatts.toLocaleString()} W
                    </td>
                    <td className="px-2.5 py-2.5 text-right text-muted-foreground">Total Consumption:</td>
                    <td className="px-3.5 py-2.5 text-right text-solar print:text-slate-900">
                      {results.dailyEnergyKWh.toFixed(2)} kWh/day
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Section 3: Engineering Assumptions */}
          <div className="p-3.5 rounded-lg bg-muted/40 border border-border print:bg-slate-50 print:border-slate-300 text-xs space-y-2">
            <h3 className="font-semibold text-foreground print:text-slate-900 flex items-center gap-1.5 text-[11px] font-mono uppercase">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              3. Sizing Constants & Engineering Assumptions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-muted-foreground print:text-slate-700 font-mono text-[11px]">
              <div>• Continuous Headroom: +{(settings.inverterHeadroom * 100 - 100).toFixed(0)}%</div>
              <div>• Inverter Power Factor: {settings.inverterPowerFactor}</div>
              <div>• Peak Sun Hours: {settings.peakSunHours} PSH</div>
              <div>• System Derate: {(settings.systemDerate * 100).toFixed(0)}%</div>
              <div>• LiFePO4 Max DoD: {(settings.batteryDoD * 100).toFixed(0)}%</div>
              <div>• Battery Roundtrip Eff.: {(settings.batteryEfficiency * 100).toFixed(0)}%</div>
              <div>• Module Power: {settings.panelWattage}W Mono</div>
              <div>• Nominal Bus: {results.recommendedDCVoltage}V System</div>
            </div>
          </div>

          {/* Section 4: Sign-Off Lines */}
          <div className="pt-6 border-t border-border print:border-slate-300 grid grid-cols-2 gap-8 text-xs text-muted-foreground print:text-slate-700">
            <div>
              <p className="font-semibold text-foreground print:text-slate-900">Technician Signature:</p>
              <div className="h-10 border-b border-dashed border-border print:border-slate-400 mt-2" />
              <p className="mt-1 text-[10px] text-muted-foreground">Authorized Solar Sizing Technician</p>
            </div>
            <div>
              <p className="font-semibold text-foreground print:text-slate-900">Client Approval Signature:</p>
              <div className="h-10 border-b border-dashed border-border print:border-slate-400 mt-2" />
              <p className="mt-1 text-[10px] text-muted-foreground">Property Owner / Project Sponsor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
