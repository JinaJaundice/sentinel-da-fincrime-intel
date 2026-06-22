import { useMemo, useState } from "react";
import { Plus, Minus, Maximize2 } from "lucide-react";
import { ComposableMap, ZoomableGroup, Geographies, Geography, Marker, Sphere, Graticule } from "react-simple-maps";
import { feature } from "topojson-client";
import worldTopo from "world-atlas/countries-110m.json";
import type { Jurisdiction } from "../content/jurisdictions";
import { STATUS_META } from "../content/jurisdictions";

// A proper world map via react-simple-maps (d3-geo geoEqualEarth — accurate,
// no polar warping). Countries are tinted by regulation status; each tracked
// jurisdiction gets a glowing, pulsing, clickable marker. Drag to pan, scroll
// to zoom.

// Featureize the topojson once → a GeoJSON FeatureCollection for <Geographies>.
const topo = worldTopo as unknown as { objects: { countries: unknown } };
const GEO = (feature as unknown as (t: unknown, o: unknown) => object)(topo, topo.objects.countries);

const LAND = "rgba(255,255,255,0.055)";
const LAND_HOVER = "rgba(255,255,255,0.11)";
const BORDER = "rgba(255,255,255,0.10)";

type Position = { coordinates: [number, number]; zoom: number };

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

  const [pos, setPos] = useState<Position>({ coordinates: [0, 12], zoom: 1 });
  const clampZoom = (z: number) => Math.min(8, Math.max(1, z));
  const zoomBy = (f: number) => setPos((p) => ({ ...p, zoom: clampZoom(p.zoom * f) }));
  const reset = () => setPos({ coordinates: [0, 12], zoom: 1 });

  // Keep markers a roughly constant screen size as the map zooms.
  const r = 5 / pos.zoom;

  return (
    <div className="relative overflow-hidden rounded-xl bg-neutral-950/50 ring-1 ring-white/[0.06]">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 165 }}
        width={820}
        height={380}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <defs>
          <filter id="dot-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ZoomableGroup
          zoom={pos.zoom}
          center={pos.coordinates}
          minZoom={1}
          maxZoom={8}
          onMoveEnd={(p: Position) => setPos(p)}
        >
          <Sphere id="rsm-sphere" fill="transparent" stroke="rgba(139,92,246,0.18)" strokeWidth={0.6} />
          <Graticule stroke="rgba(255,255,255,0.035)" strokeWidth={0.4} />
          <Geographies geography={GEO}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const j = isoToJur.get(String(geo.id));
                const fill = j ? STATUS_META[j.status].fill : LAND;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => j && onSelect(j.id)}
                    style={{
                      default: { fill, stroke: BORDER, strokeWidth: 0.3, outline: "none" },
                      hover: { fill: j ? fill : LAND_HOVER, stroke: BORDER, strokeWidth: 0.3, outline: "none", cursor: j ? "pointer" : "grab" },
                      pressed: { fill, stroke: BORDER, strokeWidth: 0.3, outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
          {jurisdictions.map((j) => {
            const sel = j.id === selectedId;
            const dot = STATUS_META[j.status].dot;
            return (
              <Marker key={j.id} coordinates={[j.lon, j.lat]} onClick={() => onSelect(j.id)} style={{ default: { cursor: "pointer" }, hover: { cursor: "pointer" }, pressed: {} }}>
                <circle r={r} fill={dot} opacity={0.35} className="map-ping" style={{ transformOrigin: "center" }} />
                <circle
                  r={r}
                  fill={dot}
                  filter="url(#dot-glow)"
                  stroke={sel ? "#ffffff" : "rgba(10,10,12,0.7)"}
                  strokeWidth={sel ? r * 0.45 : r * 0.22}
                />
                {/* invisible larger hit target */}
                <circle r={r * 2.6} fill="transparent" />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute top-2 right-2 flex flex-col gap-1">
        <MapButton Icon={Plus} label="Zoom in" onClick={() => zoomBy(1.5)} />
        <MapButton Icon={Minus} label="Zoom out" onClick={() => zoomBy(1 / 1.5)} />
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
