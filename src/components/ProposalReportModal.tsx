'use client';

import React from 'react';
import {
  X,
  Printer,
  Sun,
  Zap,
  BatteryCharging,
  CheckCircle2,
  FileText,
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
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-white my-8 print:border-none print:shadow-none print:bg-white print:text-black print:my-0">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Solar System Sizing Proposal & Load Audit
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Proposal Document Body */}
        <div className="p-6 sm:p-8 space-y-6 print:p-6 print:text-slate-900 font-sans">
          
          {/* Proposal Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:border-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg">
                <Sun className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white print:text-slate-900">
                  SolarSpec System Proposal
                </h1>
                <p className="text-xs text-slate-400 print:text-slate-600">
                  Equipment sizing based on on-site electrical load audit
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-300 print:text-slate-700 font-mono">
              <div className="flex items-center sm:justify-end gap-1 font-bold text-amber-400 print:text-amber-700 text-sm">
                <User className="w-4 h-4" />
                <span>Client: {clientName || 'Not specified'}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1 mt-1 text-slate-400 print:text-slate-600">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date: {currentDate}</span>
              </div>
            </div>
          </div>

          {/* System Specification Cards Grid */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 print:text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              1. Recommended Equipment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Inverter Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                <div className="flex items-center gap-2 text-amber-400 print:text-amber-700 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  Recommended Inverter
                </div>
                <div className="text-xl font-extrabold text-white print:text-slate-900 mt-1">
                  {results.inverterLabel || 'None'}
                </div>
                <p className="text-xs text-slate-400 print:text-slate-600 mt-1 font-mono">
                  Continuous Raw: {results.rawInverterKVA.toFixed(2)} kVA
                </p>
                <div className="mt-2 pt-2 border-t border-slate-800 print:border-slate-300 text-[11px] text-slate-400 print:text-slate-700 flex justify-between font-mono">
                  <span>Running: {results.totalRunningWatts}W</span>
                  <span>Surge: {results.peakSurgeWatts}W</span>
                </div>
              </div>

              {/* Battery Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 print:text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <BatteryCharging className="w-4 h-4" />
                  Battery Bank (LiFePO4)
                </div>
                <div className="text-lg font-extrabold text-white print:text-slate-900 mt-1">
                  {results.batteryConfigLabel}
                </div>
                <p className="text-xs text-slate-400 print:text-slate-600 mt-1 font-mono">
                  Total Capacity: {results.actualBatteryKWh.toFixed(2)} kWh
                </p>
                <div className="mt-2 pt-2 border-t border-slate-800 print:border-slate-300 text-[11px] text-slate-400 print:text-slate-700 flex justify-between font-mono">
                  <span>Required: {results.requiredBatteryKWh.toFixed(2)} kWh</span>
                  <span>{settings.batteryDoD * 100}% DoD</span>
                </div>
              </div>

              {/* Solar Array Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                <div className="flex items-center gap-2 text-sky-400 print:text-sky-700 text-xs font-bold uppercase tracking-wider">
                  <Sun className="w-4 h-4" />
                  Solar PV Array
                </div>
                <div className="text-lg font-extrabold text-white print:text-slate-900 mt-1">
                  {results.panelCount}x {settings.panelWattage}W Panels
                </div>
                <p className="text-xs text-slate-400 print:text-slate-600 mt-1 font-mono">
                  Total PV Size: {results.actualPVKWp.toFixed(2)} kWp
                </p>
                <div className="mt-2 pt-2 border-t border-slate-800 print:border-slate-300 text-[11px] text-slate-400 print:text-slate-700 flex justify-between font-mono">
                  <span>Est. Gen: {results.dailyPVGenerationKWh.toFixed(2)} kWh/d</span>
                  <span>{settings.peakSunHours} PSH</span>
                </div>
              </div>

            </div>
          </div>

          {/* Load Audit Schedule Table */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 print:text-slate-900 mb-3">
              2. Appliance Load Audit
            </h2>

            <div className="overflow-x-auto rounded-xl border border-slate-800 print:border-slate-300">
              <table className="w-full text-xs text-left text-slate-300 print:text-slate-800">
                <thead className="bg-slate-950/80 text-amber-400 print:bg-slate-100 print:text-slate-900 font-bold border-b border-slate-800 print:border-slate-300">
                  <tr>
                    <th className="px-4 py-2.5">Appliance / Load Item</th>
                    <th className="px-3 py-2.5 text-center">Qty</th>
                    <th className="px-3 py-2.5 text-right">Rated Power</th>
                    <th className="px-3 py-2.5 text-right">Surge Factor</th>
                    <th className="px-3 py-2.5 text-right">Daily Runtime</th>
                    <th className="px-4 py-2.5 text-right">Daily Consumption</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                  {activeAppliances.length > 0 ? (
                    activeAppliances.map((item) => {
                      const itemRunning = item.quantity * item.ratedWatts;
                      const itemDailyWh = itemRunning * item.hoursPerDay;
                      return (
                        <tr key={item.id} className="hover:bg-slate-950/40">
                          <td className="px-4 py-2 font-medium text-white print:text-slate-900">
                            {item.name}
                          </td>
                          <td className="px-3 py-2 text-center font-bold font-mono">
                            {item.quantity}
                          </td>
                          <td className="px-3 py-2 text-right font-mono">
                            {item.ratedWatts} W
                          </td>
                          <td className="px-3 py-2 text-right font-mono text-rose-400 print:text-slate-800">
                            {item.surgeFactor}x
                          </td>
                          <td className="px-3 py-2 text-right font-mono">
                            {item.hoursPerDay} hrs/day
                          </td>
                          <td className="px-4 py-2 text-right font-bold font-mono text-emerald-400 print:text-emerald-800">
                            {(itemDailyWh / 1000).toFixed(2)} kWh
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-500">
                        No active loads selected for this audit
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-slate-950/90 font-bold border-t border-slate-800 print:bg-slate-100 print:border-slate-300">
                  <tr>
                    <td colSpan={2} className="px-4 py-2.5 text-white print:text-slate-900">
                      Audit Totals
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-amber-300 print:text-slate-900">
                      {results.totalRunningWatts.toLocaleString()} W
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-rose-400 print:text-slate-900">
                      Peak: {results.peakSurgeWatts.toLocaleString()} W
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-400">Total Energy:</td>
                    <td className="px-4 py-2.5 text-right font-mono text-emerald-300 print:text-slate-900 text-sm">
                      {results.dailyEnergyKWh.toFixed(2)} kWh/day
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Sizing Math & Engineering Assumptions */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-300 text-xs space-y-2">
            <h3 className="font-bold text-slate-300 print:text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-400" />
              Sizing Formulas & Engineering Assumptions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-400 print:text-slate-700 font-mono">
              <div>• Inverter Headroom: {(settings.inverterHeadroom * 100 - 100).toFixed(0)}%</div>
              <div>• Inverter PF: {settings.inverterPowerFactor}</div>
              <div>• Sun Hours: {settings.peakSunHours} PSH</div>
              <div>• System Derate: {settings.systemDerate * 100}%</div>
              <div>• LiFePO4 DoD: {settings.batteryDoD * 100}%</div>
              <div>• Battery Eff.: {settings.batteryEfficiency * 100}%</div>
              <div>• PV Panel: {settings.panelWattage}W Mono</div>
              <div>• DC Voltage: {results.recommendedDCVoltage}V System</div>
            </div>
          </div>

          {/* Footer signature lines for installer & client */}
          <div className="pt-8 border-t border-slate-800 print:border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-400 print:text-slate-700">
            <div>
              <p className="font-semibold text-slate-300 print:text-slate-900">Solar Installer Signature:</p>
              <div className="h-12 border-b border-dashed border-slate-700 print:border-slate-400 mt-2" />
              <p className="mt-1 text-[10px]">Installer / Technician Signature</p>
            </div>
            <div>
              <p className="font-semibold text-slate-300 print:text-slate-900">Client Approval Signature:</p>
              <div className="h-12 border-b border-dashed border-slate-700 print:border-slate-400 mt-2" />
              <p className="mt-1 text-[10px]">Customer / Property Owner Signature</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
