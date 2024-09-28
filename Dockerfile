FROM node:20
WORKDIR /app
COPY . .
RUN npm install
# RUN npm run build
EXPOSE 5000

CMD ["node","app.js"];