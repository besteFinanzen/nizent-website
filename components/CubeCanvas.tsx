"use client";

/*
 * React Three Fiber canvas hosting the logo cube, ambient shards and the
 * sound-reactive particle cloud. Rendered as a fixed, pointer-ignore background
 * layer behind all page content.
 */

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import IsometricCube, { frameLevel } from "./IsometricCube";
import { settings } from "@/lib/settings";

const P = settings.visuals.particles;

// Deterministic pseudo-random (pure render, no hydration mismatch)
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Shards() {
  const ref = useRef<THREE.Group>(null);

  const shards = useMemo(() => {
    const rand = seededRandom(1337);
    return Array.from({ length: 12 }, (_, i) => ({
      pos: [
        (rand() - 0.5) * 9,
        (rand() - 0.5) * 5.5,
        -2 - rand() * 2.5,
      ] as [number, number, number],
      r: 0.03 + rand() * 0.09,
      speed: 0.15 + rand() * 0.35,
      phase: i * 1.7,
      color: i % 3 === 0 ? "#00e0ff" : "#1b5676",
      opacity: 0.18 + rand() * 0.22,
    }));
  }, []);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((child, i) => {
      child.rotation.x = t * shards[i].speed * 0.6;
      child.rotation.y = t * shards[i].speed;
      child.position.y = shards[i].pos[1] + Math.sin(t * 0.4 + shards[i].phase) * 0.25;
    });
  });

  return (
    <group ref={ref}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <octahedronGeometry args={[s.r, 0]} />
          <meshBasicMaterial color={s.color} wireframe transparent opacity={s.opacity} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Ambient particle cloud around the logo. Drifts slowly and breathes subtly
 * with the music (size + opacity), driven by settings.visuals.particles.
 */
function SoundParticles() {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const geometry = useMemo(() => {
    const rand = seededRandom(7);
    const count = P.count;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = P.radiusMin + rand() * (P.radiusMax - P.radiusMin);
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(rand() * 2 - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((state) => {
    const p = ref.current;
    if (!p) return;
    const t = state.clock.elapsedTime;
    p.rotation.y = t * P.driftSpeed;
    p.rotation.x = Math.sin(t * 0.03) * 0.1;
    if (matRef.current) {
      // barely-there breathing with the music — non-disturbing
      matRef.current.opacity =
        P.opacityBase + frameLevel.high * P.opacityHighGain + frameLevel.mid * P.opacityMidGain;
      matRef.current.size = P.sizeBase + frameLevel.mid * P.sizeBoost;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        ref={matRef}
        color="#00e0ff"
        size={P.sizeBase}
        sizeAttenuation
        transparent
        opacity={P.opacityBase}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function CubeCanvas({
  progress,
  marks,
}: {
  progress: number;
  marks?: number[] | null;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.75]}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 6, 8]} intensity={1.0} />
        <pointLight position={[-6, -2, 6]} intensity={14} color="#00e0ff" distance={20} />
        <pointLight position={[6, -4, -4]} intensity={8} color="#1b5676" distance={18} />
        <IsometricCube progress={progress} marks={marks} />
        <Shards />
        <SoundParticles />
      </Canvas>
    </div>
  );
}
