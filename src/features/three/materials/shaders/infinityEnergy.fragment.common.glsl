uniform float uTime;

varying vec2 vInfinityUv;
varying vec3 vInfinityLocalPos;
varying vec3 vInfinityWorldPos;
varying vec3 vInfinityWorldNormal;

float saturateFloat(float value) {
  return clamp(value, 0.0, 1.0);
}
