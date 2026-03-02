"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ── Role configurations ── */
const roles = [
  { color: "#f59e0b", emissive: "#f59e0b", geometry: "icosahedron" as const, scale: 0.6 },
  { color: "#f97316", emissive: "#f97316", geometry: "dodecahedron" as const, scale: 0.55 },
  { color: "#3b82f6", emissive: "#3b82f6", geometry: "octahedron" as const, scale: 0.6 },
  { color: "#a855f7", emissive: "#a855f7", geometry: "icosahedron" as const, scale: 0.55 },
  { color: "#14b8a6", emissive: "#14b8a6", geometry: "dodecahedron" as const, scale: 0.6 },
  { color: "#ef4444", emissive: "#ef4444", geometry: "octahedron" as const, scale: 0.55 },
  { color: "#ec4899", emissive: "#ec4899", geometry: "icosahedron" as const, scale: 0.5 },
  { color: "#f59e0b", emissive: "#d97706", geometry: "dodecahedron" as const, scale: 0.55 },
];

/* ── Floating geometry with simple physics ── */
function FloatingGeometry({
  color,
  emissive,
  geometry,
  scale,
  initialPosition,
  initialVelocity,
}: {
  color: string;
  emissive: string;
  geometry: "icosahedron" | "dodecahedron" | "octahedron";
  scale: number;
  initialPosition: [number, number, number];
  initialVelocity: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocity = useRef(new THREE.Vector3(...initialVelocity));
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const pos = meshRef.current.position;
    const vel = velocity.current;

    // Apply velocity
    pos.x += vel.x * delta;
    pos.y += vel.y * delta;
    pos.z += vel.z * delta;

    // Bounce off boundaries
    const bound = 4;
    const boundY = 3;
    if (Math.abs(pos.x) > bound) { vel.x *= -1; pos.x = Math.sign(pos.x) * bound; }
    if (Math.abs(pos.y) > boundY) { vel.y *= -1; pos.y = Math.sign(pos.y) * boundY; }
    if (Math.abs(pos.z) > 2) { vel.z *= -1; pos.z = Math.sign(pos.z) * 2; }

    // Gentle rotation
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.4;

    // Mouse influence
    const mouseX = state.pointer.x * 0.3;
    const mouseY = state.pointer.y * 0.3;
    vel.x += (mouseX - pos.x) * 0.002;
    vel.y += (mouseY - pos.y) * 0.002;

    // Damping
    vel.multiplyScalar(0.999);
  });

  const GeometryComponent = {
    icosahedron: <icosahedronGeometry args={[1, 1]} />,
    dodecahedron: <dodecahedronGeometry args={[1, 0]} />,
    octahedron: <octahedronGeometry args={[1, 0]} />,
  };

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={initialPosition}
        scale={hovered ? scale * 1.3 : scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {GeometryComponent[geometry]}
        <MeshDistortMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={hovered ? 1.5 : 0.6}
          roughness={0.2}
          metalness={0.8}
          distort={0.25}
          speed={2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

/* ── Particle field ── */
function ParticleField({ count = 300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      [0.96, 0.62, 0.04],
      [0.98, 0.45, 0.09],
      [0.23, 0.51, 0.96],
      [0.66, 0.33, 0.97],
      [0.08, 0.72, 0.65],
      [0.94, 0.27, 0.27],
      [0.93, 0.29, 0.6],
    ];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Collision spark particles ── */
function CollisionSparks() {
  const ref = useRef<THREE.Points>(null);
  const sparkCount = 50;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < sparkCount; i++) {
      posArr[i * 3] += Math.sin(time * 2 + i) * 0.005;
      posArr[i * 3 + 1] += Math.cos(time * 3 + i * 0.5) * 0.005;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ── Mouse-following light ── */
function MouseLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!lightRef.current) return;
    lightRef.current.position.x = (state.pointer.x * viewport.width) / 2;
    lightRef.current.position.y = (state.pointer.y * viewport.height) / 2;
  });

  return <pointLight ref={lightRef} intensity={2} distance={8} color="#a78bfa" />;
}

/* ── Main 3D Scene ── */
function Scene() {
  const initialPositions: [number, number, number][] = useMemo(
    () => [
      [-3, 2, 0],
      [3, 2, 1],
      [-2, -1, -1],
      [2, -1, 0.5],
      [-3.5, 0, 1],
      [3.5, 0, -0.5],
      [0, 2.5, -1],
      [0, -2, 0.5],
    ],
    []
  );

  const initialVelocities: [number, number, number][] = useMemo(
    () => [
      [0.4, -0.3, 0.2],
      [-0.3, 0.4, -0.1],
      [0.5, 0.2, -0.3],
      [-0.4, -0.3, 0.2],
      [0.3, 0.5, -0.2],
      [-0.5, -0.2, 0.3],
      [0.2, -0.4, 0.1],
      [-0.3, 0.3, -0.2],
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#a78bfa" />
      <directionalLight position={[-5, -5, 5]} intensity={0.2} color="#f472b6" />
      <MouseLight />

      <ParticleField count={300} />
      <CollisionSparks />

      {roles.map((role, i) => (
        <FloatingGeometry
          key={i}
          {...role}
          initialPosition={initialPositions[i]}
          initialVelocity={initialVelocities[i]}
        />
      ))}
    </>
  );
}

export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
