# استخدام نسخة Node.js مستقرة
FROM node:20-slim

# إنشاء مجلد العمل
WORKDIR /app

# نسخ ملف التعريف
COPY package.json .

# تثبيت المكتبات (سيقوم السيرفر بإنشاء الـ lockfile بنفسه هنا)
RUN npm install

# نسخ بقية الكود
COPY . .

# فتح المنفذ المطلوبة
EXPOSE 8080

# تشغيل الكود
CMD ["node", "index.js"]
