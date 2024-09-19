await import("./src/env.js");
import pwa from "next-pwa";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = pwa({
  dest: 'public',
});

export default withPWA({
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  transpilePackages: ["geist"],
});