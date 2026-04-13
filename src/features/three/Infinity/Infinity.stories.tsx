import type { Meta, StoryObj } from "@storybook/nextjs";
import { Canvas } from "@react-three/fiber";
import { Infinity } from "./Infinity";
import type { InfinityProps } from "./Infinity.types";
import { GradientMaterial, StandardMaterial } from "@portfolio/features/three/materials";

type InfinityStoryArgs = {
  glow: boolean;
  particles: boolean;
  rotation: boolean;
  material: "gradient" | "standard";
};

const meta: Meta<InfinityStoryArgs> = {
  title: "Three/Infinity",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    glow: {
      control: "boolean",
      description: "Enable bloom glow post-processing effect.",
    },
    particles: {
      control: "boolean",
      description: "Enable particle trail along the lemniscate path.",
    },
    rotation: {
      control: "boolean",
      description: "Enable idle auto-rotation animation.",
    },
    material: {
      control: { type: "select" },
      options: ["gradient", "standard"],
      description: "Material applied to the lemniscate geometry.",
    },
  },
  args: {
    glow: true,
    particles: true,
    rotation: true,
    material: "gradient",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "600px", height: "400px" }}>
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.25} />
          <directionalLight position={[4, 6, 3]} intensity={1.0} />
          <directionalLight position={[-4, -2, -3]} intensity={0.2} />
          <directionalLight
            position={[-3, 4, -5]}
            intensity={0.6}
            color="#818cf8"
          />
          <Story />
        </Canvas>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

function InfinityWithArgs({
  glow,
  particles,
  rotation,
  material,
}: InfinityStoryArgs) {
  const MaterialComponent: NonNullable<InfinityProps["MaterialComponent"]> =
    material === "standard"
      ? (StandardMaterial as NonNullable<InfinityProps["MaterialComponent"]>)
      : GradientMaterial;
  return (
    <Infinity
      MaterialComponent={MaterialComponent}
      effects={{ glow, particles, rotation }}
    />
  );
}

export const Default: Story = {
  render: (args) => <InfinityWithArgs {...args} />,
};

export const WithStandardMaterial: Story = {
  args: { material: "standard" },
  render: (args) => <InfinityWithArgs {...args} />,
};

export const NoEffects: Story = {
  args: { glow: false, particles: false, rotation: false },
  render: (args) => <InfinityWithArgs {...args} />,
};

export const StaticPose: Story = {
  args: { rotation: false },
  render: (args) => <InfinityWithArgs {...args} />,
};
