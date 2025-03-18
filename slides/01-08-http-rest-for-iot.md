# HTTP/REST for IoT

```mermaid
sequenceDiagram
    participant Device as IoT Device
    participant API as REST API
    participant Service as Cloud Service
    Device->>API: HTTP GET /api/config
    API-->>Device: Configuration Data
    Device->>API: HTTP POST /api/data
    API-->>Device: 201 Created
    API->>Service: Process Data
    Service->>API: Store Result
    Device->>API: HTTP GET /api/commands
    API-->>Device: Pending Commands
```

## HTTP/REST Advantages in IoT
- Familiar and widespread
- Excellent compatibility with existing web infrastructure
- Stateless nature simplifies scaling
- Rich ecosystem of tools and libraries
- RESTful design patterns

![HTTP REST API IoT Integration](https://www.google.com/search?q=http+rest+api+iot+integration&tbm=isch)

> Key Takeaway: HTTP/REST ยังคงมีบทบาทสำคัญใน IoT โดยเฉพาะในการเชื่อมต่อระหว่างระบบและการทำ API แม้จะไม่เหมาะกับอุปกรณ์ที่มีข้อจำกัดสูงเท่า MQTT หรือ CoAP แต่ HTTP/REST มีข้อดีหลายประการ ได้แก่ (1) เป็นที่รู้จักและใช้งานอย่างแพร่หลาย (2) รองรับโครงสร้างพื้นฐานเว็บที่มีอยู่แล้ว (3) มีเครื่องมือและไลบรารีมากมาย และ (4) สามารถทำ caching เพื่อลดการใช้ทรัพยากรได้ เหมาะสำหรับการเชื่อมโยง IoT กับระบบภายนอกและการสร้าง API

Technical Terms:
- RESTful API
- HTTP Methods (GET, POST, PUT, DELETE)
- Status Codes
- Resource-oriented Architecture
- Stateless Protocol
- API Endpoints
