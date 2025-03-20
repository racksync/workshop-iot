/**
 * Exercise 13: การกำหนดสิทธิ์การเข้าถึง (Access Control) สำหรับ MQTT
 *
 * แบบฝึกหัดนี้จะเรียนรู้และพัฒนาระบบควบคุมสิทธิ์การเข้าถึงหัวข้อใน MQTT
 * โดยกำหนดสิทธิ์ให้ clients ต่างๆ สามารถเข้าถึง topics เฉพาะที่ได้รับอนุญาตเท่านั้น
 *
 * ข้อกำหนด:
 * 1. ติดตั้ง MQTT Broker ที่รองรับการ Authentication และ Authorization (เช่น EMQX, Mosquitto with plugin)
 * 2. กำหนด ACL (Access Control List) เพื่อกำหนดสิทธิ์การเข้าถึง topics ต่างๆ
 * 3. สร้าง clients ที่มีสิทธิ์แตกต่างกัน และทดสอบการเข้าถึง topics
 *
 * การติดตั้งไลบรารี:
 * npm install mqtt
 */

const mqtt = require('mqtt');

// ---------- กำหนดค่าการเชื่อมต่อ ----------
const MQTT_BROKER = 'mqtt://localhost:1883'; // ที่อยู่ MQTT Broker
const BASE_TOPIC = 'workshop/acl';

// ---------- ฟังก์ชันสำหรับสร้าง MQTT Client ----------
function createClient(clientId, username, password, permissions) {
    const options = {
        clientId: clientId,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
        username: username,
        password: password
    };

    console.log(`[INFO] สร้าง MQTT Client: ${clientId}`);
    const client = mqtt.connect(MQTT_BROKER, options);

    client.on('connect', () => {
        console.log(`[SUCCESS] Client ${clientId} เชื่อมต่อกับ MQTT Broker สำเร็จ`);

        // ทดสอบสิทธิ์ในการ subscribe
        permissions.subscribe.forEach(topic => {
            const fullTopic = `${BASE_TOPIC}/${topic}`;
            client.subscribe(fullTopic, (err) => {
                if (!err) {
                    console.log(`[INFO] Client ${clientId} สมัครสมาชิกหัวข้อ: ${fullTopic} สำเร็จ`);
                } else {
                    console.error(`[ERROR] Client ${clientId} ไม่สามารถสมัครสมาชิกหัวข้อ ${fullTopic}:`, err);
                }
            });
        });

        // ทดสอบสิทธิ์ในการ publish
        permissions.publish.forEach(topic => {
            const fullTopic = `${BASE_TOPIC}/${topic}`;
            const message = `Hello from ${clientId} to ${fullTopic}`;

            // หน่วงเวลาเล็กน้อยก่อน publish เพื่อให้แน่ใจว่า subscribe เสร็จสิ้น
            setTimeout(() => {
                client.publish(fullTopic, message, (err) => {
                    if (!err) {
                        console.log(`[INFO] Client ${clientId} ส่งข้อความไปยัง ${fullTopic}: ${message}`);
                    } else {
                        console.error(`[ERROR] Client ${clientId} ไม่สามารถส่งข้อความไปยัง ${fullTopic}:`, err);
                    }
                });
            }, 1000);
        });
    });

    client.on('message', (topic, message) => {
        console.log(`[MESSAGE] Client ${clientId} ได้รับข้อความจาก ${topic}: ${message.toString()}`);
    });

    client.on('error', (err) => {
        console.error(`[ERROR] Client ${clientId} เกิดข้อผิดพลาด:`, err);
    });

    return client;
}

// ---------- กำหนดสิทธิ์การเข้าถึง ----------
const ACL = {
    'user1': {
        username: 'user1',
        password: 'password1',
        permissions: {
            subscribe: ['topic1', 'topic2'],
            publish: ['topic1']
        }
    },
    'user2': {
        username: 'user2',
        password: 'password2',
        permissions: {
            subscribe: ['topic2', 'topic3'],
            publish: ['topic2']
        }
    },
    'user3': {
        username: 'user3',
        password: 'password3',
        permissions: {
            subscribe: ['topic3'],
            publish: [] // ไม่มีสิทธิ์ publish
        }
    }
};

// ---------- สร้าง Clients ----------
const client1 = createClient('client1', ACL.user1.username, ACL.user1.password, ACL.user1.permissions);
const client2 = createClient('client2', ACL.user2.username, ACL.user2.password, ACL.user2.permissions);
const client3 = createClient('client3', ACL.user3.username, ACL.user3.password, ACL.user3.permissions);

// ---------- จัดการการปิดโปรแกรม ----------
process.on('SIGINT', () => {
    console.log('\n[INFO] กำลังปิดการเชื่อมต่อ MQTT...');
    client1.end(true);
    client2.end(true);
    client3.end(true);
    console.log('[INFO] ปิดการเชื่อมต่อเรียบร้อย');
    process.exit(0);
});

/**
 * คำแนะนำในการทดสอบ:
 *
 * 1. ติดตั้ง MQTT Broker ที่รองรับการ Authentication และ Authorization (เช่น EMQX, Mosquitto with plugin)
 *    และตั้งค่าให้ใช้ username/password และ ACL ที่กำหนด
 *
 * 2. รันโปรแกรมด้วยคำสั่ง: node 13-mqtt-access-control.js
 *
 * 3. ตรวจสอบผลลัพธ์:
 *    - Clients ควรจะสามารถ subscribe และ publish ไปยัง topics ที่ได้รับอนุญาตเท่านั้น
 *    - Clients ไม่ควรจะสามารถ subscribe หรือ publish ไปยัง topics ที่ไม่ได้รับอนุญาต
 *
 * 4. ทดลองปรับแต่งโปรแกรม:
 *    - เพิ่ม clients ที่มีสิทธิ์แตกต่างกัน
 *    - เปลี่ยนแปลง ACL และทดสอบผลลัพธ์
 *    - ใช้ wildcards ใน ACL (เช่น topic/#, topic/+)
 */
