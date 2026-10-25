export interface Appliance {
  id: string;
  name: string;
  ratedWatts: number;
  defaultHours: number;
  hoursPerDay: number;
  surgeFactor: number;
  quantity: number;
  isCustom?: boolean;
  category?: 'lighting' | 'cooling' | 'refrigeration' | 'electronics' | 'pumps' | 'other';
}

export interface SystemSettings {
  peakSunHours: number;       // default 4.5 hrs
  systemDerate: number;        // default 0.75
  panelWattage: number;        // default 450 W
  batteryDoD: number;          // default 0.85 (85%)
  batteryEfficiency: number;   // default 0.90 (90%)
  inverterHeadroom: number;    // default 1.25 (25% headroom)
  inverterPowerFactor: number; // default 0.8
}

export interface CalculationResults {
  totalRunningWatts: number;
  peakSurgeWatts: number;
  largestSurgeAdder: number;
  largestSurgeAppliance: string | null;
  dailyEnergyWh: number;
  dailyEnergyKWh: number;
  
  // Inverter Sizing
  rawInverterKVA: number;
  recommendedInverterKVA: number;
  recommendedDCVoltage: number; // 12, 24, or 48
  inverterLabel: string;
  isThreePhase: boolean;

  // Battery Bank Sizing
  requiredBatteryKWh: number;
  moduleKWh: number;
  moduleVoltage: number;
  moduleCapacityAh: number;
  batteryModuleCount: number;
  batteryConfigLabel: string;
  actualBatteryKWh: number;

  // Solar Array Sizing
  rawPVArrayKWp: number;
  panelCount: number;
  actualPVKWp: number;
  dailyPVGenerationKWh: number;
}

export interface PresetProfile {
  id: string;
  name: string;
  description: string;
  quantities: Record<string, { qty: number; hours?: number }>;
}

export interface SavedProject {
  id: string;
  clientName: string;
  location?: string;
  notes?: string;
  updatedAt: string;
  appliances: Appliance[];
  settings: SystemSettings;
}
