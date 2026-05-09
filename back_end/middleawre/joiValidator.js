const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, {
        abortEarly: false,   
        stripUnknown:true,
    });

    if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({ errors });
    }

    next();
};

export default validate;