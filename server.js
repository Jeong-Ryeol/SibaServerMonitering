const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
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

// 자정까지 남은 시간 계산 (밀리초)
function getMillisecondsUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // 다음날 00:00:00
  return midnight - now;
}

// 미들웨어
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 세션 스토어 설정
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: getMillisecondsUntilMidnight() // 자정까지
  }
});

app.use(sessionMiddleware);
app.use(express.static('public'));

// 활성 관리자 세션 추적 (sessionID -> 마지막 활동 시간)
const activeAdminSessions = new Map();

// 세션 활동 업데이트 미들웨어
app.use((req, res, next) => {
  // 세션 쿠키 만료 시간을 자정까지로 재설정
  if (req.session) {
    req.session.cookie.maxAge = getMillisecondsUntilMidnight();
  }

  // 관리자 세션 추적
  if (req.session && req.session.adminAuthorized) {
    activeAdminSessions.set(req.sessionID, Date.now());
  }
  next();
});

// 만료된 세션 정리 (30초마다)
setInterval(() => {
  const now = Date.now();
  const timeout = 2 * 60 * 1000; // 2분 동안 활동 없으면 제거

  activeAdminSessions.forEach((lastActivity, sessionId) => {
    if (now - lastActivity > timeout) {
      activeAdminSessions.delete(sessionId);
      console.log(`관리자 세션 만료: ${sessionId}`);
    }
  });
}, 30000); // 30초마다 체크

// ==================== 사용자 API ====================

// 세션 확인
app.get('/api/check-session', (req, res) => {
  res.json({ authorized: !!req.session.siteAuthorized });
});

// 사이트 비밀번호 확인
app.post('/api/verify-site-password', async (req, res) => {
  const { password } = req.body;

  db.query('SELECT password FROM site_password ORDER BY id DESC LIMIT 1', async (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: '서버 오류' });
    }

    if (results.length > 0) {
      try {
        const isMatch = await bcrypt.compare(password, results[0].password);
        if (isMatch) {
          req.session.siteAuthorized = true;
          res.json({ success: true });
        } else {
          res.json({ success: false, message: '비밀번호가 올바르지 않습니다.' });
        }
      } catch (error) {
        return res.status(500).json({ success: false, message: '비밀번호 확인 오류' });
      }
    } else {
      res.json({ success: false, message: '비밀번호가 설정되지 않았습니다.' });
    }
  });
});

// 고유번호로 사기 신고 조회 (가해자 고유번호 기준)
app.get('/api/fraud-reports/:uniqueId', (req, res) => {
  const uniqueId = parseInt(req.params.uniqueId);

  if (!req.session.siteAuthorized) {
    return res.status(401).json({ success: false, message: '세션 만료로 인해 새로고침 후 재로그인 부탁드립니다' });
  }

  db.query(
    'SELECT * FROM fraud_reports WHERE attacker_id = ? ORDER BY report_date DESC',
    [uniqueId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: '서버 오류' });
      }
      res.json({ success: true, data: results });
    }
  );
});

// 통계 정보 조회
app.get('/api/stats', (req, res) => {
  // 사이트 통계 조회
  db.query('SELECT online_users, last_update_date FROM site_stats ORDER BY id DESC LIMIT 1', (err, statsResults) => {
    if (err) {
      return res.status(500).json({ success: false, message: '서버 오류' });
    }

    // 사기꾼 수 조회
    db.query('SELECT COUNT(DISTINCT unique_id) as fraudCount FROM fraud_reports', (err, fraudResults) => {
      if (err) {
        return res.status(500).json({ success: false, message: '서버 오류' });
      }

      const stats = statsResults[0] || { online_users: 400, last_update_date: new Date() };
      const fraudCount = fraudResults[0].fraudCount;

      res.json({
        onlineUsers: stats.online_users,
        fraudCount: fraudCount,
        lastUpdate: stats.last_update_date
      });
    });
  });
});

// ==================== 관리자 API ====================

// 관리자 세션 확인
app.get('/api/admin/check-session', (req, res) => {
  res.json({ authorized: !!req.session.adminAuthorized });
});

// 관리자 비밀번호 확인
app.post('/api/admin/verify-password', async (req, res) => {
  const { password } = req.body;

  db.query('SELECT password FROM admin_password ORDER BY id DESC LIMIT 1', async (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: '서버 오류' });
    }

    if (results.length > 0) {
      try {
        const isMatch = await bcrypt.compare(password, results[0].password);
        if (isMatch) {
          req.session.adminAuthorized = true;
          activeAdminSessions.set(req.sessionID, Date.now());
          res.json({ success: true });
        } else {
          res.json({ success: false, message: '관리자 비밀번호가 올바르지 않습니다.' });
        }
      } catch (error) {
        return res.status(500).json({ success: false, message: '비밀번호 확인 오류' });
      }
    } else {
      res.json({ success: false, message: '비밀번호가 설정되지 않았습니다.' });
    }
  });
});

// 관리자 로그아웃
app.post('/api/admin/logout', (req, res) => {
  if (req.session && req.session.adminAuthorized) {
    // 활성 세션에서 제거
    activeAdminSessions.delete(req.sessionID);
    console.log(`관리자 로그아웃: ${req.sessionID}`);

    // 세션 파괴
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: '로그아웃 실패' });
      }
      res.json({ success: true, message: '로그아웃 되었습니다.' });
    });
  } else {
    res.json({ success: true, message: '이미 로그아웃 상태입니다.' });
  }
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
  const { reportDate, victimId, victimNickname, attackerId, attackerNickname, amount, amountType, reason } = req.body;

  db.query(
    'INSERT INTO fraud_reports (report_date, unique_id, victim_id, victim_nickname, attacker_id, attacker_nickname, amount, amount_type, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [reportDate, victimId, victimId, victimNickname, attackerId, attackerNickname, amount, amountType || 'money', reason],
    (err, result) => {
      if (err) {
        console.error('DB Error:', err);
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
app.post('/api/admin/change-site-password', requireAdmin, async (req, res) => {
  const { newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.query('UPDATE site_password SET password = ? WHERE id = 1', [hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: '변경 실패' });
      }
      res.json({ success: true, message: '사이트 비밀번호가 변경되었습니다.' });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: '비밀번호 해싱 오류' });
  }
});

// 관리자 비밀번호 변경
app.post('/api/admin/change-admin-password', requireAdmin, async (req, res) => {
  const { newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.query('UPDATE admin_password SET password = ? WHERE id = 1', [hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: '변경 실패' });
      }
      res.json({ success: true, message: '관리자 비밀번호가 변경되었습니다.' });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: '비밀번호 해싱 오류' });
  }
});

// 통계 정보 업데이트
app.post('/api/admin/update-stats', requireAdmin, (req, res) => {
  const { onlineUsers, lastUpdateDate } = req.body;

  db.query(
    'INSERT INTO site_stats (id, online_users, last_update_date) VALUES (1, ?, ?) ON DUPLICATE KEY UPDATE online_users = ?, last_update_date = ?',
    [onlineUsers, lastUpdateDate, onlineUsers, lastUpdateDate],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: '변경 실패' });
      }
      res.json({ success: true, message: '통계가 업데이트되었습니다.' });
    }
  );
});

// 현재 통계 정보 조회 (관리자용)
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  db.query('SELECT * FROM site_stats ORDER BY id DESC LIMIT 1', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
    res.json({ success: true, data: results[0] || { online_users: 400, last_update_date: new Date() } });
  });
});

// 활성 관리자 수 조회 (관리자용)
app.get('/api/admin/active-admins', requireAdmin, (req, res) => {
  res.json({
    success: true,
    activeAdmins: activeAdminSessions.size
  });
});

// 고유번호 일괄 변경 (관리자용)
app.post('/api/admin/bulk-update-id', requireAdmin, (req, res) => {
  const { oldId, newId, type } = req.body;

  if (!oldId || !newId) {
    return res.status(400).json({ success: false, message: '기존 고유번호와 새 고유번호를 모두 입력하세요' });
  }

  if (oldId === newId) {
    return res.status(400).json({ success: false, message: '기존 고유번호와 새 고유번호가 같습니다' });
  }

  let query = '';
  let params = [];
  let message = '';

  // 변경 유형에 따라 쿼리 설정
  if (type === 'attacker') {
    // 가해자만 변경 (unique_id와 attacker_id)
    query = 'UPDATE fraud_reports SET unique_id = ?, attacker_id = ? WHERE attacker_id = ?';
    params = [newId, newId, oldId];
    message = '가해자 고유번호가 일괄 변경되었습니다';
  } else if (type === 'victim') {
    // 피해자만 변경
    query = 'UPDATE fraud_reports SET victim_id = ? WHERE victim_id = ?';
    params = [newId, oldId];
    message = '피해자 고유번호가 일괄 변경되었습니다';
  } else {
    return res.status(400).json({ success: false, message: '변경 대상을 선택하세요' });
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Bulk update error:', err);
      return res.status(500).json({ success: false, message: '업데이트 실패' });
    }
    res.json({
      success: true,
      message: message,
      updatedCount: result.affectedRows
    });
  });
});

// 닉네임 일괄 변경 (관리자용)
app.post('/api/admin/bulk-update-nickname', requireAdmin, (req, res) => {
  const { oldNickname, newNickname, type } = req.body;

  if (!oldNickname || !newNickname) {
    return res.status(400).json({ success: false, message: '기존 닉네임과 새 닉네임을 모두 입력하세요' });
  }

  if (oldNickname === newNickname) {
    return res.status(400).json({ success: false, message: '기존 닉네임과 새 닉네임이 같습니다' });
  }

  let query = '';
  let params = [];
  let message = '';

  // 변경 유형에 따라 쿼리 설정
  if (type === 'attacker') {
    // 가해자 닉네임만 변경
    query = 'UPDATE fraud_reports SET attacker_nickname = ? WHERE attacker_nickname = ?';
    params = [newNickname, oldNickname];
    message = '가해자 닉네임이 일괄 변경되었습니다';
  } else if (type === 'victim') {
    // 피해자 닉네임만 변경
    query = 'UPDATE fraud_reports SET victim_nickname = ? WHERE victim_nickname = ?';
    params = [newNickname, oldNickname];
    message = '피해자 닉네임이 일괄 변경되었습니다';
  } else {
    return res.status(400).json({ success: false, message: '변경 대상을 선택하세요' });
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Bulk nickname update error:', err);
      return res.status(500).json({ success: false, message: '업데이트 실패' });
    }
    res.json({
      success: true,
      message: message,
      updatedCount: result.affectedRows
    });
  });
});

// ==================== 제보 제출 API ====================

// 사용자 제보 제출
app.post('/api/submit-report', (req, res) => {
  if (!req.session.siteAuthorized) {
    return res.status(401).json({ success: false, message: '세션 만료로 인해 새로고침 후 재로그인 부탁드립니다' });
  }

  const { reporterUniqueId, reporterNickname, discordId, reportDate, fraudsterUniqueId, amount, reason } = req.body;

  db.query(
    'INSERT INTO pending_reports (reporter_unique_id, reporter_nickname, discord_id, report_date, fraudster_unique_id, amount, reason) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [reporterUniqueId, reporterNickname, discordId, reportDate, fraudsterUniqueId, amount, reason],
    (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: '제보 제출 실패' });
      }
      res.json({ success: true, message: '제보가 제출되었습니다. 관리자 승인 후 등록됩니다.' });
    }
  );
});

// 대기 중인 제보 조회 (관리자용)
app.get('/api/admin/pending-reports', requireAdmin, (req, res) => {
  db.query('SELECT * FROM pending_reports ORDER BY created_at DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
    res.json({ success: true, data: results });
  });
});

// 제보 승인 (관리자용)
app.post('/api/admin/approve-report/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);

  // 대기 중인 제보 조회
  db.query('SELECT * FROM pending_reports WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: '서버 오류' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: '제보를 찾을 수 없습니다' });
    }

    const report = results[0];

    // fraud_reports 테이블에 추가
    db.query(
      'INSERT INTO fraud_reports (report_date, unique_id, amount, reason) VALUES (?, ?, ?, ?)',
      [report.report_date, report.fraudster_unique_id, report.amount, report.reason],
      (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: '승인 실패' });
        }

        // pending_reports에서 삭제
        db.query('DELETE FROM pending_reports WHERE id = ?', [id], (err, result) => {
          if (err) {
            return res.status(500).json({ success: false, message: '삭제 실패' });
          }
          res.json({ success: true, message: '제보가 승인되었습니다.' });
        });
      }
    );
  });
});

// 제보 거부 (관리자용)
app.delete('/api/admin/reject-report/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);

  db.query('DELETE FROM pending_reports WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: '거부 실패' });
    }
    res.json({ success: true, message: '제보가 거부되었습니다.' });
  });
});

// ==================== 공지사항 API ====================

// 공지사항 조회 (사용자용)
app.get('/api/announcements', (req, res) => {
  db.query('SELECT * FROM announcements ORDER BY created_at DESC LIMIT 10', (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: '서버 오류' });
    }
    res.json({ success: true, data: results });
  });
});

// 공지사항 등록 (관리자용)
app.post('/api/admin/announcements', requireAdmin, (req, res) => {
  const { title, content } = req.body;

  db.query('INSERT INTO announcements (title, content) VALUES (?, ?)', [title, content], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: '등록 실패' });
    }
    res.json({ success: true, message: '공지사항이 등록되었습니다.' });
  });
});

// 공지사항 삭제 (관리자용)
app.delete('/api/admin/announcements/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);

  db.query('DELETE FROM announcements WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: '삭제 실패' });
    }
    res.json({ success: true, message: '삭제되었습니다.' });
  });
});

// 서버 시작
app.listen(PORT, '0.0.0.0', () => {
  console.log(`FIVEN:FREEDOM 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`로컬 접속 주소: http://localhost:${PORT}`);
  console.log(`외부 접속 주소: http://168.107.28.244:${PORT}`);
});
