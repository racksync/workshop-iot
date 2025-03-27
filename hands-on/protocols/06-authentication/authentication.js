/**
 * Exercise : Authentication สำหรับ MQTT และ WebSocket
 *
 * แบบฝึกหัดนี้จะเพิ่มระบบยืนยันตัวตนให้กับการเชื่อมต่อ MQTT และ WebSocket
 * โดยใช้ JWT (JSON Web Tokens) เพื่อตรวจสอบสิทธิ์ก่อนอนุญาตให้เชื่อมต่อ
 * กับ broker หรือ server และกำหนดสิทธิ์ในการเข้าถึง topics ต่างๆ
 *
 * ข้อกำหนด:
 * 1. สร้างระบบ Authentication server ที่สามารถออก JWT tokens
 * 2. แก้ไข MQTT broker ให้ตรวจสอบ JWT token ก่อนอนุญาตให้ client เชื่อมต่อ
 * 3. แก้ไข WebSocket server ให้ตรวจสอบ JWT token ก่อนอนุญาตให้ client เชื่อมต่อ
 *
 * การติดตั้งไลบรารี:
 * npm install express jsonwebtoken bcrypt cors dotenv
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ---------- Secret key สำหรับ JWT (ควรเก็บเป็นความลับ) ----------
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ---------- ข้อมูลผู้ใช้ (จำลอง) ----------
const users = [
    {
        id: 1,
        username: 'admin',
        password: 'password', // ควร hash password ก่อนเก็บใน production
        role: 'admin',
        permissions: ['read:sensor', 'write:device']
    },
    {
        id: 2,
        username: 'user',
        password: 'password',
        role: 'user',
        permissions: ['read:sensor']
    }
];

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());

// ---------- ฟังก์ชันสำหรับสร้าง JWT token ----------
function generateToken(user) {
    const payload = {
        userId: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions
    };

    const options = {
        expiresIn: '1h' // กำหนดอายุของ token
    };

    return jwt.sign(payload, JWT_SECRET, options);
}

// ---------- Endpoint สำหรับ Login ----------
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // ค้นหาผู้ใช้
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).json({ message: 'ไม่พบผู้ใช้' });
    }

    // ตรวจสอบรหัสผ่าน (ควรใช้ bcrypt ใน production)
    if (user.password !== password) {
        return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // สร้าง JWT token
    const token = generateToken(user);

    res.json({ message: 'เข้าสู่ระบบสำเร็จ', token });
});

// ---------- Middleware สำหรับตรวจสอบ JWT token ----------
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'ไม่พบ token' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token ไม่ถูกต้อง' });
        }

        req.user = user;
        next();
    });
}

// ---------- ตัวอย่าง Endpoint ที่ต้องมีการยืนยันตัวตน ----------
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'เข้าถึงข้อมูลสำเร็จ', user: req.user });
});

// ---------- เริ่ม Server ----------
app.listen(port, () => {
    console.log(`
========================================================
  Authentication Server ทำงานที่ http://localhost:${port}
  (กด Ctrl+C เพื่อปิดโปรแกรม)
========================================================
    `);
});

/**
 * คำแนะนำเพิ่มเติม:
 *
 * 1. ติดตั้ง MQTT Broker ที่รองรับการ Authentication:
 *    - EMQX: เป็น MQTT broker ขั้นสูงที่รองรับหลายวิธีการ authentication:
 *      * JWT Authentication: ตั้งค่า EMQX ให้ตรวจสอบ JWT token โดยกำหนด secret key
 *        ที่ตรงกับ Authentication Server ของเรา
 *      * Username/Password: สามารถเชื่อมต่อกับ HTTP API เพื่อตรวจสอบความถูกต้อง
 *      * OAuth 2.0: รองรับการเชื่อมต่อกับ OAuth providers
 *      * การตั้งค่า ACL (Access Control List): กำหนดสิทธิ์การเข้าถึง topics ตาม username, 
 *        clientid หรือข้อมูลใน JWT claims
 *      * EMQX Dashboard: มีหน้า UI สำหรับจัดการ authentication และ authorization rules
 *
 * 2. แก้ไข WebSocket server 
 *    ให้ตรวจสอบ JWT token จาก HTTP Header ตอน handshake
 *    และปฏิเสธการเชื่อมต่อถ้า token ไม่ถูกต้อง
 *
 * 3. สร้าง MQTT Client และ WebSocket Client
 *    ให้ส่ง JWT token ใน header ตอนเชื่อมต่อ
 *    - สำหรับ EMQX: กำหนด username เป็น JWT token และเว้น password ว่าง 
 *      หรือส่ง token ใน password field ขึ้นอยู่กับการตั้งค่า
 *
 * 4. ทดลองปรับแต่งโปรแกรม:
 *    - เพิ่มระบบ Refresh Token
 *    - กำหนดสิทธิ์การเข้าถึง topics ต่างๆ ตาม role/permissions ของผู้ใช้
 *    - ใช้ฐานข้อมูลจริงในการเก็บข้อมูลผู้ใช้
 */
