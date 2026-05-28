import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TechMintLab - Premium Software Marketplace",
    short_name: "TechMintLab",
    description: "Premium software marketplace and digital product platform. Build Faster. Scale Smarter.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10b981",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
