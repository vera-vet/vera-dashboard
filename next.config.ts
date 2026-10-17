import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // La app no usa next/image (las fotos son URLs arbitrarias y se muestran con <img>). Sin
    // optimizador, /_next/image responde 404 y el servidor nunca procesa imágenes ajenas:
    // menos superficie de ataque.
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
