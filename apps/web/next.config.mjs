/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    transpilePackages: ["@repo/ui"],
    env: {
        MONGODB_URI: process.env.MONGODB_URI,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        DO_SPACES_CDN_ENDPOINT: process.env.DO_SPACES_CDN_ENDPOINT,
        DO_SPACES_BUCKET: process.env.DO_SPACES_BUCKET,
        DO_SPACES_ENDPOINT: process.env.DO_SPACES_ENDPOINT,
        DO_SPACES_KEY: process.env.DO_SPACES_KEY,
        DO_SPACES_REGION: process.env.DO_SPACES_REGION,
        DO_SPACES_SECRET: process.env.DO_SPACES_SECRET,
        GMAIL_SENDER_EMAIL: process.env.GMAIL_SENDER_EMAIL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_SECRET: process.env.JWT_SECRET,
        MEDFLOW_KEY: process.env.MEDFLOW_KEY,
        MEDFLOW_SENDGRID_KEY: process.env.MEDFLOW_SENDGRID_KEY,
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
        NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL,
    },
    images: {
        unoptimized: true,  // Bypass Next.js image optimization
        domains: [
            'lh3.googleusercontent.com',
            'localhost',
            'medflow-telegram.fra1.digitaloceanspaces.com',
            'fra1.digitaloceanspaces.com',
            'medflow-telegram.fra1.cdn.digitaloceanspaces.com',
            'medflow.cloud',
            'www.medflow.cloud',
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'medflow-telegram.fra1.digitaloceanspaces.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'medflow-telegram.fra1.cdn.digitaloceanspaces.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'fra1.digitaloceanspaces.com',
                port: '',
                pathname: '/medflow-telegram/**',
            },
            {
                protocol: 'https',
                hostname: 'medflow-mena-health.vercel.app',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'medflow.cloud',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.medflow.cloud',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'stage.medflow.cloud',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.stage.medflow.cloud',
                port: '',
                pathname: '/**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/assets/images/mena_health_logo.jpeg',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                ],
            },
            {
                source: '/:path*.(ttf|woff|woff2|eot|otf)',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type',
                    },
                ],
            },
            {
                source: '/:path*.ogg',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type',
                    },
                ],
            },
            {
                source: '/api/telegram-bot/get-media',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type',
                    },
                ],
            },
        ];
    },
    webpack(config) {
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        };

        config.module.rules.push({
            test: /\.ttf$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        publicPath: '/_next/static/chunks',
                        outputPath: 'static/fonts',
                        name: '[name].[hash].[ext]',
                        emitFile: false,
                    },
                },
            ],
        });

        return config;
    },
};

export default nextConfig;

