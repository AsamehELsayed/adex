/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // Exclude database-related packages from server-side bundle (Next.js 16)
  serverExternalPackages: [
    'sequelize',
    'mysql2',
    'pg',
    'pg-hstore',
    'tedious',
    'sqlite3',
    'better-sqlite3',
    'ibm_db',
    'oracledb',
  ],
  // Use webpack explicitly to avoid Turbopack conflicts
  // You can also run with: npm run dev -- --webpack
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark database modules as external on server
      config.externals = config.externals || [];
      config.externals.push({
        'pg': 'commonjs pg',
        'pg-hstore': 'commonjs pg-hstore',
        'tedious': 'commonjs tedious',
        'sqlite3': 'commonjs sqlite3',
        'better-sqlite3': 'commonjs better-sqlite3',
        'ibm_db': 'commonjs ibm_db',
        'oracledb': 'commonjs oracledb',
      });
    } else {
      // Client-side: these should not be bundled
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'pg': false,
        'pg-hstore': false,
        'tedious': false,
        'sqlite3': false,
        'better-sqlite3': false,
        'ibm_db': false,
        'oracledb': false,
        'sequelize': false,
        'mysql2': false,
      };
    }
    return config;
  },
  // Empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;
