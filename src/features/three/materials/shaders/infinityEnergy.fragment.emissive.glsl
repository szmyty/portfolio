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

vec3 softBlue = vec3(0.30, 0.72, 1.0);
vec3 pink = vec3(0.98, 0.48, 1.0);
vec3 cyan = vec3(0.56, 1.0, 1.0);
vec3 whiteHot = vec3(1.0, 1.0, 1.0);

vec3 plasma = mix(softBlue, pink, smoothstep(0.2, 0.9, emissiveLoop));
vec3 hotBand = mix(cyan, whiteHot, emissiveHotspots);

float glowAmount =
  0.28 +
  emissiveCore * 0.22 +
  emissiveLoop * 0.4 +
  emissiveFresnel * 0.75 +
  crossoverEnergy * 0.2;

totalEmissiveRadiance += plasma * glowAmount;
totalEmissiveRadiance += hotBand * emissiveHotspots * (0.65 + emissiveLoop * 0.35);
totalEmissiveRadiance += whiteHot * emissiveFresnel * 0.18;
totalEmissiveRadiance *= 1.0 + hoverBoost * 0.45;
