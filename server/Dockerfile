FROM node:22-alpine
WORKDIR /app
COPY server/generate.mjs ./generate.mjs
ENV PORT=8080
ENV QUOTA_FILE=/data/duo-quota.json
ENV MAX_DAILY_GENERATIONS=10
EXPOSE 8080
CMD ["node", "generate.mjs"]
