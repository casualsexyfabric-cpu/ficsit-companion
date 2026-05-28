// ============================================================
// TIPOS DE LA API DE SATISFACTORY
// ============================================================

export interface SatisfactoryCircuit {
  id: number
  consumption: number
  capacity: number
  batteryInput: number
  batteryOutput: number
  batteryStored: number
  batteryCapacity: number
  fuseTriggered: boolean
}

export interface SatisfactoryGenerator {
  id: string
  name: string
  className: string
  location: Location3D
  isRunning: boolean
  currentOutput: number
  maxOutput: number
  fuelType: string
  circuitId: number
}

export interface SatisfactoryPowerData {
  circuits: SatisfactoryCircuit[]
  generators: SatisfactoryGenerator[]
}

export interface Location3D {
  x: number
  y: number
  z: number
}

export interface SatisfactoryMachine {
  id: string
  name: string
  className: string
  location: Location3D
  isRunning: boolean
  efficiency: number
  recipe: string | null
  inputItems: ItemStack[]
  outputItems: ItemStack[]
  hasPower: boolean
  hasInput: boolean
  hasOutput: boolean
}

export interface ItemStack {
  itemClass: string
  itemName: string
  amount: number
}

export interface SatisfactoryFactory {
  id: string
  name: string
  location: Location3D
  machines: SatisfactoryMachine[]
  efficiency: number
  status: 'operative' | 'underproducing' | 'stopped'
  primaryProduct: string | null
}

export interface SatisfactoryContainer {
  id: string
  name: string
  location: Location3D
  items: ItemStack[]
  maxCapacity: number
  currentAmount: number
  fillPercentage: number
}

export interface SatisfactoryPlayer {
  id: string
  name: string
  isOnline: boolean
  health: number
  maxHealth: number
  location: Location3D
  inventory: ItemStack[]
}

export interface SatisfactoryTrain {
  id: string
  name: string
  status: 'moving' | 'loading' | 'unloading' | 'stopped' | 'deadlock'
  speed: number
  currentStation: string | null
  nextStation: string | null
  route: string[]
  wagons: TrainWagon[]
}

export interface TrainWagon {
  id: string
  type: string
  cargo: ItemStack[]
}

// ============================================================
// TIPOS DE ALERTAS
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

// ============================================================
// TIPOS DE TAREAS
// ============================================================

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

// ============================================================
// TIPOS DE ESTADO DE CONEXIÓN
// ============================================================

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error'

export interface AppSettings {
  apiUrl: string
  pollingInterval: number
  playerName: string
}