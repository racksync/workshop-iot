# Authentication, Authorization & Encryption

## The Three Pillars of IoT Security

- **Authentication**: Verifying identity (Who are you?)
- **Authorization**: Granting access rights (What can you do?)
- **Encryption**: Protecting data confidentiality (Can anyone else see?)

```mermaid
graph LR
    A[IoT Security] --> B[Authentication]
    A --> C[Authorization]
    A --> D[Encryption]
    
    B --> B1[Certificates]
    B --> B2[Passwords]
    B --> B3[Tokens]
    B --> B4[Biometrics]
    
    C --> C1[ACLs]
    C --> C2[RBAC]
    C --> C3[ABAC]
    
    D --> D1[Symmetric]
    D --> D2[Asymmetric]
    D --> D3[TLS/SSL]
    
    style A fill:#f96,stroke:#333,stroke-width:2px
    style B,C,D fill:#bbf,stroke:#333,stroke-width:2px
```

[Search for authentication authorization encryption images](https://www.google.com/search?q=authentication+authorization+encryption+diagram&tbm=isch)

## Presenter Notes (ข้อมูลสำหรับผู้บรรยาย)

> Key Takeaway: หลักการความปลอดภัยสำคัญสำหรับระบบ IoT ประกอบด้วยสามส่วนหลัก: การพิสูจน์ตัวตน (Authentication), การอนุญาต (Authorization) และการเข้ารหัสข้อมูล (Encryption) ซึ่งทั้งสามส่วนต้องทำงานร่วมกันเพื่อสร้างระบบที่ปลอดภัย

> การพิสูจน์ตัวตน - ตรวจสอบว่าอุปกรณ์หรือผู้ใช้เป็นใคร สามารถทำได้ผ่านรหัสผ่าน, ใบรับรอง X.509, โทเค็น หรือข้อมูลชีวมิติ  
> การอนุญาต - กำหนดสิทธิ์ว่าอุปกรณ์หรือผู้ใช้สามารถทำอะไรได้บ้าง มักใช้ ACLs (Access Control Lists), RBAC (Role-Based Access Control) หรือ ABAC (Attribute-Based Access Control)  
> การเข้ารหัส - ปกป้องความลับของข้อมูลที่รับส่ง มีทั้งการเข้ารหัสแบบสมมาตร (AES, 3DES) และแบบอสมมาตร (RSA, ECC)

> ศัพท์เทคนิค: Multi-factor authentication, Public Key Infrastructure (PKI), Access Control List (ACL), Role-Based Access Control (RBAC), Symmetric encryption, Asymmetric encryption, Transport Layer Security (TLS)
