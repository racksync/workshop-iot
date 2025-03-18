# IoT Protocol Comparison

| Feature | MQTT | WebSocket | HTTP/REST | CoAP |
|---------|------|-----------|-----------|------|
| Transport | TCP | TCP | TCP | UDP |
| Pattern | Pub/Sub | Bidirectional | Request/Response | Request/Response |
| Header Size | 2-4 bytes | 2-14 bytes | ~200 bytes | 4 bytes |
| QoS Levels | 0,1,2 | No | No | Yes (Confirmable) |
| Bandwidth | Low | Medium | High | Very Low |
| Ideal Use | Sensor data, Command & Control | Real-time dashboards | API integration | Constrained devices |

![IoT Protocol Comparison Chart](https://www.google.com/search?q=mqtt+vs+http+vs+websocket+vs+coap+comparison+chart&tbm=isch)

> Key Takeaway: โปรโตคอล IoT แต่ละประเภทมีจุดแข็งต่างกัน MQTT เหมาะกับการส่งข้อมูลเซนเซอร์และควบคุมอุปกรณ์เนื่องจากใช้ทรัพยากรน้อย WebSocket เหมาะกับแอปพลิเคชันแบบเรียลไทม์ HTTP/REST เหมาะกับการทำ API และ CoAP เหมาะกับอุปกรณ์ที่มีข้อจำกัดสูงมาก การเลือกใช้โปรโตคอลที่เหมาะสมมีผลอย่างมากต่อประสิทธิภาพของระบบ

Technical Terms:
- Publish/Subscribe Pattern
- Request/Response Pattern
- Quality of Service (QoS)
- Header Overhead
- Bidirectional Communication
- Bandwidth Consumption
