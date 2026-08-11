"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useSelector } from "react-redux";
import * as THREE from "three";
import { selectSortedScopes } from "@portfolio/features/github/store/github.selectors";
import type { GitHubState } from "@portfolio/features/github/store/github.slice";
import type { GitHubRepository, GitHubScope } from "@portfolio/features/github/types";

// ─── Floating Particles (ambient depth cue) ──────────────────────────────────

const PARTICLE_COUNT = 120;

// Initialise random particle data once at module load time so that
// Math.random() is never called during a React render (react-hooks/purity).
const _particlePositions = (() => {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 40;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  return pos;
})();

const _particlePhases = (() => {
  const ph = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    ph[i] = Math.random() * Math.PI * 2;
  }
  return ph;
})();

function FloatingParticles() {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, phases } = useMemo(() => {
    return { positions: _particlePositions, phases: _particlePhases };
  }, []);

  const basePositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const attr = geo.attributes.position as THREE.BufferAttribute;
    const t = clock.getElapsedTime();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      attr.setY(i, basePositions[i * 3 + 1] + Math.sin(t * 0.4 + phases[i]) * 0.35);
      attr.setX(i, basePositions[i * 3]     + Math.cos(t * 0.3 + phases[i]) * 0.2);
    }
    attr.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    return geo;
  }, [positions]);

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        color="#a0b8ff"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ConstellationLevel = "galaxy" | "cluster";

type Vec3 = [number, number, number];

type CameraTarget = {
  position: Vec3;
  lookAt: Vec3;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const ORG_COLORS: Record<string, string> = {
  szmyty: "#7c9cff",
  incomprisllc: "#5ec2b7",
  egohygiene: "#c084fc",
};

const ORG_POSITIONS: Record<string, Vec3> = {
  szmyty: [0, 5.5, 0],
  incomprisllc: [-7, -3.5, 0],
  egohygiene: [7, -3.5, 0],
};

const GALAXY_CAMERA: CameraTarget = {
  position: [0, 0, 24],
  lookAt: [0, 0, 0],
};

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#eab308",
  Python: "#3572a5",
  Go: "#00add8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555599",
  "C#": "#178600",
  Ruby: "#701516",
  Swift: "#f05138",
  Kotlin: "#a97bff",
  Dart: "#00b4ab",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Makefile: "#427819",
  Nix: "#7e7eff",
  Lua: "#000080",
  Haskell: "#5e5086",
  Elixir: "#6e4a7e",
  Clojure: "#db5855",
};

const DEFAULT_REPO_COLOR = "#64748b";
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const ORG_NODE_RADIUS = 1.0;
const CLUSTER_Z_OFFSET = 15;

// Interaction limits
const MAX_YAW   = Math.PI / 6;   // ±30 degrees horizontal
const MAX_PITCH = Math.PI / 12;  // ±15 degrees vertical
const MIN_ZOOM  = 1.0;           // cannot zoom out beyond starting distance
const MAX_ZOOM  = 2.2;           // cannot zoom in past ~2×

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getOrgColor(orgId: string): string {
  return ORG_COLORS[orgId] ?? "#7c9cff";
}

function getOrgPosition(orgId: string): Vec3 {
  return ORG_POSITIONS[orgId] ?? [0, 0, 0];
}

function getLanguageColor(language: string | null): string {
  if (!language) return DEFAULT_REPO_COLOR;
  return LANGUAGE_COLORS[language] ?? DEFAULT_REPO_COLOR;
}

function getClusterCamera(orgId: string): CameraTarget {
  const [ox, oy, oz] = getOrgPosition(orgId);
  return {
    position: [ox, oy, oz + CLUSTER_Z_OFFSET],
    lookAt: [ox, oy, oz],
  };
}

/**
 * Distribute repos in a Fibonacci spiral around the org center.
 * Deterministic — no Math.random() so positions are stable across renders.
 */
function computeRepoPositions(orgPos: Vec3, count: number): Vec3[] {
  return Array.from({ length: count }, (_, i) => {
    const theta = i * GOLDEN_ANGLE;
    const r = 2.8 + Math.sqrt(i + 1) * 1.4;
    const zJitter = ((i * 137) % 7) * 0.18 - 0.63; // deterministic z spread
    return [
      orgPos[0] + r * Math.cos(theta),
      orgPos[1] + r * Math.sin(theta),
      orgPos[2] + zJitter,
    ] as Vec3;
  });
}

function getRepoNodeRadius(stars: number): number {
  return 0.18 + Math.min(stars * 0.025, 0.42);
}

// ─── Sub-components (inside Canvas) ───────────────────────────────────────────

type CameraRigProps = {
  targetPosition: Vec3;
  targetLookAt: Vec3;
  yaw: number;
  pitch: number;
  zoom: number;
};

function CameraRig({ targetPosition, targetLookAt, yaw, pitch, zoom }: CameraRigProps) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 0, 24));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));
  const destPos = useRef(new THREE.Vector3(...targetPosition));
  const destLook = useRef(new THREE.Vector3(...targetLookAt));

  useEffect(() => {
    destPos.current.set(...targetPosition);
    destLook.current.set(...targetLookAt);
  }, [targetPosition, targetLookAt]);

  useFrame(() => {
    currentPos.current.lerp(destPos.current, 0.05);
    currentLook.current.lerp(destLook.current, 0.05);

    // Orbit the camera around the look-at point applying user drag + zoom
    const look = currentLook.current.clone();
    const dir = currentPos.current.clone().sub(look);
    const spherical = new THREE.Spherical().setFromVector3(dir);
    spherical.theta += yaw;
    spherical.phi    = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + pitch));
    spherical.radius = spherical.radius / zoom;

    const finalPos = look.clone().add(new THREE.Vector3().setFromSpherical(spherical));
    camera.position.copy(finalPos);
    camera.lookAt(look);
  });

  return null;
}

// ─── OrgNode ──────────────────────────────────────────────────────────────────

type OrgNodeProps = {
  orgId: string;
  position: Vec3;
  color: string;
  isVisible: boolean;
  isSelected: boolean;
  onClick: () => void;
};

function OrgNode({ orgId, position, color, isVisible, isSelected, onClick }: OrgNodeProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const radius = isSelected ? ORG_NODE_RADIUS * 1.3 : ORG_NODE_RADIUS;

  useFrame(({ clock }) => {
    if (!coreRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + 0.07 * Math.sin(t * 1.4 + position[0] * 0.5);
    coreRef.current.scale.setScalar(pulse);
  });

  if (!isVisible) return null;

  return (
    <group position={position}>
      {/* Core sphere */}
      <mesh ref={coreRef} onClick={onClick}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 4 : 2}
          roughness={0.15}
          metalness={0.7}
        />
      </mesh>

      {/* Soft outer halo */}
      <mesh>
        <sphereGeometry args={[radius * 1.55, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* HTML label */}
      <Html
        center
        distanceFactor={12}
        zIndexRange={[1, 5]}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <span
          style={{
            display: "block",
            whiteSpace: "nowrap",
            fontSize: "13px",
            fontWeight: 700,
            color: "#ffffff",
            textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
            marginTop: "4px",
            letterSpacing: "0.04em",
          }}
        >
          {orgId}
        </span>
      </Html>
    </group>
  );
}

// ─── RepoNode ─────────────────────────────────────────────────────────────────

type RepoNodeProps = {
  repo: GitHubRepository;
  position: Vec3;
  isSelected: boolean;
  onPointerOver: (repo: GitHubRepository) => void;
  onPointerOut: () => void;
  onClick: (repo: GitHubRepository) => void;
};

function RepoNode({
  repo,
  position,
  isSelected,
  onPointerOver,
  onPointerOut,
  onClick,
}: RepoNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = getLanguageColor(repo.language);
  const baseRadius = getRepoNodeRadius(repo.stargazers_count);
  const radius = isSelected ? baseRadius * 1.6 : baseRadius;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.4;
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(repo);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onPointerOver(repo);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onPointerOut();
        }}
      >
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 3.5 : 1.2}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

// ─── OrgToRepoLines ───────────────────────────────────────────────────────────

type OrgToRepoLinesProps = {
  orgPos: Vec3;
  repoPositions: Vec3[];
  color: string;
};

function OrgToRepoLines({ orgPos, repoPositions, color }: OrgToRepoLinesProps) {
  const geometry = useMemo(() => {
    const vertices: number[] = [];
    for (const rp of repoPositions) {
      vertices.push(orgPos[0], orgPos[1], orgPos[2], rp[0], rp[1], rp[2]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    return geo;
  }, [orgPos, repoPositions]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={0.18} />
    </lineSegments>
  );
}

// ─── Inner scene ──────────────────────────────────────────────────────────────

type InnerSceneProps = {
  scopes: GitHubScope[];
  level: ConstellationLevel;
  selectedScopeId: string | null;
  selectedRepo: GitHubRepository | null;
  cameraTarget: CameraTarget;
  repoPositions: Vec3[];
  yaw: number;
  pitch: number;
  zoom: number;
  onOrgClick: (scopeId: string) => void;
  onRepoClick: (repo: GitHubRepository) => void;
  onRepoHoverIn: (repo: GitHubRepository) => void;
  onRepoHoverOut: () => void;
};

function InnerScene({
  scopes,
  level,
  selectedScopeId,
  selectedRepo,
  cameraTarget,
  repoPositions,
  yaw,
  pitch,
  zoom,
  onOrgClick,
  onRepoClick,
  onRepoHoverIn,
  onRepoHoverOut,
}: InnerSceneProps) {
  const activeScope = scopes.find((s) => s.id === selectedScopeId) ?? null;
  const activeOrgPos = selectedScopeId ? getOrgPosition(selectedScopeId) : [0, 0, 0] as Vec3;
  const activeColor = selectedScopeId ? getOrgColor(selectedScopeId) : "#7c9cff";

  return (
    <>
      <color attach="background" args={["#05080f"]} />
      <ambientLight intensity={0.25} color="#1a2040" />
      <pointLight position={[0, 0, 8]} intensity={0.6} color="#7c9cff" />
      <pointLight position={[0, 10, -5]} intensity={0.3} color="#c084fc" />

      <Stars radius={90} depth={50} count={4000} factor={4} fade speed={0.2} />
      <FloatingParticles />

      <CameraRig
        targetPosition={cameraTarget.position}
        targetLookAt={cameraTarget.lookAt}
        yaw={yaw}
        pitch={pitch}
        zoom={zoom}
      />

      {/* Org nodes */}
      {scopes.map((scope) => (
        <OrgNode
          key={scope.id}
          orgId={scope.id}
          position={getOrgPosition(scope.id)}
          color={getOrgColor(scope.id)}
          isVisible={level === "galaxy" || scope.id === selectedScopeId}
          isSelected={scope.id === selectedScopeId}
          onClick={() => onOrgClick(scope.id)}
        />
      ))}

      {/* Cluster view: lines + repo nodes */}
      {level === "cluster" && activeScope && (
        <>
          <OrgToRepoLines
            orgPos={activeOrgPos}
            repoPositions={repoPositions}
            color={activeColor}
          />
          {activeScope.repositories.map((repo, i) => (
            <RepoNode
              key={repo.id}
              repo={repo}
              position={repoPositions[i] ?? [0, 0, 0]}
              isSelected={selectedRepo?.id === repo.id}
              onClick={onRepoClick}
              onPointerOver={onRepoHoverIn}
              onPointerOut={onRepoHoverOut}
            />
          ))}
        </>
      )}

      <EffectComposer>
        <Bloom
          intensity={1.8}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ─── Repo info card (HTML overlay) ────────────────────────────────────────────

type RepoInfoCardProps = {
  repo: GitHubRepository;
  onClose: () => void;
};

function RepoInfoCard({ repo, onClose }: RepoInfoCardProps) {
  const color = getLanguageColor(repo.language);
  const updatedDate = new Date(repo.updated_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="absolute bottom-4 left-4 sm:left-auto sm:right-4 right-4 sm:w-80 z-20 rounded-2xl border border-border bg-background/90 backdrop-blur-md p-4 shadow-xl"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 text-text-muted hover:text-text-primary transition-colors text-base leading-none"
      >
        ✕
      </button>

      <div className="flex items-start gap-3 pr-6">
        <span
          className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: color }}
          aria-hidden
        />
        <div className="min-w-0">
          <h4 className="truncate font-semibold text-text-primary">{repo.name}</h4>
          {repo.description && (
            <p className="mt-1 text-sm text-text-muted line-clamp-2">{repo.description}</p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
        {repo.language && (
          <span
            className="rounded-full px-2 py-0.5"
            style={{ background: `${color}22`, color }}
          >
            {repo.language}
          </span>
        )}
        <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
        <span className="text-text-muted">Updated {updatedDate}</span>
      </div>

      <a
        href={`https://github.com/${repo.full_name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        View on GitHub
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </svg>
      </a>
    </div>
  );
}

// ─── Main exported component ───────────────────────────────────────────────────

type GitHubStoreState = {
  github: GitHubState;
};

export function ConstellationScene() {
  const scopes = useSelector((state: GitHubStoreState) => selectSortedScopes(state));

  const [level, setLevel] = useState<ConstellationLevel>("galaxy");
  const [selectedScopeId, setSelectedScopeId] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepository | null>(null);
  const [hoveredRepo, setHoveredRepo] = useState<GitHubRepository | null>(null);

  // Interaction state — drag rotation + scroll zoom
  const [yaw,   setYaw]   = useState(0);
  const [pitch, setPitch] = useState(0);
  const [zoom,  setZoom]  = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<{ active: boolean; lastX: number; lastY: number; wasDrag: boolean }>({
    active: false, lastX: 0, lastY: 0, wasDrag: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY, wasDrag: false };
    setIsDragging(true);
    // Do NOT call setPointerCapture — that steals events from the Canvas/Three.js
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;

    // Mark as drag after 4 px of movement
    if (Math.abs(dx) + Math.abs(dy) > 1) {
      dragRef.current.wasDrag = true;
    }

    setYaw((prev) =>
      Math.max(-MAX_YAW, Math.min(MAX_YAW, prev - dx * 0.004))
    );
    setPitch((prev) =>
      Math.max(-MAX_PITCH, Math.min(MAX_PITCH, prev + dy * 0.003))
    );
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current.active = false;
    setIsDragging(false);
    // reset wasDrag after a brief delay so click handlers can read it
    setTimeout(() => { dragRef.current.wasDrag = false; }, 50);
  }, []);

  // Passive-safe wheel handler — attach imperatively so we can call preventDefault
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((prev) =>
        Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev - e.deltaY * 0.001))
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const cameraTarget = useMemo<CameraTarget>(() => {
    if (level === "cluster" && selectedScopeId) {
      return getClusterCamera(selectedScopeId);
    }
    return GALAXY_CAMERA;
  }, [level, selectedScopeId]);

  const repoPositions = useMemo<Vec3[]>(() => {
    if (!selectedScopeId) return [];
    const scope = scopes.find((s) => s.id === selectedScopeId);
    if (!scope) return [];
    return computeRepoPositions(getOrgPosition(selectedScopeId), scope.repositories.length);
  }, [scopes, selectedScopeId]);

  const handleOrgClick = useCallback((scopeId: string) => {
    if (dragRef.current.wasDrag) return;
    setSelectedScopeId(scopeId);
    setLevel("cluster");
    setSelectedRepo(null);
    setHoveredRepo(null);
    // Reset interaction when navigating into a cluster
    setYaw(0);
    setPitch(0);
    setZoom(1);
  }, []);

  const handleRepoClick = useCallback((repo: GitHubRepository) => {
    if (dragRef.current.wasDrag) return;
    setSelectedRepo((prev) => (prev?.id === repo.id ? null : repo));
    setHoveredRepo(null);
  }, []);

  const handleZoomOut = useCallback(() => {
    setLevel("galaxy");
    setSelectedScopeId(null);
    setSelectedRepo(null);
    setHoveredRepo(null);
    setYaw(0);
    setPitch(0);
    setZoom(1);
  }, []);

  const handleResetCamera = useCallback(() => {
    setYaw(0);
    setPitch(0);
    setZoom(1);
  }, []);

  const displayedRepo = selectedRepo ?? hoveredRepo;

  return (
    <div className="flex min-w-0 flex-col rounded-3xl border border-border bg-surface shadow-sm overflow-hidden" style={{ height: "600px" }}>
      {/* Card header */}
      <div className="flex items-start justify-between gap-4 px-5 py-6 sm:px-6 sm:py-7 flex-shrink-0">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-text-primary">
            Constellation World
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Explore organizations and repositories in a 3D interactive space.
          </p>
        </div>
      </div>

      {/* Canvas area — fills all remaining height, no empty space below */}
      <div
        ref={containerRef}
        className="relative flex-1"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Breadcrumb nav */}
        <div className="absolute top-3 left-4 z-10 flex items-center gap-1.5 text-sm font-medium pointer-events-none">
          <button
            onClick={handleZoomOut}
            className={
              level === "galaxy"
                ? "text-text-primary pointer-events-auto"
                : "text-text-secondary hover:text-text-primary transition-colors pointer-events-auto"
            }
          >
            Galaxy
          </button>
          {level === "cluster" && selectedScopeId && (
            <>
              <span className="text-text-muted">/</span>
              <span
                className="font-semibold"
                style={{ color: getOrgColor(selectedScopeId) }}
              >
                {selectedScopeId}
              </span>
            </>
          )}
        </div>

        {/* Top-right controls */}
        <div className="absolute top-3 right-4 z-10 flex items-center gap-2">
          {/* Reset camera */}
          <button
            onClick={handleResetCamera}
            title="Reset camera"
            className="rounded-full border border-border bg-background/70 backdrop-blur-sm px-3 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            ⟳ Reset
          </button>

          {/* Zoom out (cluster only) */}
          {level === "cluster" && (
            <button
              onClick={handleZoomOut}
              className="rounded-full border border-border bg-background/70 backdrop-blur-sm px-3 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              ← Back
            </button>
          )}
        </div>

        {/* Hint text */}
        {level === "galaxy" && (
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-xs text-text-muted pointer-events-none">
            Click an organization to explore its repositories
          </p>
        )}
        {level === "cluster" && !displayedRepo && (
          <p className="absolute bottom-4 left-4 z-10 text-xs text-text-muted pointer-events-none">
            Click a repository for details
          </p>
        )}

        {/* Drag hint */}
        <p className="absolute bottom-4 right-4 z-10 text-xs text-text-muted pointer-events-none select-none">
          Drag to rotate · Scroll to zoom
        </p>

        {/* Repo info overlay — floats over the canvas */}
        {displayedRepo && (
          <RepoInfoCard
            repo={displayedRepo}
            onClose={() => {
              setSelectedRepo(null);
              setHoveredRepo(null);
            }}
          />
        )}

        <Canvas
          camera={{ position: [0, 0, 24], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: "low-power" }}
          className="h-full w-full"
          style={{ display: "block" }}
        >
          <InnerScene
            scopes={scopes}
            level={level}
            selectedScopeId={selectedScopeId}
            selectedRepo={selectedRepo}
            cameraTarget={cameraTarget}
            repoPositions={repoPositions}
            yaw={yaw}
            pitch={pitch}
            zoom={zoom}
            onOrgClick={handleOrgClick}
            onRepoClick={handleRepoClick}
            onRepoHoverIn={setHoveredRepo}
            onRepoHoverOut={() => setHoveredRepo(null)}
          />
        </Canvas>
      </div>
    </div>
  );
}
