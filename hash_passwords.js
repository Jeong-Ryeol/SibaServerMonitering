const bcrypt = require('bcrypt');

async function hashPasswords() {
  const sitePassword = 'freedom2025';
  const adminPassword = 'admin2025';

  try {
    const hashedSitePassword = await bcrypt.hash(sitePassword, 10);
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    console.log('=== 비밀번호 해시 생성 완료 ===\n');
    console.log('사이트 비밀번호 (freedom2025):');
    console.log(hashedSitePassword);
    console.log('\n관리자 비밀번호 (admin2025):');
    console.log(hashedAdminPassword);
    console.log('\n=== SQL 업데이트 쿼리 ===\n');
    console.log(`UPDATE site_password SET password = '${hashedSitePassword}' WHERE id = 1;`);
    console.log(`UPDATE admin_password SET password = '${hashedAdminPassword}' WHERE id = 1;`);
  } catch (error) {
    console.error('해싱 오류:', error);
  }
}

hashPasswords();
