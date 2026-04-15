export const infinityEnergyVertexCommon = `
varying vec2 vInfinityUv;
varying vec3 vInfinityLocalPos;
varying vec3 vInfinityWorldPos;
varying vec3 vInfinityWorldNormal;
`;

export const infinityEnergyVertexBegin = `
vInfinityUv = uv;
vInfinityLocalPos = position;
vInfinityWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
vInfinityWorldNormal = normalize(mat3(modelMatrix) * normal);
`;

export const infinityEnergyFragmentCommon = `
uniform float uTime;

varying vec2 vInfinityUv;
varying vec3 vInfinityLocalPos;
varying vec3 vInfinityWorldPos;
varying vec3 vInfinityWorldNormal;

float saturateFloat(float value) {
  return clamp(value, 0.0, 1.0);
}
`;

export const infinityEnergyFragmentColor = `
#include <color_fragment>

float pathCoord = vInfinityUv.x;
float tubeCoord = abs(vInfinityUv.y * 2.0 - 1.0);
float tubeCore = 1.0 - tubeCoord;

float loopPhase = sin(pathCoord * 6.28318530718);
float loopGlow = pow(abs(loopPhase), 1.4);
float crossoverGlow = exp(-5.0 * dot(vInfinityLocalPos, vInfinityLocalPos));
vec3 viewDir = normalize(cameraPosition - vInfinityWorldPos);
float fresnel = pow(
  1.0 - saturateFloat(dot(normalize(vInfinityWorldNormal), viewDir)),
  2.6
);

float spectralBand =
  0.5 +
  0.5 *
    sin(
      pathCoord * 15.0 -
      uTime * 0.9 +
      vInfinityLocalPos.y * 1.8 +
      vInfinityLocalPos.z * 5.0
    );

float energyStream =
  0.5 +
  0.5 *
    sin(
      pathCoord * 28.0 -
      uTime * 2.2 +
      vInfinityLocalPos.x * 1.5 -
      vInfinityLocalPos.y * 2.4
    );

vec3 deepBlue = vec3(0.05, 0.08, 0.28);
vec3 electricBlue = vec3(0.16, 0.43, 1.0);
vec3 violet = vec3(0.39, 0.18, 0.88);
vec3 pink = vec3(0.96, 0.46, 1.0);
vec3 cyan = vec3(0.50, 0.98, 1.0);
vec3 whiteHot = vec3(0.96, 0.99, 1.0);

vec3 bodyColor = mix(deepBlue, violet, smoothstep(0.18, 0.82, loopGlow));
bodyColor = mix(bodyColor, electricBlue, tubeCore * 0.35 + spectralBand * 0.15);
bodyColor = mix(bodyColor, pink, smoothstep(0.6, 1.0, loopGlow) * 0.35);

vec3 rimColor = mix(cyan, pink, spectralBand);
vec3 streamColor = mix(electricBlue, whiteHot, smoothstep(0.74, 1.0, energyStream));

float rimMix = saturateFloat(fresnel * 0.95 + tubeCore * 0.18);
float streamMix = smoothstep(0.76, 0.98, energyStream) * (0.25 + 0.75 * loopGlow);

vec3 composed = mix(bodyColor, rimColor, rimMix);
composed = mix(composed, streamColor, streamMix);
composed += whiteHot * crossoverGlow * 0.18;

diffuseColor.rgb = composed;
`;

export const infinityEnergyFragmentEmissive = `
#include <emissivemap_fragment>

float emissivePath = vInfinityUv.x;
float emissiveTube = abs(vInfinityUv.y * 2.0 - 1.0);
float emissiveCore = 1.0 - emissiveTube;
vec3 emissiveViewDir = normalize(cameraPosition - vInfinityWorldPos);

float emissiveLoop = pow(abs(sin(emissivePath * 6.28318530718)), 1.25);
float emissiveFresnel = pow(
  1.0 - saturateFloat(dot(normalize(vInfinityWorldNormal), emissiveViewDir)),
  2.1
);
float emissiveFlow =
  0.5 +
  0.5 *
    sin(
      emissivePath * 32.0 -
      uTime * 3.1 +
      vInfinityLocalPos.y * 2.4 -
      vInfinityLocalPos.z * 7.0
    );
float emissiveHotspots = smoothstep(0.84, 0.98, emissiveFlow);
float crossoverEnergy = exp(-3.8 * dot(vInfinityLocalPos, vInfinityLocalPos));
float hoverBoost = clamp(length(emissive), 0.0, 1.8);

vec3 emissiveSoftBlue = vec3(0.30, 0.72, 1.0);
vec3 emissivePink = vec3(0.98, 0.48, 1.0);
vec3 emissiveCyan = vec3(0.56, 1.0, 1.0);
vec3 emissiveWhiteHot = vec3(1.0, 1.0, 1.0);

vec3 plasma = mix(
  emissiveSoftBlue,
  emissivePink,
  smoothstep(0.2, 0.9, emissiveLoop)
);
vec3 hotBand = mix(emissiveCyan, emissiveWhiteHot, emissiveHotspots);

float glowAmount =
  0.28 +
  emissiveCore * 0.22 +
  emissiveLoop * 0.4 +
  emissiveFresnel * 0.75 +
  crossoverEnergy * 0.2;

totalEmissiveRadiance += plasma * glowAmount;
totalEmissiveRadiance += hotBand * emissiveHotspots * (0.65 + emissiveLoop * 0.35);
totalEmissiveRadiance += emissiveWhiteHot * emissiveFresnel * 0.18;
totalEmissiveRadiance *= 1.0 + hoverBoost * 0.45;
`;
