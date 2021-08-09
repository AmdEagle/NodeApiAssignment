let buildUser = function( validator )
{
    return async ( userObj = {} ) =>{
        let validatedData = await validator( userObj );
        validatedData = validatedData.value;
        if( validatedData.error )
            throw new Error( validatedData.error );
        
        let freezedOBj = Object.freeze(
        {
           Email    : validatedData.Email,
           Username : validatedData.Username,
           Type     : validatedData.Type
        });


        return freezedOBj;
    };
};
module.exports = buildUser;