const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
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

// 미들웨어
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24시간
}));
app.use(express.static('public'));

// ==================== 사용자 API ====================

// 사이트 비밀번호 확인
app.post('/api/verify-site-password', (req, res) => {
  const { password } = req.body;

  db.query('SELECT password FROM site_password ORDER BY id DESC LIMIT 1', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: '서버 오류' });
    }

    if (results.length > 0 && results[0].password === password) {
      req.session.siteAuthorized = true;
      res.json({ success: true });
    } else {
      res.json({ success: false, message: '비밀번호가 올바르지 않습니다.' });
    }
  });
});

// 고유번호로 사기 신고 조회
app.get('/api/fraud-reports/:uniqueId', (req, res) => {
  const uniqueId = parseInt(req.params.uniqueId);

  if (!req.session.siteAuthorized) {
    return res.status(401).json({ success: false, message: '인증이 필요합니다.' });
  }

  db.query(
    'SELECT * FROM fraud_reports WHERE unique_id = ? ORDER BY report_date DESC',
    [uniqueId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: '서버 오류' });
      }
      res.json({ success: true, data: results });
    }
  );
});

// 통계 정보 조회 (온라인 유저, 활동자 수는 하드코딩)
app.get('/api/stats', (req, res) => {
  res.json({
    onlineUsers: 400,
    activeUsers: 500,
    uptime: '24/7/365'
  });
});

// ==================== 관리자 API ====================

// 관리자 비밀번호 확인
app.post('/api/admin/verify-password', (req, res) => {
  const { password } = req.body;

  db.query('SELECT password FROM admin_password ORDER BY id DESC LIMIT 1', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: '서버 오류' });
    }

    if (results.length > 0 && results[0].password === password) {
      req.session.adminAuthorized = true;
      res.json({ success: true });
    } else {
      res.json({ success: false, message: '관리자 비밀번호가 올바르지 않습니다.' });
    }
  });
});

// 관리자 인증 미들웨어
const requireAdmin = (req, res, next) => {
  if (!req.session.adminAuthorized) {
    return res.status(401).json({ success: false, message: '관리자 인증이 필요합니다.' });
  }
  next();
};

// 사기 신고 등록
app.post('/api/admin/fraud-reports', requireAdmin, (req, res) => {
  const { reportDate, uniqueId, amount, reason } = req.body;

  db.query(
    'INSERT INTO fraud_reports (report_date, unique_id, amount, reason) VALUES (?, ?, ?, ?)',
    [reportDate, uniqueId, amount, reason],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: '등록 실패' });
      }
      res.json({ success: true, message: '사기 신고가 등록되었습니다.' });
    }
  );
});

// 사기 신고 삭제
app.delete('/api/admin/fraud-reports/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);

  db.query('DELETE FROM fraud_reports WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: '삭제 실패' });
    }
    res.json({ success: true, message: '삭제되었습니다.' });
  });
});

// 모든 사기 신고 조회 (관리자용)
app.get('/api/admin/fraud-reports', requireAdmin, (req, res) => {
  db.query('SELECT * FROM fraud_reports ORDER BY report_date DESC, created_at DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
    res.json({ success: true, data: results });
  });
});

// 제보 등록
app.post('/api/admin/tip-reports', requireAdmin, (req, res) => {
  const { content } = req.body;

  db.query('INSERT INTO tip_reports (content) VALUES (?)', [content], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: '등록 실패' });
    }
    res.json({ success: true, message: '제보가 등록되었습니다.' });
  });
});

// 모든 제보 조회
app.get('/api/admin/tip-reports', requireAdmin, (req, res) => {
  db.query('SELECT * FROM tip_reports ORDER BY created_at DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
    res.json({ success: true, data: results });
  });
});

// 제보 삭제
app.delete('/api/admin/tip-reports/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);

  db.query('DELETE FROM tip_reports WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: '삭제 실패' });
    }
    res.json({ success: true, message: '삭제되었습니다.' });
  });
});

// 사이트 비밀번호 변경
app.post('/api/admin/change-site-password', requireAdmin, (req, res) => {
  const { newPassword } = req.body;

  db.query('UPDATE site_password SET password = ? WHERE id = 1', [newPassword], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: '변경 실패' });
    }
    res.json({ success: true, message: '사이트 비밀번호가 변경되었습니다.' });
  });
});

// 관리자 비밀번호 변경
app.post('/api/admin/change-admin-password', requireAdmin, (req, res) => {
  const { newPassword } = req.body;

  db.query('UPDATE admin_password SET password = ? WHERE id = 1', [newPassword], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: '변경 실패' });
    }
    res.json({ success: true, message: '관리자 비밀번호가 변경되었습니다.' });
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`FIVEN:FREEDOM 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`접속 주소: http://168.107.28.244`);
});
