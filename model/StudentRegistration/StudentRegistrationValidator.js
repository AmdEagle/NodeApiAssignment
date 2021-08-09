const Joi = require( 'joi' );

async function studentRegistrationValidator( payLoad )
{
    let schema = Joi.object(
    {
        StudentEmail    : Joi.string().email().required(),
        TeacherEmail    : Joi.string().email().required(),
    });
    return await schema.validate( payLoad );
};

module.exports = studentRegistrationValidator;