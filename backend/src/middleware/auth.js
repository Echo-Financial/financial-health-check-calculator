const jwt = require('jsonwebtoken');

function signAdminToken(payload = {}) {
  return jwt.sign(
    { ...payload, role: 'admin' },
    process.env.JWT_SECRET,
    {
      issuer: process.env.JWT_ISSUER || 'financial-health-check',
      audience: process.env.JWT_AUDIENCE || 'admin',
      expiresIn: process.env.JWT_TTL || '15m',
    }
  );
}

function verifyAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const [, token] = auth.split(' ');
    if (!token) return res.status(401).json({ error: 'Missing bearer token' });
    const claims = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER || 'financial-health-check',
      audience: process.env.JWT_AUDIENCE || 'admin',
    });
    req.admin = claims; // { sub, role, iat, exp, ... }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { signAdminToken, verifyAdmin };

