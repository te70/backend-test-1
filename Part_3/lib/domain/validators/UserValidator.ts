import Joi from 'joi';

export default Joi.object({
  firstName: Joi.string()
    .label('first_name')
    .min(2)
    .required(),

  lastName: Joi.string()
    .label('last_name')
    .min(1)
    .required(),

  email: Joi.string()
    .label('email')
    .email()
    .required(),

  password: Joi.string()
    .label('password')
    .alter({
      create: (schema) => schema.pattern(/^[a-zA-Z0-9]{3,30}$/),
      update: (schema) => schema.pattern(/^\$2[ayb]\$.{56}$/)
    })
    .required(),

  phone: Joi.string()
    .label('phone')
    .min(10)
    .regex(/^\d+$/)
    .optional(),
}).unknown();
