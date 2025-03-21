FROM eclipse-mosquitto:latest

# ติดตั้งเครื่องมือพื้นฐานและเครื่องมือวิเคราะห์เครือข่าย
RUN apk add --no-cache \
    bash \
    curl \
    nano \
    net-tools \
    iputils \
    jq

# คัดลอกไฟล์การตั้งค่า
COPY config/mosquitto.conf /mosquitto/config/mosquitto.conf

# สร้างไดเรกทอรีที่จำเป็นและกำหนดสิทธิ์
RUN mkdir -p /mosquitto/data /mosquitto/log && \
    chmod -R 777 /mosquitto/data /mosquitto/log

EXPOSE 1883 9001

# คำสั่งเริ่มต้น
CMD ["/usr/sbin/mosquitto", "-c", "/mosquitto/config/mosquitto.conf"]
