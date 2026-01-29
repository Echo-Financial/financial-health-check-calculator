const express = require('express');
const router = express.Router();
const { signAdminToken, verifyAdmin } = require('../middleware/auth');

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const envUser = (process.env.ADMIN_USERNAME || '').trim();
  const envPass = (process.env.ADMIN_PASSWORD || '').trim();
  const inUser = (username || '').trim();
  const inPass = (password || '').trim();

  if (inUser === envUser && inPass === envPass) {
    const token = signAdminToken({ sub: envUser });
    return res.json({ token, expiresIn: process.env.JWT_TTL || '15m' });
  }

  // lightweight debug  does not leak secrets
  console.warn('[admin] login failed', {
    inUserLen: inUser.length,
    inPassLen: inPass.length,
    envUserLen: envUser.length,
    envPassLen: envPass.length,
  });
  return res.status(401).json({ error: 'Invalid credentials' });
});

router.get('/ping', verifyAdmin, (req, res) => {
  res.json({ ok: true, admin: req.admin.sub, role: req.admin.role });
});

module.exports = router;
