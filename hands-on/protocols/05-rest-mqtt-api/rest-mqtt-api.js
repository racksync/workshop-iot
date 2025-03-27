/**
 * Exercise : REST API ที่ทำงานร่วมกับ MQTT
 * 
 * แบบฝึกหัดนี้จะสร้าง REST API ที่สามารถส่งและรับข้อมูลผ่าน MQTT
 * โดยใช้ Express.js เป็น web framework และเชื่อมต่อกับ MQTT broker
 * 
 * การติดตั้งไลบรารี:
 * npm install express mqtt cors helmet morgan
 */

const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// ---------- กำหนดค่าการเชื่อมต่อ ----------
const CONFIG = {
    port: process.env.PORT || 3000,
    mqttBroker: process.env.MQTT_BROKER || 'mqtt://localhost:1883',
    mqttClientId: `rest_mqtt_bridge_${Math.random().toString(16).slice(3)}`,
    topicPrefix: 'api/v1'
};

// ---------- สร้าง Express App ----------
const app = express();

// ---------- Middleware ----------
app.use(cors());                // อนุญาต Cross-Origin Resource Sharing
app.use(helmet());             // เพิ่มความปลอดภัยพื้นฐาน
app.use(express.json());       // แปลง JSON request body
app.use(morgan('dev'));        // บันทึก HTTP requests

// ---------- ตัวแปรสำหรับเก็บข้อมูล ----------
const deviceStates = new Map();     // เก็บสถานะล่าสุดของอุปกรณ์
const messageHistory = new Map();    // เก็บประวัติข้อความแต่ละ topic
const subscriptions = new Set();     // เก็บรายการ topics ที่ subscribe

// ---------- เชื่อมต่อกับ MQTT Broker ----------
console.log(`[MQTT] กำลังเชื่อมต่อกับ MQTT Broker: ${CONFIG.mqttBroker}`);
const mqttClient = mqtt.connect(CONFIG.mqttBroker, {
    clientId: CONFIG.mqttClientId,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
    username: 'mqtt',
    password: 'mqtt1234'
});

// ---------- MQTT Event Handlers ----------
mqttClient.on('connect', () => {
    console.log('[MQTT] เชื่อมต่อสำเร็จ');
    
    // Subscribe topics เดิมหลังจากเชื่อมต่อใหม่
    subscriptions.forEach(topic => {
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
        // แปลงข้อความเป็น JSON
        const payload = JSON.parse(message.toString());
        
        // เก็บข้อความล่าสุด
        messageHistory.set(topic, {
            topic,
            payload,
            timestamp: new Date().toISOString()
        });
        
        // ถ้าเป็น topic ของอุปกรณ์ ให้อัพเดทสถานะ
        if (topic.startsWith(`${CONFIG.topicPrefix}/devices/`)) {
            const deviceId = topic.split('/')[3];
            deviceStates.set(deviceId, {
                ...payload,
                lastUpdate: new Date().toISOString()
            });
        }
        
    } catch (error) {
        console.error('[MQTT] เกิดข้อผิดพลาดในการประมวลผลข้อความ:', error);
    }
});

mqttClient.on('error', (error) => {
    console.error('[MQTT] เกิดข้อผิดพลาด:', error);
});

// ---------- REST API Endpoints ----------

// สถานะการทำงาน
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        mqtt: mqttClient.connected ? 'connected' : 'disconnected',
        subscribedTopics: Array.from(subscriptions),
        deviceCount: deviceStates.size,
        messageCount: messageHistory.size
    });
});

// ดูรายการอุปกรณ์และสถานะ
app.get('/api/devices', (req, res) => {
    const devices = Array.from(deviceStates.entries()).map(([id, state]) => ({
        id,
        ...state
    }));
    res.json({ devices });
});

// ดูสถานะอุปกรณ์เฉพาะตัว
app.get('/api/devices/:deviceId', (req, res) => {
    const { deviceId } = req.params;
    const state = deviceStates.get(deviceId);
    
    if (state) {
        res.json({ device: { id: deviceId, ...state }});
    } else {
        res.status(404).json({ error: 'ไม่พบอุปกรณ์' });
    }
});

// ส่งคำสั่งไปยังอุปกรณ์
app.post('/api/devices/:deviceId/command', (req, res) => {
    const { deviceId } = req.params;
    const { command, params } = req.body;
    
    if (!command) {
        return res.status(400).json({ error: 'ต้องระบุคำสั่ง' });
    }
    
    const topic = `${CONFIG.topicPrefix}/devices/${deviceId}/command`;
    const message = {
        command,
        params: params || {},
        timestamp: new Date().toISOString()
    };
    
    try {
        mqttClient.publish(topic, JSON.stringify(message));
        res.json({ success: true, message: 'ส่งคำสั่งสำเร็จ' });
    } catch (error) {
        res.status(500).json({ error: 'ไม่สามารถส่งคำสั่งได้' });
    }
});

// ส่งข้อความไปยัง MQTT topic
app.post('/api/publish', (req, res) => {
    const { topic, message } = req.body;
    
    if (!topic || !message) {
        return res.status(400).json({ error: 'ต้องระบุทั้ง topic และ message' });
    }
    
    try {
        const payload = typeof message === 'string' ? message : JSON.stringify(message);
        mqttClient.publish(topic, payload);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'ไม่สามารถส่งข้อความได้' });
    }
});

// Subscribe MQTT topic
app.post('/api/subscribe', (req, res) => {
    const { topic } = req.body;
    
    if (!topic) {
        return res.status(400).json({ error: 'ต้องระบุ topic' });
    }
    
    try {
        mqttClient.subscribe(topic, (err) => {
            if (err) {
                res.status(500).json({ error: 'ไม่สามารถ subscribe topic ได้' });
            } else {
                subscriptions.add(topic);
                res.json({ success: true });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
    }
});

// ดูประวัติข้อความ
app.get('/api/messages', (req, res) => {
    const messages = Array.from(messageHistory.values());
    res.json({ messages });
});

// ---------- Error Handling Middleware ----------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
});

// ---------- เริ่ม Server ----------
app.listen(CONFIG.port, () => {
    console.log(`
========================================================
  REST API พร้อมใช้งานที่ http://localhost:${CONFIG.port}
  MQTT Broker: ${CONFIG.mqttBroker}
  (กด Ctrl+C เพื่อปิดโปรแกรม)
========================================================
    `);
});

// ---------- จัดการการปิดโปรแกรม ----------
process.on('SIGINT', () => {
    console.log('\nกำลังปิดการเชื่อมต่อ...');
    
    mqttClient.end(true, () => {
        console.log('ปิดการเชื่อมต่อ MQTT เรียบร้อย');
        process.exit(0);
    });
});

/**
 * วิธีการทดสอบ API:
 * 
 * 1. ตรวจสอบสถานะ:
 *    curl http://localhost:3000/api/status
 * 
 * 2. ส่งข้อความไปยัง MQTT:
 *    curl -X POST http://localhost:3000/api/publish \
 *         -H "Content-Type: application/json" \
 *         -d '{"topic":"test/topic","message":{"value":123}}'
 *    
 *    Postman: 
 *    - Method: POST
 *    - URL: http://localhost:3000/api/publish
 *    - Headers: Content-Type: application/json
 *    - Body: เลือก "raw" และ "JSON", แล้วใส่ {"topic":"test/topic","message":{"value":123}}
 * 
 * 3. Subscribe topic:
 *    curl -X POST http://localhost:3000/api/subscribe \
 *         -H "Content-Type: application/json" \
 *         -d '{"topic":"test/#"}'
 *    
 *    Postman:
 *    - Method: POST
 *    - URL: http://localhost:3000/api/subscribe
 *    - Headers: Content-Type: application/json
 *    - Body: เลือก "raw" และ "JSON", แล้วใส่ {"topic":"test/#"}
 * 
 * 4. ดูรายการอุปกรณ์:
 *    curl http://localhost:3000/api/devices
 * 
 * 5. ส่งคำสั่งไปยังอุปกรณ์:
 *    curl -X POST http://localhost:3000/api/devices/device1/command \
 *         -H "Content-Type: application/json" \
 *         -d '{"command":"turnOn","params":{"brightness":100}}'
 *    
 *    Postman:
 *    - Method: POST
 *    - URL: http://localhost:3000/api/devices/device1/command
 *    - Headers: Content-Type: application/json
 *    - Body: เลือก "raw" และ "JSON", แล้วใส่ {"command":"turnOn","params":{"brightness":100}}
 * 
 * 6. ดูประวัติข้อความ:
 *    curl http://localhost:3000/api/messages
 * 
 * หมายเหตุ: ต้องมี MQTT Broker (เช่น Mosquitto) ทำงานอยู่ที่ localhost:1883
 */
