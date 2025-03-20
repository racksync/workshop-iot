/**
 * Exercise 14: ความปลอดภัยพื้นฐานสำหรับ REST API
 *
 * แบบฝึกหัดนี้จะเรียนรู้และนำหลักการความปลอดภัยพื้นฐานมาใช้กับ REST API
 *
 * ข้อกำหนด:
 * 1. ตรวจสอบความถูกต้องของข้อมูลที่รับเข้ามา (Input Validation)
 * 2. จำกัดจำนวนคำขอ (Rate Limiting)
 * 3. ใช้การเข้ารหัสผ่าน HTTPS เพื่อป้องกันข้อมูลระหว่างการส่ง
 *
 * การติดตั้งไลบรารี:
 * npm install express express-rate-limit helmet
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// ---------- สร้าง Express App ----------
const app = express();
const port = process.env.PORT || 3000;

// ---------- Middleware ----------
// Helmet เพื่อเพิ่มความปลอดภัยพื้นฐาน
app.use(helmet());

// แปลง JSON request body
app.use(express.json());

// ---------- Rate Limiting ----------
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 นาที
    max: 100, // จำกัด 100 คำขอต่อ 15 นาที
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// ใช้ rate limiter กับทุก endpoints
app.use(limiter);

// ---------- ตัวอย่างข้อมูล (จำลอง) ----------
const products = [
    { id: 1, name: 'Smart Thermostat', price: 199.99 },
    { id: 2, name: 'Wireless Security Camera', price: 149.99 }
];

// ---------- ฟังก์ชันตรวจสอบข้อมูล (Input Validation) ----------
function validateProduct(req, res, next) {
    const { name, price } = req.body;

    if (!name || typeof name !== 'string' || name.length < 3) {
        return res.status(400).json({ error: 'Product name must be a string with at least 3 characters' });
    }

    if (!price || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Product price must be a number greater than 0' });
    }

    next();
}

// ---------- REST API Endpoints ----------
// ดึงข้อมูลสินค้าทั้งหมด
app.get('/api/products', (req, res) => {
    res.json(products);
});

// สร้างสินค้าใหม่
app.post('/api/products', validateProduct, (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// ---------- HTTPS Redirect (ใน production) ----------
// ใน production ควรใช้ HTTPS เสมอ
// app.use((req, res, next) => {
//   if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
//     res.redirect(`https://${req.hostname}${req.url}`);
//   } else {
//     next();
//   }
// });

// ---------- เริ่ม Server ----------
app.listen(port, () => {
    console.log(`
========================================================
  REST API พร้อมใช้งานที่ http://localhost:${port}
  (กด Ctrl+C เพื่อปิดโปรแกรม)
========================================================
    `);
});

/**
 * คำแนะนำเพิ่มเติม:
 *
 * 1. ติดตั้งและตั้งค่า HTTPS:
 *    - ใช้ Let's Encrypt สำหรับ certificates ฟรี
 *    - ตั้งค่า reverse proxy (เช่น Nginx, Apache) เพื่อจัดการ HTTPS
 *
 * 2. เพิ่มการตรวจสอบสิทธิ์ (Authentication) และการอนุญาต (Authorization):
 *    - ใช้ JWT หรือ OAuth2 สำหรับการตรวจสอบสิทธิ์
 *    - กำหนดสิทธิ์การเข้าถึง endpoints ต่างๆ ตาม role ของผู้ใช้
 *
 * 3. ป้องกัน Cross-Site Scripting (XSS):
 *    - ใช้ template engine ที่มีการ escape ข้อมูลอัตโนมัติ
 *    - ใช้ Content Security Policy (CSP)
 *
 * 4. ป้องกัน SQL Injection:
 *    - ใช้ ORM หรือ parameterized queries
 *
 * 5. ตรวจสอบ Dependencies:
 *    - ใช้เครื่องมือตรวจสอบ dependencies เพื่อหาช่องโหว่ด้านความปลอดภัย
 */
