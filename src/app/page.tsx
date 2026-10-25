'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { ApplianceList } from '../components/ApplianceList';
import { SystemSummaryCard } from '../components/SystemSummaryCard';
import { AddCustomModal } from '../components/AddCustomModal';
import { SettingsModal } from '../components/SettingsModal';
import { SavedProjectsModal } from '../components/SavedProjectsModal';
import { ProposalReportModal } from '../components/ProposalReportModal';

import { Appliance, SystemSettings, SavedProject } from '../types/solar';
import { SEED_APPLIANCES, DEFAULT_SETTINGS, PRESET_PROFILES } from '../constants/defaults';
import { calculateSolarSystem } from '../utils/solarMath';
import {
  loadSavedState,
  saveState,
  loadSavedProjects,
  saveProject,
  deleteSavedProject,
} from '../utils/storage';

import { Zap, BatteryCharging, Sun, ChevronUp, ChevronDown, Layers } from 'lucide-react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Application State
  const [appliances, setAppliances] = useState<Appliance[]>(SEED_APPLIANCES);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [clientName, setClientName] = useState<string>('');
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  // Active preset tracker
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Theme Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Modal States
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);

  // Mobile Bottom Sheet state for field installers on small screens
  const [isMobileSummaryExpanded, setIsMobileSummaryExpanded] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    const state = loadSavedState();
    setAppliances(state.appliances);
    setSettings(state.settings);
    setClientName(state.clientName);
    setSavedProjects(loadSavedProjects());
    setIsLoaded(true);
  }, []);

  // Save state on changes
  useEffect(() => {
    if (!isLoaded) return;
    saveState({ appliances, settings, clientName });
  }, [appliances, settings, clientName, isLoaded]);

  // Reactive Memoized Sizing Calculations
  const calculationResults = useMemo(() => {
    return calculateSolarSystem(appliances, settings);
  }, [appliances, settings]);

  // Handlers for Appliance Updates
  const handleUpdateQuantity = (id: string, qty: number) => {
    setAppliances((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleUpdateHours = (id: string, hours: number) => {
    setAppliances((prev) =>
      prev.map((item) => (item.id === id ? { ...item, hoursPerDay: hours } : item))
    );
  };

  const handleAddCustomAppliance = (newAppliance: Omit<Appliance, 'id'>) => {
    const newId = `custom-${Date.now()}`;
    const customItem: Appliance = {
      ...newAppliance,
      id: newId,
      isCustom: true,
    };
    setAppliances((prev) => [...prev, customItem]);
  };

  const handleDeleteCustomAppliance = (id: string) => {
    setAppliances((prev) => prev.filter((item) => item.id !== id));
  };

  // Preset Handler
  const handleApplyPreset = (presetId: string) => {
    const preset = PRESET_PROFILES.find((p) => p.id === presetId);
    if (!preset) return;

    setActivePreset(presetId);
    setAppliances((prev) =>
      prev.map((item) => {
        const presetData = preset.quantities[item.id];
        if (presetData) {
          return {
            ...item,
            quantity: presetData.qty,
            hoursPerDay: presetData.hours ?? item.defaultHours,
          };
        }
        return { ...item, quantity: 0 };
      })
    );
  };

  // Reset Actions
  const handleZeroAllQuantities = () => {
    setAppliances((prev) => prev.map((item) => ({ ...item, quantity: 0 })));
    setActivePreset(null);
  };

  const handleResetHoursToDefault = () => {
    setAppliances((prev) =>
      prev.map((item) => ({ ...item, hoursPerDay: item.defaultHours }))
    );
  };

  const handleResetAllToDefaults = () => {
    if (window.confirm('Reset all loads, settings, and client entries to factory defaults?')) {
      setAppliances(SEED_APPLIANCES);
      setSettings(DEFAULT_SETTINGS);
      setClientName('');
      setActivePreset(null);
    }
  };

  // Save Project Snapshot
  const handleSaveSnapshot = () => {
    const name = clientName.trim() || `Client Project ${new Date().toLocaleTimeString()}`;
    const newProject: SavedProject = {
      id: `proj-${Date.now()}`,
      clientName: name,
      updatedAt: new Date().toISOString(),
      appliances,
      settings,
    };
    const updated = saveProject(newProject);
    setSavedProjects(updated);
    alert(`Snapshot saved successfully for "${name}"!`);
  };

  const handleLoadProject = (project: SavedProject) => {
    setAppliances(project.appliances);
    setSettings(project.settings);
    setClientName(project.clientName);
  };

  const handleDeleteProject = (id: string) => {
    const updated = deleteSavedProject(id);
    setSavedProjects(updated);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Loading sizing calculator...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Header Bar */}
      <Header
        clientName={clientName}
        setClientName={setClientName}
        onResetAll={handleResetAllToDefaults}
        onOpenAddCustom={() => setIsAddCustomOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProjects={() => setIsProjectsOpen(true)}
        onOpenProposal={() => setIsProposalOpen(true)}
        onApplyPreset={handleApplyPreset}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activePreset={activePreset}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-12">
        {/* Landing Section: Real Workflows & Concrete Actions */}
        <section
          className={`mb-8 rounded-2xl p-6 sm:p-7 border transition-all shadow-xl ${
            isDarkMode
              ? 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-slate-800'
              : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}
        >
          <div className="max-w-3xl">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${
                isDarkMode
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              Field-tested solar sizing
            </span>
            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Size inverters, batteries, and solar panels from actual appliance loads.
            </h1>
            <p
              className={`mt-2.5 text-sm sm:text-base leading-relaxed ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Stop estimating solar capacity on the back of an envelope. Tally what the customer
              runs, factor in compressor surge spikes, and get hardware numbers you can quote with
              confidence before leaving the property.
            </p>
          </div>

          {/* Three Concrete Workflows (No abstract AI feature bullets) */}
          <div
            className={`mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t ${
              isDarkMode ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <div
              className={`p-4 rounded-xl border ${
                isDarkMode
                  ? 'bg-slate-950/60 border-slate-800/80'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
                  1
                </span>
                <h2
                  className={`text-sm font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Audit room-by-room loads
                </h2>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Pick standard items or enter the nameplate wattage stamped on the appliance. Adjust
                daily run hours so heavy daytime loads don&apos;t drain the battery overnight.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isDarkMode
                  ? 'bg-slate-950/60 border-slate-800/80'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
                  2
                </span>
                <h2
                  className={`text-sm font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Factor in motor surges & storage limits
                </h2>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                The math includes 25% continuous inverter headroom, up to 4x compressor startup
                spikes for ACs and pumps, and caps LiFePO4 discharge at 85% to protect the cells.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isDarkMode
                  ? 'bg-slate-950/60 border-slate-800/80'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-bold text-xs">
                  3
                </span>
                <h2
                  className={`text-sm font-bold ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Share an on-site proposal
                </h2>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Copy a clean itemized breakdown directly into WhatsApp, save a site snapshot to your
                browser, or generate a 1-page printable PDF proposal for client sign-off.
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Load Audit List (7 cols on desktop) */}
          <div className="lg:col-span-7">
            <ApplianceList
              appliances={appliances}
              onUpdateQuantity={handleUpdateQuantity}
              onUpdateHours={handleUpdateHours}
              onDeleteCustom={handleDeleteCustomAppliance}
              onOpenAddCustom={() => setIsAddCustomOpen(true)}
              onZeroAll={handleZeroAllQuantities}
              onResetHoursToDefault={handleResetHoursToDefault}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Right Column: System Specification Card (5 cols on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <SystemSummaryCard
              results={calculationResults}
              settings={settings}
              appliances={appliances}
              clientName={clientName}
              onOpenProposal={() => setIsProposalOpen(true)}
              onSaveSnapshot={handleSaveSnapshot}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar for Mobile Devices */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-amber-500/30 backdrop-blur-lg text-white shadow-2xl">
        <div
          onClick={() => setIsMobileSummaryExpanded(!isMobileSummaryExpanded)}
          className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500 text-slate-950 font-bold">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400">
                {calculationResults.totalRunningWatts > 0
                  ? calculationResults.inverterLabel
                  : '0 kVA (No active loads)'}
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                {calculationResults.totalRunningWatts.toLocaleString()}W Run | {calculationResults.dailyEnergyKWh.toFixed(1)} kWh/d
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {isMobileSummaryExpanded ? 'Collapse' : 'Details'}
            </span>
            {isMobileSummaryExpanded ? (
              <ChevronDown className="w-5 h-5 text-amber-400" />
            ) : (
              <ChevronUp className="w-5 h-5 text-amber-400" />
            )}
          </div>
        </div>

        {/* Expandable Mobile Tray */}
        {isMobileSummaryExpanded && (
          <div className="p-4 pt-0 space-y-3 max-h-[70vh] overflow-y-auto border-t border-slate-800">
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[9px] text-slate-400 block">Battery</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {calculationResults.batteryModuleCount} Units
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[9px] text-slate-400 block">PV Array</span>
                <span className="font-bold text-sky-400 font-mono">
                  {calculationResults.panelCount}x 450W
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[9px] text-slate-400 block">Peak Surge</span>
                <span className="font-bold text-rose-400 font-mono">
                  {calculationResults.peakSurgeWatts}W
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsProposalOpen(true)}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
            >
              View site proposal & PDF summary
            </button>
          </div>
        )}
      </div>

      {/* Modals & Drawers */}
      <AddCustomModal
        isOpen={isAddCustomOpen}
        onClose={() => setIsAddCustomOpen(false)}
        onAddAppliance={handleAddCustomAppliance}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />

      <SavedProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        projects={savedProjects}
        onLoadProject={handleLoadProject}
        onDeleteProject={handleDeleteProject}
        onSaveCurrentAsNew={handleSaveSnapshot}
      />

      <ProposalReportModal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        results={calculationResults}
        settings={settings}
        appliances={appliances}
        clientName={clientName}
      />
    </div>
  );
}
