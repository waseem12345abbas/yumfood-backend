/**
 * Lightweight request validation middleware.
 * Pass an object of field → validator functions.
 *
 * Example:
 *   router.post('/register', validateRequest({
 *     email: (v) => /\S+@\S+\.\S+/.test(v) || 'Invalid email',
 *     password: (v) => v?.length >= 6 || 'Password too short',
 *   }), register);
 */
const validateRequest = (rules) => (req, res, next) => {
  const errors = [];

  for (const [field, validator] of Object.entries(rules)) {
    const value = req.body[field];
    const result = validator(value);
    if (result !== true) {
      errors.push({ field, message: result });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors.map((e) => e.message).join(', '),
      errors,
    });
  }

  next();
};

module.exports = validateRequest;
