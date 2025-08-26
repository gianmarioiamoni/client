/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        // Enable Server Components
        serverComponentsExternalPackages: []
    },

    // Environment variables that should be available to the client
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
        NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000',
    },

    // Image domains (if you plan to use external images)
    images: {
        domains: ['localhost'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },

    // Webpack configuration for better performance
    webpack: (config, { dev, isServer }) => {
        // Optimize bundle size
        if (!dev && !isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    default: false,
                    vendors: false,
                    // Bundle socket.io separately
                    socket: {
                        name: 'socket',
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/](socket\.io|engine\.io)/,
                    },
                    // Bundle UI libraries separately
                    ui: {
                        name: 'ui',
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|class-variance-authority)/,
                    },
                    // Bundle state management separately
                    state: {
                        name: 'state',
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/](zustand)/,
                    },
                    // Bundle drag and drop separately
                    dnd: {
                        name: 'dnd',
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/](@dnd-kit|react-dnd)/,
                    },
                },
            };
        }

        return config;
    },

    // Enable PWA features (optional)
    // You can add PWA configuration here if needed

    // TypeScript configuration
    typescript: {
        // Fail build on type errors in production
        ignoreBuildErrors: false,
    },

    // ESLint configuration
    eslint: {
        // Fail build on ESLint errors in production
        ignoreDuringBuilds: false,
    },

    // Experimental features
    experimental: {
        // Enable app directory
        appDir: true,
        // Enable Server Actions
        serverActions: true,
        // Optimize font loading
        optimizeFonts: true,
    },

    // Security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
