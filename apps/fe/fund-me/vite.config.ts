import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
    root: resolve(__dirname),
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
        fallback: {
            "os": require.resolve("os-browserify/browser"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "assert": require.resolve("assert"),
            "https": require.resolve("https-browserify"),
            "http": require.resolve("stream-http"),
            "zlib": require.resolve("browserify-zlib"),
            "buffer": require.resolve("buffer"),
            "util": require.resolve("util"),
            "url": require.resolve("url")
        },
    },
    define: {
        global: 'window',
        'process.env': {},
    },
    build: {
        outDir: resolve(__dirname, '../../../dist/apps/fe/fund-me'),
    },
    server: {
        port: 4200,
        watch: {
            usePolling: true,
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true
                })
            ]
        }
    }
});
