import type { Meta, StoryObj } from "@storybook/nextjs";
import { Canvas } from "@react-three/fiber";
import { VinylRecord } from "./VinylRecord";
import { VinylRecordMaterial } from "@portfolio/features/three/materials";

type VinylRecordStoryArgs = {
  rotation: boolean;
  material: "vinyl";
};

const meta: Meta<VinylRecordStoryArgs> = {
  title: "Three/VinylRecord",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Interactive 3D vinyl record with turntable idle spin, hold-to-engage drag rotation, inertia coast, and scroll-safe pointer handling. Accepts pluggable GeometryComponent and MaterialComponent for extensibility.",
      },
    },
  },
  argTypes: {
    rotation: {
      control: "boolean",
      description: "Enable idle turntable spin and drag rotation.",
    },
    material: {
      control: { type: "select" },
      options: ["vinyl"],
      description: "Material applied to the disc geometry.",
    },
  },
  args: {
    rotation: true,
    material: "vinyl",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px", height: "400px" }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 40 }}
          style={{ width: "100%", height: "100%" }}
          gl={{ alpha: true }}
        >
          <ambientLight intensity={0.5} />
          {/* Key light — upper-left-front, produces highlight arc on vinyl */}
          <directionalLight position={[3, 5, 4]} intensity={1.6} />
          {/* Fill light — lower-right-back */}
          <directionalLight position={[-3, -2, -3]} intensity={0.4} />
          {/* Rim light — traces the thin disc edge */}
          <directionalLight
            position={[4, 3, -5]}
            intensity={0.5}
            color="#c8c0dc"
          />
          <Story />
        </Canvas>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

function VinylRecordWithArgs({ rotation }: VinylRecordStoryArgs) {
  return (
    <VinylRecord
      MaterialComponent={VinylRecordMaterial}
      effects={{ rotation }}
    />
  );
}

/**
 * Default interactive vinyl record.
 *
 * - **Idle**: disc spins continuously on its Z axis (turntable effect).
 * - **Hover**: slight emissive sheen brightens; cursor changes to `grab`.
 * - **Long-press (250 ms)**: enters engaged state; cursor becomes `grabbing`.
 * - **Drag**: tilts the disc on X / Y axes with live emissive feedback.
 * - **Release**: inertia coast decays and idle spin resumes.
 * - **Scroll safety**: scroll events pass through unless the hold threshold is met.
 */
export const Default: Story = {
  render: (args) => <VinylRecordWithArgs {...args} />,
};

/**
 * Static vinyl record with rotation disabled.
 * Useful for previewing the geometry and material without motion.
 */
export const StaticPose: Story = {
  args: { rotation: false },
  render: (args) => <VinylRecordWithArgs {...args} />,
};

