/**
 * Exercise 11: การรักษาความปลอดภัยของโปรโตคอล MQTT ด้วย TLS/SSL
 *
 * แบบฝึกหัดนี้จะเรียนรู้การเชื่อมต่อ MQTT client กับ broker โดยใช้การเข้ารหัส TLS/SSL
 * เพื่อรักษาความปลอดภัยในการสื่อสาร
 *
 * ข้อกำหนด:
 * 1. สร้าง MQTT broker ที่รองรับ TLS/SSL (เช่น Mosquitto)
 * 2. สร้าง certificates สำหรับ broker และ client
 * 3. แก้ไข MQTT client ให้เชื่อมต่อกับ broker โดยใช้ TLS/SSL
 *
 * การติดตั้งไลบรารี:
 * npm install mqtt
 *
 * การสร้าง certificates (ตัวอย่าง):
 * openssl genrsa -out ca.key 2048
 * openssl req -new -x509 -days 365 -key ca.key -out ca.crt
 * openssl genrsa -out client.key 2048
 * openssl req -new -key client.key -out client.csr
 * openssl x509 -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out client.crt
 */

const mqtt = require('mqtt');
const fs = require('fs');

// ---------- กำหนดค่าการเชื่อมต่อ ----------
const MQTT_BROKER = 'mqtt://localhost:8883'; // ที่อยู่ MQTT Broker (TLS port)
const CLIENT_ID = `mqtt_tls_client_${Math.random().toString(16).slice(3)}`; // สร้าง ID แบบสุ่ม
const PUBLISH_TOPIC = 'workshop/exercise11/data'; // หัวข้อที่จะส่งข้อมูล
const SUBSCRIBE_TOPIC = 'workshop/exercise11/command'; // หัวข้อที่จะรับข้อมูล

// ---------- ตัวเลือกการเชื่อมต่อ (TLS/SSL) ----------
const options = {
    clientId: CLIENT_ID,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
    // เพิ่ม TLS/SSL options
    // ca: fs.readFileSync('ca.crt'),       // CA certificate
    // cert: fs.readFileSync('client.crt'),   // Client certificate
    // key: fs.readFileSync('client.key'),    // Client private key
    // rejectUnauthorized: true              // ตรวจสอบความถูกต้องของ certificate
};

// ---------- สร้างการเชื่อมต่อ MQTT ----------
console.log(`[INFO] กำลังเชื่อมต่อกับ MQTT broker (TLS): ${MQTT_BROKER}`);
console.log(`[INFO] Client ID: ${CLIENT_ID}`);
const client = mqtt.connect(MQTT_BROKER, options);

// ---------- จัดการเหตุการณ์เมื่อเชื่อมต่อสำเร็จ ----------
client.on('connect', () => {
    console.log('[SUCCESS] เชื่อมต่อกับ MQTT Broker (TLS) สำเร็จ!');

    // สมัครสมาชิกเพื่อรับข้อความ
    client.subscribe(SUBSCRIBE_TOPIC, (err) => {
        if (!err) {
            console.log(`[INFO] สมัครสมาชิกหัวข้อ: ${SUBSCRIBE_TOPIC} สำเร็จ`);

            // เมื่อเชื่อมต่อสำเร็จและสมัครสมาชิกแล้ว จะเริ่มส่งข้อความทุก 5 วินาที
            sendPeriodicMessage();
        } else {
            console.error('[ERROR] เกิดข้อผิดพลาดในการสมัครสมาชิก:', err);
        }
    });
});

// ---------- ฟังก์ชันสำหรับส่งข้อความเป็นระยะ ----------
function sendPeriodicMessage() {
    console.log('[INFO] เริ่มส่งข้อมูลไปยัง MQTT Broker (TLS) ทุก 5 วินาที');

    setInterval(() => {
        // สร้างข้อมูลจำลอง
        const message = {
            device: CLIENT_ID,
            timestamp: new Date().toISOString(),
            values: {
                temperature: +(20 + Math.random() * 10).toFixed(1), // สุ่มอุณหภูมิ 20-30°C
                humidity: +(40 + Math.random() * 20).toFixed(1),     // สุ่มความชื้น 40-60%
                pressure: +(1000 + Math.random() * 30).toFixed(1)    // สุ่มความกดอากาศ 1000-1030 hPa
            }
        };

        // แปลงเป็น JSON string และส่ง
        const payload = JSON.stringify(message);

        // ส่งข้อความ (QoS 0: ส่งครั้งเดียวไม่สนใจว่าถึงหรือไม่)
        client.publish(PUBLISH_TOPIC, payload, { qos: 0 }, (err) => {
            if (err) {
                console.error('[ERROR] เกิดข้อผิดพลาดในการส่งข้อความ:', err);
            } else {
                console.log(`[INFO] ส่งข้อความไปยัง ${PUBLISH_TOPIC}: ${payload}`);
            }
        });
    }, 5000); // ส่งทุก 5 วินาที
}

// ---------- จัดการเหตุการณ์เมื่อได้รับข้อความใหม่ ----------
client.on('message', (topic, message) => {
    // แสดงข้อมูลที่ได้รับ
    console.log(`[INFO] ได้รับข้อความจากหัวข้อ ${topic}: ${message.toString()}`);

    try {
        // แปลงข้อความเป็น JSON object
        const data = JSON.parse(message.toString());
        console.log('[INFO] ข้อมูล JSON:', data);

        // ตัวอย่างการตอบสนองต่อคำสั่งที่ได้รับ
        if (data.command) {
            processCommand(data.command, data);
        }
    } catch (e) {
        console.log('[WARN] ข้อความไม่ใช่รูปแบบ JSON:', e.message);
    }
});

// ---------- ฟังก์ชันประมวลผลคำสั่ง ----------
function processCommand(command, data) {
    console.log(`[INFO] ประมวลผลคำสั่ง: ${command}`);

    switch (command.toLowerCase()) {
        case 'ping':
            // ตอบกลับคำสั่ง ping ด้วย pong
            const response = {
                type: 'response',
                to: data.from || 'unknown',
                from: CLIENT_ID,
                command: 'pong',
                timestamp: new Date().toISOString()
            };
            client.publish(`${SUBSCRIBE_TOPIC}/response`, JSON.stringify(response));
            console.log('[INFO] ตอบกลับคำสั่ง ping ด้วย pong');
            break;

        case 'status':
            // ส่งข้อมูลสถานะของ client
            const status = {
                type: 'status',
                device: CLIENT_ID,
                timestamp: new Date().toISOString(),
                uptime: process.uptime().toFixed(0),
                memory: process.memoryUsage()
            };
            client.publish(`${SUBSCRIBE_TOPIC}/response`, JSON.stringify(status));
            console.log('[INFO] ส่งข้อมูลสถานะแล้ว');
            break;

        default:
            console.log(`[WARN] ไม่รู้จักคำสั่ง: ${command}`);
    }
}

// ---------- จัดการเหตุการณ์ข้อผิดพลาดต่างๆ ----------
client.on('error', (err) => {
    console.error('[ERROR] เกิดข้อผิดพลาด:', err);
});

client.on('reconnect', () => {
    console.log('[INFO] กำลังพยายามเชื่อมต่อใหม่...');
});

client.on('disconnect', () => {
    console.log('[WARN] ถูกตัดการเชื่อมต่อ');
});

client.on('offline', () => {
    console.log('[WARN] Client ออฟไลน์');
});

// ---------- จัดการการปิดโปรแกรม ----------
process.on('SIGINT', () => {
    console.log('\n[INFO] กำลังปิดการเชื่อมต่อ MQTT...');
    client.end(true, () => {
        console.log('[INFO] ปิดการเชื่อมต่อเรียบร้อย');
        process.exit(0);
    });
});

/**
 * คำแนะนำในการทดสอบ:
 *
 * 1. สร้าง MQTT Broker ที่รองรับ TLS/SSL (เช่น Mosquitto)
 *    และตั้งค่าให้ใช้ certificates ที่สร้างขึ้น
 *
 * 2. แก้ไขไฟล์ mosquitto.conf:
 *    port 8883
 *    cafile /etc/mosquitto/ca_certificates/ca.crt
 *    certfile /etc/mosquitto/certs/mosquitto.crt
 *    keyfile /etc/mosquitto/private/mosquitto.key
 *    tls_version tlsv1.2
 *
 * 3. รันโปรแกรมด้วยคำสั่ง: node 11-mqtt-security-tls.js
 *
 * 4. ใช้ MQTT Client ตัวอื่น (เช่น MQTT Explorer) เพื่อ:
 *    - Subscribe หัวข้อ: workshop/exercise11/data เพื่อดูข้อมูลที่ส่งจาก Client นี้
 *    - Publish ข้อความไปที่หัวข้อ: workshop/exercise11/command เพื่อส่งคำสั่ง
 *      ตัวอย่างคำสั่ง ping: {"command": "ping", "from": "user"}
 *      ตัวอย่างคำสั่ง status: {"command": "status"}
 *
 * 5. ทดลองปรับแต่งโปรแกรม:
 *    - เปลี่ยน topics
 *    - เพิ่มคำสั่งใหม่
 *    - ปรับแต่งรูปแบบข้อมูลที่ส่ง
 */
