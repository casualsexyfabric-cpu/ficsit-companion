import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  fetchPowerData,
  fetchFactories,
  fetchPlayers,
  fetchTrains,
  fetchContainers,
  setApiBaseUrl,
} from '@/services/satisfactoryApi'
import { useAppStore } from '@/store'

// ============================================================
// HOOK BASE
// ============================================================

export function useSatisfactoryAPI() {
  const settings = useAppStore((s) => s.settings)

  useEffect(() => {
    setApiBaseUrl(settings.apiUrl)
  }, [settings.apiUrl])

  const isEnabled = Boolean(settings.apiUrl)

  return { isEnabled, pollingInterval: settings.pollingInterval }
}

// ============================================================
// HOOKS POR RECURSO
// ============================================================

export function usePowerData() {
  const { isEnabled, pollingInterval } = useSatisfactoryAPI()
  const setConnectionStatus = useAppStore((s) => s.setConnectionStatus)

  return useQuery({
    queryKey: ['power'],
    queryFn: async () => {
      try {
        const data = await fetchPowerData()
        setConnectionStatus('connected')
        return data
      } catch (error) {
        setConnectionStatus('error')
        throw error
      }
    },
    enabled: isEnabled,
    refetchInterval: pollingInterval,
    retry: 2,
    staleTime: 0,
  })
}

export function useFactories() {
  const { isEnabled, pollingInterval } = useSatisfactoryAPI()

  return useQuery({
    queryKey: ['factories'],
    queryFn: fetchFactories,
    enabled: isEnabled,
    refetchInterval: pollingInterval,
    retry: 2,
    staleTime: 0,
  })
}

export function usePlayers() {
  const { isEnabled, pollingInterval } = useSatisfactoryAPI()

  return useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
    enabled: isEnabled,
    refetchInterval: pollingInterval,
    retry: 2,
    staleTime: 0,
  })
}

export function useTrains() {
  const { isEnabled, pollingInterval } = useSatisfactoryAPI()

  return useQuery({
    queryKey: ['trains'],
    queryFn: fetchTrains,
    enabled: isEnabled,
    refetchInterval: pollingInterval,
    retry: 2,
    staleTime: 0,
  })
}

export function useContainers() {
  const { isEnabled, pollingInterval } = useSatisfactoryAPI()

  return useQuery({
    queryKey: ['containers'],
    queryFn: fetchContainers,
    enabled: isEnabled,
    refetchInterval: pollingInterval,
    retry: 2,
    staleTime: 0,
  })
}