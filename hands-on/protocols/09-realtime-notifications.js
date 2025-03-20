/**
 * Exercise 9: ระบบแจ้งเตือนแบบ Real-time ด้วย WebSocket
 *
 * แบบฝึกหัดนี้จะพัฒนาระบบแจ้งเตือนที่ส่งการแจ้งเตือนแบบ real-time
 * ไปยังหน้าเว็บผ่าน WebSocket โดยสามารถจัดลำดับความสำคัญของการแจ้งเตือน
 * และแสดงผลที่เหมาะสมบนหน้าเว็บไซต์
 *
 * ข้อกำหนด:
 * 1. สร้าง WebSocket Server ที่รับการเชื่อมต่อจาก clients
 * 2. กำหนดรูปแบบข้อความแจ้งเตือน (เช่น { type: 'notification', message: '...', priority: 'high' })
 * 3. สร้างฟังก์ชันสำหรับส่งการแจ้งเตือนไปยัง clients ที่เชื่อมต่ออยู่
 * 4. พัฒนา web frontend ที่รับการแจ้งเตือนและแสดงผลตามลำดับความสำคัญ
 *
 * การติดตั้งไลบรารี:
 * npm install ws express
 */

const express = require('express');
const WebSocket = require('ws');
const http = require('http');

// ---------- กำหนดค่าการเชื่อมต่อ ----------
const PORT = process.env.PORT || 5000;

// ---------- สร้าง Express App และ HTTP Server ----------
const app = express();
const server = http.createServer(app);

// ---------- สร้าง WebSocket Server ----------
const wss = new WebSocket.Server({ server });

// ---------- ตัวแปรสำหรับเก็บ clients ที่เชื่อมต่อ ----------
const clients = new Set();

// ---------- ฟังก์ชันสำหรับส่งการแจ้งเตือน ----------
/**
 * ส่งการแจ้งเตือนไปยัง clients ที่เชื่อมต่ออยู่
 * @param {Object} notification - ข้อความแจ้งเตือน
 *  {
 *      type: 'notification',
 *      message: 'ข้อความแจ้งเตือน',
 *      priority: 'high' | 'medium' | 'low',
 *      timestamp: new Date().toISOString()
 *  }
 */
function sendNotification(notification) {
    const message = JSON.stringify(notification);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
    console.log(`[NOTIFICATION] ส่งการแจ้งเตือน: ${notification.message}`);
}

// ---------- WebSocket Server Event Handlers ----------
wss.on('connection', ws => {
    console.log('[WS] Client เชื่อมต่อ');
    clients.add(ws);

    // ส่งข้อความต้อนรับ
    ws.send(JSON.stringify({
        type: 'welcome',
        message: 'ยินดีต้อนรับสู่ระบบแจ้งเตือน Real-time!',
        timestamp: new Date().toISOString()
    }));

    // จัดการเมื่อ client ส่งข้อความมา
    ws.on('message', message => {
        console.log(`[WS] ได้รับข้อความ: ${message}`);
        // ในแบบฝึกหัดนี้เราจะไม่ประมวลผลข้อความจาก client
        // แต่ใน production คุณอาจต้องการให้ client ส่งข้อมูลบางอย่าง
        // เพื่อใช้ในการปรับแต่งการแจ้งเตือน
    });

    // จัดการเมื่อ client ตัดการเชื่อมต่อ
    ws.on('close', () => {
        console.log('[WS] Client ตัดการเชื่อมต่อ');
        clients.delete(ws);
    });

    // จัดการเมื่อเกิดข้อผิดพลาด
    ws.on('error', error => {
        console.error('[WS] เกิดข้อผิดพลาด:', error);
        clients.delete(ws);
    });
});

// ---------- REST API สำหรับส่งการแจ้งเตือน (จำลอง) ----------
app.post('/api/notify', (req, res) => {
    const { message, priority } = req.body;

    if (!message || !priority) {
        return res.status(400).json({ error: 'ต้องระบุ message และ priority' });
    }

    const notification = {
        type: 'notification',
        message: message,
        priority: priority,
        timestamp: new Date().toISOString()
    };

    sendNotification(notification);
    res.json({ success: true, message: 'ส่งการแจ้งเตือนแล้ว' });
});

// ---------- เริ่ม Server ----------
server.listen(PORT, () => {
    console.log(`
========================================================
  WebSocket Server ทำงานที่ port ${PORT}
  (กด Ctrl+C เพื่อปิดโปรแกรม)
========================================================
    `);
});

// ---------- ตัวอย่างการใช้งาน (จำลอง) ----------
// ใน production คุณอาจมีการตรวจสอบเงื่อนไขบางอย่างก่อนส่งการแจ้งเตือน
// เช่น ตรวจสอบค่าเซ็นเซอร์, เหตุการณ์ที่เกิดขึ้น, ฯลฯ
// ตัวอย่าง:
// setInterval(() => {
//     sendNotification({
//         type: 'notification',
//         message: 'อุณหภูมิสูงเกินกำหนด!',
//         priority: 'high',
//         timestamp: new Date().toISOString()
//     });
// }, 60000); // ทุก 1 นาที

/**
 * คำแนะนำเพิ่มเติม:
 *
 * 1. สร้าง web frontend ที่เชื่อมต่อกับ WebSocket server
 *    และแสดงการแจ้งเตือนตามลำดับความสำคัญ (high, medium, low)
 *
 * 2. ใช้ CSS ในการจัดรูปแบบการแสดงผลของการแจ้งเตือน
 *    เช่น สีพื้นหลัง, ขนาดตัวอักษร, ไอคอน, ฯลฯ
 *
 * 3. เพิ่มระบบ queue สำหรับการจัดการการแจ้งเตือนจำนวนมาก
 *    เพื่อป้องกันไม่ให้ server ทำงานหนักเกินไป
 *
 * 4. ทดลองปรับแต่งโปรแกรม:
 *    - เพิ่มระบบยืนยันตัวตนสำหรับ WebSocket clients
 *    - เพิ่มระบบการจัดการ channel สำหรับการส่งการแจ้งเตือนไปยังกลุ่มเป้าหมาย
 *    - ใช้ฐานข้อมูลในการเก็บประวัติการแจ้งเตือน
 */
