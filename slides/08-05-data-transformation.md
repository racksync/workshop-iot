# Data Transformation in IoT APIs

## Converting Between MQTT and REST Formats

```mermaid
flowchart LR
    A[MQTT Message Format] -->|Extract| B[Transformation Layer]
    C[Database Format] -->|Query| B
    B -->|Format| D[REST Response]
    
    subgraph "MQTT Message"
    A1["topic: sensors/temp
    payload: {\"temp\": 25.5}"]
    end
    
    subgraph "REST Response"
    D1["{
      \"device\": \"temp_sensor\",
      \"value\": 25.5,
      \"unit\": \"C\",
      \"timestamp\": \"2023-05-10T...\"
    }"]
    end
    
    A1 --> A
    B --> D1
    
    style B fill:#f96,stroke:#333,stroke-width:2px
```

[Search for Data Transformation IoT Diagrams](https://www.google.com/search?q=data+transformation+mqtt+to+rest+api+diagram&tbm=isch)

## Presenter Notes (ข้อมูลสำหรับผู้บรรยาย)

> **Key Takeaway**: การแปลงข้อมูลระหว่างรูปแบบต่างๆ เป็นส่วนสำคัญในการทำงานร่วมกันของระบบ IoT โดยเฉพาะระหว่าง MQTT และ REST API ซึ่งมีรูปแบบและวัตถุประสงค์การใช้งานที่แตกต่างกัน

### การแปลงข้อมูลระหว่าง MQTT และ REST API:

#### 1. ความแตกต่างของรูปแบบข้อมูล
- **MQTT**: มักเป็นข้อมูลแบบกระชับ เน้นประสิทธิภาพ แบ่งข้อมูลตาม topics
  ```json
  // Topic: device/12345/temperature
  // Payload:
  { "value": 25.5, "ts": 1620634800 }
  ```
  
- **REST API**: มักมีโครงสร้างที่ชัดเจน มี metadata มากกว่า และมีความหมายในตัวเอง
  ```json
  {
    "device_id": "12345",
    "measurements": {
      "temperature": 25.5
    },
    "timestamp": "2023-05-10T12:00:00Z",
    "unit": "Celsius",
    "location": {"lat": 13.756, "lng": 100.501}
  }
  ```

#### 2. ตัวอย่างโค้ดการแปลงข้อมูล

```javascript
// ฟังก์ชันแปลง MQTT สู่ REST API format
function mqttToRestFormat(topic, message) {
  try {
    const payload = JSON.parse(message);
    const topicParts = topic.split('/');
    
    // Extract data from topic structure
    const deviceType = topicParts[0];
    const deviceId = topicParts[1];
    const measurementType = topicParts[2];
    
    // ดึงข้อมูลเพิ่มเติมจากฐานข้อมูล (ถ้าจำเป็น)
    const deviceInfo = getDeviceInfo(deviceId);
    
    // สร้าง REST response format
    return {
      id: deviceId,
      type: deviceType,
      name: deviceInfo.name,
      measurement: {
        type: measurementType,
        value: payload.value,
        unit: deviceInfo.units[measurementType],
        timestamp: new Date(payload.ts * 1000).toISOString()
      },
      location: deviceInfo.location
    };
  } catch (error) {
    console.error('Error transforming data:', error);
    throw error;
  }
}
```

#### 3. ประเด็นสำคัญในการแปลงข้อมูล

- **Timestamp Formats**: MQTT อาจใช้ unix timestamp แต่ REST API มักใช้ ISO 8601
- **Units**: เพิ่มหน่วยวัดที่ชัดเจนในข้อมูล REST
- **Data Enrichment**: เพิ่มข้อมูล metadata จากฐานข้อมูลหรือแหล่งอื่น
- **Error Handling**: จัดการกับข้อมูลที่ไม่สมบูรณ์หรือผิดรูปแบบ
- **Caching**: พิจารณาใช้ cache สำหรับข้อมูลที่ใช้บ่อยเพื่อเพิ่มประสิทธิภาพ

#### 4. การแปลงกลับจาก REST สู่ MQTT

```javascript
function restToMqttFormat(restData, deviceId) {
  // แยกข้อมูลเฉพาะที่จำเป็น
  const mqttPayload = {
    value: restData.value,
    ts: Math.floor(new Date(restData.timestamp).getTime() / 1000)
  };
  
  // กำหนด topic
  const topic = `device/${deviceId}/command`;
  
  return {
    topic: topic,
    payload: JSON.stringify(mqttPayload)
  };
}
```

การแปลงข้อมูลที่ดีควรคำนึงถึงประสิทธิภาพ ความถูกต้อง และความสอดคล้องกับมาตรฐาน

**ศัพท์เทคนิค**: Data Transformation, Schema Validation, JSON Schema, Data Mapping, Payload Format, Timestamp Conversion, Data Enrichment, Normalization, Message Format, State Representation
