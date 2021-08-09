const express   = require('../node_modules/express');
const KRONOS    = require('../core/core');
const path      = require('path');
const router    = express.Router();
const fs        = require( 'fs' );
const registry  = require( './routeRegistry.json' );

KRONOS.getLogger().debug( 'Initializing Service Manager' );
KRONOS.ServiceManager = {};
let servicePath = path.join( __dirname, '../services' );
let services = fs.readdirSync( servicePath );
for( let service of services )
{
    let requiredService = require( path.join( servicePath, `/${service}/${service}Service.js` ));
    KRONOS.getLogger().debug( `Initialized Service : ${ service }` );
    KRONOS.ServiceManager[ service ] = requiredService( KRONOS );
}
KRONOS.getLogger().debug( 'Initializing Service Manager : Completed' );

router.all( '/:apiName', async ( req, res ) =>
{
    KRONOS.getLogger().debug( `Request received from : ${ req.path }, HTTP Method : ${ req.method }` );
    if( req.method != "GET" && req.method != "POST" )
    {
        KRONOS.getLogger().debug( `WRONG Method: Request received from : ${ req.path }, HTTP Method : ${ req.method }` );
        res.status( 501 ).json({ message: `[501] Not Implemented: The only methods that servers are required to support are GET and POST` });
        return;
    }

    if( req.method == "POST" && req.headers['content-type'] !== 'application/json' )
    {
        res.status( 400 ).json({ message: `Bad Header: Expecting "application/json"  but recieved ${ req.headers['content-type'] }` });
        return;
    }

    let serviceDataObj = registry.apiEndpoints[ req.params.apiName ];
    KRONOS.getLogger().trace( serviceDataObj );
    if( serviceDataObj && req.method == serviceDataObj.httpMethod )
    {
        KRONOS.getLogger().debug( `Routing to Service: ${ serviceDataObj.ServiceId } and Operation: ${ serviceDataObj.OperationId }` );
        try
        {
            const startTime = new Date().getTime();
            let result  = await KRONOS.ServiceManager[ serviceDataObj.ServiceId ][ serviceDataObj.OperationId ]( req ).catch( err =>
            {
                if( err.sqlMessage )KRONOS.getLogger().error( err.sqlMessage );
                if( err.sql )KRONOS.getLogger().error( err.sql );
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
        }
        catch( err ) 
        {
            KRONOS.getLogger().error( err );
            res.status( 500 ).json({ message: `Internal Server Error` });
        }
    }
    else if( serviceDataObj && req.method != serviceDataObj.httpMethod )
    {
        KRONOS.getLogger().debug( `Bad Request: ${ req.method } is not supported by ${ req.path } api.` );
        res.status( 400 ).json({ message: `Bad Request: ${ req.method } is not supported by ${ req.path } api.` });
    }
    else
    {
        KRONOS.getLogger().debug( `Bad Request: ${ req.path } is not a valid request` );
        res.status( 400 ).json({ message: `Bad Request: ${ req.path } is not a valid request` });
    }
});

module.exports = router;