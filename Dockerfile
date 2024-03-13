# Sử dụng image node:alpine để build ứng dụng React
FROM node:alpine as build

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json vào thư mục /app
COPY package*.json ./

# Install các dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào thư mục /app
COPY . .

# Build ứng dụng React
RUN npm run build

# Sử dụng image nginx để serve ứng dụng build
FROM nginx:alpine

# Copy các file từ builder stage (build) vào thư mục của nginx
COPY --from=build /app/build /usr/share/nginx/html

# Mở cổng 8081
EXPOSE 8081

# Khởi động nginx
CMD ["nginx", "-g", "daemon off;"]
