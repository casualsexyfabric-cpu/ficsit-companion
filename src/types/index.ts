// ============================================================
// TIPOS DE LA API — FicsitRemoteMonitoring (FRM)
// Endpoints: GET http://host:8080/getPower, /getFactory, etc.
// ============================================================

// --- ELECTRICIDAD ---

export interface FRMPowerCircuit {
  CircuitGroupID: number
  PowerProduction: number
  PowerConsumed: number
  PowerCapacity: number
  PowerMaxConsumed: number
  BatteryInput: number
  BatteryOutput: number
  BatteryDifferential: number
  BatteryPercent: number
  BatteryCapacity: number
  BatteryTimeEmpty: string
  BatteryTimeFull: string
  AssociatedCircuits?: number[]
  FuseTriggered: boolean
}

// --- FÁBRICAS (máquinas individuales) ---

export interface FRMProductionItem {
  Name: string
  ClassName: string
  Amount: number
  CurrentProd: number
  MaxProd: number
  ProdPercent: number
}

export interface FRMIngredient {
  Name: string
  ClassName: string
  Amount: number
  CurrentConsumed: number
  MaxConsumed: number
  ConsPercent: number
}

export interface FRMPowerInfo {
  CircuitGroupID: number
  CircuitID: number
  PowerConsumed: number
  MaxPowerConsumed: number
}

export interface FRMLocation {
  x: number
  y: number
  z: number
  rotation?: number
}

export interface FRMMachine {
  ID: string
  Name: string
  ClassName: string
  location: FRMLocation
  Recipe: string
  RecipeClassName: string
  production: FRMProductionItem[]
  ingredients: FRMIngredient[]
  Productivity: number
  ManuSpeed: number
  IsConfigured: boolean
  IsProducing: boolean
  IsPaused: boolean
  PowerInfo: FRMPowerInfo
}

// --- JUGADORES ---

export interface FRMInventoryItem {
  Name: string
  ClassName: string
  Amount: number
}

export interface FRMPlayer {
  ID: string
  Name: string
  ClassName: string
  location: FRMLocation
  Online: boolean
  PlayerHP: number
  Inventory?: FRMInventoryItem[]
}

// --- TRENES ---

export interface FRMTrainStop {
  StationName: string
  ClassName: string
}

export interface FRMTrainWagon {
  Name: string
  ClassName: string
  TotalInventory?: FRMInventoryItem[]
}

export interface FRMTrain {
  TrainName: string
  PowerInfo: FRMPowerInfo
  TrainStation: string
  Derailed: boolean
  Status: string
  TimeTable?: FRMTrainStop[]
  Wagons?: FRMTrainWagon[]
  location: FRMLocation
}

// --- CONTENEDORES ---

export interface FRMContainer {
  ID: string
  Name: string
  ClassName: string
  location: FRMLocation
  Inventory: FRMInventoryItem[]
}

// ============================================================
// TIPOS INTERNOS DE LA APP (no vienen de la API)
// ============================================================

export type AlertType =
  | 'factory_stopped'
  | 'factory_underproducing'
  | 'circuit_critical'
  | 'container_full'
  | 'train_deadlock'
  | 'milestone_ready'

export interface Alert {
  id: string
  type: AlertType
  title: string
  description: string
  affectedElement: string
  detectedAt: Date
  isActive: boolean
}

export interface AlertConfig {
  factory_stopped: boolean
  factory_underproducing: boolean
  factory_underproducing_threshold: number
  circuit_critical: boolean
  circuit_critical_threshold: number
  container_full: boolean
  container_full_threshold: number
  train_deadlock: boolean
  milestone_ready: boolean
}

export type TaskStatus = 'pending' | 'inprogress' | 'completed'
export type TaskHorizon = 'short' | 'medium' | 'long'
export type TaskAssignee = 'player1' | 'player2' | 'both'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  horizon: TaskHorizon
  assignee: TaskAssignee
  createdAt: Date
  updatedAt: Date
  isSessionGoal: boolean
  completedInSession: boolean
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

export interface AppSettings {
  apiUrl: string
  pollingInterval: number
  playerName: string
}