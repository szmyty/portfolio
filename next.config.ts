import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
    "postprocessing",
  ],
  turbopack: {
    rules: {
      "*.glsl": {
        type: "raw",
      },
      "*.vert.glsl": {
        type: "raw",
      },
      "*.frag.glsl": {
        type: "raw",
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/i,
      type: "asset/source",
    });

    return config;
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
