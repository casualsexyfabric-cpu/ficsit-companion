// ============================================================
// SISTEMA DE COORDENADAS DE SATISFACTORY
// El mundo tiene estos límites aproximados:
// X: -324698 a 425298
// Y: -375000 a 375000
// ============================================================

export const MAP_BOUNDS = {
  minX: -324698,
  maxX: 425298,
  minY: -375000,
  maxY: 375000,
}

export const MAP_IMAGE_SIZE = 4096 // píxeles del mapa base

// Convierte coordenadas del juego a píxeles del mapa
export function gameToPixel(x: number, y: number): { px: number; py: number } {
  const px =
    ((x - MAP_BOUNDS.minX) / (MAP_BOUNDS.maxX - MAP_BOUNDS.minX)) *
    MAP_IMAGE_SIZE
  const py =
    ((y - MAP_BOUNDS.minY) / (MAP_BOUNDS.maxY - MAP_BOUNDS.minY)) *
    MAP_IMAGE_SIZE
  return { px, py }
}

// Convierte coordenadas del juego a latLng para Leaflet
// Leaflet usa [lat, lng] = [y, x] en coordenadas simples
export function gameToLatLng(x: number, y: number): [number, number] {
  const { px, py } = gameToPixel(x, y)
  // En Leaflet CRS.Simple, y está invertido
  return [MAP_IMAGE_SIZE - py, px]
}

export const MAP_CENTER: [number, number] = [MAP_IMAGE_SIZE / 2, MAP_IMAGE_SIZE / 2]

export const LEAFLET_BOUNDS: [[number, number], [number, number]] = [
  [0, 0],
  [MAP_IMAGE_SIZE, MAP_IMAGE_SIZE],
]