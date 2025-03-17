const bcrypt = require('bcryptjs');

async function hashPassword(plainPassword) {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(plainPassword, saltRounds);
  console.log('Hashed Password:', hashed);
}

// Replace 'yourpassword' with the actual password you want to hash
hashPassword('Cim24@aalr');
