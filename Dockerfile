FROM --platform=$BUILDPLATFORM node:18.12-alpine3.16 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine
LABEL org.opencontainers.image.title="Topmast" \
    org.opencontainers.image.description="Topmast is an extension that simplifies the management of Docker logs and container statistics. Please note that this is an alpha version, offering early functionality with limited stability or incomplete features." \
    org.opencontainers.image.vendor="Topmast" \
    org.opencontainers.image.version="0.1.2-alpha" \
    com.docker.desktop.extension.api.version="0.3.3" \
    com.docker.extension.categories='["developer-tools", "logs"]' \
    com.docker.extension.changelog="https://github.com/oslabs-beta/Topmast/blob/dev/CHANGELOG.md" \
    com.docker.extension.screenshots='[{"url":"https://raw.githubusercontent.com/oslabs-beta/Topmast/dev/public/Topmast.png", "alt":"Screenshot of Topmast"}]' \
    com.docker.extension.detailed-description="Topmast simplifies the management of Docker logs and container statistics. This extension will provide a centralized platform for viewing and analyzing Docker logs, as well as tracking and monitoring container performance. With Topmast, developers utilizing Docker will be able to consolidate their Docker-related data in one place, enabling easier troubleshooting and analysis." \
    com.docker.extension.publisher-url="https://topmast.dev" \
    com.docker.extension.additional-urls='[{"title": "GitHub", "url": "https://github.com/oslabs-beta/Topmast"}, {"title": "Documentation", "url": "https://topmast.dev/documentation"}]' \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/oslabs-beta/Topmast/4406f7718b1c71af768cf47a474161ebcb3d2817/topmast_cruise.svg"

COPY docker-compose.yaml .
COPY metadata.json .
COPY docker.svg .
COPY topmast_cruise.png .
COPY --from=client-builder /ui/build ui
COPY topmast_cruise.svg .

CMD ["echo", "Topmast extension image is built."]
