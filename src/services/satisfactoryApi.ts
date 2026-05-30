import type {
  FRMPowerCircuit,
  FRMMachine,
  FRMPlayer,
  FRMTrain,
  FRMContainer,
} from '@/types'

// ============================================================
// CLIENTE BASE
// FRM expone un servidor HTTP simple con GET requests
// Puerto por defecto: 8080
// ============================================================

let baseUrl = ''

export function setApiBaseUrl(url: string) {
  baseUrl = url.endsWith('/') ? url.slice(0, -1) : url
}

export function getApiBaseUrl() {
  return baseUrl
}

async function getRequest<T>(endpoint: string): Promise<T> {
  if (!baseUrl) throw new Error('API URL no configurada')

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

// ============================================================
// ENDPOINTS FRM
// ============================================================

export async function fetchPowerData(): Promise<FRMPowerCircuit[]> {
  return getRequest<FRMPowerCircuit[]>('/getPower')
}

export async function fetchFactories(): Promise<FRMMachine[]> {
  return getRequest<FRMMachine[]>('/getFactory')
}

export async function fetchPlayers(): Promise<FRMPlayer[]> {
  return getRequest<FRMPlayer[]>('/getPlayer')
}

export async function fetchTrains(): Promise<FRMTrain[]> {
  return getRequest<FRMTrain[]>('/getTrains')
}

export async function fetchContainers(): Promise<FRMContainer[]> {
  return getRequest<FRMContainer[]>('/getStorageInv')
}

// ============================================================
// CHECK DE CONEXIÓN
// ============================================================

export async function checkConnection(): Promise<boolean> {
  try {
    await getRequest('/getPower')
    return true
  } catch {
    return false
  }
}