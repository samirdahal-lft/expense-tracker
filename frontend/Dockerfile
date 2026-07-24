FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
# @robusgauli/proto is a prototyping-only dev tool from a private GitHub registry
# (needs GITHUB_TOKEN) and is NOT imported by the production bundle — the app uses
# the local src/components/proto-vocab/* instead. Drop it so the image builds
# without a token; this also removes the excalidraw React-19 peer conflict, so a
# plain public-registry install resolves cleanly.
RUN npm pkg delete devDependencies.@robusgauli/proto \
 && npm install --legacy-peer-deps --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
