# REST API in IoT Systems

## What is REST API?

- **RE**presentational **S**tate **T**ransfer
- HTTP-based communication protocol
- Standard interface for web services
- Uses familiar HTTP methods (GET, POST, PUT, DELETE)
- Data typically formatted in JSON or XML

[Search for REST API IoT Architecture Images](https://www.google.com/search?q=rest+api+iot+architecture+diagram&tbm=isch)

## Presenter Notes (ข้อมูลสำหรับผู้บรรยาย)

> **Key Takeaway**: REST API เป็นมาตรฐานการสื่อสารที่ใช้กันแพร่หลายในการพัฒนาเว็บและการเชื่อมต่อระบบ IoT ที่ช่วยให้ระบบต่างๆ สามารถสื่อสารกันได้อย่างมีประสิทธิภาพผ่านอินเทอร์เน็ต โดยใช้รูปแบบการสื่อสารที่เรียบง่ายบน HTTP

อธิบายคุณสมบัติหลักของ REST API:
- ใช้การสื่อสารแบบ **stateless** คือไม่เก็บสถานะของไคลเอนต์ไว้ที่เซิร์ฟเวอร์
- มีการออกแบบแบบ **resource-oriented** โดยทรัพยากรต่างๆ จะถูกระบุด้วย URI
- ใช้ HTTP methods เพื่อกำหนดการกระทำ (GET = อ่าน, POST = สร้าง, PUT = อัพเดท, DELETE = ลบ)
- มีความเข้ากันได้กับระบบต่างๆ สูง (high interoperability)
- สามารถใช้งานได้ง่ายผ่าน HTTP client มาตรฐาน เช่น browser, curl, Postman

สำหรับการใช้งานใน IoT, REST API มีข้อดีคือใช้งานง่าย เป็นที่ยอมรับอย่างกว้างขวาง และรองรับโดยอุปกรณ์/ระบบส่วนใหญ่ แต่อาจไม่เหมาะกับการสื่อสารแบบ real-time เท่ากับโปรโตคอลอย่าง MQTT หรือ WebSocket

**ศัพท์เทคนิค**: RESTful API, Endpoints, Resources, HTTP Methods, Status Codes, Stateless, URI (Uniform Resource Identifier), JSON (JavaScript Object Notation), XML (Extensible Markup Language)
