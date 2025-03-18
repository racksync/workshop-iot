# บทที่ 9: ความปลอดภัยและ IoT ขั้นสูง

| รายละเอียด | คำอธิบาย |
|----------|---------|
| **ชื่อเนื้อหา** | ความปลอดภัยและ IoT ขั้นสูง |
| **วัตถุประสงค์** | เรียนรู้การรักษาความปลอดภัยในระบบ IoT และการป้องกันการโจมตี |
| **ระดับความยาก** | ขั้นสูง [⭑⭑⭑⭑] |
| **เวลา** | 60 นาที |
| **สิ่งที่ต้องเตรียม** | Node-RED, MQTT Broker, OpenSSL, Postman |
| **ความรู้พื้นฐาน** | MQTT, HTTP, Network Security |

บทนี้มุ่งเน้นไปที่การรักษาความปลอดภัยของระบบ IoT และการใช้มาตรการรักษาความปลอดภัยขั้นสูง

## วัตถุประสงค์การเรียนรู้

- ระบุความเสี่ยงในระบบ IoT และใช้วิธีป้องกัน
- ใช้หลักการการพิสูจน์ตัวตน การอนุญาต และการเข้ารหัสข้อมูล
- ใช้งาน TLS/SSL กับ MQTT Broker
- กำหนดค่า WebSocket Secure (WSS)
- ใช้โทเค็นการพิสูจน์ตัวตน (JWT)
- ใช้การเข้ารหัสกุญแจสาธารณะ/ส่วนตัวสำหรับการส่งข้อมูลอย่างปลอดภัย
- ใช้หลักการ OWASP สำหรับความปลอดภัย IoT
- ใช้เครื่องมือทดสอบความปลอดภัย
- วิเคราะห์กรณีศึกษาด้านความปลอดภัย IoT ในโลกจริง

## หัวข้อที่ครอบคลุม

1. ความเสี่ยงในระบบ IoT และวิธีการป้องกัน
2. หลักการการพิสูจน์ตัวตน การอนุญาต และการเข้ารหัสข้อมูล
3. การใช้งาน TLS/SSL กับ MQTT Broker
4. การกำหนดค่า WebSocket Secure (WSS)
5. การใช้โทเค็นการพิสูจน์ตัวตน (JWT)
6. การใช้การเข้ารหัสกุญแจสาธารณะ/ส่วนตัวสำหรับการส่งข้อมูลอย่างปลอดภัย
7. หลักการ OWASP สำหรับความปลอดภัย IoT
8. เครื่องมือทดสอบความปลอดภัย
9. กรณีศึกษา: การใช้งานระบบรักษาความปลอดภัย IoT ในโลกจริง

## ทรัพยากร

- ใบรับรอง SSL/TLS
- ไลบรารีการพิสูจน์ตัวตน
- เครื่องมือทดสอบความปลอดภัย
- แนวทางความปลอดภัย IoT ของ OWASP

## ตัวอย่างการรักษาความปลอดภัย IoT

### 1. การตั้งค่า TLS/SSL สำหรับ MQTT Broker

```bash
# Generate self-signed certificates
openssl req -new -x509 -days 365 -extensions v3_ca -keyout ca.key -out ca.crt
openssl genrsa -out server.key 2048
openssl req -out server.csr -key server.key -new
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365

# Mosquitto configuration
listener 8883
cafile /etc/mosquitto/ca_certificates/ca.crt
certfile /etc/mosquitto/certs/server.crt
keyfile /etc/mosquitto/certs/server.key
require_certificate true
```

### 2. การใช้ JWT Authentication

```javascript
const jwt = require('jsonwebtoken');

// JWT Middleware
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

// Protected route example
app.post('/api/devices', authenticateJWT, (req, res) => {
    // Handle device registration
});
```

### 3. การเข้ารหัสข้อมูลเซนเซอร์

```javascript
const crypto = require('crypto');

class SecureSensorData {
    constructor(secretKey) {
        this.algorithm = 'aes-256-cbc';
        this.key = crypto.scryptSync(secretKey, 'salt', 32);
    }

    encrypt(data) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return { encrypted, iv: iv.toString('hex') };
    }

    decrypt(encrypted, iv) {
        const decipher = crypto.createDecipheriv(
            this.algorithm, 
            this.key, 
            Buffer.from(iv, 'hex')
        );
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += cipher.final('utf8');
        return JSON.parse(decrypted);
    }
}
```

### 4. Rate Limiting และ DDoS Protection

```javascript
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Rate limiting
const deviceLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});

// Speed limiting
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 100,
    delayMs: 500
});

app.use('/api/devices', deviceLimiter, speedLimiter);
```

### 5. Device Authentication Using X.509 Certificates

```javascript
const https = require('https');
const fs = require('fs');

const options = {
    cert: fs.readFileSync('device-cert.pem'),
    key: fs.readFileSync('device-key.pem'),
    ca: [fs.readFileSync('ca-cert.pem')],
    requestCert: true,
    rejectUnauthorized: true
};

https.createServer(options, (req, res) => {
    const cert = req.socket.getPeerCertificate();
    
    if (!cert || !cert.subject) {
        res.writeHead(403);
        res.end('Client certificate required');
        return;
    }
    
    // Verify device ID in certificate
    if (cert.subject.CN !== req.body.deviceId) {
        res.writeHead(403);
        res.end('Certificate mismatch');
        return;
    }
    
    // Process authenticated request
}).listen(8443);
```

### 6. Secure Device Provisioning

```javascript
class DeviceProvisioning {
    static async provisionDevice(deviceInfo) {
        // Generate unique device credentials
        const deviceId = crypto.randomBytes(16).toString('hex');
        const deviceSecret = crypto.randomBytes(32).toString('hex');
        
        // Create device certificate
        const cert = await this.generateDeviceCert(deviceId);
        
        // Store device info securely
        await this.storeDeviceCredentials({
            deviceId,
            deviceSecret: await this.hashSecret(deviceSecret),
            certificate: cert,
            created: new Date(),
            status: 'active'
        });
        
        return {
            deviceId,
            deviceSecret,
            certificate: cert
        };
    }
    
    static async hashSecret(secret) {
        return crypto.pbkdf2Sync(secret, 'salt', 100000, 64, 'sha512');
    }
}
```

### 7. Secure MQTT Communication

```javascript
const MQTT = require('mqtt');

// Secure MQTT client setup
const client = MQTT.connect('mqtts://broker.example.com', {
    port: 8883,
    protocol: 'mqtts',
    ca: fs.readFileSync('ca.crt'),
    cert: fs.readFileSync('client.crt'),
    key: fs.readFileSync('client.key'),
    rejectUnauthorized: true,
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS
});

// Topic ACL implementation
const topicAcl = {
    canPublish: (user, topic) => {
        return topic.startsWith(`devices/${user.deviceId}/`);
    },
    canSubscribe: (user, topic) => {
        return topic.match(/^devices\/[^\/]+\/status$/);
    }
};
```

### 8. Secure Data Storage

```javascript
const { Model } = require('sequelize');

class SensorData extends Model {
    static async storeSensorReading(reading) {
        // Validate data
        if (!this.isValidReading(reading)) {
            throw new Error('Invalid sensor reading');
        }
        
        // Encrypt sensitive data
        const encrypted = this.encryptSensitiveData(reading);
        
        // Store with audit trail
        return await this.create({
            ...encrypted,
            timestamp: new Date(),
            hash: this.calculateHash(reading)
        });
    }
    
    static calculateHash(data) {
        return crypto
            .createHash('sha256')
            .update(JSON.stringify(data))
            .digest('hex');
    }
}
```

### 9. Security Monitoring System

```javascript
class SecurityMonitor {
    constructor() {
        this.alertThreshold = 5;
        this.failedAttempts = new Map();
    }

    trackFailedAuth(deviceId) {
        const attempts = (this.failedAttempts.get(deviceId) || 0) + 1;
        this.failedAttempts.set(deviceId, attempts);
        
        if (attempts >= this.alertThreshold) {
            this.triggerAlert({
                type: 'AUTH_FAILURE',
                deviceId,
                attempts,
                timestamp: new Date()
            });
        }
    }

    async triggerAlert(alert) {
        // Log to security monitoring system
        await SecurityLog.create(alert);
        
        // Send notification
        await NotificationService.send({
            channel: 'security',
            priority: 'high',
            message: `Security alert: Multiple failed auth attempts for device ${alert.deviceId}`
        });
    }
}
```

### 10. Secure Firmware Update

```javascript
class FirmwareUpdate {
    static async verifyAndUpdate(deviceId, firmware) {
        // Verify firmware signature
        const isValid = await this.verifySignature(
            firmware.data,
            firmware.signature,
            process.env.FIRMWARE_PUBLIC_KEY
        );
        
        if (!isValid) {
            throw new Error('Invalid firmware signature');
        }
        
        // Check firmware version
        if (!this.isNewer(firmware.version, await this.getCurrentVersion(deviceId))) {
            throw new Error('Firmware version must be newer');
        }
        
        // Backup current firmware
        await this.backupCurrentFirmware(deviceId);
        
        // Update firmware
        try {
            await this.performUpdate(deviceId, firmware);
        } catch (error) {
            await this.rollback(deviceId);
            throw error;
        }
    }
}
```

## การทดลองบน Node-RED

### 1. TLS/SSL Authentication Flow
```json
[
    {
        "id": "ssl-config",
        "type": "tls-config",
        "name": "MQTT SSL",
        "cert": "",
        "key": "",
        "ca": "",
        "verifyservercert": true
    },
    {
        "id": "mqtt-ssl",
        "type": "mqtt-broker",
        "name": "Secure MQTT",
        "broker": "localhost",
        "port": "8883",
        "tls": "ssl-config"
    },
    {
        "id": "secure-mqtt-in",
        "type": "mqtt in",
        "topic": "sensors/#",
        "broker": "mqtt-ssl"
    }
]
```

### 2. JWT Authentication Flow
```json
[
    {
        "id": "jwt-auth",
        "type": "function",
        "name": "JWT Auth",
        "func": "const token = global.get('jwt_token');\nif (!token) {\n    msg.statusCode = 401;\n    msg.payload = { error: 'Unauthorized' };\n    return msg;\n}\nmsg.headers = { 'Authorization': `Bearer ${token}` };\nreturn msg;"
    },
    {
        "id": "http-request",
        "type": "http request",
        "method": "POST",
        "url": "https://api.example.com/devices",
        "headers": []
    }
]
```

### 3. การเข้ารหัสข้อมูลใน Node-RED
```json
[
    {
        "id": "encrypt-data",
        "type": "function",
        "name": "Encrypt Data",
        "func": "const crypto = global.get('crypto');\nconst key = Buffer.from(env.get('ENCRYPTION_KEY'), 'hex');\nconst iv = crypto.randomBytes(16);\n\nconst cipher = crypto.createCipheriv('aes-256-cbc', key, iv);\nlet encrypted = cipher.update(JSON.stringify(msg.payload), 'utf8', 'hex');\nencrypted += cipher.final('hex');\n\nmsg.payload = {\n    data: encrypted,\n    iv: iv.toString('hex')\n};\nreturn msg;"
    }
]
```

### 4. Rate Limiting ใน Node-RED
```json
[
    {
        "id": "rate-limit",
        "type": "rate-limit",
        "name": "Device Rate Limit",
        "rate": "10",
        "nbRateUnits": "1",
        "rateUnits": "minute",
        "randomDelayMin": "0",
        "randomDelayMax": "0",
        "drop": true
    }
]
```

## ตัวอย่าง Node-RED Flow สำหรับการรักษาความปลอดภัย IoT

### 1. ระบบตรวจจับการโจมตี Brute Force
```json
[
    {
        "id": "brute-force-detector",
        "type": "function",
        "name": "Brute Force Detection",
        "func": `
            const attempts = context.get('loginAttempts') || {};
            const ip = msg.ip;
            const now = Date.now();
            
            // Initialize or update attempts
            if (!attempts[ip]) {
                attempts[ip] = {
                    count: 1,
                    firstAttempt: now,
                    blocked: false
                };
            } else {
                attempts[ip].count++;
            }
            
            // Check for brute force
            if (attempts[ip].count > 5 && 
                (now - attempts[ip].firstAttempt) < 300000) { // 5 minutes
                attempts[ip].blocked = true;
                msg.block = true;
            }
            
            context.set('loginAttempts', attempts);
            return msg;
        `
    },
    {
        "id": "block-ip",
        "type": "exec",
        "command": "iptables -A INPUT -s {{msg.ip}} -j DROP"
    }
]
```

### 2. ระบบตรวจจับ SQL Injection
```json
[
    {
        "id": "sql-injection-guard",
        "type": "function",
        "name": "SQL Injection Detection",
        "func": `
            const patterns = [
                "'.*--",
                "(?i)\\bOR\\b.*='.*'",
                "(?i)\\bAND\\b.*='.*'",
                "(?i)\\bUNION\\b.*SELECT",
                "(?i)\\bDROP\\b.*TABLE",
                "(?i)\\bDELETE\\b.*FROM",
                "(?i)\\bINSERT\\b.*INTO"
            ];
            
            const input = msg.payload;
            const matches = patterns.some(pattern => 
                new RegExp(pattern).test(input)
            );
            
            if (matches) {
                msg.attack = 'sql_injection';
                msg.payload = {
                    alert: 'SQL Injection attempt detected',
                    input: input,
                    timestamp: new Date()
                };
                return [msg, null];
            }
            return [null, msg];
        `,
        "outputs": 2
    }
]
```

### 3. ระบบเข้ารหัสข้อมูลอัตโนมัติ
```json
[
    {
        "id": "auto-encryption",
        "type": "function",
        "name": "Auto Data Encryption",
        "func": `
            const crypto = global.get('crypto');
            const key = Buffer.from(env.get('ENCRYPTION_KEY'), 'hex');
            
            function encrypt(text) {
                const iv = crypto.randomBytes(16);
                const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
                let encrypted = cipher.update(text, 'utf8', 'hex');
                encrypted += cipher.final('hex');
                const authTag = cipher.getAuthTag();
                return {
                    encrypted,
                    iv: iv.toString('hex'),
                    authTag: authTag.toString('hex')
                };
            }
            
            msg.payload = encrypt(JSON.stringify(msg.payload));
            return msg;
        `
    }
]
```

### 4. ระบบตรวจสอบ Device Authentication
```json
[
    {
        "id": "device-auth",
        "type": "function",
        "name": "Device Authentication",
        "func": `
            const devices = context.get('authorizedDevices') || {};
            const deviceId = msg.deviceId;
            const token = msg.token;
            
            if (!devices[deviceId] || devices[deviceId].token !== token) {
                msg.statusCode = 401;
                msg.payload = { error: 'Unauthorized device' };
                return [msg, null];
            }
            
            // Update last seen
            devices[deviceId].lastSeen = new Date();
            context.set('authorizedDevices', devices);
            return [null, msg];
        `,
        "outputs": 2
    }
]
```

### 5. ระบบจัดการ Access Control List (ACL)
```json
[
    {
        "id": "acl-manager",
        "type": "function",
        "name": "ACL Manager",
        "func": `
            const acl = {
                'admin': ['read', 'write', 'delete'],
                'user': ['read'],
                'operator': ['read', 'write']
            };
            
            function checkPermission(role, action) {
                return acl[role] && acl[role].includes(action);
            }
            
            const userRole = msg.user?.role || 'guest';
            const requestedAction = msg.action;
            
            if (!checkPermission(userRole, requestedAction)) {
                msg.statusCode = 403;
                msg.payload = { error: 'Permission denied' };
                return [msg, null];
            }
            return [null, msg];
        `,
        "outputs": 2
    }
]
```

### 6. ระบบตรวจจับ Anomaly Detection
```json
[
    {
        "id": "anomaly-detector",
        "type": "function",
        "name": "Anomaly Detection",
        "func": `
            const history = context.get('sensorHistory') || [];
            const currentValue = msg.payload;
            const threshold = 3; // Standard deviations
            
            // Calculate mean and standard deviation
            const mean = history.reduce((a, b) => a + b, 0) / history.length;
            const std = Math.sqrt(
                history.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / history.length
            );
            
            if (Math.abs(currentValue - mean) > threshold * std) {
                msg.anomaly = true;
                msg.payload = {
                    value: currentValue,
                    mean: mean,
                    std: std,
                    timestamp: new Date()
                };
                return [msg, null];
            }
            
            // Update history
            history.push(currentValue);
            if (history.length > 100) history.shift();
            context.set('sensorHistory', history);
            
            return [null, msg];
        `,
        "outputs": 2
    }
]
```

### 7. ระบบ Certificate Management
```json
[
    {
        "id": "cert-manager",
        "type": "function",
        "name": "Certificate Manager",
        "func": `
            const certs = context.get('certificates') || {};
            
            function validateCert(cert) {
                const expiry = new Date(cert.validUntil);
                const now = new Date();
                const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24);
                
                if (daysUntilExpiry <= 0) {
                    return { valid: false, reason: 'expired' };
                }
                if (daysUntilExpiry <= 30) {
                    return { valid: true, warning: 'expiring_soon' };
                }
                return { valid: true };
            }
            
            const deviceCert = certs[msg.deviceId];
            if (!deviceCert) {
                msg.statusCode = 401;
                msg.payload = { error: 'No certificate found' };
                return [msg, null];
            }
            
            const validation = validateCert(deviceCert);
            msg.certStatus = validation;
            
            if (!validation.valid) {
                return [msg, null];
            }
            return [null, msg];
        `,
        "outputs": 2
    }
]
```

### 8. ระบบ Rate Limiting แบบ Dynamic
```json
[
    {
        "id": "dynamic-rate-limit",
        "type": "function",
        "name": "Dynamic Rate Limiter",
        "func": `
            const limits = context.get('rateLimits') || {};
            const now = Date.now();
            const ip = msg.ip;
            
            if (!limits[ip]) {
                limits[ip] = {
                    count: 0,
                    firstRequest: now,
                    threshold: 100 // Requests per minute
                };
            }
            
            // Reset counter if minute has passed
            if (now - limits[ip].firstRequest > 60000) {
                limits[ip].count = 0;
                limits[ip].firstRequest = now;
            }
            
            limits[ip].count++;
            
            // Dynamic threshold adjustment
            if (limits[ip].count > limits[ip].threshold) {
                limits[ip].threshold *= 0.8; // Reduce threshold
                msg.statusCode = 429;
                msg.payload = { error: 'Rate limit exceeded' };
                return [msg, null];
            }
            
            context.set('rateLimits', limits);
            return [null, msg];
        `,
        "outputs": 2
    }
]
```

### 9. ระบบ Secure Password Reset
```json
[
    {
        "id": "password-reset",
        "type": "function",
        "name": "Secure Password Reset",
        "func": `
            const resetTokens = context.get('resetTokens') || {};
            const crypto = global.get('crypto');
            
            function generateToken() {
                return crypto.randomBytes(32).toString('hex');
            }
            
            function isTokenValid(token) {
                const tokenData = resetTokens[token];
                if (!tokenData) return false;
                
                const now = Date.now();
                const expiry = tokenData.created + (30 * 60 * 1000); // 30 minutes
                return now < expiry;
            }
            
            if (msg.generate) {
                const token = generateToken();
                resetTokens[token] = {
                    userId: msg.userId,
                    created: Date.now()
                };
                context.set('resetTokens', resetTokens);
                msg.resetToken = token;
                return [msg, null];
            }
            
            if (msg.verify) {
                if (!isTokenValid(msg.token)) {
                    msg.statusCode = 400;
                    msg.payload = { error: 'Invalid or expired token' };
                    return [msg, null];
                }
                return [null, msg];
            }
        `,
        "outputs": 2
    }
]
```

### 10. ระบบ Security Audit Logging
```json
[
    {
        "id": "audit-logger",
        "type": "function",
        "name": "Security Audit Logger",
        "func": `
            const auditLog = context.get('auditLog') || [];
            
            function logEvent(event) {
                const logEntry = {
                    timestamp: new Date(),
                    event: event.type,
                    user: event.user,
                    ip: event.ip,
                    details: event.details,
                    severity: event.severity
                };
                
                auditLog.push(logEntry);
                
                // Keep last 1000 entries
                if (auditLog.length > 1000) {
                    auditLog.shift();
                }
                
                // Store high severity events separately
                if (event.severity === 'high') {
                    const highSeverityLogs = context.get('highSeverityLogs') || [];
                    highSeverityLogs.push(logEntry);
                    context.set('highSeverityLogs', highSeverityLogs);
                }
                
                context.set('auditLog', auditLog);
                return logEntry;
            }
            
            msg.payload = logEvent({
                type: msg.eventType,
                user: msg.user,
                ip: msg.ip,
                details: msg.details,
                severity: msg.severity || 'low'
            });
            
            return msg;
        `
    }
]
```

## การนำไปประยุกต์ใช้

แต่ละตัวอย่าง flow สามารถนำไปปรับใช้โดย:

1. Import flow เข้า Node-RED
2. ปรับแต่งค่าตามความต้องการ
3. เชื่อมต่อกับ node อื่นๆ เช่น MQTT, HTTP
4. ทดสอบการทำงานและความปลอดภัย

## การทดสอบและการนำไปใช้

1. Import flows เข้า Node-RED:
   - เปิด Node-RED
   - เลือก Import -> Clipboard
   - วาง JSON flow
   - กด Import

2. การปรับแต่ง:
   - ปรับค่า threshold ตามความเหมาะสม
   - กำหนดค่า encryption key
   - ตั้งค่าการแจ้งเตือน

3. การเชื่อมต่อ:
   - เพิ่ม MQTT nodes
   - เชื่อมต่อกับฐานข้อมูล
   - ตั้งค่าการแจ้งเตือน

4. การทดสอบ:
   ```bash
   # ทดสอบ SQL Injection
   curl -X POST http://localhost:1880/api/data -d "user_id=1' OR '1'='1"
   
   # ทดสอบ Rate Limiting
   for i in {1..200}; do curl http://localhost:1880/api/test; done
   
   # ทดสอบ Authentication
   curl -H "Authorization: Bearer invalid_token" http://localhost:1880/api/secure
   ```
---
## RACKSYNC CO., LTD.

[RACKSYNC](https://github.com/racksync) เป็นบริษัทที่มีความเชี่ยวชาญในการพัฒนาโซลูชั่นด้าน IoT และระบบอัตโนมัติ เรามุ่งมั่นในการสร้างเทคโนโลยีที่เชื่อมต่อโลกเข้าด้วยกันผ่านระบบ IoT ที่มีประสิทธิภาพและเสถียร

### บริการของเรา
- การออกแบบและพัฒนาระบบ IoT แบบครบวงจร
- โซลูชั่นเชื่อมต่อสำหรับอุตสาหกรรม 4.0
- ระบบอัตโนมัติสำหรับบ้านและอาคารอัจฉริยะ
- การฝึกอบรมและเวิร์คช็อปด้าน IoT

ติดตามโปรเจกต์และอัปเดตได้ที่ [GitHub](https://github.com/racksync)

© 2007-2025 RACKSYNC CO., LTD. All rights reserved.
