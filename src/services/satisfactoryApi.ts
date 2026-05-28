import type {
  SatisfactoryPowerData,
  SatisfactoryFactory,
  SatisfactoryContainer,
  SatisfactoryPlayer,
  SatisfactoryTrain,
} from '@/types'

// ============================================================
// CLIENTE BASE
// ============================================================

let baseUrl = ''

export function setApiBaseUrl(url: string) {
  baseUrl = url.endsWith('/') ? url.slice(0, -1) : url
}

export function getApiBaseUrl() {
  return baseUrl
}

async function apiRequest<T>(endpoint: string): Promise<T> {
  if (!baseUrl) throw new Error('API URL no configurada')

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  return data as T
}

// ============================================================
// ENDPOINTS
// ============================================================

export async function fetchPowerData(): Promise<SatisfactoryPowerData> {
  return apiRequest<SatisfactoryPowerData>('/api/v1/power')
}

export async function fetchFactories(): Promise<SatisfactoryFactory[]> {
  return apiRequest<SatisfactoryFactory[]>('/api/v1/factories')
}

export async function fetchContainers(): Promise<SatisfactoryContainer[]> {
  return apiRequest<SatisfactoryContainer[]>('/api/v1/containers')
}

export async function fetchPlayers(): Promise<SatisfactoryPlayer[]> {
  return apiRequest<SatisfactoryPlayer[]>('/api/v1/players')
}

export async function fetchTrains(): Promise<SatisfactoryTrain[]> {
  return apiRequest<SatisfactoryTrain[]>('/api/v1/trains')
}

// ============================================================
// CHECK DE CONEXIÓN
// ============================================================

export async function checkConnection(): Promise<boolean> {
  try {
    await apiRequest('/api/v1/health')
    return true
  } catch {
    return false
  }
}