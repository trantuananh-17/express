# Hướng dẫn khởi tạo dự án Node.js + TypeScript + Express

npm init : Phải tự nhập thông tin  
npm init -y : Tự động điền thông tin  
npm i || npm install + tên package : Cài đặt thư viện

- typescript + ts-node (chạy chương trình)
- @types/node : Thư viện kiểu dữ liệu cho Node.js
- Cài express: npm i express @types/express

Môi trường trong package.json:

- dependencies và devDependencies

- npx tsc --init : Tạo file tsconfig.json – là file chứa cấu hình của TypeScript:

* target: es2016 : Phiên bản → đổi sang 2022
* module: commonjs : Kiểu module → cú pháp import/export
* strict : Chế độ kiểm tra nghiêm ngặt → Báo tất cả lỗi trong quá trình code có thể xảy ra
* "esModuleInterop": true
* "skipLibCheck": true : Bỏ qua kiểu dữ liệu của thư viện
* "forceConsistentCasingInFileNames": true : Kiểm tra tính nhất quán tên file
* include : Cho phép những file nào
* exclude : Ngoại trừ file nào

# Câu lệnh chạy:

- npx ts-node src/index.ts
