exports.ok = (res, data = {}) => res.status(200).json({ success: true, data });
exports.fail = (res, httpStatus, code, message, details) =>
  res.status(httpStatus).json({
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
  });

