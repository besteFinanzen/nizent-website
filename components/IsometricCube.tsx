"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
const DEPTH = 30;
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

// Cube state at each section (order: home, mpg, dlrg, about, services, contact)
interface Params {
  x: number;
  y: number;
  s: number;
  spread: number;
}

const SECTION_PARAMS: Params[] = [
  { x: 0, y: 1.1, s: 0.72, spread: 0 },      // home — floats above the headline
  { x: -3.15, y: 0, s: 0.38, spread: 0.05 }, // mpg — peeks from the left edge
  { x: 3.15, y: 0, s: 0.38, spread: 0.05 },  // dlrg — peeks from the right edge
  { x: 0, y: 0.1, s: 0.8, spread: 1 },       // about — fully exploded
  { x: -3.2, y: 0, s: 0.38, spread: 0.05 },  // services — peeks from the left edge
  { x: 3.2, y: 0, s: 0.36, spread: 0.15 },   // contact — reassembled at the right edge
];

const FALLBACK_MARKS = [0.06, 0.26, 0.46, 0.64, 0.8, 0.95];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smooth(u: number) {
  return u * u * (3 - 2 * u);
}

function paramsAt(p: number, marks: number[]): Params {
  const P = SECTION_PARAMS;
  if (p <= marks[0]) return P[0];
  for (let i = 0; i < marks.length - 1; i++) {
    if (p <= marks[i + 1]) {
      const span = marks[i + 1] - marks[i] || 1;
      const u = smooth(Math.min(1, Math.max(0, (p - marks[i]) / span)));
      return {
        x: lerp(P[i].x, P[i + 1].x, u),
        y: lerp(P[i].y, P[i + 1].y, u),
        s: lerp(P[i].s, P[i + 1].s, u),
        spread: lerp(P[i].spread, P[i + 1].spread, u),
      };
    }
  }
  return P[P.length - 1];
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

function Piece({ def, index }: { def: PieceDef; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgeRef = useRef<THREE.LineSegments>(null);

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
    const bob = Math.sin(t * 0.8 + tumble.phase) * (5 + spread * 16);

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
  });

  return (
    <>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color={def.color}
          emissive={def.emissive}
          emissiveIntensity={0.5}
          metalness={0.25}
          roughness={0.5}
          flatShading
        />
      </mesh>
      <lineSegments ref={edgeRef} geometry={edges}>
        <lineBasicMaterial color="#00e0ff" transparent opacity={0.35} />
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
    g.position.set(p.x, p.y, 0);
    g.scale.setScalar(BASE_SCALE * p.s);
    g.rotation.x = smoothMouse.current.y * 0.22 + Math.sin(t * 0.21) * 0.04;
    g.rotation.y = smoothMouse.current.x * 0.3 + Math.sin(t * 0.16) * 0.08;
    g.rotation.z = Math.sin(t * 0.13) * 0.03;
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
