const validate = (schema) => async (req, res, next) => {
  try {
    const result = await schema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });
    req.body = result;
    return next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid submission',
      details: err.details?.map((d) => d.message) || [String(err.message)],
    });
  }
};

module.exports = validate;

