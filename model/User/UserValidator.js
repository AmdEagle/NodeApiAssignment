const Joi = require( 'joi' );

async function userValidator( payLoad )
{
    let userSchema = Joi.object(
    {
        Username    : Joi.string(),
        Email       : Joi.string().email(),
        Type        : Joi.string()
    });
    return await userSchema.validate( payLoad );
};

module.exports = userValidator;