/**
 * Exercise 12: การพัฒนาแอปพลิเคชัน IoT แบบครบวงจร
 *
 * แบบฝึกหัดนี้จะสร้างระบบ IoT ครบวงจรที่ใช้ MQTT, WebSocket และ REST API ร่วมกัน
 *
 * ประกอบด้วย:
 * 1. การจำลองอุปกรณ์ IoT ด้วย Python ที่ส่งข้อมูลผ่าน MQTT
 * 2. Backend ที่รวม MQTT, WebSocket และ REST API
 * 3. Web Dashboard สำหรับแสดงผลและควบคุมอุปกรณ์
 * 4. ระบบจัดเก็บข้อมูลลงฐานข้อมูล
 *
 * ข้อกำหนด:
 * 1. สร้าง MQTT Broker (เช่น Mosquitto)
 * 2. สร้าง Database (เช่น MongoDB, InfluxDB)
 * 3. พัฒนา REST API ด้วย Node.js/Express.js สำหรับจัดการอุปกรณ์และข้อมูล
 * 4. พัฒนา WebSocket Server สำหรับส่งข้อมูล real-time ไปยัง Web Dashboard
 * 5. พัฒนา Web Dashboard ด้วย HTML/CSS/JavaScript สำหรับแสดงผลและควบคุมอุปกรณ์
 * 6. สร้าง Python script สำหรับจำลองอุปกรณ์ IoT ที่ส่งข้อมูลไปยัง MQTT Broker
 *
 * การติดตั้งไลบรารี:
 * npm install express mqtt ws mongoose dotenv cors helmet morgan
 * pip install paho-mqtt
 */

// ---------- Dependencies ----------
const express = require('express');
const mqtt = require('mqtt');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');

// ---------- Load environment variables ----------
dotenv.config();

// ---------- Configuration ----------
const CONFIG = {
    port: process.env.PORT || 8080,
    mqttBroker: process.env.MQTT_BROKER || 'mqtt://localhost:1883',
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/iot_data',
    topicPrefix: 'iot',
    deviceName: 'sensor-node'
};

// ---------- Express App ----------
const app = express();

// ---------- Middleware ----------
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// ---------- Mongoose Setup ----------
mongoose.connect(CONFIG.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// ---------- Data Model ----------
const DataSchema = new mongoose.Schema({
    deviceId: String,
    timestamp: Date,
    temperature: Number,
    humidity: Number,
    pressure: Number
});

const DataModel = mongoose.model('SensorData', DataSchema);

// ---------- MQTT Client ----------
console.log(`[MQTT] Connecting to broker: ${CONFIG.mqttBroker}`);
const mqttClient = mqtt.connect(CONFIG.mqttBroker, {
    clientId: `backend_${Math.random().toString(16).slice(3)}`,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
});

mqttClient.on('connect', () => {
    console.log('[MQTT] Connected');
    mqttClient.subscribe(`${CONFIG.topicPrefix}/${CONFIG.deviceName}/data`);
});

mqttClient.on('message', async (topic, message) => {
    try {
        const payload = JSON.parse(message.toString());
        console.log(`[MQTT] Received data: ${topic}`, payload);

        // Save to database
        const data = new DataModel({
            deviceId: CONFIG.deviceName,
            timestamp: payload.timestamp,
            temperature: payload.temperature,
            humidity: payload.humidity,
            pressure: payload.pressure
        });
        await data.save();

        // Notify WebSocket clients
        broadcast(JSON.stringify({ type: 'data', data: payload }));

    } catch (error) {
        console.error('MQTT message error:', error);
    }
});

// ---------- WebSocket Server ----------
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('[WS] Client connected');
    ws.send(JSON.stringify({ type: 'status', message: 'Connected to WebSocket server' }));

    ws.on('close', () => console.log('[WS] Client disconnected'));
    ws.on('error', console.error);
});

function broadcast(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// ---------- REST API Endpoints ----------
app.get('/api/data', async (req, res) => {
    try {
        const data = await DataModel.find().sort({ timestamp: -1 }).limit(100);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ---------- Start Server ----------
server.listen(CONFIG.port, () => {
    console.log(`Server started on port ${CONFIG.port}`);
});

// ---------- Error handling ----------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// ---------- Cleanup on exit ----------
process.on('SIGINT', () => {
    console.log('Closing connections...');
    mqttClient.end();
    mongoose.connection.close();
    wss.close();
    server.close(() => console.log('Server closed'));
});

/**
 * คำแนะนำเพิ่มเติม:
 *
 * 1. สร้าง Python script สำหรับจำลองอุปกรณ์ IoT ที่ส่งข้อมูลไปยัง MQTT Broker
 *    (ดูตัวอย่างจาก exercise 2)
 *
 * 2. พัฒนา Web Dashboard ด้วย HTML/CSS/JavaScript สำหรับแสดงผลและควบคุมอุปกรณ์
 *    (ใช้ข้อมูลจาก REST API และ WebSocket)
 *
 * 3. ทดลองปรับแต่งโปรแกรม:
 *    - เพิ่มระบบ Authentication
 *    - เพิ่มการควบคุมอุปกรณ์ผ่าน REST API และ MQTT
 *    - เพิ่มการวิเคราะห์ข้อมูล
 */
