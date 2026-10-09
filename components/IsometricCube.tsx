"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sfx } from "@/lib/audio";
import { settings } from "@/lib/settings";

/*
 * The nizent logo, rebuilt piece by piece.
 * Each polygon is traced 1:1 from RealLogo.svg (1080×1080 canvas),
 * extruded in Z so the flat mark becomes a real 3D object.
 *
 * Choreography is driven by "marks": the normalized scroll positions of
 * each page section (measured at runtime). Between two marks, the cube
 * smoothly interpolates position / scale / explode-spread.
 */

const CX = 540;
const CY = 540;
const DEPTH = 18;
const BASE_SCALE = 0.0032;

type Pt = [number, number];

interface PieceDef {
  pts: Pt[];
  color: string;
  emissive: string;
}

const PIECES: PieceDef[] = [
  // Left column, lower block (dark)
  { pts: [[86.67, 854.99], [286.67, 739.52], [286.67, 929.52], [86.67, 1044.99]], color: "#0b3f60", emissive: "#062033" },
  // Left column, upper block (dark)
  { pts: [[87, 245], [287, 360.46], [287, 660.46], [87, 775.93]], color: "#0b3f60", emissive: "#062033" },
  // Left top cap (medium)
  { pts: [[87, 245], [287, 129.52], [287, 360.46]], color: "#1b5676", emissive: "#093049" },
  // Upper diagonal band (medium)
  { pts: [[287, 129.52], [726.67, 383.55], [726.67, 614.49], [287, 360.46]], color: "#1b5676", emissive: "#093049" },
  // Right top cap (medium)
  { pts: [[993.33, 225.01], [793.33, 340.48], [793.33, 150.48], [993.33, 35.01]], color: "#1b5676", emissive: "#093049" },
  // Right column, upper block (medium)
  { pts: [[993.33, 835.01], [793.33, 719.54], [793.33, 419.54], [993.33, 304.07]], color: "#1b5676", emissive: "#093049" },
  // Right bottom cap (dark)
  { pts: [[993.33, 835.01], [793.33, 950.48], [793.33, 719.54]], color: "#0b3f60", emissive: "#062033" },
  // Lower diagonal band (dark)
  { pts: [[794, 950.48], [354, 696.45], [354, 465.51], [794, 719.54]], color: "#0b3f60", emissive: "#062033" },
];

// Cube state at each section (order: home, mpg, dlrg, gallery, about, services, contact)
interface Params {
  x: number;
  y: number;
  s: number;
  spread: number;
}

const SECTION_PARAMS: Params[] = [
  { x: 0, y: 1.1, s: 0.72, spread: 0 },      // home — floats above the headline
  { x: -3.15, y: 0, s: 0.38, spread: 0 },    // mpg — peeks from the left edge
  { x: 3.15, y: 0, s: 0.38, spread: 0 },     // dlrg — peeks from the right edge
  { x: -3.15, y: 0, s: 0.38, spread: 0 },    // gallery — peeks from the left edge
  { x: 0, y: 0.1, s: 0.8, spread: 1 },       // about — fully exploded
  { x: -3.2, y: 0, s: 0.38, spread: 0 },     // services — peeks from the left edge
  { x: 3.2, y: 0, s: 0.36, spread: 0 },      // contact — reassembled at the right edge
];

const FALLBACK_MARKS = [0.06, 0.24, 0.4, 0.55, 0.7, 0.84, 0.95];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smooth(u: number) {
  return u * u * (3 - 2 * u);
}

// Region i = [b[i], b[i+1]] settles at P[i]: each transition completes within
// the first ~22% of the region, then the exact params are held — the cube is
// always fully settled (and perfectly flush) before the user rests anywhere.
function paramsAt(p: number, marks: number[]): Params {
  const P = SECTION_PARAMS;
  const n = P.length;
  const b: number[] = [0];
  for (let i = 1; i < n; i++) b.push((marks[i - 1] + marks[i]) / 2);
  b.push(1);

  for (let i = 0; i < n; i++) {
    if (p >= b[i] && p <= b[i + 1]) {
      if (i === 0) return P[0];
      const segLen = b[i + 1] - b[i] || 1;
      const w = smooth(Math.min(1, (p - b[i]) / segLen / 0.22));
      return {
        x: lerp(P[i - 1].x, P[i].x, w),
        y: lerp(P[i - 1].y, P[i].y, w),
        s: lerp(P[i - 1].s, P[i].s, w),
        spread: lerp(P[i - 1].spread, P[i].spread, w),
      };
    }
  }
  return P[n - 1];
}

// Shared mouse state (window-level, since the canvas ignores pointer events)
const mouseState = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener(
    "mousemove",
    (e) => {
      mouseState.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseState.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true }
  );
}

const spreadRef: MutableRefObject<number> = { current: 0 };

// smoothed audio energy, sampled once per frame (read by pieces + particles)
export const frameLevel = { bass: 0, mid: 0, high: 0 };

function Piece({ def, index }: { def: PieceDef; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgeRef = useRef<THREE.LineSegments>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);

  const { geometry, edges, center, dir, tumble } = useMemo(() => {
    // Piece points relative to the LOGO center…
    const local = def.pts.map(([x, y]) => [x - CX, -(y - CY)] as Pt);
    // …then find the piece's own centroid so it can spin in place.
    const cx = local.reduce((a, p) => a + p[0], 0) / local.length;
    const cy = local.reduce((a, p) => a + p[1], 0) / local.length;
    const centered = local.map(([x, y]) => [x - cx, y - cy] as Pt);

    const shape = new THREE.Shape();
    shape.moveTo(centered[0][0], centered[0][1]);
    for (let i = 1; i < centered.length; i++) shape.lineTo(centered[i][0], centered[i][1]);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false });
    // Shape coords are already centroid-relative — only center the extrusion depth.
    geo.translate(0, 0, -DEPTH / 2);

    const edgeGeo = new THREE.EdgesGeometry(geo, 10);

    // Explode direction: away from logo center, alternating z
    const len = Math.hypot(cx, cy) || 1;
    const dir = new THREE.Vector3(cx / len, cy / len, index % 2 === 0 ? 0.5 : -0.5);

    const tumble = {
      x: ((index % 3) - 1) * 0.6,
      y: ((index % 4) - 1.5) * 0.45,
      z: (index % 2 === 0 ? 1 : -1) * 0.55,
      speed: 0.3 + (index % 5) * 0.11,
      phase: index * 1.13,
    };

    return { geometry: geo, edges: edgeGeo, center: new THREE.Vector3(cx, cy, 0), dir, tumble };
  }, [def, index]);

  useFrame((state) => {
    const mesh = meshRef.current;
    const edge = edgeRef.current;
    if (!mesh || !edge) return;
    const t = state.clock.elapsedTime;
    const spread = spreadRef.current;

    const dist = spread * 170;
    const bob = Math.sin(t * 0.3 + tumble.phase) * (4 + spread * 14);

    mesh.position.set(
      center.x + dir.x * dist,
      center.y + dir.y * dist,
      dir.z * dist + bob
    );
    mesh.rotation.x = spread * tumble.x + Math.sin(t * tumble.speed + tumble.phase) * 0.14 * spread;
    mesh.rotation.y = spread * tumble.y + Math.cos(t * tumble.speed * 0.8 + tumble.phase) * 0.14 * spread;
    mesh.rotation.z = spread * tumble.z;

    edge.position.copy(mesh.position);
    edge.rotation.copy(mesh.rotation);

    if (matRef.current) {
      // gentle glow that breathes with the bass — subtle, never distracting
      matRef.current.emissiveIntensity =
        settings.visuals.cube.emissiveBase + frameLevel.bass * settings.visuals.cube.emissiveBoost;
    }
    if (edgeMatRef.current) {
      edgeMatRef.current.opacity =
        settings.visuals.cube.edgeOpacityBase + frameLevel.high * settings.visuals.cube.edgeOpacityBoost;
    }
  });

  return (
    <>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          ref={matRef}
          color={def.color}
          emissive={def.emissive}
          emissiveIntensity={0.5}
          metalness={0.25}
          roughness={0.5}
          flatShading
        />
      </mesh>
      <lineSegments ref={edgeRef} geometry={edges}>
        <lineBasicMaterial ref={edgeMatRef} color="#00e0ff" transparent opacity={0.35} />
      </lineSegments>
    </>
  );
}

export default function IsometricCube({
  progress,
  marks,
}: {
  progress: number;
  marks?: number[] | null;
}) {
  const rig = useRef<THREE.Group>(null);
  const smoothMouse = useRef({ x: 0, y: 0 });
  const activeMarks = marks ?? FALLBACK_MARKS;

  useFrame((state) => {
    const g = rig.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    smoothMouse.current.x += (mouseState.x - smoothMouse.current.x) * 0.05;
    smoothMouse.current.y += (mouseState.y - smoothMouse.current.y) * 0.05;

    const p = paramsAt(progress, activeMarks);
    const lv = sfx.level();
    frameLevel.bass = lv.bass;
    frameLevel.mid = lv.mid;
    frameLevel.high = lv.high;
    const parallaxX = 0.09 + 0.11 * p.spread;
    const parallaxY = 0.12 + 0.14 * p.spread;
    g.position.set(p.x, p.y, 0);
    g.scale.setScalar(BASE_SCALE * p.s);
    g.rotation.x = smoothMouse.current.y * parallaxX + Math.sin(t * 0.09) * 0.03;
    g.rotation.y = smoothMouse.current.x * parallaxY + Math.sin(t * 0.07) * 0.06;
    g.rotation.z = Math.sin(t * 0.055) * 0.025;
    spreadRef.current = p.spread;
  });

  return (
    <group ref={rig}>
      {PIECES.map((def, i) => (
        <Piece key={i} def={def} index={i} />
      ))}
    </group>
  );
}
