const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'webapp_db'
});

console.log('데이터베이스 연결 중...');

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL 연결 실패:', err);
    process.exit(1);
  }

  console.log('✅ MySQL 연결 성공!\n');

  const sitePasswordHash = '$2b$10$QbeQYM3fZelfA59PgIj82e9LiMz.0BRetcWvhoS.RuQIAQxfAfkMi';
  const adminPasswordHash = '$2b$10$IJlAg5UsEt.HlVgeCpc3iONDB4o4NPjI.mm99jlwwpWaScSn0D4q6';

  console.log('비밀번호 업데이트 중...\n');

  // 사이트 비밀번호 업데이트
  db.query('UPDATE site_password SET password = ? WHERE id = 1', [sitePasswordHash], (err, result) => {
    if (err) {
      console.error('❌ 사이트 비밀번호 업데이트 실패:', err);
      db.end();
      process.exit(1);
    }

    console.log('✅ 사이트 비밀번호 업데이트 완료 (freedom2025)');
    console.log(`   영향받은 행: ${result.affectedRows}\n`);

    // 관리자 비밀번호 업데이트
    db.query('UPDATE admin_password SET password = ? WHERE id = 1', [adminPasswordHash], (err, result) => {
      if (err) {
        console.error('❌ 관리자 비밀번호 업데이트 실패:', err);
        db.end();
        process.exit(1);
      }

      console.log('✅ 관리자 비밀번호 업데이트 완료 (admin2025)');
      console.log(`   영향받은 행: ${result.affectedRows}\n`);

      // 확인
      db.query(`
        SELECT 'site_password' as table_name, LEFT(password, 20) as password_hash
        FROM site_password WHERE id = 1
        UNION ALL
        SELECT 'admin_password' as table_name, LEFT(password, 20) as password_hash
        FROM admin_password WHERE id = 1
      `, (err, results) => {
        if (err) {
          console.error('❌ 확인 실패:', err);
        } else {
          console.log('📋 업데이트 확인:');
          console.table(results);
        }

        db.end();
        console.log('\n✅ 모든 작업 완료!');
        console.log('이제 서버를 재시작하세요: pm2 restart all');
      });
    });
  });
});
