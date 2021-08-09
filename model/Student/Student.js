let buildStudent = function( validator )
{
    return async ( studentObj = {} ) =>{
        let validatedData = await validator( studentObj );
        if( validatedData.error )
            throw new Error( validatedData.error );
            
        validatedData = validatedData.value;        
        validatedData.SuspendedOn = validatedData.IsSuspended ? new Date().toISOString().replace( 'T', ' ' ).replace('Z', '').substring( 0, 19 ) : null ;
        let freezedOBj = Object.freeze(
        {
            StudentEmail    : validatedData.StudentEmail,
            IsSuspended     : validatedData.IsSuspended,
            SuspendedOn     : validatedData.SuspendedOn
        });

        return freezedOBj;
    };
};
module.exports = buildStudent;