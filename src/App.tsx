import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainLayout } from '@/components/layout'
import { Inicio } from '@/pages/Inicio'
import { Electricidad } from '@/pages/Electricidad'
import { Fabricas } from '@/pages/Fabricas'
import { Contenedores } from '@/pages/Contenedores'
import { Jugadores } from '@/pages/Jugadores'
import { Mapa } from '@/pages/Mapa'
import { Trenes } from '@/pages/Trenes'
import { Alertas } from '@/pages/Alertas'
import { Tareas } from '@/pages/Tareas'
import { Investigacion } from '@/pages/Investigacion'
import { Historial } from '@/pages/Historial'
import { Calculadora } from '@/pages/Calculadora'
import { Configuracion } from '@/pages/Configuracion'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Inicio />} />
            <Route path="electricidad" element={<Electricidad />} />
            <Route path="fabricas" element={<Fabricas />} />
            <Route path="contenedores" element={<Contenedores />} />
            <Route path="jugadores" element={<Jugadores />} />
            <Route path="mapa" element={<Mapa />} />
            <Route path="trenes" element={<Trenes />} />
            <Route path="alertas" element={<Alertas />} />
            <Route path="tareas" element={<Tareas />} />
            <Route path="investigacion" element={<Investigacion />} />
            <Route path="historial" element={<Historial />} />
            <Route path="calculadora" element={<Calculadora />} />
            <Route path="configuracion" element={<Configuracion />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}