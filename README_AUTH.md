# API Documentation - Authentication & Customer

**Base URL:** `http://localhost:8080`

## Authentication Endpoints

### 1. Đăng nhập

- **Method:** `POST`
- **Endpoint:** `/customer/auth/login`
- **Auth:** Không cần
- **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Error (401):** `"Tài khoản không tồn tại"`
- **Error (400):** `"Tài khoản này chỉ hỗ trợ đăng nhập bằng Google"`

### 2. Đăng nhập Google OAuth2

- **Method:** `GET`
- **Endpoint:** `/customer/auth/login/google`
- **Auth:** Không cần (OAuth2 redirect)
- **Response (200):** Same as login response
- **Error (400):** `"Google authentication failed: No authentication object"` hoặc `"Google account missing email"`

### 3. Đăng ký

- **Method:** `POST`
- **Endpoint:** `/customer/auth/register`
- **Auth:** Không cần
- **Request Body:**

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "0123456789",
  "role": "CUSTOMER"
}
```

- **Response (200):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "0123456789",
  "role": "CUSTOMER",
  "createdAt": "2024-01-01T00:00:00.000+00:00",
  "authProvider": "LOCAL"
}
```

- **Error (400):** `"Error: [error message]"`

### 4. Refresh Token

- **Method:** `POST`
- **Endpoint:** `/customer/auth/refresh-token`
- **Auth:** Không cần
- **Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Response (200):** Same as login response
- **Error (400):** `"Missing refresh token"`
- **Error (401):** `"User not found"`, `"Invalid refresh token"`, `"Refresh token expired"`, `"Invalid refresh token format"`

---

## Customer Endpoints

### 5. Lấy thông tin khách hàng theo email

- **Method:** `GET`
- **Endpoint:** `/customer/email/{email}`
- **Auth:** Bearer Token (ADMIN only)
- **Response (200):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "0123456789",
  "role": "CUSTOMER",
  "createdAt": "2024-01-01T00:00:00.000+00:00",
  "authProvider": "LOCAL"
}
```

### 6. Lấy thông tin khách hàng theo số điện thoại

- **Method:** `GET`
- **Endpoint:** `/customer/phone/{phone}`
- **Auth:** Bearer Token (ADMIN only)
- **Response (200):** CustomerResponseDTO

### 7. Cập nhật thông tin khách hàng

- **Method:** `PUT`
- **Endpoint:** `/customer/update`
- **Auth:** Bearer Token (CUSTOMER, ADMIN)
- **Headers:** `Authorization: Bearer {token}`
- **Request Body:**

```json
{
  "name": "John Doe Updated",
  "phone": "0987654321"
}
```

- **Response (200):** CustomerResponseDTO
- **Error (401):** Error message

### 8. Đổi mật khẩu

- **Method:** `POST`
- **Endpoint:** `/customer/changepassword`
- **Auth:** Bearer Token (CUSTOMER, ADMIN)
- **Headers:** `Authorization: Bearer {token}`
- **Request Body:**

```json
{
  "oldPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

- **Response (204):** No Content
- **Error (401):** Error message

### 9. Xóa khách hàng

- **Method:** `DELETE`
- **Endpoint:** `/customer/delete/{id}`
- **Auth:** Bearer Token (ADMIN only)
- **Response (204):** No Content

### 10. Reset mật khẩu

- **Method:** `PUT`
- **Endpoint:** `/customer/resetpassword/{id}`
- **Auth:** Bearer Token (ADMIN only)
- **Response (204):** No Content

### 11. Lấy danh sách tất cả khách hàng

- **Method:** `GET`
- **Endpoint:** `/customer/customerlist`
- **Auth:** Bearer Token (ADMIN only)
- **Response (200):**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "0123456789",
    "role": "CUSTOMER",
    "createdAt": "2024-01-01T00:00:00.000+00:00",
    "authProvider": "LOCAL"
  }
]
```

### 12. Lấy thông tin profile

- **Method:** `GET`
- **Endpoint:** `/customer/profile`
- **Auth:** Bearer Token
- **Headers:** `Authorization: Bearer {token}`
- **Response (200):** CustomerResponseDTO
- **Error (401):** `"Invalid token"`
- **Error (404):** `"User not found"`

---

## Data Models

### CustomerResponseDTO

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "0123456789",
  "role": "CUSTOMER" | "ADMIN" | "GUIDE",
  "createdAt": "2024-01-01T00:00:00.000+00:00",
  "authProvider": "LOCAL" | "GOOGLE"
}
```

### CustomerLoginDTO

```json
{
  "email": "string",
  "password": "string"
}
```

### ChangePasswordDTO

```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```
