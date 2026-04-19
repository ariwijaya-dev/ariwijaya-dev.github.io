import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect, Suspense } from 'react';
import type { Group, Mesh, Points as ThreePoints } from 'three';
import * as THREE from 'three';

function Starfield({ count = 1200 }: { count?: number }) {
  const ref = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.03;
    ref.current.rotation.x += delta * 0.01;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#60a5fa"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function DistortedCore() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.2;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.4, 6]} />
        <MeshDistortMaterial
          color="#3b82f6"
          emissive="#1e3a8a"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          distort={0.45}
          speed={1.6}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.25} />
      </mesh>
    </Float>
  );
}

function OrbitingShape({
  radius,
  speed,
  offset,
  geometry,
  color,
}: {
  radius: number;
  speed: number;
  offset: number;
  geometry: 'octahedron' | 'tetrahedron' | 'torus';
  color: string;
}) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * speed + offset;
    groupRef.current.position.x = Math.cos(t) * radius;
    groupRef.current.position.z = Math.sin(t) * radius;
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.6;
    groupRef.current.rotation.x = t * 1.2;
    groupRef.current.rotation.y = t * 0.8;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        {geometry === 'octahedron' && <octahedronGeometry args={[0.22, 0]} />}
        {geometry === 'tetrahedron' && <tetrahedronGeometry args={[0.25, 0]} />}
        {geometry === 'torus' && <torusGeometry args={[0.2, 0.06, 16, 40]} />}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.7}
          wireframe
        />
      </mesh>
    </group>
  );
}

function SceneContents() {
  const groupRef = useRef<Group>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setPointer({ x, y });
    };
    window.addEventListener('pointermove', handler);
    return () => window.removeEventListener('pointermove', handler);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += (pointer.x * 0.4 - groupRef.current.rotation.y) * delta * 1.5;
    groupRef.current.rotation.x += (pointer.y * 0.25 - groupRef.current.rotation.x) * delta * 1.5;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#8b5cf6" />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color="#3b82f6" />
      <directionalLight position={[0, 5, 2]} intensity={0.3} />

      <group ref={groupRef}>
        <DistortedCore />
        <OrbitingShape radius={2.6} speed={0.5} offset={0} geometry="octahedron" color="#60a5fa" />
        <OrbitingShape radius={3.0} speed={0.35} offset={2.1} geometry="tetrahedron" color="#a78bfa" />
        <OrbitingShape radius={2.4} speed={0.6} offset={4.2} geometry="torus" color="#22d3ee" />
        <Starfield count={1000} />
      </group>
    </>
  );
}

export default function HeroScene() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reduced) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
      <fog attach="fog" args={[new THREE.Color('#0a0a0a'), 5, 14]} />
    </Canvas>
  );
}
