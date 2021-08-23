const express   = require('../node_modules/express');
const KRONOS    = require('../core/core');
const router    = express.Router();

router.all( '/:apiName', async ( req, res ) =>
{
    try
    {
        let serviceDataObj = req.serviceDataObj;
        KRONOS.getLogger().debug( `Routing to Service: ${ serviceDataObj.ServiceId } and Operation: ${ serviceDataObj.OperationId }` );
        const startTime = new Date().getTime();
        let result  = await KRONOS.ServiceManager[ serviceDataObj.ServiceId ][ serviceDataObj.OperationId ]( req ).catch( err =>
        {
            if( err.sqlMessage )KRONOS.getLogger().error( err.sqlMessage );
            if( err.sql )KRONOS.getLogger().error( err.sql );
            KRONOS.getLogger().error( `Error Msg Caught: ${err.message}` );
            KRONOS.getLogger().trace( err );
            res.status( 500 ).json({ message: `Internal Server Error`});
            KRONOS.getLogger().error( `Response sent to user: Internal Server Error with status code of 500` );
        });
        if( result )
        {
            KRONOS.getLogger().trace( result );
            const endTime = new Date().getTime();
            KRONOS.getLogger().debug( `Result retrived with a status : ${ result.status }, Total Processing Time: ${endTime - startTime} milliseconds.` );
            if( result.status == 400 )
            {
                res.status( result.status ).json({ message: result.data });
            }
            else
            {
                res.status( result.status ).json( result.data );
            }
        }
        else
            KRONOS.getLogger().debug( `Returned result was empty.` );
    }
    catch( err ) 
    {
        KRONOS.getLogger().error( err );
        res.status( 500 ).json({ message: `Internal Server Error` });
    }
});

module.exports = router;