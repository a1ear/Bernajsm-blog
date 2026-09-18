import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Covers both hosted Supabase (*.supabase.co) and a local `supabase
    // start` stack (localhost) so uploaded cover images, author photos and
    // newsletter thumbnails all resolve through next/image.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/storage/v1/object/public/**" },
      { protocol: "http", hostname: "localhost", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
