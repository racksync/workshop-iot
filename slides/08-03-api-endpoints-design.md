# Designing API Endpoints for IoT

## Best Practices for IoT API Design

- **Use nouns, not verbs** for resources
  - `/devices` not `/getDevices`
- **Utilize HTTP methods** appropriately
  - GET, POST, PUT, DELETE
- **Version your API**
  - `/api/v1/devices`
- **Return appropriate status codes**
  - 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized
- **Implement proper authentication**
  - API keys, OAuth, JWT

[Search for REST API Design Best Practices Images](https://www.google.com/search?q=rest+api+design+best+practices+endpoints&tbm=isch)

## Presenter Notes (ข้อมูลสำหรับผู้บรรยาย)

> **Key Takeaway**: การออกแบบ REST API ที่ดีสำหรับระบบ IoT ควรมีความชัดเจน สอดคล้องกับมาตรฐาน และรองรับการขยายตัวในอนาคต นอกจากนี้ยังต้องออกแบบให้เหมาะสมกับข้อจำกัดของอุปกรณ์ IoT

### แนวทางการออกแบบ API สำหรับ IoT:

#### 1. โครงสร้าง URLs สำหรับระบบ IoT
- **Collection-based**: `/devices`, `/sensors`, `/readings`
- **Hierarchical**: `/devices/{device_id}/sensors`, `/sensors/{sensor_id}/readings`
- **Query parameters**: `/readings?from=2023-01-01&to=2023-02-01`

#### 2. ตัวอย่าง Endpoints ที่ควรมี
```
GET    /devices                   # รายการอุปกรณ์ทั้งหมด
GET    /devices/{id}              # ข้อมูลอุปกรณ์เฉพาะ
POST   /devices                   # เพิ่มอุปกรณ์ใหม่
PUT    /devices/{id}              # อัปเดตอุปกรณ์
DELETE /devices/{id}              # ลบอุปกรณ์
GET    /devices/{id}/data         # ข้อมูลจากอุปกรณ์
POST   /devices/{id}/commands     # ส่งคำสั่งไปยังอุปกรณ์
```

#### 3. การพิจารณาเฉพาะสำหรับ IoT
- **Bandwidth Conservation**: API ควรส่งเฉพาะข้อมูลที่จำเป็นและใช้รูปแบบที่กระชับ
- **Batching**: รองรับการส่งข้อมูลแบบ batch เพื่อลดการเชื่อมต่อ
- **Pagination**: ใช้ pagination สำหรับข้อมูลขนาดใหญ่ (`?page=2&limit=50`)
- **Filtering**: อนุญาตให้กรองข้อมูลได้เพื่อลดปริมาณข้อมูลที่ส่ง
- **Data Formats**: ใช้ JSON เพราะมีขนาดเล็กและอ่านง่าย

#### 4. Error Handling
- ใช้ HTTP status codes อย่างเหมาะสม
- ให้ข้อความแสดงข้อผิดพลาดที่มีประโยชน์
- มี error codes สำหรับการจัดการข้อผิดพลาดโดยโปรแกรม

ให้ความสำคัญกับการออกแบบ REST API ที่สอดคล้องกับความต้องการของธุรกิจและเข้าใจถึงข้อจำกัดของอุปกรณ์ IoT ที่จะเชื่อมต่อกับ API

**ศัพท์เทคนิค**: Resource URI, HTTP Methods, API Versioning, Status Codes, Authentication, Authorization, Pagination, Rate Limiting, HATEOAS (Hypermedia as the Engine of Application State), Idempotency, Content Negotiation
