import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Alert,
  AlertConfig,
  AppSettings,
  ConnectionStatus,
} from '@/types'

// ============================================================
// STORE DE CONFIGURACIÓN Y CONEXIÓN
// ============================================================

interface AppStore {
  // Configuración
  settings: AppSettings
  setSettings: (settings: Partial<AppSettings>) => void

  // Estado de conexión a la API
  connectionStatus: ConnectionStatus
  setConnectionStatus: (status: ConnectionStatus) => void

  // Alertas
  alerts: Alert[]
  addAlert: (alert: Alert) => void
  dismissAlert: (id: string) => void
  clearAlerts: () => void

  // Configuración de alertas
  alertConfig: AlertConfig
  setAlertConfig: (config: Partial<AlertConfig>) => void
}

const defaultAlertConfig: AlertConfig = {
  factory_stopped: true,
  factory_underproducing: true,
  factory_underproducing_threshold: 70,
  circuit_critical: true,
  circuit_critical_threshold: 90,
  container_full: true,
  container_full_threshold: 90,
  train_deadlock: true,
  milestone_ready: true,
}

const defaultSettings: AppSettings = {
  apiUrl: '',
  pollingInterval: 5000,
  playerName: 'Jugador',
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Configuración
      settings: defaultSettings,
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Conexión
      connectionStatus: 'disconnected',
      setConnectionStatus: (status) => set({ connectionStatus: status }),

      // Alertas
      alerts: [],
      addAlert: (alert) =>
        set((state) => ({
          alerts: state.alerts.some((a) => a.id === alert.id)
            ? state.alerts
            : [alert, ...state.alerts],
        })),
      dismissAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== id),
        })),
      clearAlerts: () => set({ alerts: [] }),

      // Configuración de alertas
      alertConfig: defaultAlertConfig,
      setAlertConfig: (config) =>
        set((state) => ({
          alertConfig: { ...state.alertConfig, ...config },
        })),
    }),
    {
      name: 'ficsit-companion-storage',
      partialize: (state) => ({
        settings: state.settings,
        alertConfig: state.alertConfig,
      }),
    }
  )
)