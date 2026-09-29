# Write Tool UI — Frontend Application

<p align="center">
   <img src="https://cdn.simpleicons.org/nextdotjs" width="90" alt="Next.js Logo" />
</p>

<p align="center">
  <strong>Giao diện web hiện đại, tối ưu trải nghiệm viết lách và biên soạn tài liệu/tiểu thuyết số (Write Tool).</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/TipTap-3.x-2D3748?logo=markdown&logoColor=white" alt="TipTap" />
</p>

---

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng chính](#tính-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Yêu cầu & Biến môi trường](#yêu-cầu--biến-môi-trường)
- [Cài đặt & Khởi chạy](#cài-đặt--khởi-chạy)
- [Các trang & Điều hướng](#các-trang--điều-hướng)
- [Kiến trúc Frontend & Luồng dữ liệu](#kiến-trúc-frontend--luồng-dữ-liệu)
  - [Cơ chế Offline-First & Tự động lưu](#cơ-chế-offline-first--tự-động-lưu)
  - [Xử lý API Token & Làm mới phiên](#xử-lý-api-token--làm-mới-phiên)
- [Giấy phép](#giấy-phép)

---

## Giới thiệu

**Write Tool UI** là ứng dụng giao diện web được xây dựng nhằm mang lại không gian viết tập trung, tối giản và mượt mà cho tác giả, tiểu thuyết gia và những người sáng tạo nội dung văn bản dài. Ứng dụng kết hợp chặt chẽ với dịch vụ backend [write-tool-api](../write-tool-api).

Được phát triển trên nền tảng **Next.js 16 (App Router)** và **React 19**, giao diện hướng tới trải nghiệm viết không gián đoạn nhờ tích hợp trình soạn thảo **TipTap**, cơ chế lưu đệm ngoại tuyến qua **IndexedDB**, khả năng nhập tệp Microsoft Word (`.docx`), cùng giao diện tùy biến giấy in độc đáo.

---

## Tính năng chính

### 1. Trình soạn thảo tập trung (TipTap Rich-text Editor)
- Trình soạn thảo rich-text hiện đại xây dựng trên nền tảng TipTap StarterKit (hỗ trợ heading, bold, italic, blockquote, danh sách, code block...).
- Tính toán thống kê theo thời gian thực: đếm số từ (word count) và ký tự (char count).
- Chế độ hiển thị không phân tâm (Distraction-free Canvas), tự động ẩn các thanh điều hướng khi người dùng bắt đầu nhập liệu.

### 2. Tùy biến Giấy & Kiểu chữ (Paper Modes & Typography)
- **Chế độ màu giấy chuyên dụng**:
  - Giấy ngà (Ivory Paper - `#F7F4EE`): Dịu mắt khi làm việc ban ngày.
  - Giấy mộc (Natural Paper - `#F1EAD9`): Mô phỏng trang sách in truyền thống.
  - Đêm than (Charcoal Night - `#161716`): Bảo vệ thị lực ban đêm, chống chói.
- **Tùy biến Typography**:
  - Phông chữ phong phú: Source Serif 4, Liberation Serif, Inter Sans-serif.
  - Cỡ chữ linh hoạt: 16px, 18px (tiêu chuẩn), 20px.
  - Chiều rộng vùng đọc/viết: 680px (gọn), 740px (chuẩn), 800px (rộng).

### 3. Lưu trữ ngoại tuyến & Tự động lưu (Offline-First Autosave)
- Tích hợp **IndexedDB** cục bộ (`idb`) độc lập với mạng: Bản nháp chương viết được tự động lưu ngay trên trình duyệt, không lo mất mát dữ liệu do rớt mạng hoặc đóng trình duyệt đột ngột.
- Cơ chế đồng bộ hóa mượt mà: Tự động lưu dữ liệu lên máy chủ backend định kỳ và khi người dùng thực hiện thao tác lưu.

### 4. Nhập tệp thông minh
- Hỗ trợ tải lên và trích xuất nội dung trực tiếp từ:
  - Tệp văn bản thuần `.txt`.
  - Tài liệu Microsoft Word `.docx` thông qua thư viện `mammoth`, tự động chuẩn hóa sang định dạng HTML sạch tương thích với editor.

### 5. Quản lý Dự án & Chương sách
- Thanh điều hướng bên (Sidebar) quản lý danh sách chương theo từng dự án hoặc viết bản nháp độc lập.
- Thao tác nhanh: thêm mới, đổi tên, sắp xếp thứ tự chương, xem thông tin tài liệu.
- Quản lý danh mục tài liệu với các bộ lọc, tìm kiếm và phân loại.

### 6. Quy trình Xác thực & Quản trị tài khoản
- Bộ giao diện đăng ký, đăng nhập, nhập mã xác thực OTP gửi qua email.
- Khôi phục và đặt lại mật khẩu với giao diện trực quan.
- Tự động quản lý Access Token trong bộ nhớ và tự động gửi yêu cầu Refresh Token khi gặp mã phản hồi 401.

### 7. Nâng cấp tài khoản PRO qua VietQR
- Modal nâng cấp tài khoản PRO hiển thị mã VietQR động trực tiếp.
- Đồng hồ đếm ngược giao dịch trong thời hạn 15 phút.
- Tự động thăm dò (polling) trạng thái thanh toán để kích hoạt quyền lợi PRO ngay khi hoàn tất giao dịch.

---

## Công nghệ sử dụng

| Lĩnh vực | Công nghệ | Chi tiết sử dụng |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server Components, Route Groups |
| **Thư viện UI** | [React 19](https://react.dev/) | React Hooks, Context API, Client/Server boundaries |
| **Ngôn ngữ** | [TypeScript 5](https://www.typescriptlang.org/) | Type-safety toàn diện |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + CSS Modules | Giao diện hiện đại kết hợp CSS Module tối ưu theo component |
| **Editor** | [TipTap 3](https://tiptap.dev/) (`@tiptap/react`, StarterKit) | Headless rich-text editor cho môi trường web |
| **Lưu trữ Offline** | [idb](https://github.com/jakearchibald/idb) (IndexedDB) | Lưu trữ bản nháp cục bộ trên client |
| **Xử lý tệp** | [Mammoth](https://github.com/mwilliamson/mammoth.js) | Chuyển đổi tài liệu Word `.docx` sang HTML |
| **Linter** | ESLint 9 | Đảm bảo tiêu chuẩn mã nguồn |

---

## Cấu trúc thư mục

```text
write-tool-ui/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Nhóm route xác thực
│   │   ├── login/                 # Trang đăng nhập
│   │   ├── register/              # Trang đăng ký
│   │   ├── verify-email/          # Trang xác thực email
│   │   └── forgot-password/       # Trang quên/đặt lại mật khẩu
│   ├── (main)/                    # Nhóm route chính
│   │   ├── home/                  # Danh sách dự án / Trang chủ
│   │   ├── profile/               # Thông tin cá nhân
│   │   ├── settings/              # Cài đặt giao diện & nâng cấp PRO
│   │   └── statistics/            # Thống kê số từ & phiên viết
│   ├── chapter/                   # Không gian soạn thảo chính (Editor)
│   ├── globals.css                # CSS toàn cục & Tailwind directives
│   └── layout.tsx                 # Root layout tích hợp Providers
├── components/                    # Thành phần giao diện dùng chung
│   ├── common/                    # Button, Input, Modal dùng chung
│   ├── icons/                     # SVG Icons
│   └── layout/                    # Navbar, Sidebar, Footer, MainLayoutShell
├── modules/                       # Module tính năng (Feature-Sliced Design)
│   ├── auth/                      # Form xác thực, hooks, services
│   ├── chapters/                  # Toàn bộ logic Editor, toolbar, canvas, import
│   ├── documents/                 # Card, modal, danh sách tài liệu
│   ├── settings/                  # Tùy biến theme, typography, UpgradeModal
│   └── statistics/                # Biểu đồ và dữ liệu thống kê
├── lib/                           # Thư viện lõi & cấu hình
│   ├── api-client.ts              # Fetch wrapper tự động đính kèm token & refresh
│   ├── db.ts                      # Cấu hình cơ sở dữ liệu client IndexedDB
│   └── token.ts                   # Quản lý bộ nhớ Access Token & CSRF
├── stores/                        # React Context Providers
│   ├── AuthProvider.tsx           # Context quản lý phiên đăng nhập
│   └── ThemeProvider.tsx          # Context quản lý màu giấy, cỡ chữ, font
├── constants/                     # Các hằng số ứng dụng
├── hooks/                         # Custom hooks dùng chung
├── types/                         # Định nghĩa kiểu dữ liệu TypeScript
├── utils/                         # Hàm tiện ích (định dạng, mapper lỗi)
├── styles/                        # Kiểu dáng phụ trợ
├── .env.example                   # Mẫu cấu hình biến môi trường
├── next.config.ts                 # Cấu hình Next.js
├── package.json                   # Dependencies & Scripts
└── tsconfig.json                  # Cấu hình TypeScript
```

---

## Yêu cầu & Biến môi trường

### Yêu cầu tiên quyết
- **Node.js**: Phiên bản `>= 20.x` (khuyến nghị `22.x` hoặc `24.x`)
- **NPM**, **PNPM** hoặc **Yarn**
- Backend [write-tool-api](../write-tool-api) đang khởi chạy (mặc định tại `http://localhost:3000`)

### Thiết lập tệp `.env`

Tạo file `.env.local` tại thư mục gốc dựa trên mẫu `.env.example`:

```bash
cp .env.example .env.local
```

Chi tiết các biến cấu hình (chẳng hạn như đường dẫn máy chủ API) đã được định nghĩa trong tệp [.env.example](.env.example). Vui lòng tham khảo tệp này để điều chỉnh theo môi trường phát triển của bạn.

---

## Cài đặt & Khởi chạy

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Khởi chạy môi trường phát triển
```bash
npm run dev
```

Ứng dụng sẽ được khởi chạy tại cổng 3001:  
`http://localhost:3001`

### 3. Biên dịch và chạy sản phẩm
```bash
# Biên dịch dự án cho production
npm run build

# Khởi chạy bản production
npm run start
```

### 4. Kiểm tra mã nguồn (Linting)
```bash
npm run lint
```

---

## Các trang & Điều hướng

| Đường dẫn | Vai trò | Mô tả |
|---|---|---|
| `/` | Landing / Redirect | Chuyển hướng người dùng vào trang làm việc chính |
| `/login` | Đăng nhập | Đăng nhập tài khoản bằng email và mật khẩu |
| `/register` | Đăng ký | Đăng ký tài khoản mới và chuyển sang xác thực |
| `/verify-email` | Xác thực email | Nhập mã OTP 6 số đã được gửi qua email |
| `/forgot-password` | Quên mật khẩu | Gửi email yêu cầu đặt lại mật khẩu |
| `/home` | Trang chủ dự án | Quản lý danh sách tài liệu, tạo sách mới, tìm kiếm |
| `/chapter` | Không gian viết | Trình soạn thảo TipTap toàn màn hình, thanh công cụ, sidebar chương |
| `/statistics` | Thống kê | Xem báo cáo số lượng từ, thời gian viết, biểu đồ tiến độ |
| `/settings` | Cài đặt | Tùy chỉnh chế độ giấy in, phông chữ và nâng cấp tài khoản PRO |
| `/profile` | Cá nhân | Xem và cập nhật thông tin cá nhân |

---

## Kiến trúc Frontend & Luồng dữ liệu

### Cơ chế Offline-First & Tự động lưu
```text
[ Tác giả gõ chữ trên TipTap Editor ]
                 │
                 ├──────────────────────────────┐
                 │ (Ngay lập tức)               │ (Theo chu kỳ / Sự kiện)
                 ▼                              ▼
      ┌─────────────────────┐        ┌───────────────────────┐
      │  IndexedDB (Client) │        │   API Client (Fetch)  │
      │  Store: 'chapters'  │        │   PATCH /chapters/:id │
      └─────────────────────┘        └──────────┬────────────┘
                 │                              │
        [ Luôn sẵn sàng ]                       ▼
        [ Kể cả khi mất mạng ]       ┌───────────────────────┐
                                     │   Backend Server DB   │
                                     └───────────────────────┘
```

### Xử lý API Token & Làm mới phiên
```text
[ Request nghiệp vụ (VD: GET /documents) ]
                 │
                 ▼
       ┌───────────────────┐
       │ Đính kèm Token    │ ──► Authorization: Bearer <accessToken>
       └─────────┬─────────┘
                 │
                 ├──────────────────────────────────────┐
                 ▼ (Nếu thành công 200)                 ▼ (Nếu gặp lỗi 401 Unauthorized)
         [ Trả dữ liệu UI ]             ┌────────────────────────────────────────┐
                                        │  Gọi POST /api/v1/auth/refresh         │
                                        │  Đính kèm Cookie refreshToken & CSRF   │
                                        └──────────────────┬─────────────────────┘
                                                           │
                                         ┌─────────────────┴─────────────────┐
                                         ▼ (Thành công)                      ▼ (Thất bại)
                               ┌──────────────────┐               ┌───────────────────────┐
                               │ Nhận Token mới & │               │ Xóa phiên đăng nhập   │
                               │ Retry lại request│               │ Điều hướng về /login  │
                               └──────────────────┘               └───────────────────────┘
```

---

## Giấy phép

Dự án được phát triển dưới bản quyền cá nhân / nội bộ [UNLICENSED]. Mọi quyền được bảo lưu.
