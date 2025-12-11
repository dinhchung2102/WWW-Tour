# API Documentation - Promotion & Promotion Subscriber

**Base URL:** `http://localhost:8080`

## Promotion Endpoints

### 1. Tạo khuyến mãi mới

- **Method:** `POST`
- **Endpoint:** `/promotion`
- **Auth:** Cần authentication (Admin)
- **Request Body:**

```json
{
  "title": "Giảm giá 50% cho tour mùa hè",
  "description": "Khuyến mãi đặc biệt cho các tour mùa hè",
  "discountPercent": 50.0,
  "discountAmount": null,
  "code": "SUMMER50",
  "startDate": "2024-06-01T00:00:00.000+00:00",
  "endDate": "2024-08-31T23:59:59.000+00:00",
  "minOrderAmount": 1000000.0,
  "maxDiscountAmount": 500000.0,
  "usageLimit": 100,
  "active": true,
  "image": "https://example.com/promotion-image.jpg"
}
```

- **Response (200):** PromotionDTO (đã có `id`, `createdAt`, `updatedAt`, `active` = true, `usedCount` = 0)
- **Note:** Khi tạo khuyến mãi mới, hệ thống sẽ tự động gửi email thông báo đến tất cả người đăng ký nhận khuyến mãi
- **Error (500):** `"Failed to add promotion: [error message]"`

### 2. Lấy tất cả khuyến mãi

- **Method:** `GET`
- **Endpoint:** `/promotion`
- **Auth:** Không cần (public)
- **Response (200):**

```json
[
  {
    "id": 1,
    "title": "Giảm giá 50% cho tour mùa hè",
    "description": "Khuyến mãi đặc biệt cho các tour mùa hè",
    "discountPercent": 50.0,
    "discountAmount": null,
    "code": "SUMMER50",
    "startDate": "2024-06-01T00:00:00.000+00:00",
    "endDate": "2024-08-31T23:59:59.000+00:00",
    "minOrderAmount": 1000000.0,
    "maxDiscountAmount": 500000.0,
    "usageLimit": 100,
    "usedCount": 0,
    "active": true,
    "image": "https://example.com/promotion-image.jpg",
    "createdAt": "2024-01-01T00:00:00.000+00:00",
    "updatedAt": "2024-01-01T00:00:00.000+00:00"
  }
]
```

- **Error (500):** Internal Server Error

### 3. Lấy khuyến mãi đang hoạt động (theo thời gian)

- **Method:** `GET`
- **Endpoint:** `/promotion/active`
- **Auth:** Không cần (public)
- **Response (200):** Danh sách PromotionDTO có `active = true` và nằm trong khoảng thời gian `startDate` đến `endDate`
- **Error (500):** Internal Server Error

### 4. Lấy khuyến mãi theo trạng thái active

- **Method:** `GET`
- **Endpoint:** `/promotion/status?active=true`
- **Auth:** Không cần (public)
- **Query Parameters:**
  - `active` (optional, default: `true`): `true` hoặc `false`
- **Response (200):** Danh sách PromotionDTO theo trạng thái active
- **Error (500):** Internal Server Error

### 5. Lấy khuyến mãi theo mã code

- **Method:** `GET`
- **Endpoint:** `/promotion/code/{code}`
- **Auth:** Không cần (public)
- **Path Parameters:**
  - `code`: Mã khuyến mãi (ví dụ: `SUMMER50`)
- **Response (200):** PromotionDTO
- **Response (404):** Not Found nếu không tìm thấy
- **Error (500):** Internal Server Error

### 6. Lấy một khuyến mãi theo ID

- **Method:** `GET`
- **Endpoint:** `/promotion/{id}`
- **Auth:** Không cần (public)
- **Path Parameters:**
  - `id`: ID của khuyến mãi
- **Response (200):** PromotionDTO
- **Response (404):** Not Found nếu không tìm thấy
- **Error (500):** Internal Server Error

### 7. Cập nhật khuyến mãi

- **Method:** `PUT`
- **Endpoint:** `/promotion`
- **Auth:** Cần authentication (Admin)
- **Request Body:**

```json
{
  "id": 1,
  "title": "Giảm giá 50% cho tour mùa hè (Updated)",
  "description": "Khuyến mãi đặc biệt cho các tour mùa hè",
  "discountPercent": 50.0,
  "code": "SUMMER50",
  "startDate": "2024-06-01T00:00:00.000+00:00",
  "endDate": "2024-08-31T23:59:59.000+00:00",
  "active": true
}
```

- **Response (200):** PromotionDTO đã cập nhật
- **Error (500):** `"Failed to update promotion: [error message]"`

### 8. Xóa khuyến mãi

- **Method:** `DELETE`
- **Endpoint:** `/promotion/{id}`
- **Auth:** Cần authentication (Admin)
- **Path Parameters:**
  - `id`: ID của khuyến mãi
- **Response (200):** `"Xóa khuyến mãi thành công"`
- **Error (500):** `"Failed to delete promotion: [error message]"`

## Promotion Subscriber Endpoints

### 1. Đăng ký nhận thông báo khuyến mãi

- **Method:** `POST`
- **Endpoint:** `/promotion-subscriber/subscribe`
- **Auth:** Không cần (public)
- **Request Body:**

```json
{
  "email": "user@example.com",
  "name": "Nguyễn Văn A"
}
```

- **Response (200):** PromotionSubscriberDTO
- **Note:**
  - Nếu email đã tồn tại và đang active, sẽ trả về subscriber hiện tại
  - Nếu email đã tồn tại nhưng đã unsubscribe, sẽ tự động reactivate
  - Nếu email chưa tồn tại, sẽ tạo mới subscriber
- **Error (400):** `"Email is required"` nếu thiếu email
- **Error (500):** `"Failed to subscribe: [error message]"`

### 2. Hủy đăng ký nhận thông báo khuyến mãi (theo email)

- **Method:** `POST`
- **Endpoint:** `/promotion-subscriber/unsubscribe`
- **Auth:** Không cần (public)
- **Request Body:**

```json
{
  "email": "user@example.com"
}
```

- **Response (200):** `"Đã hủy đăng ký nhận khuyến mãi thành công"`
- **Error (400):** `"Email is required"` nếu thiếu email
- **Error (500):** `"Failed to unsubscribe: [error message]"`

### 3. Hủy đăng ký nhận thông báo khuyến mãi (theo ID)

- **Method:** `DELETE`
- **Endpoint:** `/promotion-subscriber/{id}`
- **Auth:** Cần authentication (Admin)
- **Path Parameters:**
  - `id`: ID của subscriber
- **Response (200):** `"Đã hủy đăng ký nhận khuyến mãi thành công"`
- **Error (500):** `"Failed to unsubscribe: [error message]"`

### 4. Lấy tất cả người đăng ký

- **Method:** `GET`
- **Endpoint:** `/promotion-subscriber`
- **Auth:** Cần authentication (Admin)
- **Response (200):**

```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "name": "Nguyễn Văn A",
    "active": true,
    "subscribedAt": "2024-01-01T00:00:00.000+00:00",
    "unsubscribedAt": null
  }
]
```

- **Error (500):** Internal Server Error

### 5. Lấy người đăng ký theo trạng thái active

- **Method:** `GET`
- **Endpoint:** `/promotion-subscriber/active?active=true`
- **Auth:** Cần authentication (Admin)
- **Query Parameters:**
  - `active` (optional, default: `true`): `true` hoặc `false`
- **Response (200):** Danh sách PromotionSubscriberDTO theo trạng thái active
- **Error (500):** Internal Server Error

### 6. Lấy người đăng ký theo email

- **Method:** `GET`
- **Endpoint:** `/promotion-subscriber/email/{email}`
- **Auth:** Cần authentication (Admin)
- **Path Parameters:**
  - `email`: Email của subscriber
- **Response (200):** PromotionSubscriberDTO
- **Response (404):** Not Found nếu không tìm thấy
- **Error (500):** Internal Server Error

## Data Models

### Promotion

| Field             | Type    | Description                             |
| ----------------- | ------- | --------------------------------------- |
| id                | Integer | ID của khuyến mãi (auto-generated)      |
| title             | String  | Tiêu đề khuyến mãi                      |
| description       | String  | Mô tả khuyến mãi                        |
| discountPercent   | double  | Phần trăm giảm giá                      |
| discountAmount    | Double  | Số tiền giảm cố định (nullable)         |
| code              | String  | Mã khuyến mãi (unique)                  |
| startDate         | Date    | Ngày bắt đầu                            |
| endDate           | Date    | Ngày kết thúc                           |
| minOrderAmount    | Double  | Số tiền tối thiểu để áp dụng (nullable) |
| maxDiscountAmount | Double  | Số tiền giảm tối đa (nullable)          |
| usageLimit        | Integer | Giới hạn số lần sử dụng (nullable)      |
| usedCount         | int     | Số lần đã sử dụng (default: 0)          |
| active            | boolean | Trạng thái hoạt động (default: true)    |
| image             | String  | URL hình ảnh khuyến mãi (nullable)      |
| createdAt         | Date    | Ngày tạo (auto-generated)               |
| updatedAt         | Date    | Ngày cập nhật                           |

### PromotionSubscriber

| Field          | Type    | Description                          |
| -------------- | ------- | ------------------------------------ |
| id             | Integer | ID của subscriber (auto-generated)   |
| email          | String  | Email đăng ký (unique, required)     |
| name           | String  | Tên người đăng ký (nullable)         |
| active         | boolean | Trạng thái hoạt động (default: true) |
| subscribedAt   | Date    | Ngày đăng ký (auto-generated)        |
| unsubscribedAt | Date    | Ngày hủy đăng ký (nullable)          |

## Tour Integration

Tour model đã được cập nhật để có quan hệ với Promotion:

- **Field:** `promotion` (Many-to-One, nullable)
- **Field trong TourDTO:** `promotionId` (Integer, nullable)

Khi tạo/cập nhật Tour, có thể gán `promotionId` để liên kết tour với khuyến mãi.

## Email Notification

Khi tạo khuyến mãi mới, hệ thống sẽ tự động:

1. Lấy danh sách tất cả email đã đăng ký nhận khuyến mãi (active = true)
2. Gửi email thông báo đến từng email với nội dung:
   - Tiêu đề khuyến mãi
   - Mô tả
   - Phần trăm giảm giá
   - Mã khuyến mãi (nếu có)
   - Thời gian áp dụng
   - Số tiền tối thiểu (nếu có)

**Lưu ý:**

- Nếu email service chưa được cấu hình (trong `application.properties`), hệ thống sẽ log thông tin khuyến mãi thay vì gửi email
- Lỗi gửi email sẽ không làm fail việc tạo khuyến mãi

## Security

- **Public endpoints (GET):**
  - `/promotion/**` (GET only)
  - `/promotion-subscriber/subscribe`
  - `/promotion-subscriber/unsubscribe`
- **Protected endpoints (cần authentication):**
  - `/promotion` (POST, PUT, DELETE)
  - `/promotion-subscriber` (GET, DELETE)
