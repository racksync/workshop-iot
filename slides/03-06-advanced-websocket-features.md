# Advanced WebSocket Features

```javascript
// Advanced WebSocket Server with Broadcasting & Heartbeat
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

// Broadcast function: send to all clients
function broadcast(data) {
  wss.clients.forEach(function(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Heartbeat: ping every 30 seconds
function heartbeat() {
  wss.clients.forEach(function(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.ping();
    }
  });
}
setInterval(heartbeat, 30000);
```

Advanced features like **broadcasting** and **heartbeats** help create robust WebSocket applications.

[Search WebSocket heartbeat mechanism](https://www.google.com/search?q=WebSocket+heartbeat+mechanism&tbm=isch)

## Presenter Notes (ข้อมูลสำหรับผู้บรรยาย)

> Key Takeaway: WebSocket มีฟีเจอร์ขั้นสูงที่ควรใช้ในระบบจริง เช่น broadcasting สำหรับส่งข้อมูลไปยัง client หลายตัวพร้อมกัน และ heartbeat สำหรับตรวจสอบการเชื่อมต่อ

> Broadcasting คือการส่งข้อความไปยัง clients ทุกตัวที่กำลังเชื่อมต่ออยู่ ใช้ประโยชน์มากในระบบแชท, แดชบอร์ดสำหรับหลายผู้ใช้ หรือระบบแจ้งเตือน
> 
> Heartbeat คือการส่ง ping ไปยัง client ทุกๆ ช่วงเวลาหนึ่ง เพื่อให้แน่ใจว่าการเชื่อมต่อยังคงอยู่ เป็นวิธีตรวจจับ connection ที่หลุดโดยไม่ได้แจ้งเตือน (เช่น เน็ตขาด, แบตเตอรี่หมด)
> 
> readyState มีค่าต่างๆ ได้แก่:
> - CONNECTING (0): กำลังเชื่อมต่อ
> - OPEN (1): เชื่อมต่อแล้ว
> - CLOSING (2): กำลังปิดการเชื่อมต่อ
> - CLOSED (3): ปิดการเชื่อมต่อแล้ว

> ศัพท์เทคนิค: Broadcasting, Heartbeat, ping/pong mechanism, readyState, connection lifecycle
