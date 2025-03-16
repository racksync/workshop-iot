/**
 * ตัวอย่างการใช้งาน MQTT Client ด้วย JavaScript
 * สำหรับประกอบการเรียนการสอนในบทที่ 1: โปรโตคอลพื้นฐาน
 * 
 * ก่อนใช้งานต้องติดตั้ง mqtt.js ด้วยคำสั่ง: npm install mqtt
 */

const mqtt = require('mqtt');
const random = require('crypto').randomBytes;

// กำหนดค่าการเชื่อมต่อ
const MQTT_BROKER = 'mqtt://localhost:1883';
const CLIENT_ID = `js-mqtt-client-${random(4).toString('hex')}`;
const PUBLISH_TOPIC = 'sensor/temperature/js';
const SUBSCRIBE_TOPIC = 'sensor/#';

// สร้างตัวแปรสำหรับเก็บ client
let client;

// ฟังก์ชันสำหรับสร้างข้อมูลเซนเซอร์จำลอง
function generateSensorData() {
  return {
    temperature: +(20.0 + Math.random() * 10.0).toFixed(1),
    humidity: +(30.0 + Math.random() * 40.0).toFixed(1),
    unit: 'celsius',
    timestamp: new Date().toISOString(),
    client: CLIENT_ID
  };
}

// ฟังก์ชันสำหรับเริ่มการส่งข้อมูล
function startPublishing() {
  console.log('เริ่มส่งข้อมูลทุก 5 วินาที...');
  
  // ส่งข้อมูลทุก 5 วินาที
  const interval = setInterval(() => {
    // สร้างข้อมูลจำลอง
    const data = generateSensorData();
    const payload = JSON.stringify(data);
    
    // ส่งข้อมูล
    console.log(`กำลังส่งข้อมูลไปที่ ${PUBLISH_TOPIC}: ${payload}`);
    client.publish(PUBLISH_TOPIC, payload, { qos: 1 }, (err) => {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการส่งข้อมูล:', err);
      }
    });
  }, 5000);

  // คืนค่า interval เพื่อให้สามารถยกเลิกได้ภายหลัง
  return interval;
}

// การเชื่อมต่อกับ MQTT Broker
function connectToBroker() {
  console.log(`กำลังเชื่อมต่อกับ MQTT Broker ที่ ${MQTT_BROKER} ด้วย ID: ${CLIENT_ID}`);
  
  // สร้าง MQTT client
  client = mqtt.connect(MQTT_BROKER, {
    clientId: CLIENT_ID,
    clean: true,
    connectTimeout: 5000,
    reconnectPeriod: 1000
  });

  // จัดการเหตุการณ์การเชื่อมต่อ
  client.on('connect', () => {
    console.log('เชื่อมต่อสำเร็จ!');
    
    // สมัครรับข้อมูลจากหัวข้อที่สนใจ
    client.subscribe(SUBSCRIBE_TOPIC, { qos: 1 }, (err) => {
      if (!err) {
        console.log(`สมัครรับข้อมูลจากหัวข้อ ${SUBSCRIBE_TOPIC} สำเร็จ`);
        
        // เริ่มส่งข้อมูล
        const publishInterval = startPublishing();
        
        // จัดการการปิดโปรแกรมด้วยการกด Ctrl+C
        process.on('SIGINT', () => {
          console.log('\nกำลังปิดการเชื่อมต่อ...');
          clearInterval(publishInterval);
          client.end();
          process.exit(0);
        });
      } else {
        console.error('เกิดข้อผิดพลาดในการสมัครรับข้อมูล:', err);
      }
    });
  });

  // จัดการเหตุการณ์การรับข้อความ
  client.on('message', (topic, message) => {
    console.log(`ได้รับข้อความจากหัวข้อ: ${topic}`);
    
    try {
      // พยายามแปลงข้อความเป็น JSON
      const payload = JSON.parse(message.toString());
      console.log('ข้อมูลที่ได้รับ:', JSON.stringify(payload, null, 2));
      
      // ตรวจสอบว่าเป็นข้อความจากตัวเองหรือไม่
      if (payload.client === CLIENT_ID) {
        console.log('(นี่เป็นข้อความที่ส่งจากตัวเอง)');
      }
    } catch (e) {
      // ถ้าแปลงเป็น JSON ไม่ได้ แสดงเป็นข้อความธรรมดา
      console.log('ข้อมูลที่ได้รับ (ไม่ใช่ JSON):', message.toString());
    }
    
    console.log('-'.repeat(50));
  });

  // จัดการเหตุการณ์ข้อผิดพลาด
  client.on('error', (err) => {
    console.error('เกิดข้อผิดพลาด:', err);
  });
}

// เริ่มการทำงาน
connectToBroker();
