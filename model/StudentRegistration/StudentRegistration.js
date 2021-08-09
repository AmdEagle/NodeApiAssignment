let buildUser = function( validator )
{
    return async ( studentRegistrationObj = {} ) =>{
        
        let validatedData = await validator( studentRegistrationObj );
        if( validatedData.error )
            throw new Error( validatedData.error );
        
        validatedData = validatedData.value;    
        let freezedOBj = Object.freeze(
        {
            StudentEmail    : validatedData.StudentEmail,
            TeacherEmail    : validatedData.TeacherEmail
        });

        return freezedOBj;
    };
};
module.exports = buildUser;