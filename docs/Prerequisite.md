# สิ่งที่ต้องเตรียมสำหรับ Workshop IoT

เอกสารนี้รวบรวมบริการ (services) และโปรแกรมต่างๆ ที่จำเป็นสำหรับการเรียนรู้และปฏิบัติใน Workshop IoT

## 1. บริการที่ต้องสมัคร (Services)

### Cloud Platforms (สำหรับการติดตั้งบนระบบคลาวด์ - บทที่ 7)

| Platform | ประเภท | เหมาะสำหรับ | ข้อแนะนำ |
|---------|--------|------------|---------|
| **[AWS (Amazon Web Services)](https://aws.amazon.com/free/)** | IaaS/PaaS | องค์กรขนาดใหญ่และโครงการที่ต้องการความยืดหยุ่นสูง | มี Free Tier 12 เดือน, บริการ AWS IoT Core รองรับอุปกรณ์จำนวนมาก |
| **[Microsoft Azure](https://azure.microsoft.com/en-us/free/)** | IaaS/PaaS | องค์กรที่ใช้ระบบ Microsoft | มี Free Credit $200, Azure IoT Hub มีเครื่องมือสำหรับจัดการอุปกรณ์ที่ครบถ้วน |
| **[Google Cloud Platform (GCP)](https://cloud.google.com/free)** | IaaS/PaaS | โครงการที่ต้องการวิเคราะห์ข้อมูลขั้นสูง | มี Free Credit $300, เชื่อมต่อกับ Firebase ได้ดี |

> **ข้อสังเกต**: การเลือก Cloud Platform ขึ้นอยู่กับความต้องการและขนาดของโครงการ แต่ละแพลตฟอร์มมีจุดเด่นต่างกัน เช่น AWS มีบริการหลากหลายและยืดหยุ่น, Azure เชื่อมต่อกับระบบ Microsoft ได้ดี, GCP มีความสามารถด้าน Big Data และ AI ที่โดดเด่น

### MQTT Cloud Services

| Service | ประเภท | แผนฟรี | ข้อแนะนำ |
|--------|--------|--------|---------|
| **[EMQX Cloud](https://www.emqx.com/en/cloud)** | MQTT Broker as a Service | ✓ (มีข้อจำกัด) | เหมาะสำหรับโปรเจคที่เน้น MQTT โดยเฉพาะ, มีเครื่องมือ Rule Engine ที่มีประสิทธิภาพ |
| **[HiveMQ Cloud](https://www.hivemq.com/mqtt-cloud-broker/)** | MQTT Broker as a Service | ✓ (จำกัดการเชื่อมต่อ) | รองรับ MQTT 5.0, มีเครื่องมือติดตามและวิเคราะห์ที่ดี |
| **[AWS IoT Core](https://aws.amazon.com/iot-core/)** | MQTT+IoT Platform | ✓ (จำกัดจำนวนข้อความ) | เชื่อมต่อกับบริการอื่นๆ ของ AWS ได้ง่าย, รองรับอุปกรณ์จำนวนมาก |
| **[Azure IoT Hub](https://azure.microsoft.com/en-us/services/iot-hub/)** | MQTT+IoT Platform | ✓ (จำกัดข้อความต่อวัน) | เชื่อมต่อกับ Azure Digital Twins และ Azure Time Series Insights ได้ดี |

> **ข้อสังเกต**: EMQX Cloud และ HiveMQ Cloud เน้นที่ MQTT โดยเฉพาะ เหมาะสำหรับโครงการขนาดเล็กถึงกลาง ส่วน AWS IoT Core และ Azure IoT Hub เหมาะกับโครงการที่ต้องการเชื่อมต่อกับบริการคลาวด์อื่นๆ

### บริการเสริม

| Service | ประเภท | การใช้งาน | ข้อแนะนำ |
|--------|--------|---------|---------|
| **[LINE Notify](https://notify-bot.line.me/en/)** | Notification Service | ส่งการแจ้งเตือนไปยังกลุ่ม LINE | ฟรี, ง่ายต่อการตั้งค่า, เหมาะสำหรับระบบแจ้งเตือนในบทที่ 5 |
| **[Firebase](https://firebase.google.com/)** | Backend as a Service | ฐานข้อมูล Realtime, Authentication | มีแพคเกจฟรีที่ใช้งานได้จริง, ทางเลือกหลังจาก Google Cloud IoT Core ถูกยกเลิก |

> **ข้อแนะนำ**: LINE Notify เป็นทางเลือกที่ดีสำหรับการแจ้งเตือนในโครงการ IoT เนื่องจาก LINE เป็นที่นิยมในประเทศไทย และ Firebase Realtime Database เหมาะสำหรับการเก็บข้อมูลแบบ real-time โดยมีการเชื่อมต่อ WebSocket ให้พร้อมใช้งาน

## 2. โปรแกรมหรือแอพพลิเคชั่นที่จะต้องดาวน์โหลด

### เครื่องมือพัฒนา IoT

| โปรแกรม | ประเภท | ระบบปฏิบัติการ | ข้อแนะนำ |
|--------|--------|--------------|---------|
| **[Arduino IDE](https://www.arduino.cc/en/software)** | IDE สำหรับ Arduino | Windows, macOS, Linux | เหมาะสำหรับผู้เริ่มต้น, ติดตั้งและใช้งานง่าย |
| **[PlatformIO](https://platformio.org/install)** | IDE สำหรับการพัฒนา IoT | VSCode Extension | เหมาะสำหรับโปรเจคขนาดใหญ่, รองรับหลายแพลตฟอร์ม, จัดการไลบรารีอัตโนมัติ |
| **[Visual Studio Code](https://code.visualstudio.com/download)** | Code Editor | Windows, macOS, Linux | มี Extensions สำหรับการพัฒนา IoT หลากหลาย |

> **ข้อสังเกต**: Arduino IDE เหมาะสำหรับผู้เริ่มต้น แต่ PlatformIO ผ่าน VS Code จะให้ประสบการณ์การพัฒนาที่ดีกว่าสำหรับโปรเจคที่ซับซ้อน

### MQTT Tools

| โปรแกรม | ประเภท | ข้อแนะนำ |
|--------|--------|---------|
| **[MQTTX](https://mqttx.app/)** | MQTT Client GUI | แนะนำในหลักสูตร, UI ทันสมัย, ใช้งานง่าย, รองรับ MQTT 5.0 |
| **[MQTT Explorer](http://mqtt-explorer.com/)** | MQTT Client GUI | แสดงข้อมูลในรูปแบบ Tree View, เหมาะสำหรับดูภาพรวมของ Topics |
| **[MQTT CLI](https://github.com/hivemq/mqtt-cli)** | Command Line Tool | เหมาะสำหรับการ automation และการทดสอบผ่าน script |

> **ข้อแนะนำ**: MQTTX เป็นเครื่องมือที่แนะนำในหลักสูตรนี้ มีการอัปเดตสม่ำเสมอและใช้งานง่าย

### ระบบจัดการและแสดงผลข้อมูล

| โปรแกรม | ประเภท | การใช้งาน | ข้อแนะนำ |
|--------|--------|---------|---------|
| **[Node-RED](https://nodered.org/docs/getting-started/local)** | Flow-based Programming | สร้าง flows, แดชบอร์ด, automation | เป็นเครื่องมือหลักในบทที่ 5, ใช้งานง่ายผ่าน drag-and-drop |
| **[Grafana](https://grafana.com/grafana/download)** | Data Visualization | สร้าง Dashboard ขั้นสูง | เหมาะสำหรับการแสดงผลข้อมูลแบบ Time Series, มี templates มากมาย |
| **[InfluxDB](https://portal.influxdata.com/downloads/)** | Time Series Database | เก็บข้อมูล Time Series | ทำงานร่วมกับ Grafana ได้ดี, เหมาะสำหรับข้อมูลจากเซนเซอร์ |

> **ข้อแนะนำ**: Node-RED เป็นเครื่องมือสำคัญสำหรับหลักสูตรนี้ และในการสร้างระบบ IoT จริงอาจใช้ Grafana+InfluxDB เพื่อการแสดงผลและวิเคราะห์ข้อมูลที่ซับซ้อนมากขึ้น

### MQTT Brokers สำหรับพัฒนาแบบ Local

| โปรแกรม | ประเภท | ข้อแนะนำ |
|--------|--------|---------|
| **[Eclipse Mosquitto](https://mosquitto.org/download/)** | Lightweight MQTT Broker | ใช้ทรัพยากรน้อย, เหมาะสำหรับอุปกรณ์ที่มีทรัพยากรจำกัด |
| **[EMQX](https://www.emqx.io/downloads)** | Enterprise MQTT Broker | มีฟีเจอร์ขั้นสูง, Dashboard จัดการในตัว, เหมาะสำหรับระบบขนาดใหญ่ |

> **ข้อแนะนำ**: Mosquitto เหมาะสำหรับการทดลองและโปรเจคขนาดเล็ก ส่วน EMQX เหมาะสำหรับการพัฒนาระบบที่ซับซ้อนและมีขนาดใหญ่

### เครื่องมือสำหรับทดสอบ

| โปรแกรม | ประเภท | การใช้งาน | ข้อแนะนำ |
|--------|--------|---------|---------|
| **[Postman](https://www.postman.com/downloads/)** | API Testing Tool | ทดสอบ REST API | ใช้ในบทที่ 8 สำหรับทดสอบการเชื่อมต่อ API |

> **ข้อแนะนำ**: Postman เป็นเครื่องมือมาตรฐานในการทดสอบ REST API ใช้งานง่ายและมีฟีเจอร์ครบถ้วน

### Infrastructure Tools

| โปรแกรม | ประเภท | การใช้งาน | ข้อแนะนำ |
|--------|--------|---------|---------|
| **[Docker](https://www.docker.com/get-started)** | Containerization | สร้างและรัน containers | จำเป็นสำหรับการรัน services ต่างๆ ในหลักสูตร |
| **[Docker Compose](https://docs.docker.com/compose/install/)** | Container Orchestration | จัดการหลาย containers | ใช้สำหรับรันระบบที่มีหลาย services (Node-RED, MQTT, ฐานข้อมูล) |
| **[PuTTY](https://www.putty.org/)** (Windows) / **Terminal** (macOS/Linux) | SSH Client | เข้าถึงระบบ Cloud | จำเป็นสำหรับการจัดการระบบบนคลาวด์ |

> **ข้อแนะนำ**: Docker และ Docker Compose เป็นเครื่องมือสำคัญที่ใช้ในการรัน services ต่างๆ สำหรับการฝึกปฏิบัติ แนะนำให้ติดตั้งและเรียนรู้การใช้งานเบื้องต้นก่อนเริ่มหลักสูตร

### เครื่องมือสำหรับอุปกรณ์เฉพาะ

| โปรแกรม | ประเภท | การใช้งาน | ข้อแนะนำ |
|--------|--------|---------|---------|
| **[Tasmotizer](https://github.com/tasmota/tasmotizer/releases)** | Firmware Flashing Tool | ติดตั้ง Tasmota firmware | ใช้ในบทที่ 6 สำหรับอัพเดท firmware ของอุปกรณ์ ESP |
| **[ESPHome](https://esphome.io/guides/getting_started_command_line.html)** | Firmware Generator | สร้าง firmware สำหรับ ESP | ทางเลือกนอกเหนือจาก Tasmota สำหรับการพัฒนา IoT |

> **ข้อแนะนำ**: Tasmota เป็น firmware ที่นิยมสำหรับอุปกรณ์ ESP8266 และใช้งานได้ง่ายสำหรับผู้เริ่มต้น โดย Tasmotizer จะช่วยให้การติดตั้ง firmware ทำได้สะดวกมากขึ้น

## สรุป

การเตรียมความพร้อมสำหรับ Workshop IoT นี้ แบ่งเป็น 2 ส่วนหลัก:

1. **บริการที่ต้องสมัคร (Services)**:
   - Cloud Platform (AWS, Azure, หรือ GCP) สำหรับการเรียนรู้การติดตั้งระบบ IoT บนคลาวด์
   - MQTT Cloud Service (EMQX Cloud, HiveMQ, AWS IoT Core, หรือ Azure IoT Hub) สำหรับการสร้าง MQTT Broker บนคลาวด์
   - บริการเสริม เช่น LINE Notify สำหรับการแจ้งเตือน

2. **โปรแกรมที่ต้องติดตั้ง**:
   - เครื่องมือพัฒนา: Arduino IDE หรือ PlatformIO + VS Code
   - MQTT Tools: MQTTX (แนะนำ), MQTT Explorer, หรือ MQTT CLI
   - ระบบจัดการข้อมูล: Node-RED, Grafana, InfluxDB
   - MQTT Broker: Mosquitto หรือ EMQX
   - Infrastructure: Docker และ Docker Compose
   - เครื่องมือเฉพาะ: Postman, Tasmotizer ตามบทเรียนที่เกี่ยวข้อง

ทั้งนี้ แนะนำให้ติดตั้ง Docker และ Docker Compose เป็นอันดับแรก เนื่องจากจะใช้รันบริการต่างๆ เช่น Node-RED, MQTT Broker, และฐานข้อมูลในระหว่างการฝึกปฏิบัติ

สำหรับ Cloud Services สามารถสมัครในระหว่างเรียนบทที่เกี่ยวข้องได้ โดยอาจเริ่มต้นจาก Free Tier เพื่อทดลองใช้งานก่อน
