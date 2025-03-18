# บทที่ 1: IoT Foundation - โปรโตคอล

| รายละเอียด         | คำอธิบาย                                                     |
|---------------------|----------------------------------------------------------------|
| **ชื่อเนื้อหา**     | IoT Foundation - โปรโตคอล                            |
| **วัตถุประสงค์**    | เรียนรู้พื้นฐานและเปรียบเทียบโปรโตคอลการสื่อสารใน IoT          |
| **ระดับความยาก**    | พื้นฐาน [⭑⭑]                                                  |
| **เวลา**           | 30 นาที                                              |
| **สิ่งที่ต้องเตรียม** | เว็บบราวเซอร์, MQTT Client (optional)                         |
| **ความรู้พื้นฐาน**  | เครือข่ายคอมพิวเตอร์เบื้องต้น, TCP/IP                           |

## ภาพรวมหมวดหมู่การสื่อสารใน IoT

ในปัจจุบัน การสื่อสารในระบบ IoT มีความซับซ้อนและหลากหลายมากขึ้น สามารถแบ่งตาม Layer ได้ดังนี้:

- **Link Layer**
    - 802.3 – Ethernet
    - 802.11 – WiFi
    - 802.16 – WiMax
    - 802.15.4 – LR-WPAN
    - LoRaWan
    - 2G/3G/4G
- **Network/Internet Layer**
    - IPv4
    - IPv6
    - 6LoWPAN
- **Transport Layer**
    - TCP
    - UDP
- **Application Layer**
    - HTTP
    - CoAP
    - WebSocket
    - MQTT
    - XMPP
    - DDS
    - AMQP

นอกจากนี้ยังสามารถจำแนกตามลักษณะการสื่อสารได้ 2 หมวดหลัก ดังนี้:

### การสื่อสารไร้สาย (Wireless)

| เทคโนโลยี | ความถี่/ย่าน | ความเร็ว | ระยะทำการ | อายุแบตเตอรี่ | ข้อดี | ข้อเสีย | การใช้งานหลัก |
|-----------|-------------|----------|------------|---------------|-------|----------|---------------|
| WiFi | 2.4/5 GHz | 54Mbps-600Mbps | 30-100m | ต่ำ (วัน-สัปดาห์) | - รองรับแบนด์วิธสูง<br>- มาตรฐานใช้งานทั่วไป<br>- การตั้งค่าง่าย | - ใช้พลังงานสูง<br>- ความหนาแน่นส่งผลต่อประสิทธิภาพ | - กล้องวงจรปิด<br>- ระบบมัลติมีเดีย<br>- Smart Home Hub |
| BLE | 2.4 GHz | 1-3Mbps | 10-100m | สูง (เดือน-ปี) | - ประหยัดพลังงาน<br>- เชื่อมต่อง่าย<br>- ราคาถูก | - แบนด์วิธจำกัด<br>- จำนวนอุปกรณ์จำกัด | - อุปกรณ์สวมใส่<br>- เซ็นเซอร์ใกล้ตัว<br>- Beacon |
| Zigbee | 2.4 GHz | 250Kbps | 10-100m | สูงมาก (ปี) | - Mesh Network<br>- รองรับอุปกรณ์มาก<br>- ประหยัดพลังงาน | - ความเร็วต่ำ<br>- ต้องมี Gateway | - ระบบแสงสว่าง<br>- เซ็นเซอร์อุตสาหกรรม<br>- Home Automation |
| LoRa | Sub-GHz | 0.3-50Kbps | 2-15km | สูงมาก (หลายปี) | - ระยะไกลมาก<br>- ทนต่อการรบกวน<br>- ประหยัดพลังงาน | - ความเร็วต่ำมาก<br>- ต้องมีโครงสร้างพื้นฐาน | - Smart City<br>- เกษตรอัจฉริยะ<br>- Asset Tracking |
| NB-IoT | Licensed Band | 20-200Kbps | 1-10km | สูง (ปี) | - ใช้เครือข่ายมือถือ<br>- Coverage ดี<br>- QoS รับประกัน | - ค่าบริการสูง<br>- Latency สูง | - มิเตอร์อัจฉริยะ<br>- Smart Parking<br>- Asset Tracking |
| NFC | 13.56 MHz | 424 Kbps | < 0.1m | Passive | - ใช้งานง่าย<br>- ปลอดภัย<br>- ราคาถูก | - ระยะทางสั้นมาก<br>- ความเร็วต่ำ | - Mobile Payment<br>- Smart Card<br>- Tagging |
| Sigfox | Sub-GHz | 10-100 bps | 1-50km | สูงมาก (หลายปี) | - ราคาถูก<br>- ใช้พลังงานต่ำ<br>- ครอบคลุมพื้นที่กว้าง | - ความเร็วต่ำ<br>- ปริมาณข้อมูลจำกัด | - การติดตามทรัพย์สิน<br>- เซ็นเซอร์สิ่งแวดล้อม |
| Z-Wave | 868 MHz (EU), 908 MHz (US) | 9.6/40/100 Kbps | 30m | สูง (1-3 ปี) | - Mesh Network<br>- ใช้พลังงานต่ำ<br>- เชื่อถือได้ | - แบนด์วิธต่ำ<br>- จำนวนอุปกรณ์ต่อเครือข่ายจำกัด | - ระบบบ้านอัจฉริยะ<br>- ระบบรักษาความปลอดภัย |
| 3G/4G/5G | 700-3500 MHz | 3G: 384Kbps-2Mbps<br>4G: 100Mbps-1Gbps<br>5G: 1-10Gbps | 1-10km | ต่ำ (ชั่วโมง-วัน) | - ความเร็วสูง<br>- ครอบคลุมพื้นที่กว้าง<br>- โครงสร้างพื้นฐานพร้อมใช้งาน | - ใช้พลังงานสูง<br>- ค่าบริการสูง<br>- Latency แปรผันตามเครือข่าย | - อุปกรณ์เคลื่อนที่<br>- Live Streaming<br>- โครงสร้างพื้นฐานสำรอง |

### การสื่อสารผ่านสาย (Wired)

| เทคโนโลยี | ความเร็ว | ระยะทาง | การเชื่อมต่อ | ข้อดี | ข้อเสีย | การใช้งานหลัก |
|-----------|----------|-----------|-------------|-------|----------|---------------|
| Ethernet | 10Mbps-10Gbps | 100m/segment | Point-to-Point/Switch | - เสถียรสูง<br>- แบนด์วิธสูง<br>- Latency ต่ำ | - ติดตั้งยุ่งยาก<br>- ค่าใช้จ่ายสูง | - ระบบอุตสาหกรรม<br>- กล้อง IP<br>- Gateway |
| RS-485 | 100Kbps-10Mbps | 1,200m | Multi-drop Bus | - ทนต่อการรบกวน<br>- เชื่อมต่อหลายจุด<br>- ราคาถูก | - ความเร็วจำกัด<br>- ต้องมีโปรโตคอลเพิ่ม | - PLC<br>- เครื่องจักร<br>- Modbus RTU |
| CAN Bus | 1Mbps@40m<br>50Kbps@1km | 40m-1km | Multi-master Bus | - มาตรฐานอุตสาหกรรม<br>- Error Detection<br>- Real-time | - ความเร็วจำกัด<br>- จำนวนโหนดจำกัด | - ยานยนต์<br>- หุ่นยนต์<br>- เครื่องจักรกล |
| Serial Communication | Up to 25Mbps | < 15m | Point-to-Point | - ต้นทุนต่ำ<br>- ใช้พลังงานต่ำ<br>- Simple | - ความเร็วและระยะทางจำกัด<br>- ไม่รองรับ Multi-drop | - การสื่อสารระหว่าง MCU และอุปกรณ์ต่อพ่วง |
| I2C | 3.4 Mbps | < 1m | Multi-drop | - ใช้สายไฟน้อย<br>- ง่ายต่อการ Implement | - ระยะทางสั้น<br>- ความเร็วจำกัด | - การเชื่อมต่อเซ็นเซอร์และอุปกรณ์ต่อพ่วงขนาดเล็ก |

## Diagram สัดส่วนตลาดของโปรโตคอล IoT

```mermaid
pie title สัดส่วนตลาดโปรโตคอล IoT
    "MQTT" : 40
    "HTTP" : 30
    "WebSocket" : 20
    "CoAP" : 10
```

## ตารางเปรียบเทียบระหว่างโปรโตคอล IoT

| Protocol | Transport Layer | Security | QoS Levels | Message Size | Bandwidth | Use Cases | Implementation Complexity |
|----------|----------------|-----------|------------|--------------|-----------|------------|-------------------------|
| MQTT | TCP/IP | TLS/SSL | 0,1,2 | ไม่จำกัด (ปกติ <100KB) | ต่ำ | - IoT Sensors<br>- Real-time Monitoring<br>- Push Notifications | ปานกลาง |
| WebSocket | TCP/IP | TLS/SSL | ไม่มี | ไม่จำกัด | ปานกลาง-สูง | - Real-time Web Apps<br>- Live Dashboard<br>- Chat Systems | ต่ำ-ปานกลาง |
| HTTP | TCP/IP | TLS/SSL | ไม่มี | ไม่จำกัด | สูง | - RESTful APIs<br>- File Transfer<br>- Web Services | ต่ำ |
| CoAP | UDP | DTLS | Confirmable/<br>Non-confirmable | 1152 bytes | ต่ำมาก | - Constrained Devices<br>- Sensor Networks<br>- M2M Communication | ปานกลาง-สูง |

## รายละเอียดโปรโตคอลและเหตุผลเลือกให้เจาะลึก

### MQTT (Message Queuing Telemetry Transport)
- **เวอร์ชันล่าสุด:** MQTT 5.0
- **สถาปัตยกรรม:** Publish/Subscribe with Broker
- **การรับประกันการส่งข้อมูล:** QoS 0, 1, 2
- **ความสามารถพิเศษ:**
  - Retained Messages
  - Last Will and Testament
  - Clean/Persistent Sessions
  - Topic Wildcards
  - Message Queuing
- **ข้อดีเชิงเทคนิค:**
  - Header เพียง 2-5 bytes
  - รองรับ millions of devices/broker
  - Latency ต่ำ (20-100ms)
  - Binary protocol

### WebSocket
- **เวอร์ชันล่าสุด:** RFC 6455
- **สถาปัตยกรรม:** Full-Duplex Client-Server
- **การรับประกันการส่งข้อมูล:** TCP reliable delivery
- **ความสามารถพิเศษ:**
  - Built-in browser support
  - Sub-protocol support
  - Extension mechanism
  - Automatic reconnection
- **ข้อดีเชิงเทคนิค:**
  - Header overhead ต่ำ (2-14 bytes)
  - รองรับ Text/Binary frames
  - Cross-origin support
  - Proxy/Load balancer friendly

### HTTP
- โปรโตคอลมาตรฐานสำหรับการสื่อสารผ่านเว็บ
- รองรับอย่างแพร่หลายและใช้งานง่ายเมื่อรวมเข้ากับโครงสร้างพื้นฐานปัจจุบัน
- ใช้รูปแบบ request/response ซึ่งอาจมี overhead ค่อนข้างสูง
- ไม่เหมาะกับงานที่ต้องการการอัปเดตแบบเรียลไทม์มากนัก

### CoAP
- โปรโตคอลที่ออกแบบมาเพื่ออุปกรณ์ IoT ที่มีทรัพยากรจำกัด
- ใช้รูปแบบการสื่อสารคล้าย RESTful แต่ประหยัดแบนด์วิธกว่า HTTP
- มี overhead ต่ำ เพราะสามารถทำงานบน UDP
- เหมาะกับการสื่อสารแบบ M2M ในระบบ IoT ขนาดเล็ก

### เหตุผลในการเลือกศึกษา MQTT และ WebSocket:

1. **ความครอบคลุมการใช้งาน:**
   - MQTT: เป็นมาตรฐานในการสื่อสารระหว่างอุปกรณ์ IoT
   - WebSocket: เป็นมาตรฐานในการสื่อสารแบบ real-time บนเว็บ

2. **การผสมผสานที่ลงตัว:**
   - MQTT เหมาะกับ Device-to-Server
   - WebSocket เหมาะกับ Server-to-Client UI
   - ทั้งคู่ทำงานร่วมกันได้ดีในระบบ IoT

3. **แนวโน้มอุตสาหกรรม:**
   - การเติบโตของ MQTT: 40% market share ในระบบ IoT
   - การเติบโตของ WebSocket: 20% ในการพัฒนา real-time web applications

4. **ความเหมาะสมกับการพัฒนา:**
   - พัฒนาได้บนหลากหลายแพลตฟอร์ม
   - มี libraries รองรับจำนวนมาก
   - Community support แข็งแกร่ง

### มาตรฐานและข้อกำหนด
- [MQTT Specification](https://mqtt.org/mqtt-specification/) - ข้อกำหนดอย่างเป็นทางการของ MQTT
- [WebSocket Protocol Specification](https://tools.ietf.org/html/rfc6455) - RFC 6455: ข้อกำหนด WebSocket
- [CoAP Specification](https://tools.ietf.org/html/rfc7252) - RFC 7252: ข้อกำหนด CoAP
- [HTTP/1.1 Specification](https://tools.ietf.org/html/rfc2616) - RFC 2616: ข้อกำหนด HTTP/1.1
- [HTTP/2 Specification](https://tools.ietf.org/html/rfc7540) - RFC 7540: ข้อกำหนด HTTP/2



## RACKSYNC CO., LTD.

[RACKSYNC](https://github.com/racksync) เป็นบริษัทที่มีความเชี่ยวชาญในการพัฒนาโซลูชั่นด้าน IoT และระบบอัตโนมัติ เรามุ่งมั่นในการสร้างเทคโนโลยีที่เชื่อมต่อโลกเข้าด้วยกันผ่านระบบ IoT ที่มีประสิทธิภาพและเสถียร

### บริการของเรา
- การออกแบบและพัฒนาระบบ IoT แบบครบวงจร
- โซลูชั่นเชื่อมต่อสำหรับอุตสาหกรรม 4.0
- ระบบอัตโนมัติสำหรับบ้านและอาคารอัจฉริยะ
- การฝึกอบรมและเวิร์คช็อปด้าน IoT

ติดตามโปรเจกต์และอัปเดตได้ที่ [GitHub](https://github.com/racksync)

© 2007-2025 RACKSYNC CO., LTD. All rights reserved.
