import type { NextConfig } from "next";

const contentSecurityPolicyHeaderValue = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000 ws://localhost:3000;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self' data:;
  connect-src 'self' http://localhost:3000 ws://localhost:3000;
  frame-src 'self' blob:;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  manifest-src 'self';
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  async headers() {
    // Retorna vazio no ambiente local para evitar bloqueios do Next.js Dev Server
    if (process.env.NODE_ENV === "development") {
      return [];
    }

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicyHeaderValue,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
