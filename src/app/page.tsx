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

import { Zap, ChevronUp, ChevronDown, BatteryCharging, Shield, Cpu } from 'lucide-react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Application State
  const [appliances, setAppliances] = useState<Appliance[]>(SEED_APPLIANCES);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [clientName, setClientName] = useState<string>('');
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  // Active preset tracker
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Modal States
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);

  // Mobile Bottom Sheet state for field technicians
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
    if (window.confirm('Reset all loads, runtimes, and client info to default values?')) {
      setAppliances(SEED_APPLIANCES);
      setSettings(DEFAULT_SETTINGS);
      setClientName('');
      setActivePreset(null);
    }
  };

  // Save Project Snapshot
  const handleSaveSnapshot = () => {
    const name = clientName.trim() || `Site Audit ${new Date().toLocaleDateString()}`;
    const newProject: SavedProject = {
      id: `proj-${Date.now()}`,
      clientName: name,
      updatedAt: new Date().toISOString(),
      appliances,
      settings,
    };
    const updated = saveProject(newProject);
    setSavedProjects(updated);
    alert(`Audit saved: "${name}"`);
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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-solar border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono tracking-wider uppercase text-muted-foreground">
            Initializing load schedule...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-150">
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
        activePreset={activePreset}
      />

      {/* Main Workbench Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-28 lg:pb-12">
        {/* Workbench Context Banner */}
        <section className="mb-6 rounded-xl p-5 border border-border bg-card text-foreground transition-colors shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium border border-solar/20 bg-solar/10 text-solar">
                  Electrical Load Audit
                </span>
                <span className="text-xs text-muted-foreground">
                  {settings.peakSunHours} PSH • {(settings.systemDerate * 100).toFixed(0)}% derate • {settings.panelWattage}W modules
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Appliance Load Schedule & Hardware Sizing
              </h1>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Enter appliance counts and daily run hours. Sizing calculations update automatically, factoring in continuous inverter headroom, inductive compressor surge multipliers, and usable LiFePO4 battery depth-of-discharge.
              </p>
            </div>

            {/* Engineering Guardrail Badges */}
            <div className="flex flex-wrap items-center gap-2 md:justify-end text-xs font-mono">
              <div className="px-3 py-2 rounded-lg border border-border bg-muted/50 text-foreground flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-solar" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase">Continuous Headroom</div>
                  <div className="font-semibold text-foreground">
                    +{(settings.inverterHeadroom * 100 - 100).toFixed(0)}% Safety Margin
                  </div>
                </div>
              </div>

              <div className="px-3 py-2 rounded-lg border border-border bg-muted/50 text-foreground flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-solar" />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase">DC Bus Voltage</div>
                  <div className="font-semibold text-foreground">
                    {calculationResults.recommendedDCVoltage}V System
                  </div>
                </div>
              </div>

              <div className="px-3 py-2 rounded-lg border border-storage/20 bg-storage/10 text-storage flex items-center gap-2">
                <BatteryCharging className="w-3.5 h-3.5 text-storage" />
                <div>
                  <div className="text-[10px] text-storage/80 uppercase font-medium">Storage Boundary</div>
                  <div className="font-semibold text-storage">
                    {(settings.batteryDoD * 100).toFixed(0)}% Max DoD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Asymmetrical 2-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Appliance Load Schedule (7 cols) */}
          <div className="lg:col-span-7">
            <ApplianceList
              appliances={appliances}
              onUpdateQuantity={handleUpdateQuantity}
              onUpdateHours={handleUpdateHours}
              onDeleteCustom={handleDeleteCustomAppliance}
              onOpenAddCustom={() => setIsAddCustomOpen(true)}
              onZeroAll={handleZeroAllQuantities}
              onResetHoursToDefault={handleResetHoursToDefault}
            />
          </div>

          {/* Right Column: Hardware Specification Placard (5 cols, sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <SystemSummaryCard
              results={calculationResults}
              settings={settings}
              appliances={appliances}
              clientName={clientName}
              onOpenProposal={() => setIsProposalOpen(true)}
              onSaveSnapshot={handleSaveSnapshot}
            />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Bar for Field Technicians */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 text-foreground backdrop-blur-md shadow-lg transition-colors">
        <button
          type="button"
          onClick={() => setIsMobileSummaryExpanded(!isMobileSummaryExpanded)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-left cursor-pointer focus:outline-none"
          aria-expanded={isMobileSummaryExpanded}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-primary text-primary-foreground font-bold">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold text-solar font-mono">
                {calculationResults.totalRunningWatts > 0
                  ? calculationResults.inverterLabel
                  : '0 kVA (No active loads)'}
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">
                {calculationResults.totalRunningWatts.toLocaleString()}W Run • {calculationResults.dailyEnergyKWh.toFixed(1)} kWh/day
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-border bg-muted text-muted-foreground">
              {isMobileSummaryExpanded ? 'Hide' : 'Spec'}
            </span>
            {isMobileSummaryExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expandable Mobile Tray */}
        {isMobileSummaryExpanded && (
          <div className="p-4 pt-1 space-y-3 max-h-[70vh] overflow-y-auto border-t border-border">
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 font-mono">
              <div className="p-2 rounded-lg border border-storage/20 bg-storage/10 text-storage">
                <span className="text-[10px] text-storage/80 block">Battery Bank</span>
                <span className="font-semibold text-storage">
                  {calculationResults.batteryModuleCount} modules
                </span>
              </div>
              <div className="p-2 rounded-lg border border-border bg-muted/60 text-foreground">
                <span className="text-[10px] text-muted-foreground block">PV Array</span>
                <span className="font-semibold text-foreground">
                  {calculationResults.panelCount} panels
                </span>
              </div>
              <div className="p-2 rounded-lg border border-border bg-muted/60 text-foreground">
                <span className="text-[10px] text-muted-foreground block">Peak Surge</span>
                <span className="font-semibold text-foreground">
                  {calculationResults.peakSurgeWatts}W
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsProposalOpen(true)}
              className="w-full h-9 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Generate printable proposal
            </button>
          </div>
        )}
      </div>

      {/* Modals & Dialogs */}
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
