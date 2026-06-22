import { useMemo, useRef, useState, type PointerEvent as RPE } from "react";
import { Plus, Minus, Maximize2 } from "lucide-react";
import { feature } from "topojson-client";
import worldTopo from "world-atlas/countries-110m.json";
import type { Jurisdiction } from "../content/jurisdictions";
import { STATUS_META } from "../content/jurisdictions";
import { cn } from "../lib/utils";

// Self-rendered world map: project a world topojson with a plain
// equirectangular projection (no d3/geo runtime), tint tracked countries by
// status, and drop pulsing clickable markers on each jurisdiction. Kept
// dependency-light and fully styleable for the dark/violet identity.

const W = 1000;
const H = 500;
const px = (lon: number) => ((lon + 180) / 360) * W;
const py = (lat: number) => ((90 - lat) / 180) * H;

type Position = [number, number];
type Ring = Position[];
type Feat = { id?: string | number; properties?: { name?: string }; geometry: { type: string; coordinates: unknown } };

function ringPath(ring: Ring): string {
  let d = "";
  for (let i = 0; i < ring.length; i++) {
    d += `${i ? "L" : "M"}${px(ring[i][0]).toFixed(1)} ${py(ring[i][1]).toFixed(1)}`;
  }
  return d + "Z";
}
function geoToPath(geom: { type: string; coordinates: unknown }): string {
  if (geom.type === "Polygon") return (geom.coordinates as Ring[]).map(ringPath).join(" ");
  if (geom.type === "MultiPolygon") return (geom.coordinates as Ring[][]).flat().map(ringPath).join(" ");
  return "";
}

// Featureize + project once at module load.
const COUNTRIES: Feat[] = (feature as unknown as (t: unknown, o: unknown) => { features: Feat[] })(
  worldTopo,
  worldTopo.objects.countries,
).features;
const COUNTRY_PATHS = COUNTRIES.map((f) => ({ id: String(f.id ?? ""), d: geoToPath(f.geometry) })).filter((c) => c.d);

export function WorldMap({
  jurisdictions,
  selectedId,
  onSelect,
}: {
  jurisdictions: Jurisdiction[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const isoToJur = useMemo(() => {
    const m = new Map<string, Jurisdiction>();
    for (const j of jurisdictions) for (const iso of j.iso) m.set(iso, j);
    return m;
  }, [jurisdictions]);

  const [vb, setVb] = useState({ x: 0, y: 0, w: W, h: H });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);

  const clampX = (x: number, w: number) => Math.min(W - w, Math.max(0, x));
  const clampY = (y: number, h: number) => Math.min(H - h, Math.max(0, y));

  const zoomBy = (factor: number) =>
    setVb((v) => {
      const cx = v.x + v.w / 2;
      const cy = v.y + v.h / 2;
      const w = Math.min(W, Math.max(W / 8, v.w * factor));
      const h = w * (H / W);
      return { x: clampX(cx - w / 2, w), y: clampY(cy - h / 2, h), w, h };
    });
  const reset = () => setVb({ x: 0, y: 0, w: W, h: H });

  const onPointerDown = (e: RPE<SVGSVGElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, vx: vb.x, vy: vb.y, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: RPE<SVGSVGElement>) => {
    if (!drag.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = ((e.clientX - drag.current.x) / rect.width) * vb.w;
    const dy = ((e.clientY - drag.current.y) / rect.height) * vb.h;
    if (Math.abs(e.clientX - drag.current.x) + Math.abs(e.clientY - drag.current.y) > 3) drag.current.moved = true;
    setVb((v) => ({ ...v, x: clampX(drag.current!.vx - dx, v.w), y: clampY(drag.current!.vy - dy, v.h) }));
  };
  const endDrag = () => {
    drag.current = null;
  };

  const markerR = 5.5 * (vb.w / W);

  return (
    <div className="relative">
      <svg
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        className="w-full rounded-xl bg-neutral-950/40 ring-1 ring-white/[0.06] touch-none cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: "2 / 1" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        role="img"
        aria-label="World map of crypto-regulation status"
      >
        {COUNTRY_PATHS.map((c, idx) => {
          const j = isoToJur.get(c.id);
          return (
            <path
              key={idx}
              d={c.d}
              fill={j ? STATUS_META[j.status].fill : "rgba(255,255,255,0.045)"}
              stroke={j ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)"}
              strokeWidth={0.4 * (vb.w / W)}
              className={cn(j && "cursor-pointer")}
              onClick={() => j && !drag.current?.moved && onSelect(j.id)}
            />
          );
        })}
        {jurisdictions.map((j) => {
          const x = px(j.lon);
          const y = py(j.lat);
          const sel = j.id === selectedId;
          const dot = STATUS_META[j.status].dot;
          return (
            <g key={j.id} className="cursor-pointer" onClick={() => !drag.current?.moved && onSelect(j.id)}>
              <circle cx={x} cy={y} r={markerR} fill={dot} opacity={0.35} className="map-ping" style={{ transformOrigin: `${x}px ${y}px` }} />
              <circle cx={x} cy={y} r={markerR} fill={dot} stroke={sel ? "#fff" : "rgba(0,0,0,0.4)"} strokeWidth={sel ? markerR * 0.35 : markerR * 0.18} />
              <circle cx={x} cy={y} r={markerR * 2.4} fill="transparent" />
            </g>
          );
        })}
      </svg>

      <div className="absolute top-2 right-2 flex flex-col gap-1">
        <MapButton Icon={Plus} label="Zoom in" onClick={() => zoomBy(1 / 1.5)} />
        <MapButton Icon={Minus} label="Zoom out" onClick={() => zoomBy(1.5)} />
        <MapButton Icon={Maximize2} label="Reset view" onClick={reset} />
      </div>
    </div>
  );
}

function MapButton({ Icon, label, onClick }: { Icon: typeof Plus; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid place-items-center w-7 h-7 rounded-lg surface text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
