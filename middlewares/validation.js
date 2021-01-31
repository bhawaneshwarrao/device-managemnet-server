const Joi = require('joi');

const deviceSchema = Joi.object({
  id: Joi.string(),
  device: Joi.string().required(),
  os: Joi.string().required(),
  manufacturer: Joi.string().required(),
  lastCheckedOutBy: Joi.string(),
  isCheckedOut: Joi.boolean(),
});

const deviceSchemaValidation = () => (req, res, next) => {
  const { error } = deviceSchema.validate(req.body);
  const valid = error == null;
  if (valid) {
    next();
  } else {
    const { details } = error;
    const message = details.map((i) => i.message).join(',');
    res.status(400).json({ error: message });
  }
};
module.exports = deviceSchemaValidation;
