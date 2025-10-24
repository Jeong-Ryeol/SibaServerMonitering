# 시바서버 모니터링 시스템 - 작업 이어가기

## 서버 정보
- **공용 IP**: 168.107.28.244
- **OS**: Ubuntu 20.04
- **위치**: Oracle Cloud Seoul Region
- **SSH 접속**:
  ```bash
  ssh -i /Users/jeong-wonlyeol/Desktop/project/mujang/ssh-key-2025-10-24.key ubuntu@168.107.28.244
  ```

## 설치된 환경
- Node.js 18.20.8
- MySQL 8.0
- Nginx (리버스 프록시 - 포트 80 → 3000)
- PM2 6.0.13 (프로세스 관리자)
- UFW 방화벽 설정 완료
- iptables 규칙 설정 완료

## 데이터베이스 정보
- **DB 이름**: webapp_db
- **사용자**: webapp_user
- **비밀번호**: WebApp2025!
- **호스트**: localhost
- **접속**: `mysql -u webapp_user -p webapp_db`

## GitHub 저장소
- **URL**: https://github.com/Jeong-Ryeol/SibaServerMonitering.git
- **SSH**: git@github.com:Jeong-Ryeol/SibaServerMonitering.git
- **서버 SSH 키**: 이미 GitHub에 등록됨

## 현재 서버 상태
- 테스트 앱 실행 중: ~/webapp (PM2 이름: webapp, 포트 3000)
- SibaServerMonitering 프로젝트: ~/SibaServerMonitering (아직 코드 없음)
- Nginx가 80포트로 3000포트를 프록시 중

## 개발 워크플로우

### 1. 로컬에서 프로젝트 클론
```bash
cd ~/Desktop/project
git clone git@github.com:Jeong-Ryeol/SibaServerMonitering.git
cd SibaServerMonitering
code .
```

### 2. 로컬에서 개발
VS Code에서 다음 파일들 생성:

#### package.json
```json
{
  "name": "sibaserver-monitoring",
  "version": "1.0.0",
  "description": "시바서버 모니터링 시스템",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

#### .env
```env
PORT=3000
DB_HOST=localhost
DB_USER=webapp_user
DB_PASSWORD=WebApp2025!
DB_NAME=webapp_db
```

#### .gitignore
```
node_modules/
.env
*.log
.DS_Store
```

#### server.js
```javascript
const express = require('express');
const mysql = require('mysql2');
const os = require('os');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL 연결
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
  } else {
    console.log('MySQL 연결 성공!');
  }
});

// 정적 파일 제공
app.use(express.static('public'));

// API: 서버 상태
app.get('/api/status', (req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  const cpus = os.cpus();
  const cpuCount = cpus.length;

  res.json({
    hostname: os.hostname(),
    uptime: os.uptime(),
    platform: os.platform(),
    cpu: {
      count: cpuCount,
      model: cpus[0].model,
      speed: cpus[0].speed
    },
    memory: {
      total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      free: (freeMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      usagePercent: ((usedMem / totalMem) * 100).toFixed(2)
    },
    mysql: db.state === 'authenticated' ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// API: Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mysql: db.state === 'authenticated',
    timestamp: new Date()
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`시바서버 모니터링 시스템이 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`접속 주소: http://168.107.28.244`);
});
```

#### public/index.html
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>시바서버 모니터링</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        h1 {
            color: white;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .card h2 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.5em;
        }

        .stat {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }

        .stat:last-child {
            border-bottom: none;
        }

        .stat-label {
            color: #666;
            font-weight: 500;
        }

        .stat-value {
            color: #333;
            font-weight: bold;
        }

        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: bold;
        }

        .status-online {
            background: #4ade80;
            color: white;
        }

        .status-offline {
            background: #ef4444;
            color: white;
        }

        .progress-bar {
            width: 100%;
            height: 20px;
            background: #eee;
            border-radius: 10px;
            overflow: hidden;
            margin-top: 10px;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s ease;
        }

        .last-update {
            text-align: center;
            color: white;
            margin-top: 20px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>시바서버 모니터링 시스템</h1>

        <div class="cards">
            <div class="card">
                <h2>시스템 정보</h2>
                <div class="stat">
                    <span class="stat-label">호스트명</span>
                    <span class="stat-value" id="hostname">-</span>
                </div>
                <div class="stat">
                    <span class="stat-label">플랫폼</span>
                    <span class="stat-value" id="platform">-</span>
                </div>
                <div class="stat">
                    <span class="stat-label">가동 시간</span>
                    <span class="stat-value" id="uptime">-</span>
                </div>
            </div>

            <div class="card">
                <h2>CPU</h2>
                <div class="stat">
                    <span class="stat-label">코어 수</span>
                    <span class="stat-value" id="cpu-count">-</span>
                </div>
                <div class="stat">
                    <span class="stat-label">모델</span>
                    <span class="stat-value" id="cpu-model">-</span>
                </div>
                <div class="stat">
                    <span class="stat-label">속도</span>
                    <span class="stat-value" id="cpu-speed">-</span>
                </div>
            </div>

            <div class="card">
                <h2>메모리</h2>
                <div class="stat">
                    <span class="stat-label">전체</span>
                    <span class="stat-value" id="mem-total">-</span>
                </div>
                <div class="stat">
                    <span class="stat-label">사용 중</span>
                    <span class="stat-value" id="mem-used">-</span>
                </div>
                <div class="stat">
                    <span class="stat-label">여유</span>
                    <span class="stat-value" id="mem-free">-</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="mem-progress"></div>
                </div>
                <div style="text-align: center; margin-top: 10px;">
                    <span id="mem-percent" style="font-weight: bold; color: #667eea;">0%</span>
                </div>
            </div>

            <div class="card">
                <h2>데이터베이스</h2>
                <div class="stat">
                    <span class="stat-label">MySQL 상태</span>
                    <span class="stat-value">
                        <span class="status-badge" id="mysql-status">확인 중...</span>
                    </span>
                </div>
                <div class="stat">
                    <span class="stat-label">데이터베이스</span>
                    <span class="stat-value">webapp_db</span>
                </div>
            </div>
        </div>

        <div class="last-update">
            마지막 업데이트: <span id="last-update">-</span>
        </div>
    </div>

    <script>
        function formatUptime(seconds) {
            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${days}일 ${hours}시간 ${minutes}분`;
        }

        function updateStatus() {
            fetch('/api/status')
                .then(res => res.json())
                .then(data => {
                    document.getElementById('hostname').textContent = data.hostname;
                    document.getElementById('platform').textContent = data.platform;
                    document.getElementById('uptime').textContent = formatUptime(data.uptime);

                    document.getElementById('cpu-count').textContent = data.cpu.count + '개';
                    document.getElementById('cpu-model').textContent = data.cpu.model;
                    document.getElementById('cpu-speed').textContent = data.cpu.speed + ' MHz';

                    document.getElementById('mem-total').textContent = data.memory.total;
                    document.getElementById('mem-used').textContent = data.memory.used;
                    document.getElementById('mem-free').textContent = data.memory.free;
                    document.getElementById('mem-percent').textContent = data.memory.usagePercent + '%';
                    document.getElementById('mem-progress').style.width = data.memory.usagePercent + '%';

                    const mysqlBadge = document.getElementById('mysql-status');
                    if (data.mysql === 'connected') {
                        mysqlBadge.textContent = '연결됨';
                        mysqlBadge.className = 'status-badge status-online';
                    } else {
                        mysqlBadge.textContent = '연결 끊김';
                        mysqlBadge.className = 'status-badge status-offline';
                    }

                    document.getElementById('last-update').textContent = new Date().toLocaleString('ko-KR');
                })
                .catch(err => {
                    console.error('상태 업데이트 실패:', err);
                });
        }

        updateStatus();
        setInterval(updateStatus, 5000);
    </script>
</body>
</html>
```

### 3. Git Push
```bash
git add .
git commit -m "시바서버 모니터링 시스템 초기 버전"
git push origin main
```

### 4. 서버에 배포
```bash
# SSH 접속
ssh -i /Users/jeong-wonlyeol/Desktop/project/mujang/ssh-key-2025-10-24.key ubuntu@168.107.28.244

# 프로젝트로 이동
cd ~/SibaServerMonitering

# 최신 코드 가져오기
git pull origin main

# 의존성 설치
npm install

# 기존 테스트 앱 중지
pm2 stop webapp

# 새 앱 시작
pm2 start server.js --name monitoring

# PM2 저장
pm2 save

# 로그 확인
pm2 logs monitoring
```

## PM2 유용한 명령어
```bash
pm2 list                    # 실행 중인 앱 목록
pm2 logs monitoring         # 로그 보기
pm2 restart monitoring      # 재시작
pm2 stop monitoring         # 중지
pm2 delete monitoring       # 삭제
pm2 monit                   # 실시간 모니터링
```

## 서버 방화벽 설정 (이미 완료됨)
- Oracle Cloud Security List: HTTP(80), HTTPS(443) 열림
- Ubuntu UFW: 22, 80, 443 허용
- iptables: HTTP/HTTPS 규칙이 REJECT 규칙보다 앞에 있음

## 문제 해결

### 브라우저 접속 안될 때
```bash
# 서버 상태 확인
pm2 status
sudo systemctl status nginx

# iptables 확인
sudo iptables -L INPUT -n --line-numbers | head -10

# 로그 확인
pm2 logs monitoring
sudo tail -f /var/log/nginx/error.log
```

### MySQL 연결 안될 때
```bash
sudo systemctl status mysql
mysql -u webapp_user -p webapp_db
```

## 접속 URL
- http://168.107.28.244

## 다음에 추가할 기능 아이디어
- 디스크 사용량 모니터링
- 네트워크 트래픽 모니터링
- 로그 수집 및 표시
- 알림 기능 (이메일/디스코드)
- FiveM 서버 연동
- 플레이어 통계
