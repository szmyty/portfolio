import type { Meta, StoryObj } from "@storybook/nextjs";
import { Canvas } from "@react-three/fiber";
import { ThemeProvider } from "@portfolio/lib/theme";
import { FloppyDisk } from "./FloppyDisk";

const meta: Meta = {
  title: "Three/FloppyDisk",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Interactive 3D floppy disk object backed by an OBJ model. Supports hover and drag interaction with theme-aware translucent materials.",
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: "400px", height: "400px" }}>
          <Canvas
            camera={{ position: [0, 0.1, 5], fov: 28 }}
            style={{ width: "100%", height: "100%" }}
            dpr={[1, 1.25]}
            gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
          >
            <ambientLight intensity={0.7} />
            <directionalLight
              position={[4, 5, 4]}
              intensity={1.25}
              color="#ffffff"
            />
            <directionalLight
              position={[-3, -2, -4]}
              intensity={0.4}
              color="#f0d8ff"
            />
            <directionalLight
              position={[0, 2, -5]}
              intensity={0.42}
              color="#ffd5ea"
            />
            <Story />
          </Canvas>
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default interactive floppy disk.
 *
 * - **Idle**: disk rests at a slight tilt defined by BASE_ROTATION_X / BASE_ROTATION_Y.
 * - **Hover**: emissive sheen brightens; cursor changes to `grab`.
 * - **Long-press (250 ms)**: enters engaged state; cursor becomes `grabbing`.
 * - **Drag**: rotates the disk with live emissive feedback.
 * - **Release**: inertia coast decays back to idle.
 */
export const Default: Story = {
  render: () => <FloppyDisk />,
};
