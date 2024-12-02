import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Добавляем любые существующие конфигурационные параметры Next.js
  reactStrictMode: true,

  // Добавляем кастомную конфигурацию Webpack для интеграции SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            
            
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;

