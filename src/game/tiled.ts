import type Phaser from 'phaser'

type TiledObject = Phaser.Types.Tilemaps.TiledObject

/**
 * Properti custom object Tiled. Phaser menyimpan `properties` mentah dari JSON
 * (array `{name, type, value}`), tetapi beberapa versi Tiled/Phaser memakai bentuk objek.
 */
export function tiledProps(obj: TiledObject): Record<string, unknown> {
  const raw: unknown = obj.properties
  if (Array.isArray(raw)) {
    const out: Record<string, unknown> = {}
    for (const p of raw as { name: string; value: unknown }[]) out[p.name] = p.value
    return out
  }
  return raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
}

export function tiledString(obj: TiledObject, name: string): string | undefined {
  const value = tiledProps(obj)[name]
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

/** Tipe objek: property custom `type` > field `type` > field `class` (Tiled 1.9+). */
export function tiledType(obj: TiledObject): string {
  const withClass = obj as TiledObject & { class?: string }
  return tiledString(obj, 'type') ?? (obj.type || withClass.class || '')
}

export interface TiledRect {
  x: number
  y: number
  width: number
  height: number
  centerX: number
  centerY: number
}

export function tiledRect(obj: TiledObject): TiledRect {
  const x = obj.x ?? 0
  const y = obj.y ?? 0
  const width = obj.width ?? 0
  const height = obj.height ?? 0
  return { x, y, width, height, centerX: x + width / 2, centerY: y + height / 2 }
}

export function objectsOf(map: Phaser.Tilemaps.Tilemap, layerName: string): TiledObject[] {
  return map.getObjectLayer(layerName)?.objects ?? []
}
