/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        serverActions:true,
        serverComponentsExternalPackages:['mongoose'],
        esmExternals: 'loose',
    },
    images:{
        domains:['m.media-amazon.com']
    }
}

module.exports = nextConfig
