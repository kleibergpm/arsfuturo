export const validate = (schema) => (req, res, next) => { req.body = schema.parse(req.body); next(); };
