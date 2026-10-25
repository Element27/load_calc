import { Appliance, SystemSettings, CalculationResults } from '../types/solar';

export function calculateSolarSystem(
  appliances: Appliance[],
  settings: SystemSettings
): CalculationResults {
  // 1. Running Power & Peak Surge
  let totalRunningWatts = 0;
  let dailyEnergyWh = 0;
  let largestSurgeAdder = 0;
  let largestSurgeAppliance: string | null = null;

  appliances.forEach((item) => {
    if (item.quantity > 0) {
      const itemRunningWatts = item.quantity * item.ratedWatts;
      totalRunningWatts += itemRunningWatts;

      const itemDailyWh = itemRunningWatts * item.hoursPerDay;
      dailyEnergyWh += itemDailyWh;

      const surgeFactor = item.surgeFactor ?? 1.0;
      if (surgeFactor > 1.0) {
        const surgeDelta = item.ratedWatts * (surgeFactor - 1);
        if (surgeDelta > largestSurgeAdder) {
          largestSurgeAdder = surgeDelta;
          largestSurgeAppliance = item.name;
        }
      }
    }
  });

  const peakSurgeWatts = totalRunningWatts > 0 ? totalRunningWatts + largestSurgeAdder : 0;
  const dailyEnergyKWh = dailyEnergyWh / 1000;

  // 2. Inverter Sizing
  // Raw kVA = (W_run * Headroom) / (1000 * PowerFactor)
  const rawInverterKVA = totalRunningWatts > 0
    ? (totalRunningWatts * settings.inverterHeadroom) / (1000 * settings.inverterPowerFactor)
    : 0;

  let recommendedInverterKVA = 0;
  let recommendedDCVoltage = 12;
  let inverterLabel = "0.0 kVA (No Load)";
  let isThreePhase = false;

  if (rawInverterKVA > 0) {
    if (rawInverterKVA <= 1.0) {
      recommendedInverterKVA = 1.2;
      recommendedDCVoltage = 12;
      inverterLabel = "1.2 kVA (12V System)";
    } else if (rawInverterKVA <= 2.0) {
      recommendedInverterKVA = 2.5;
      recommendedDCVoltage = 24;
      inverterLabel = "2.5 kVA (24V System)";
    } else if (rawInverterKVA <= 3.0) {
      recommendedInverterKVA = 3.5;
      recommendedDCVoltage = 24;
      inverterLabel = "3.5 kVA (24V System)";
    } else if (rawInverterKVA <= 4.5) {
      recommendedInverterKVA = 5.0;
      recommendedDCVoltage = 48;
      inverterLabel = "5.0 kVA (48V System)";
    } else if (rawInverterKVA <= 7.0) {
      recommendedInverterKVA = 7.5;
      recommendedDCVoltage = 48;
      inverterLabel = "7.5 kVA (48V System)";
    } else if (rawInverterKVA <= 9.5) {
      recommendedInverterKVA = 10.0;
      recommendedDCVoltage = 48;
      inverterLabel = "10.0 kVA (48V System)";
    } else {
      recommendedInverterKVA = 15.0;
      recommendedDCVoltage = 48;
      inverterLabel = "15.0 kVA 3-Phase (48V / High Voltage System)";
      isThreePhase = true;
    }
  }

  // 3. Battery Bank Sizing (LiFePO4 Standard)
  // Required Battery (kWh) = Daily Energy (Wh) / (1000 * DoD * Efficiency)
  const batteryDivisor = 1000 * settings.batteryDoD * settings.batteryEfficiency;
  const requiredBatteryKWh = dailyEnergyWh > 0 ? dailyEnergyWh / batteryDivisor : 0;

  let moduleKWh = 5.12;
  let moduleVoltage = 48;
  let moduleCapacityAh = 100;

  if (recommendedDCVoltage === 12) {
    moduleKWh = 1.28;
    moduleVoltage = 12;
    moduleCapacityAh = 100;
  } else if (recommendedDCVoltage === 24) {
    moduleKWh = 2.56;
    moduleVoltage = 24;
    moduleCapacityAh = 100;
  } else {
    moduleKWh = 5.12;
    moduleVoltage = 48;
    moduleCapacityAh = 100;
  }

  const batteryModuleCount = requiredBatteryKWh > 0 ? Math.ceil(requiredBatteryKWh / moduleKWh) : 0;
  const actualBatteryKWh = batteryModuleCount * moduleKWh;
  
  const batteryConfigLabel = batteryModuleCount > 0
    ? `${batteryModuleCount}x ${moduleVoltage}V 100Ah LiFePO4 Module${batteryModuleCount > 1 ? 's' : ''}`
    : '0 Modules';

  // 4. Solar PV Array Sizing
  // PV Array Size (kWp) = Daily Energy (Wh) / (PSH * Derate * 1000)
  const pvDivisor = settings.peakSunHours * settings.systemDerate * 1000;
  const rawPVArrayKWp = dailyEnergyWh > 0 ? dailyEnergyWh / pvDivisor : 0;

  const panelCount = rawPVArrayKWp > 0
    ? Math.ceil((rawPVArrayKWp * 1000) / settings.panelWattage)
    : 0;

  const actualPVKWp = (panelCount * settings.panelWattage) / 1000;
  const dailyPVGenerationKWh = actualPVKWp * settings.peakSunHours * settings.systemDerate;

  return {
    totalRunningWatts,
    peakSurgeWatts,
    largestSurgeAdder,
    largestSurgeAppliance,
    dailyEnergyWh,
    dailyEnergyKWh,

    rawInverterKVA,
    recommendedInverterKVA,
    recommendedDCVoltage,
    inverterLabel,
    isThreePhase,

    requiredBatteryKWh,
    moduleKWh,
    moduleVoltage,
    moduleCapacityAh,
    batteryModuleCount,
    batteryConfigLabel,
    actualBatteryKWh,

    rawPVArrayKWp,
    panelCount,
    actualPVKWp,
    dailyPVGenerationKWh,
  };
}
