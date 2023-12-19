*"Interaction" is a streaming platform that provides interactive features such as live streaming and messaging.*

Website URL: <https://jokersaysjoke.online/home>

Test account:
- User : `test@test.com`
- Password : `test`

## Features
- RTMP streaming: Enables the server to receive incoming RTMP streams from various sources, including popular broadcasting software like OBS or media encoding devices.

- Live streaming: Support live streaming, allowing broadcasters to stream video content in real-time to connected clients.

- HLS (HTTP Live Streaming): Convert RTMP streams into HLS format.

- Real-time communication: The project allows for real-time, event-driven communication between the server and clients, enabling the exchange of messages.

## System Design
### Server Architecture
<img src='https://github.com/jokersaysjoke/interaction/assets/110945189/3bb93ff1-a280-4528-a871-ddc306854fc1' width='100%'>


### Live Stream Platform Architecture
<img src='https://github.com/jokersaysjoke/interaction/assets/110945189/4eda5dca-d9eb-478e-9f82-664e3c3f6f40' width='100%'>

## Backend Technique
#### Key Points
- MVC pattern
- Websocket

#### Deployment
- Docker-compose

#### Web Server Framework
- Node.js / Express.js

#### Relational Database
- MySQL

#### NoSQL Database
- Redis

#### Networking and Security
- HTTP & HTTPS
- Domain Name System (DNS)
- SSL (sslforfree)

#### Reverse Proxy
- NGINX

#### Streaming Media Server
- Nginx RTMP Module

#### Third Party Library
- ffmpeg
- Socket.IO
- aws-sdk
- jsonwebtoken

## AWS Services
- AWS EC2: As the backend host machine
- AWS S3: Store avatars and recordings
- AWS CloudFront: Provides global CDN to speed up media transmission
- AWS RDS: A relational database service for storing application data
- AWS Route 53: Manage DNS CNAME and A record

## Version Control
- Git / GitHub

## CI / CD
- GitHub Actions

## Contact
- Author: `Chen, Chun-Yi`
- Email: `chun.yii.chen@gmail.com`
