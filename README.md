# [Interaction](https://jokersaysjoke.online/home)
*"Interaction" is a streaming platform that provides interactive features such as live streaming and messaging.*

Website URL => <https://jokersaysjoke.online/home>

Test account:
- User : `test@test.com`
- Password : `test`

## System Design
### Server Architecture
<img src='https://github.com/jokersaysjoke/interaction/assets/110945189/e842191b-10d6-4c85-848e-e9d04a278d75' width='700px'>


### Live Stream Platform Architecture
<img src='https://github.com/jokersaysjoke/interaction/assets/110945189/488daf04-ae8b-40a6-b788-979da51c1d00' width='700px'>

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
- Author: `Chen, Chun-Yi 陳群嶧`
- Email: `chun.yii.chen@gmail.com`
