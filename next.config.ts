import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    domains: ["cdn.thesimpsonsapi.com"],
  },
  typescript: {
    ignoreBuildErrors: true,      
  } ,
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
