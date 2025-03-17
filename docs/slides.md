# IoT Workshop Presentation Slides

## Slide 1: Course Overview

```mermaid
mindmap
    root((IoT Workshop))
        Foundation
            Protocols
            Device Connections
            Security
        Development
            Node-RED
            REST API
            Cloud Integration
        Implementation
            Best Practices
            Real World Cases
            Future Trends
```

## Slide 2: IoT Architecture

```mermaid
graph TB
    subgraph "Edge Layer"
        E1[Sensors] --> E2[Actuators]
        E2 --> E3[Controllers]
    end
    
    subgraph "Network Layer"
        N1[MQTT] --> N2[WebSocket]
        N2 --> N3[REST API]
    end
    
    subgraph "Cloud Layer"
        C1[Processing] --> C2[Storage]
        C2 --> C3[Analytics]
    end
    
    E3 --> N1
    N3 --> C1
    
    style E1 fill:#f9f,stroke:#333
    style E2 fill:#f9f,stroke:#333
    style E3 fill:#f9f,stroke:#333
    style N1 fill:#bbf,stroke:#333
    style N2 fill:#bbf,stroke:#333
    style N3 fill:#bbf,stroke:#333
    style C1 fill:#bfb,stroke:#333
    style C2 fill:#bfb,stroke:#333
    style C3 fill:#bfb,stroke:#333
```

## Slide 3: Workshop Timeline

```mermaid
gantt
    title Workshop Schedule
    dateFormat  HH:mm
    axisFormat %H:%M

    section Morning
    Introduction     :09:00, 30m
    IoT Basics       :09:30, 45m
    Break           :10:15, 15m
    Hands-on Lab 1   :10:30, 90m

    section Afternoon
    Lunch           :12:00, 60m
    Advanced Topics  :13:00, 60m
    Hands-on Lab 2   :14:00, 90m
    Q&A Session      :15:30, 30m
```

## Slide 4: Technology Stack

```mermaid
graph TD
    subgraph "Hardware"
        H1[ESP32/ESP8266] --> H2[Sensors]
        H1 --> H3[Actuators]
    end
    
    subgraph "Software"
        S1[Node-RED] --> S2[MQTT Broker]
        S2 --> S3[Database]
    end
    
    subgraph "Cloud"
        C1[AWS/GCP/Azure] --> C2[IoT Services]
        C2 --> C3[Analytics]
    end
    
    H1 --> S1
    S3 --> C1
    
    classDef hw fill:#f96,stroke:#333
    classDef sw fill:#99f,stroke:#333
    classDef cloud fill:#9f9,stroke:#333
    
    class H1,H2,H3 hw
    class S1,S2,S3 sw
    class C1,C2,C3 cloud
```

## Slide 5: Project Implementation Flow

```mermaid
stateDiagram-v2
    [*] --> Planning
    Planning --> Development
    Development --> Testing
    Testing --> Deployment
    Deployment --> Monitoring
    Monitoring --> Optimization
    Optimization --> [*]

    state Planning {
        Requirements --> Architecture
        Architecture --> Components
    }

    state Development {
        Hardware --> Software
        Software --> Integration
    }

    state Testing {
        Unit --> Integration
        Integration --> System
    }
```

## Navigation Guide

- Each slide focuses on a key aspect of the IoT workshop
- Use diagrams to explain complex concepts
- Include practical examples and real-world applications
- End with Q&A session and resources for further learning

## Theme Colors

- Primary: #f96 (Hardware/Edge)
- Secondary: #99f (Software/Network)
- Tertiary: #9f9 (Cloud/Analytics)
- Background: White or Light Gray
- Text: Dark Gray or Black

## Recommended Tools

- Presentation Software: Canva
- Live Demo Tools: MQTT.fx, Node-RED
- Hardware Demo: ESP32/ESP8266 kit
