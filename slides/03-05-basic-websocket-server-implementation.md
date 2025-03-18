# Basic WebSocket Server Implementation

```javascript
// Basic WebSocket Server using ws library
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function(ws) {
  console.log('Client connected');
  
  ws.on('message', function(message) {
    console.log('Received: ' + message);
  });
  
  ws.send('Hello from Node.js server');
});
```

Creating a WebSocket server with Node.js is straightforward using the **ws library**, one of the most popular WebSocket implementations.

[Search WebSocket server implementation](https://www.google.com/search?q=WebSocket+server+implementation+nodejs&tbm=isch)

## Presenter Notes (ข้อมูลสำหรับผู้บรรยาย)

> Key Takeaway: การสร้าง WebSocket server ด้วย Node.js ทำได้ง่ายโดยใช้ไลบรารี 'ws' ซึ่งเป็นไลบรารีที่นิยมใช้และมีประสิทธิภาพสูง

> อธิบายโค้ดทีละส่วน:
> 1. `const WebSocket = require('ws');` - นำเข้าไลบรารี WebSocket
> 2. `const wss = new WebSocket.Server({ port: 8080 });` - สร้าง WebSocket server ที่พอร์ต 8080
> 3. `wss.on('connection', function(ws) {...});` - เมื่อมีการเชื่อมต่อใหม่เข้ามาจะเรียกฟังก์ชันนี้
> 4. `ws.on('message', function(message) {...});` - รับข้อความจาก client
> 5. `ws.send('Hello from Node.js server');` - ส่งข้อความไปยัง client

> ไลบรารี ws เป็น WebSocket ที่เป็นมาตรฐานใน Node.js แต่ยังมีอีกหลายไลบรารีที่น่าสนใจ เช่น Socket.io ที่มีฟีเจอร์เพิ่มเติม เช่น automatic reconnection และ room

> ศัพท์เทคนิค: WebSocket server, WebSocket client, ws library, connection event, message event
