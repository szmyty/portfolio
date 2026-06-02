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
  images: {
    remotePatterns: [
      // SoundCloud artwork CDN (various numeric subdomains: i1, i2, i3, i4…)
      { protocol: "https", hostname: "i1.sndcdn.com" },
      { protocol: "https", hostname: "i2.sndcdn.com" },
      { protocol: "https", hostname: "i3.sndcdn.com" },
      { protocol: "https", hostname: "i4.sndcdn.com" },
      // Medium article thumbnail CDNs
      { protocol: "https", hostname: "miro.medium.com" },
      { protocol: "https", hostname: "cdn-images-1.medium.com" },
    ],
  },
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
