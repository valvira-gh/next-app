FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN
# DEBUG-tulostus
# Install dependencies based on the preferred package manager
# If you are using pnpm, you can replace the command with `pnpm i`
# If you are using npm, you can replace the command with `npm ci`
# We need to check if the lockfile is available, because it's not required
# to be in the root of the project.
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

# DEBUG-tulostus
RUN echo "DEBUG: Dependencies installed"

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# DEBUG-tulostus
RUN echo "DEBUG: Source code copied"

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build && ls -l /app/.next

# DEBUG-tulostus
RUN echo "DEBUG: Application built"

# ...
