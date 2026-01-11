# استخدم image رسمي Node 20 LTS
FROM node:20-alpine AS builder

WORKDIR /app

# انسخ ملفات package
COPY package.json package-lock.json ./
# تثبيت dependencies
RUN npm install --legacy-peer-deps

# انسخ باقي المشروع
COPY . .

# build production
RUN npm run build

# المرحلة النهائية (slim image)
FROM node:20-alpine AS runner
WORKDIR /app

# انسخ فقط ملفات production
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# expose port
EXPOSE 3000

# CMD مضبوط مع npx
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
