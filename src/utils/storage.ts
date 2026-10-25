import { Appliance, SystemSettings, SavedProject } from '../types/solar';
import { SEED_APPLIANCES, DEFAULT_SETTINGS } from '../constants/defaults';

const STORAGE_KEY = 'solar_load_calc_v1';
const PROJECTS_KEY = 'solar_load_calc_projects_v1';

export interface StorageState {
  appliances: Appliance[];
  settings: SystemSettings;
  clientName: string;
}

export function loadSavedState(): StorageState {
  if (typeof window === 'undefined') {
    return {
      appliances: SEED_APPLIANCES,
      settings: DEFAULT_SETTINGS,
      clientName: '',
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        appliances: SEED_APPLIANCES,
        settings: DEFAULT_SETTINGS,
        clientName: '',
      };
    }

    const data = JSON.parse(raw);
    if (Array.isArray(data.appliances) && data.settings) {
      return {
        appliances: data.appliances,
        settings: { ...DEFAULT_SETTINGS, ...data.settings },
        clientName: data.clientName || '',
      };
    }
  } catch (err) {
    console.warn('Failed to load solar_load_calc_v1 from localStorage', err);
  }

  return {
    appliances: SEED_APPLIANCES,
    settings: DEFAULT_SETTINGS,
    clientName: '',
  };
}

export function saveState(state: StorageState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save to localStorage', err);
  }
}

export function loadSavedProjects(): SavedProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveProject(project: SavedProject): SavedProject[] {
  const existing = loadSavedProjects();
  const index = existing.findIndex((p) => p.id === project.id);
  let updated: SavedProject[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = project;
  } else {
    updated = [project, ...existing];
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteSavedProject(id: string): SavedProject[] {
  const existing = loadSavedProjects();
  const updated = existing.filter((p) => p.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
  }
  return updated;
}
