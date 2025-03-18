# CoAP for Constrained Devices

```mermaid
graph LR
    Device[Constrained Device] -->|CoAP Request| Gateway
    Gateway -->|HTTP Request| Cloud[Cloud Service]
    Cloud -->|HTTP Response| Gateway
    Gateway -->|CoAP Response| Device
    
    style Device fill:#bbf,stroke:#333,stroke-width:2px
    style Gateway fill:#f96,stroke:#333,stroke-width:2px
    style Cloud fill:#bfb,stroke:#333,stroke-width:2px
```

## CoAP (Constrained Application Protocol)
- Designed specifically for resource-constrained IoT devices
- UDP-based with optional reliability
- Minimal 4-byte header
- RESTful design similar to HTTP
- Built-in service discovery
- Support for multicast

![CoAP Protocol Stack](https://www.google.com/search?q=coap+protocol+stack+constrained+devices+iot&tbm=isch)

> Key Takeaway: CoAP เป็นโปรโตคอลที่ออกแบบมาเฉพาะสำหรับอุปกรณ์ IoT ที่มีข้อจำกัดสูงมาก โดยมีจุดเด่น คือ (1) ใช้ UDP เป็นฐานทำให้ overhead ต่ำมาก (2) มีขนาด header เพียง 4 ไบต์ (3) มีการออกแบบคล้าย HTTP ทำให้ง่ายต่อการบูรณาการ (4) มีกลไก service discovery ในตัว และ (5) รองรับ multicast เหมาะสำหรับเซ็นเซอร์ขนาดเล็ก อุปกรณ์ที่ใช้แบตเตอรี่ หรือเครือข่ายที่มีแบนด์วิดธ์จำกัดมาก

Technical Terms:
- Constrained Application Protocol (CoAP)
- User Datagram Protocol (UDP)
- Confirmable Messages
- Non-confirmable Messages
- Service Discovery
- Resource Directory
- Block Transfer
