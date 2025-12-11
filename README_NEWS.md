# API Documentation - News & News Category

**Base URL:** `http://localhost:8080`

## News Category Endpoints

### 1. Tạo danh mục tin tức mới

- **Method:** `POST`
- **Endpoint:** `/news-category`
- **Auth:** Không cần
- **Request Body:**

```json
{
  "name": "Du lịch",
  "description": "Tin tức về du lịch",
  "slug": "du-lich",
  "active": true
}
```

- **Response (200):** NewsCategoryDTO (đã có `id`, `createdAt`, `updatedAt`, `active` = true)
- **Error (500):** `"Failed to add news category: [error message]"`

### 2. Lấy tất cả danh mục tin tức

- **Method:** `GET`
- **Endpoint:** `/news-category`
- **Auth:** Không cần
- **Response (200):**

```json
[
  {
    "id": 1,
    "name": "Du lịch",
    "description": "Tin tức về du lịch",
    "slug": "du-lich",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000+00:00",
    "updatedAt": "2024-01-01T00:00:00.000+00:00"
  }
]
```

- **Error (500):** Internal Server Error

### 3. Lấy danh mục theo trạng thái active

- **Method:** `GET`
- **Endpoint:** `/news-category/active?active=true`
- **Auth:** Không cần
- **Query Params:** `active` (boolean, default: true)
- **Response (200):** Array of NewsCategoryDTO
- **Error (500):** Internal Server Error

### 4. Lấy danh mục theo ID

- **Method:** `GET`
- **Endpoint:** `/news-category/{id}`
- **Auth:** Không cần
- **Response (200):** NewsCategoryDTO
- **Error (404):** Not Found
- **Error (500):** Internal Server Error

### 5. Cập nhật danh mục tin tức

- **Method:** `PUT`
- **Endpoint:** `/news-category`
- **Auth:** Không cần
- **Request Body:** NewsCategoryDTO (phải có `id`)

```json
{
  "id": 1,
  "name": "Du lịch trong nước",
  "description": "Tin tức về du lịch trong nước",
  "slug": "du-lich-trong-nuoc",
  "active": true
}
```

- **Response (200):** NewsCategoryDTO
- **Error (500):** `"Failed to update news category: [error message]"`

### 6. Xóa danh mục tin tức

- **Method:** `DELETE`
- **Endpoint:** `/news-category/{id}`
- **Auth:** Không cần
- **Response (200):** `"Xóa danh mục tin tức thành công"`
- **Error (500):** `"Failed to delete news category: [error message]"`

---

## News Endpoints

### 1. Tạo tin tức mới

- **Method:** `POST`
- **Endpoint:** `/news`
- **Auth:** Không cần
- **Request Body:**

```json
{
  "title": "Khám phá Đà Lạt mùa hoa anh đào",
  "content": "Nội dung chi tiết của tin tức...",
  "summary": "Tóm tắt về tin tức",
  "image": "https://example.com/image.jpg",
  "slug": "kham-pha-da-lat-mua-hoa-anh-dao",
  "categoryId": 1,
  "author": "Nguyễn Văn A",
  "active": true,
  "featured": false
}
```

- **Response (200):** NewsDTO (đã có `id`, `createdAt`, `updatedAt`, `views` = 0, `active` = true)
- **Error (500):** `"Failed to add news: [error message]"`

### 2. Lấy tất cả tin tức

- **Method:** `GET`
- **Endpoint:** `/news`
- **Auth:** Không cần
- **Response (200):**

```json
[
  {
    "id": 1,
    "title": "Khám phá Đà Lạt mùa hoa anh đào",
    "content": "Nội dung chi tiết...",
    "summary": "Tóm tắt về tin tức",
    "image": "https://example.com/image.jpg",
    "slug": "kham-pha-da-lat-mua-hoa-anh-dao",
    "categoryId": 1,
    "categoryName": "Du lịch",
    "author": "Nguyễn Văn A",
    "views": 0,
    "active": true,
    "featured": false,
    "createdAt": "2024-01-01T00:00:00.000+00:00",
    "updatedAt": "2024-01-01T00:00:00.000+00:00"
  }
]
```

- **Error (500):** Internal Server Error

### 3. Lấy tin tức theo trạng thái active

- **Method:** `GET`
- **Endpoint:** `/news/active?active=true`
- **Auth:** Không cần
- **Query Params:** `active` (boolean, default: true)
- **Response (200):** Array of NewsDTO
- **Error (500):** Internal Server Error

### 4. Lấy tin tức theo danh mục

- **Method:** `GET`
- **Endpoint:** `/news/category/{categoryId}`
- **Auth:** Không cần
- **Response (200):** Array of NewsDTO
- **Error (500):** Internal Server Error

### 5. Lấy tin tức nổi bật

- **Method:** `GET`
- **Endpoint:** `/news/featured?featured=true`
- **Auth:** Không cần
- **Query Params:** `featured` (boolean, default: true)
- **Response (200):** Array of NewsDTO
- **Error (500):** Internal Server Error

### 6. Lấy tin tức theo ID

- **Method:** `GET`
- **Endpoint:** `/news/{id}`
- **Auth:** Không cần
- **Response (200):** NewsDTO
- **Error (404):** Not Found
- **Error (500):** Internal Server Error

### 7. Cập nhật tin tức

- **Method:** `PUT`
- **Endpoint:** `/news`
- **Auth:** Không cần
- **Request Body:** NewsDTO (phải có `id`)

```json
{
  "id": 1,
  "title": "Khám phá Đà Lạt mùa hoa anh đào - Cập nhật",
  "content": "Nội dung đã được cập nhật...",
  "summary": "Tóm tắt đã cập nhật",
  "image": "https://example.com/new-image.jpg",
  "slug": "kham-pha-da-lat-mua-hoa-anh-dao",
  "categoryId": 1,
  "author": "Nguyễn Văn A",
  "active": true,
  "featured": true
}
```

- **Response (200):** NewsDTO
- **Error (500):** `"Failed to update news: [error message]"`

### 8. Xóa tin tức

- **Method:** `DELETE`
- **Endpoint:** `/news/{id}`
- **Auth:** Không cần
- **Response (200):** `"Xóa tin tức thành công"`
- **Error (500):** `"Failed to delete news: [error message]"`

---

## Data Models

### NewsCategoryDTO

```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "slug": "string",
  "active": true,
  "createdAt": "2024-01-01T00:00:00.000+00:00",
  "updatedAt": "2024-01-01T00:00:00.000+00:00"
}
```

### NewsDTO

```json
{
  "id": 1,
  "title": "string",
  "content": "string",
  "summary": "string",
  "image": "string",
  "slug": "string",
  "categoryId": 1,
  "categoryName": "string",
  "author": "string",
  "views": 0,
  "active": true,
  "featured": false,
  "createdAt": "2024-01-01T00:00:00.000+00:00",
  "updatedAt": "2024-01-01T00:00:00.000+00:00"
}
```

---

## Notes

- **NewsCategory**: Danh mục tin tức, có thể phân loại các tin tức theo chủ đề
- **News**: Tin tức, có quan hệ Many-to-One với NewsCategory (một tin tức thuộc một danh mục)
- Khi tạo tin tức mới, `categoryId` là bắt buộc
- `slug` nên là duy nhất và dùng để tạo URL thân thiện
- `views` mặc định là 0 khi tạo tin tức mới
- `active` và `featured` mặc định là `true` và `false` khi tạo tin tức mới
- `createdAt` được tự động set bởi database khi tạo mới
- `updatedAt` được tự động cập nhật khi sửa đổi
