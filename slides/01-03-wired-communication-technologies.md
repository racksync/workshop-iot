# Wired Communication Technologies

```mermaid
graph LR
    Ethernet[Ethernet] -->|10/100/1000 Mbps<br>High Reliability| Use1[Industrial IoT<br>Critical Systems]
    RS485[RS-485] -->|Up to 10Mbps<br>Long Distance| Use2[Industrial Control<br>Building Automation]
    CAN[CAN Bus] -->|1Mbps@40m<br>Noise Resistant| Use3[Automotive<br>Machinery]
    I2C[I2C] -->|400Kbps<br>Short Distance| Use4[Sensor Integration<br>On-board Communication]
    SPI[SPI] -->|Up to 10Mbps<br>Full Duplex| Use5[Sensor Integration<br>Display Modules]
```

![Wired Communication Technologies for IoT](https://www.google.com/search?q=wired+protocols+for+iot+industrial&tbm=isch)

> Key Takeaway: การสื่อสารแบบมีสายยังคงมีความสำคัญมากในระบบ IoT อุตสาหกรรม เนื่องจากความเสถียรสูง รองรับการสื่อสารแบบเรียลไทม์ และมีความน่าเชื่อถือมากกว่า Ethernet เหมาะกับระบบขนาดใหญ่ ขณะที่ RS-485 ยังเป็นมาตรฐานในการควบคุมอุปกรณ์อุตสาหกรรม และ CAN Bus เป็นที่นิยมในยานยนต์และเครื่องจักร ส่วน I2C และ SPI เหมาะสำหรับการสื่อสารระหว่างอุปกรณ์บนบอร์ดเดียวกัน

Technical Terms:
- Full Duplex
- Half Duplex
- Baud Rate
- Multi-drop Bus
- Noise Immunity
- EMI Resistance
