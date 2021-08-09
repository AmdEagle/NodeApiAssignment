const Joi = require( 'joi' );

async function studentValidator( payLoad )
{
    let studentSchema = Joi.object(
    {
        StudentEmail    : Joi.string().email().required(),
        IsSuspended     : Joi.boolean()
    });
    return await studentSchema.validate( payLoad );
};

module.exports = studentValidator;