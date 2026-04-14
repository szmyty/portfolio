vInfinityUv = uv;
vInfinityLocalPos = position;
vInfinityWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
vInfinityWorldNormal = normalize(mat3(modelMatrix) * normal);
