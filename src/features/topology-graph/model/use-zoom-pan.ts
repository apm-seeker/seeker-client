import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export interface ZoomState {
  x: number
  y: number
  k: number
}

interface Size {
  width: number
  height: number
}

const PAN_THRESHOLD = 4

export interface UseZoomPanOptions {
  minScale?: number
  maxScale?: number
  fitMargin?: number
  initialMaxScale?: number
}

export interface UseZoomPanResult {
  state: ZoomState
  bind: {
    ref: React.RefObject<SVGSVGElement>
    onPointerDown: (e: React.PointerEvent) => void
    onPointerMove: (e: React.PointerEvent) => void
    onPointerUp: (e: React.PointerEvent) => void
  }
  navigateTo: (worldX: number, worldY: number) => void
  zoomBy: (factor: number) => void
  reset: () => void
  consumeRecentDrag: () => boolean
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function defaultView(container: Size, world: Size, margin: number, initialMaxScale: number): ZoomState {
  if (world.width <= 0 || world.height <= 0 || container.width <= 0 || container.height <= 0) {
    return { x: 0, y: 0, k: 1 }
  }
  const sx = (container.width - margin * 2) / world.width
  const sy = (container.height - margin * 2) / world.height
  const k = Math.min(Math.min(sx, sy), initialMaxScale)
  return {
    x: (container.width - world.width * k) / 2,
    y: (container.height - world.height * k) / 2,
    k,
  }
}

export function useZoomPan(
  container: Size,
  world: Size,
  options: UseZoomPanOptions = {},
): UseZoomPanResult {
  const minScale = options.minScale ?? 0.25
  const maxScale = options.maxScale ?? 4
  const fitMargin = options.fitMargin ?? 80
  const initialMaxScale = options.initialMaxScale ?? 1
  const { width: containerW, height: containerH } = container
  const { width: worldW, height: worldH } = world

  const [state, setStateRaw] = useState<ZoomState>(() =>
    defaultView(container, world, fitMargin, initialMaxScale),
  )
  const stateRef = useRef(state)
  const setState = useCallback((next: ZoomState) => {
    stateRef.current = next
    setStateRaw(next)
  }, [])

  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{
    startClientX: number
    startClientY: number
    startState: ZoomState
    moved: boolean
  } | null>(null)
  const recentDragRef = useRef(false)

  // Wheel zoom — registered manually so we can use { passive: false }
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      const current = stateRef.current
      const rect = el.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const factor = Math.exp(-e.deltaY / 250)
      const newK = clamp(current.k * factor, minScale, maxScale)
      const ratio = newK / current.k
      setState({
        x: mx - (mx - current.x) * ratio,
        y: my - (my - current.y) * ratio,
        k: newK,
      })
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [minScale, maxScale, setState])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    dragRef.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startState: stateRef.current,
      moved: false,
    }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current
      if (!drag) return
      const dx = e.clientX - drag.startClientX
      const dy = e.clientY - drag.startClientY
      if (!drag.moved && Math.hypot(dx, dy) < PAN_THRESHOLD) return
      drag.moved = true
      setState({
        x: drag.startState.x + dx,
        y: drag.startState.y + dy,
        k: drag.startState.k,
      })
    },
    [setState],
  )

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current
    dragRef.current = null
    const target = e.currentTarget as Element
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId)
    }
    if (drag?.moved) {
      // Suppress the click that browsers fire after a drag-release.
      recentDragRef.current = true
      window.setTimeout(() => {
        recentDragRef.current = false
      }, 0)
    }
  }, [])

  const navigateTo = useCallback(
    (worldX: number, worldY: number) => {
      const current = stateRef.current
      setState({
        x: containerW / 2 - worldX * current.k,
        y: containerH / 2 - worldY * current.k,
        k: current.k,
      })
    },
    [containerW, containerH, setState],
  )

  const zoomBy = useCallback(
    (factor: number) => {
      const current = stateRef.current
      const newK = clamp(current.k * factor, minScale, maxScale)
      const ratio = newK / current.k
      const cx = containerW / 2
      const cy = containerH / 2
      setState({
        x: cx - (cx - current.x) * ratio,
        y: cy - (cy - current.y) * ratio,
        k: newK,
      })
    },
    [containerW, containerH, minScale, maxScale, setState],
  )

  const reset = useCallback(() => {
    setState(
      defaultView(
        { width: containerW, height: containerH },
        { width: worldW, height: worldH },
        fitMargin,
        initialMaxScale,
      ),
    )
  }, [containerW, containerH, worldW, worldH, fitMargin, initialMaxScale, setState])

  const consumeRecentDrag = useCallback(() => {
    const v = recentDragRef.current
    recentDragRef.current = false
    return v
  }, [])

  return useMemo(
    () => ({
      state,
      bind: { ref: svgRef, onPointerDown, onPointerMove, onPointerUp },
      navigateTo,
      zoomBy,
      reset,
      consumeRecentDrag,
    }),
    [state, onPointerDown, onPointerMove, onPointerUp, navigateTo, zoomBy, reset, consumeRecentDrag],
  )
}
