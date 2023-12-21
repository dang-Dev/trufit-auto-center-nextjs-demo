/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_PATH: process.env.VERCEL_URL ? 'https://trufitautocenter.com' : 'http://localhost:3000',
        RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
        RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY
    },
    swcMinify: true
};

module.exports = nextConfig;
