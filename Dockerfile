FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN \
	if [ -f package-lock.json ]; then npm ci; \
	else echo "Lockfile not found." && exit 1; \
	fi


FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main"]
