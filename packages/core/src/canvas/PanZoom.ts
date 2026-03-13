import { zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import { select, type Selection } from 'd3-selection';
import 'd3-transition';
import type { PanZoomInstance, PanZoomParams, PanZoomCallbacks, Viewport, Transform } from '../types';
import { DEFAULT_MIN_ZOOM, DEFAULT_MAX_ZOOM, INFINITE_EXTENT } from '../constants';

export interface PanZoomOptions extends PanZoomCallbacks {
  domNode: Element;
  minZoom?: number;
  maxZoom?: number;
  viewport?: Viewport;
  translateExtent?: [[number, number], [number, number]];
  panning?: boolean;
  zooming?: boolean;
  /** CSS selector for elements that should block pan/zoom (e.g. draggable items) */
  noPanSelector?: string;
  /** Called during filter to check if interaction is currently blocked */
  isInteractionBlocked?: () => boolean;
}

export function createPanZoom(options: PanZoomOptions): PanZoomInstance {
  const {
    domNode,
    minZoom = DEFAULT_MIN_ZOOM,
    maxZoom = DEFAULT_MAX_ZOOM,
    viewport = { x: 0, y: 0, zoom: 1 },
    translateExtent = INFINITE_EXTENT,
    panning = true,
    zooming = true,
    noPanSelector,
    isInteractionBlocked,
    onPanZoomStart,
    onPanZoom,
    onPanZoomEnd,
    onTransformChange,
  } = options;

  let currentPanning = panning;
  let currentZooming = zooming;

  const d3Zoom: ZoomBehavior<Element, unknown> = zoom<Element, unknown>()
    .scaleExtent([minZoom, maxZoom])
    .translateExtent(translateExtent)
    .filter((event: Event) => {
      const e = event as WheelEvent & MouseEvent & TouchEvent;
      if (!currentPanning && e.type !== 'wheel') return false;
      if (!currentZooming && e.type === 'wheel') return false;

      // Allow pinch zoom on trackpad (ctrl+wheel)
      if (e.type === 'wheel' && !e.ctrlKey && !currentZooming) return false;

      // Block right-click drag
      if (e.type === 'mousedown' && (e as MouseEvent).button > 0) return false;

      // Block pan when an item drag/resize is active
      if (isInteractionBlocked?.()) return false;

      // Block pan when event originates from a grid item or noPan element
      const target = e.target as HTMLElement | null;
      if (target) {
        if (target.closest('.gc-item') || target.closest('.gc-nopan')) return false;
        if (noPanSelector && target.closest(noPanSelector)) return false;
      }

      return true;
    })
    .on('start', (event) => {
      const t: ZoomTransform = event.transform;
      const vp: Viewport = { x: t.x, y: t.y, zoom: t.k };
      onPanZoomStart?.(event.sourceEvent, vp);
    })
    .on('zoom', (event) => {
      const t: ZoomTransform = event.transform;
      const transform: Transform = [t.x, t.y, t.k];
      onTransformChange?.(transform);
      const vp: Viewport = { x: t.x, y: t.y, zoom: t.k };
      onPanZoom?.(event.sourceEvent, vp);
    })
    .on('end', (event) => {
      const t: ZoomTransform = event.transform;
      const vp: Viewport = { x: t.x, y: t.y, zoom: t.k };
      onPanZoomEnd?.(event.sourceEvent, vp);
    });

  const d3Selection: Selection<Element, unknown, null, undefined> = select(domNode).call(d3Zoom);

  // Disable double-click zoom by default
  d3Selection.on('dblclick.zoom', null);

  // Set initial viewport
  const initialTransform = zoomIdentity.translate(viewport.x, viewport.y).scale(viewport.zoom);
  d3Zoom.transform(d3Selection, initialTransform);

  const instance: PanZoomInstance = {
    update(params: PanZoomParams) {
      currentPanning = params.panning;
      currentZooming = params.zooming;
      d3Zoom.scaleExtent([params.minZoom, params.maxZoom]);
      if (params.translateExtent) {
        d3Zoom.translateExtent(params.translateExtent);
      }
    },

    setViewport(vp: Viewport, opts?: { duration?: number }) {
      const transform = zoomIdentity.translate(vp.x, vp.y).scale(vp.zoom);
      const duration = opts?.duration ?? 0;

      if (duration > 0) {
        d3Selection.transition().duration(duration).call(d3Zoom.transform, transform);
      } else {
        d3Zoom.transform(d3Selection, transform);
      }
    },

    syncViewport(vp: Viewport) {
      const transform = zoomIdentity.translate(vp.x, vp.y).scale(vp.zoom);
      d3Zoom.transform(d3Selection, transform);
    },

    getViewport(): Viewport {
      const t = zoomIdentity; // fallback
      try {
        const currentTransform = (d3Selection.node() as any)?.__zoom as ZoomTransform | undefined;
        if (currentTransform) {
          return { x: currentTransform.x, y: currentTransform.y, zoom: currentTransform.k };
        }
      } catch {
        // noop
      }
      return { x: t.x, y: t.y, zoom: t.k };
    },

    destroy() {
      d3Selection.on('.zoom', null);
    },
  };

  return instance;
}
