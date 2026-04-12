/**
 * Builds fragment shader injection block.
 *
 * We keep this as a pure function so:
 * - it's testable
 * - it's reusable
 * - avoids cluttering React component
 */
export function buildGradientFragmentShader(params: {
  colorA: string;
  colorB: string;
  colorC: string;
  energy: string;
  flowSpeed: number;
  flowIntensity: number;
}) {
  const { colorA, colorB, colorC, energy, flowSpeed, flowIntensity } = params;

  return `#include <color_fragment>

// --- Gradient ---
float t = clamp((vGradientY + 1.3) / 2.6, 0.0, 1.0);

vec3 colorA = ${colorA};
vec3 colorB = ${colorB};
vec3 colorC = ${colorC};

vec3 gradientColor = t < 0.5
  ? mix(colorA, colorB, t * 2.0)
  : mix(colorB, colorC, (t - 0.5) * 2.0);

// --- Flow ---
float time = uTime * ${flowSpeed.toFixed(2)};

float wave1 = sin(vLocalPos.x * 4.0 + vLocalPos.y * 2.0 + time * 1.2);
float wave2 = sin(vLocalPos.y * 3.0 - vLocalPos.z * 2.0 - time * 0.9);
float wave3 = cos(vLocalPos.z * 5.0 + vLocalPos.x * 1.5 + time * 1.6);

float flow = (wave1 + wave2 + wave3) / 3.0;

float flowMask = smoothstep(0.4, 1.0, flow);

vec3 energyColor = ${energy};

diffuseColor.rgb = mix(
  gradientColor,
  energyColor,
  flowMask * ${flowIntensity.toFixed(2)} * 0.45
);
`;
}