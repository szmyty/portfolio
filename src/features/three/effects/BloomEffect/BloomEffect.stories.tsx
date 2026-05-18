import type { Meta, StoryObj } from "@storybook/nextjs";
import { Canvas } from "@react-three/fiber";
import { BloomEffect } from "./BloomEffect";

const meta: Meta<typeof BloomEffect> = {
  title: "Three/Effects/BloomEffect",
  component: BloomEffect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Post-processing bloom pass from @react-three/postprocessing. Adds a soft luminous glow around emissive surfaces. Must be rendered inside a React Three Fiber `<Canvas>`. Pass `enabled={false}` to skip the EffectComposer entirely.",
      },
    },
  },
  argTypes: {
    enabled: {
      control: "boolean",
      description: "Toggle the bloom post-processing effect on or off.",
    },
  },
  args: {
    enabled: true,
  },
};

export default meta;
type Story = StoryObj<typeof BloomEffect>;

function BloomScene({ enabled }: { enabled?: boolean }) {
  return (
    <div style={{ width: "400px", height: "300px" }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: false }}
      >
        <color attach="background" args={["#08080f"]} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[4, 6, 3]} intensity={1.0} />
        {/* Emissive sphere that blooms */}
        <mesh>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshStandardMaterial
            color="#5566ff"
            emissive="#3344ff"
            emissiveIntensity={2.0}
          />
        </mesh>
        <BloomEffect enabled={enabled} />
      </Canvas>
    </div>
  );
}

/**
 * Default bloom — the sphere's emissive surface creates a soft luminous halo.
 */
export const Default: Story = {
  render: (args) => <BloomScene enabled={args.enabled} />,
};

/**
 * Bloom disabled — same scene without the post-processing pass for comparison.
 */
export const Disabled: Story = {
  args: { enabled: false },
  render: (args) => <BloomScene enabled={args.enabled} />,
};
