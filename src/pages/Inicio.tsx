import { Zap } from 'lucide-react'

export function Inicio() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
      <Zap size={48} className="text-accent" />
      <h1 className="font-rajdhani text-4xl font-bold text-gray-100">
        FICSIT Companion
      </h1>
      <p className="font-exo text-gray-400 max-w-md">
        Segunda pantalla para Satisfactory. Configura la URL del túnel en ajustes para comenzar.
      </p>
    </div>
  )
}