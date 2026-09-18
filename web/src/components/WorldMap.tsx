import { useEffect, useMemo, useRef, useState, type PointerEvent as RPE } from "react";
import { Plus, Minus, Maximize2 } from "lucide-react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import worldTopo from "world-atlas/countries-110m.json";
import type { Jurisdiction } from "../content/jurisdictions";
import { STATUS_META } from "../content/jurisdictions";

// World map via d3-geo (an equal-earth projection). React renders the SVG;
// every colour is a CSS variable, so the map follows the theme. Countries
// are tinted by regulation status; tracked jurisdictions get a clickable
// dot. Drag to pan, scroll to zoom.

const W = 900;
const H = 440;
const topo = worldTopo as unknown as { objects: { countries: unknown } };
const GEO = (feature as unknown as (t: unknown, o: unknown) => FeatureCollection<Geometry, { name?: string }>)(topo, topo.objects.countries);
const projection = geoEqualEarth().fitSize([W, H], GEO);
const pathGen = geoPath(projection);
const COUNTRY_PATHS = GEO.features.map((f) => ({ id: String(f.id ?? ""), d: pathGen(f) ?? "" })).filter((c) => c.d);

type Transform = { k: number; tx: number; ty: number };

export function WorldMap({ jurisdictions, selectedId, onSelect }: { jurisdictions: Jurisdiction[]; selectedId: string | null; onSelect: (id: string) => void }) {
  const isoToJur = useMemo(() => {
    const m = new Map<string, Jurisdiction>();
    for (const j of jurisdictions) for (const iso of j.iso) m.set(iso, j);
    return m;
  }, [jurisdictions]);

  const [t, setT] = useState<Transform>({ k: 1, tx: 0, ty: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const movedRef = useRef(false);

  const clampK = (k: number) => Math.min(8, Math.max(1, k));

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const sx = ((e.clientX - rect.left) / rect.width) * W;
      const sy = ((e.clientY - rect.top) / rect.height) * H;
      const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
      setT((p) => {
        const k = clampK(p.k * factor);
        const r = k / p.k;
        return { k, tx: sx - (sx - p.tx) * r, ty: sy - (sy - p.ty) * r };
      });
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: RPE<SVGSVGElement>) => {
    dragRef.current = { x: e.clientX, y: e.clientY, tx: t.tx, ty: t.ty };
    movedRef.current = false;
  };
  const onPointerMove = (e: RPE<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 3) movedRef.current = true;
    const dx = ((e.clientX - d.x) / rect.width) * W;
    const dy = ((e.clientY - d.y) / rect.height) * H;
    setT((p) => ({ ...p, tx: d.tx + dx, ty: d.ty + dy }));
  };
  const endDrag = () => {
    dragRef.current = null;
  };

  const zoomBy = (factor: number) =>
    setT((p) => {
      const k = clampK(p.k * factor);
      const r = k / p.k;
      const cx = W / 2;
      const cy = H / 2;
      return { k, tx: cx - (cx - p.tx) * r, ty: cy - (cy - p.ty) * r };
    });
  const reset = () => setT({ k: 1, tx: 0, ty: 0 });

  const project = (lon: number, lat: number): [number, number] | null => {
    const p = projection([lon, lat]);
    return p ? [p[0] * t.k + t.tx, p[1] * t.k + t.ty] : null;
  };

  const click = (id: string) => {
    if (!movedRef.current) onSelect(id);
  };

  return (
    <div className="relative overflow-hidden panel bg-raised">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none cursor-grab active:cursor-grabbing block"
        style={{ aspectRatio: `${W} / ${H}` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        role="img"
        aria-label="World map of crypto regulation status by country"
      >
        <g transform={`translate(${t.tx} ${t.ty}) scale(${t.k})`}>
          {COUNTRY_PATHS.map((c, idx) => {
            const j = isoToJur.get(c.id);
            return (
              <path
                key={idx}
                d={c.d}
                fill={j ? STATUS_META[j.status].fill : "var(--color-map-land)"}
                fillOpacity={j ? 0.38 : 1}
                stroke="var(--color-map-border)"
                strokeWidth={0.5}
                vectorEffect="non-scaling-stroke"
                onClick={() => j && click(j.id)}
                style={{ cursor: j ? "pointer" : "inherit" }}
              />
            );
          })}
        </g>

        <g>
          {jurisdictions.map((j) => {
            const p = project(j.lon, j.lat);
            if (!p) return null;
            const sel = j.id === selectedId;
            return (
              <g key={j.id} transform={`translate(${p[0]} ${p[1]})`} className="cursor-pointer" onClick={() => click(j.id)}>
                <title>{j.name}</title>
                <circle r={sel ? 6 : 4.5} fill={STATUS_META[j.status].dot} stroke={sel ? "var(--color-ink)" : "var(--color-raised)"} strokeWidth={sel ? 2 : 1.25} />
                <circle r={12} fill="transparent" />
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute top-2 right-2 flex flex-col gap-1">
        <MapButton Icon={Plus} label="Zoom in" onClick={() => zoomBy(1.5)} />
        <MapButton Icon={Minus} label="Zoom out" onClick={() => zoomBy(1 / 1.5)} />
        <MapButton Icon={Maximize2} label="Reset the view" onClick={reset} />
      </div>
    </div>
  );
}

function MapButton({ Icon, label, onClick }: { Icon: typeof Plus; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="btn p-1.5">
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
