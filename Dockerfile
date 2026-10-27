FROM node:24-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
COPY scripts/copy-onnx.mjs ./scripts/copy-onnx.mjs
COPY third-party/onnxruntime ./third-party/onnxruntime
RUN ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm ci
COPY . .
ARG NEXT_PUBLIC_SITE_URL=https://mydevtools.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM node:24-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1001 app && useradd --system --uid 1001 --gid app app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
COPY --from=build --chown=app:app /app/desktop/privacy.cjs ./desktop/privacy.cjs
COPY --from=build --chown=app:app /app/scripts/preload-privacy.cjs ./scripts/preload-privacy.cjs
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s CMD node -e "fetch('http://127.0.0.1:3000/manifest.webmanifest').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "--require", "./scripts/preload-privacy.cjs", "server.js"]
