import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: [
            "res.cloudinary.com",
            "images.unsplash.com",
            "cdn.pixabay.com",
            "pin.it",
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
