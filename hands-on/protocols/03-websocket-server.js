/**
 * Exercise 3: WebSocket Server ด้วย JavaScript
 * 
 * แบบฝึกหัดนี้จะเรียนรู้การพัฒนา WebSocket Server ด้วย Node.js 
 * เพื่อสร้างการสื่อสารแบบ real-time ระหว่าง server กับ clients 
 * และระหว่าง clients ด้วยกันเอง
 * 
 * การติดตั้ง ws library:
 * npm install ws
 * 
 * การทดสอบ WebSocket Server นี้:
 * 1. รันเซิร์ฟเวอร์ด้วยคำสั่ง: node 03-websocket-server.js
 * 2. เชื่อมต่อโดยใช้เว็บเบราว์เซอร์ที่ http://localhost:8080
 * 3. เปิดหลายเบราว์เซอร์/แท็บเพื่อจำลองการเชื่อมต่อ clients หลายตัว
 */

const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const url = require('url');

// ---------- กำหนดค่าการเชื่อมต่อ ----------
const PORT = 8080;
const STATIC_PATH = path.join(__dirname, 'static');

// ---------- สร้าง HTTP server สำหรับส่งไฟล์ HTML ----------
const server = http.createServer((req, res) => {
  // วิเคราะห์ URL ที่ร้องขอ
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // ถ้าเข้าที่ root path ให้แสดงหน้า index.html
  if (pathname === '/' || pathname === '/index.html') {
    // ส่งหน้า HTML ที่มีลิงก์เชื่อมต่อ WebSocket
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebSocket Client Test</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          #messageHistory { height: 300px; border: 1px solid #ccc; margin-bottom: 10px; padding: 10px; overflow-y: scroll; }
          #messageForm { display: flex; }
          #messageInput { flex-grow: 1; padding: 8px; }
          button { padding: 8px 16px; background: #007bff; color: white; border: none; cursor: pointer; }
          .info { color: #0066cc; }
          .error { color: #cc0000; }
          .message { color: #333; }
          .system { color: #009900; }
        </style>
      </head>
      <body>
        <h1>WebSocket Client Test</h1>
        <div id="status" class="system">กำลังเชื่อมต่อ...</div>
        <div id="messageHistory"></div>
        <form id="messageForm">
          <input type="text" id="messageInput" placeholder="พิมพ์ข้อความของคุณที่นี่..." autocomplete="off" disabled>
          <button type="submit" id="sendButton" disabled>ส่ง</button>
        </form>

        <script>
          // เลือกองค์ประกอบ DOM ที่จะใช้ในการโต้ตอบ
          const statusDiv = document.getElementById('status');
          const messageHistory = document.getElementById('messageHistory');
          const messageForm = document.getElementById('messageForm');
          const messageInput = document.getElementById('messageInput');
          const sendButton = document.getElementById('sendButton');
          
          // อ้างอิงไปยัง WebSocket Server
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const wsUrl = protocol + '//' + window.location.host;
          let socket;
          let clientId = '';
          
          // สร้างฟังก์ชันสำหรับเพิ่มข้อความเข้าไปในประวัติการสนทนา
          function addMessage(type, text) {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = text;
            messageDiv.className = type;
            messageHistory.appendChild(messageDiv);
            // เลื่อนไปยังข้อความล่าสุด
            messageHistory.scrollTop = messageHistory.scrollHeight;
          }
          
          // เชื่อมต่อกับ WebSocket Server
          function connect() {
            socket = new WebSocket(wsUrl);
            
            // เรียกเมื่อการเชื่อมต่อถูกเปิด
            socket.onopen = () => {
              statusDiv.textContent = 'เชื่อมต่อสำเร็จ';
              messageInput.disabled = false;
              sendButton.disabled = false;
              addMessage('system', 'เชื่อมต่อกับ WebSocket Server เรียบร้อยแล้ว');
            };
            
            // เรียกเมื่อได้รับข้อความจาก Server
            socket.onmessage = (event) => {
              try {
                const data = JSON.parse(event.data);
                
                if (data.type === 'welcome') {
                  clientId = data.clientId;
                  addMessage('system', \`คุณได้เข้าร่วมการสนทนาในฐานะ client #\${clientId}\`);
                } 
                else if (data.type === 'message') {
                  // ข้อความจาก client อื่น
                  if (data.sender === clientId) {
                    addMessage('message', \`คุณ: \${data.text}\`);
                  } else {
                    addMessage('message', \`Client #\${data.sender}: \${data.text}\`);
                  }
                } 
                else if (data.type === 'info') {
                  // ข้อความแจ้งเตือนระบบ
                  addMessage('info', data.text);
                }
              } catch (e) {
                // ถ้าไม่ใช่ JSON ถือว่าเป็นข้อความธรรมดา
                addMessage('message', event.data);
              }
            };
            
            // เรียกเมื่อการเชื่อมต่อถูกปิด
            socket.onclose = (event) => {
              if (event.wasClean) {
                statusDiv.textContent = \`การเชื่อมต่อปิดแล้ว (code: \${event.code})\`;
                addMessage('system', 'การเชื่อมต่อถูกปิดอย่างสมบูรณ์');
              } else {
                // กรณี server crash หรือเครือข่ายขัดข้อง
                statusDiv.textContent = 'การเชื่อมต่อขัดข้อง';
                addMessage('error', 'การเชื่อมต่อถูกตัดโดยไม่คาดคิด');
                
                // พยายามเชื่อมต่อใหม่หลังจาก 5 วินาที
                setTimeout(connect, 5000);
              }
              messageInput.disabled = true;
              sendButton.disabled = true;
            };
            
            // เรียกเมื่อมีข้อผิดพลาด
            socket.onerror = (error) => {
              statusDiv.textContent = 'เกิดข้อผิดพลาด';
              addMessage('error', 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
              console.error('WebSocket Error:', error);
            };
          }
          
          // จัดการการส่งข้อความ
          messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = messageInput.value.trim();
            
            if (message && socket && socket.readyState === WebSocket.OPEN) {
              // ส่งข้อความไปยัง server
              socket.send(JSON.stringify({ type: 'message', text: message }));
              messageInput.value = '';
            }
          });
          
          // เริ่มการเชื่อมต่อเมื่อโหลดหน้าเว็บ
          connect();
        </script>
      </body>
      </html>
    `);
  } else {
    // สำหรับ path อื่นๆ ส่ง 404 Not Found
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Not Found');
  }
});

// ---------- สร้าง WebSocket Server และเชื่อมโยงกับ HTTP server ----------
const wss = new WebSocket.Server({ server });

// ---------- เก็บ clients ที่เชื่อมต่อทั้งหมด ----------
const clients = new Map();
let clientIdCounter = 1;

// ---------- ฟังก์ชันสำหรับกระจายข้อความไปยัง clients ทั้งหมด ----------
/**
 * กระจายข้อความไปยังทุก clients ที่เชื่อมต่ออยู่
 * @param {Object} message - ข้อความที่จะส่งในรูปแบบ object
 * @param {WebSocket|null} exclude - client ที่จะไม่ส่งข้อความไปให้ (ถ้ามี)
 */
function broadcast(message, exclude = null) {
  const messageStr = JSON.stringify(message);
  
  clients.forEach((clientInfo, ws) => {
    if (ws !== exclude && ws.readyState === WebSocket.OPEN) {
      ws.send(messageStr);
    }
  });
  
  // บันทึกข้อความที่กระจาย (ไม่รวมข้อความ system)
  if (message.type === 'message') {
    console.log(`[BROADCAST] ${message.sender}: ${message.text}`);
  }
}

// ---------- จัดการเหตุการณ์เมื่อ client เชื่อมต่อ ----------
wss.on('connection', (ws, req) => {
  // กำหนด ID ให้กับ client
  const clientId = clientIdCounter++;
  
  // เก็บข้อมูล client
  clients.set(ws, {
    id: clientId,
    ip: req.socket.remoteAddress,
    connectedAt: new Date().toISOString()
  });
  
  console.log(`[CONNECT] Client #${clientId} เชื่อมต่อจาก ${req.socket.remoteAddress}`);
  
  // ส่งข้อความต้อนรับไปยัง client ที่เพิ่งเชื่อมต่อ
  ws.send(JSON.stringify({
    type: 'welcome',
    clientId: clientId,
    message: 'ยินดีต้อนรับเข้าสู่ WebSocket Server!'
  }));
  
  // แจ้งให้ clients อื่นๆ ทราบว่ามี client ใหม่เชื่อมต่อ
  broadcast({
    type: 'info',
    text: `Client #${clientId} ได้เข้าร่วมการสนทนา`
  }, ws);
  
  // ---------- จัดการเหตุการณ์เมื่อได้รับข้อความจาก client ----------
  ws.on('message', (message) => {
    try {
      // พยายามแปลงข้อความเป็น JSON
      const data = JSON.parse(message);
      
      if (data.type === 'message') {
        // กระจายข้อความไปยัง clients ทั้งหมด
        broadcast({
          type: 'message',
          sender: clientId,
          text: data.text,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) {
      // ถ้าไม่ใช่ JSON ถือว่าเป็นข้อความธรรมดา
      broadcast({
        type: 'message',
        sender: clientId,
        text: message.toString(),
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // ---------- จัดการเหตุการณ์เมื่อ client ตัดการเชื่อมต่อ ----------
  ws.on('close', () => {
    // ดึงข้อมูล client ที่ตัดการเชื่อมต่อ
    const clientInfo = clients.get(ws);
    if (clientInfo) {
      console.log(`[DISCONNECT] Client #${clientInfo.id} ตัดการเชื่อมต่อ`);
      
      // แจ้งให้ clients อื่นๆ ทราบว่ามี client ตัดการเชื่อมต่อ
      broadcast({
        type: 'info',
        text: `Client #${clientInfo.id} ได้ออกจากการสนทนา`
      });
      
      // ลบ client ออกจากรายการ
      clients.delete(ws);
    }
  });
  
  // ---------- จัดการเหตุการณ์เมื่อเกิดข้อผิดพลาด ----------
  ws.on('error', (error) => {
    console.error(`[ERROR] เกิดข้อผิดพลาดกับ Client #${clientId}:`, error);
  });
  
  // ส่งรายการ clients ที่กำลังเชื่อมต่ออยู่ไปให้ client ใหม่
  const clientList = Array.from(clients.values()).map(c => ({
    id: c.id,
    connectedAt: c.connectedAt
  }));
  
  ws.send(JSON.stringify({
    type: 'info',
    text: `ขณะนี้มี ${clients.size} client${clients.size > 1 ? 's' : ''} กำลังเชื่อมต่ออยู่`
  }));
});

// ---------- เริ่ม server ----------
server.listen(PORT, () => {
  console.log(`
========================================================
  WebSocket Server เริ่มทำงานที่ http://localhost:${PORT}
  (กด Ctrl+C เพื่อหยุดการทำงาน)
========================================================
  `);
});

// ---------- จัดการเหตุการณ์ปิดโปรแกรม ----------
process.on('SIGINT', () => {
  console.log('\n[INFO] กำลังปิด WebSocket Server...');
  
  // ส่งข้อความแจ้งเตือนการปิดเซิร์ฟเวอร์ไปยังทุก clients
  broadcast({
    type: 'info',
    text: 'Server กำลังปิดลง กรุณาเชื่อมต่อใหม่ภายหลัง'
  });
  
  // ปิดการเชื่อมต่อทั้งหมดอย่างสมบูรณ์
  wss.clients.forEach(client => {
    client.close(1000, 'Server shutting down');
  });
  
  // ปิด server หลังจากส่งข้อความเสร็จ
  setTimeout(() => {
    server.close(() => {
      console.log('[INFO] WebSocket Server ปิดการทำงานเรียบร้อยแล้ว');
      process.exit(0);
    });
  }, 1000);
});

/**
 * คำแนะนำเพิ่มเติมสำหรับการใช้งาน WebSocket Server นี้:
 * 
 * 1. WebSocket Server นี้จะให้บริการทั้ง WebSocket และ HTTP
 *    โดย HTTP จะให้บริการหน้า web client อย่างง่าย
 * 
 * 2. เมื่อเริ่มต้น Server ให้เข้าถึง http://localhost:8080 ในเบราว์เซอร์
 *    เพื่อใช้งาน web client สำหรับทดสอบ
 * 
 * 3. ลองเปิดหลายแท็บ/เบราว์เซอร์เพื่อจำลองการสนทนาระหว่างหลาย clients
 * 
 * 4. โปรแกรมเก็บการเชื่อมต่อทั้งหมดไว้ใน memory ดังนั้นถ้ารีสตาร์ท server
 *    การเชื่อมต่อและข้อความทั้งหมดจะหายไป
 * 
 * 5. ทดลองปรับแต่งโปรแกรม:
 *    - เพิ่มการเข้ารหัสข้อความ
 *    - เพิ่มการยืนยันตัวตนก่อนเชื่อมต่อ WebSocket
 *    - เพิ่มการสนับสนุนห้องสนทนา (chat rooms)
 *    - บันทึกประวัติข้อความลงในฐานข้อมูล
 */
