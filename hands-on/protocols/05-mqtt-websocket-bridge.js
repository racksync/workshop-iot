/**
 * Exercise 5: MQTT-WebSocket Bridge
 * 
 * แบบฝึกหัดนี้จะเรียนรู้การสร้างตัวกลางเชื่อมต่อ (Bridge) ระหว่าง MQTT และ WebSocket
 * เพื่อให้เว็บแอปพลิเคชันสามารถรับและส่งข้อมูลผ่าน MQTT แบบ real-time ได้โดยไม่ต้องใช้ MQTT โดยตรง
 * 
 * การติดตั้งไลบรารี:
 * npm install mqtt ws express cors dotenv
 */

const mqtt = require('mqtt');
const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const http = require('http');

// ---------- กำหนดค่าการเชื่อมต่อ ----------
const CONFIG = {
    httpPort: process.env.PORT || 8080,
    mqttBroker: process.env.MQTT_BROKER || 'mqtt://localhost:1883',
    mqttTopics: ['sensor/#', 'device/#', 'workshop/#'],
    clientId: `mqtt_ws_bridge_${Math.random().toString(16).slice(3)}`
};

// ---------- สร้าง Express App และ HTTP Server ----------
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// ---------- ตัวแปรสำหรับเก็บสถานะ ----------
const wsClients = new Set();
const messageHistory = new Map();
let mqttClient;

// ---------- เชื่อมต่อกับ MQTT Broker ----------
function connectMQTT() {
    console.log(`[MQTT] กำลังเชื่อมต่อกับ MQTT Broker: ${CONFIG.mqttBroker}`);
    
    mqttClient = mqtt.connect(CONFIG.mqttBroker, {
        clientId: CONFIG.clientId,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000
    });

    mqttClient.on('connect', () => {
        console.log('[MQTT] เชื่อมต่อสำเร็จ');
        
        // Subscribe ทุก topic ที่กำหนด
        CONFIG.mqttTopics.forEach(topic => {
            mqttClient.subscribe(topic, (err) => {
                if (err) {
                    console.error(`[MQTT] ไม่สามารถ subscribe topic ${topic}:`, err);
                } else {
                    console.log(`[MQTT] Subscribed to ${topic}`);
                }
            });
        });
    });

    mqttClient.on('message', (topic, message) => {
        try {
            // แปลงข้อความเป็น JSON หรือใช้ข้อความดิบถ้าแปลงไม่ได้
            let payload = message.toString();
            try {
                payload = JSON.parse(payload);
            } catch (e) {
                // ถ้าแปลงเป็น JSON ไม่ได้ ใช้ข้อความดิบ
            }

            // สร้างข้อความที่จะส่งให้ WebSocket clients
            const wsMessage = {
                type: 'mqtt',
                topic: topic,
                payload: payload,
                timestamp: new Date().toISOString()
            };

            // เก็บข้อความล่าสุดของแต่ละ topic
            messageHistory.set(topic, wsMessage);

            // ส่งให้ทุก WebSocket clients
            broadcastToWebSockets(wsMessage);

        } catch (error) {
            console.error('[MQTT] เกิดข้อผิดพลาดในการประมวลผลข้อความ:', error);
        }
    });

    mqttClient.on('error', (error) => {
        console.error('[MQTT] เกิดข้อผิดพลาด:', error);
    });
}

// ---------- จัดการ WebSocket Connections ----------
wss.on('connection', (ws, req) => {
    console.log('[WS] Client เชื่อมต่อใหม่');
    wsClients.add(ws);

    // ส่งข้อความต้อนรับ
    ws.send(JSON.stringify({
        type: 'welcome',
        message: 'เชื่อมต่อกับ MQTT-WebSocket Bridge สำเร็จ',
        topics: CONFIG.mqttTopics
    }));

    // ส่งข้อความล่าสุดของแต่ละ topic
    const latestMessages = Array.from(messageHistory.values());
    if (latestMessages.length > 0) {
        ws.send(JSON.stringify({
            type: 'history',
            messages: latestMessages
        }));
    }

    // รับข้อความจาก WebSocket client
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);

            if (message.action === 'publish' && message.topic && message.payload) {
                // ส่งข้อความไปยัง MQTT
                mqttClient.publish(message.topic, 
                    typeof message.payload === 'string' 
                        ? message.payload 
                        : JSON.stringify(message.payload)
                );

                console.log(`[WS->MQTT] ส่งข้อความไปยัง ${message.topic}`);
            }
        } catch (error) {
            console.error('[WS] เกิดข้อผิดพลาดในการประมวลผลข้อความ:', error);
        }
    });

    // จัดการเมื่อ client ตัดการเชื่อมต่อ
    ws.on('close', () => {
        console.log('[WS] Client ตัดการเชื่อมต่อ');
        wsClients.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('[WS] เกิดข้อผิดพลาด:', error);
        wsClients.delete(ws);
    });
});

// ---------- ฟังก์ชั่นสำหรับส่งข้อความไปยังทุก WebSocket Clients ----------
function broadcastToWebSockets(message) {
    const messageStr = JSON.stringify(message);
    wsClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(messageStr);
        }
    });
}

// ---------- REST API Endpoints ----------
// สถานะของ Bridge
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        mqtt: mqttClient?.connected ? 'connected' : 'disconnected',
        websocket: {
            clients: wsClients.size
        },
        topics: CONFIG.mqttTopics,
        messageHistory: {
            topics: messageHistory.size
        }
    });
});

// ดูข้อความล่าสุดของแต่ละ topic
app.get('/api/messages', (req, res) => {
    res.json({
        messages: Array.from(messageHistory.values())
    });
});

// ส่งข้อความไปยัง MQTT ผ่าน HTTP POST
app.post('/api/publish', (req, res) => {
    const { topic, payload } = req.body;

    if (!topic || !payload) {
        return res.status(400).json({ error: 'ต้องระบุทั้ง topic และ payload' });
    }

    try {
        mqttClient.publish(topic, 
            typeof payload === 'string' ? payload : JSON.stringify(payload)
        );
        res.json({ success: true, topic });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ---------- เริ่มการทำงาน ----------
server.listen(CONFIG.httpPort, () => {
    console.log(`
========================================================
  MQTT-WebSocket Bridge กำลังทำงานที่ port ${CONFIG.httpPort}
  MQTT Broker: ${CONFIG.mqttBroker}
  Topics: ${CONFIG.mqttTopics.join(', ')}
  (กด Ctrl+C เพื่อปิดโปรแกรม)
========================================================
    `);
    connectMQTT();
});

// ---------- จัดการการปิดโปรแกรม ----------
process.on('SIGINT', () => {
    console.log('\nกำลังปิดการเชื่อมต่อ...');
    
    // ปิดการเชื่อมต่อ MQTT
    if (mqttClient) {
        mqttClient.end();
    }
    
    // ปิดการเชื่อมต่อ WebSocket ทั้งหมด
    wsClients.forEach(client => {
        client.close();
    });
    
    // ปิด HTTP server
    server.close(() => {
        console.log('ปิดโปรแกรมเรียบร้อย');
        process.exit(0);
    });
});

/**
 * วิธีการทดสอบ:
 * 
 * 1. เริ่ม MQTT Broker (เช่น Mosquitto):
 *    mosquitto -v
 * 
 * 2. รัน Bridge:
 *    node 05-mqtt-websocket-bridge.js
 * 
 * 3. เชื่อมต่อผ่าน WebSocket จาก browser:
 *    const ws = new WebSocket('ws://localhost:8080');
 *    ws.onmessage = (event) => console.log(JSON.parse(event.data));
 * 
 * 4. ส่งข้อความผ่าน MQTT (ใช้ mosquitto_pub):
 *    mosquitto_pub -t "sensor/temp" -m "{"value": 25.5}"
 * 
 * 5. ส่งข้อความจาก WebSocket ไปยัง MQTT:
 *    ws.send(JSON.stringify({
 *      action: 'publish',
 *      topic: 'device/status',
 *      payload: { status: 'active' }
 *    }));
 * 
 * 6. ตรวจสอบสถานะผ่าน API:
 *    curl http://localhost:8080/api/status
 * 
 * 7. ดูข้อความล่าสุดผ่าน API:
 *    curl http://localhost:8080/api/messages
 * 
 * 8. ส่งข้อความผ่าน HTTP POST:
 *    curl -X POST http://localhost:8080/api/publish \
 *         -H "Content-Type: application/json" \
 *         -d '{"topic":"test/topic","payload":{"value":123}}'
 */
