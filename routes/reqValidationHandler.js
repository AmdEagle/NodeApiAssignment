const registry  = require( './routeRegistry.json' );
const KRONOS    = require('../core/core');

let reqValidationHandler = ( req, res, next ) =>
{
    if( !KRONOS.isDatabaseRunning )
    {
        KRONOS.getLogger().debug(`Failed to process rquest during to Database connection error`);
        let incomingReq = 
        {
            path    : req.path,
            method  : req.method,
            query   : req.query,
            body    : req.body
        };
        KRONOS.getLogger().debug( `Request info during DB Downtime` );
        KRONOS.getLogger().debug( incomingReq );
        res.status( 500 ).json({ message: `Internal Server Error` });
    }

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

    let apiName = req.path.replace( '/', '' );
    KRONOS.getLogger().debug( req.url, registry.apiEndpoints[ apiName ]  );
    let serviceDataObj = registry.apiEndpoints[ apiName ];
    KRONOS.getLogger().trace( serviceDataObj );
    if( serviceDataObj && req.method == serviceDataObj.httpMethod )
    {
        req.serviceDataObj = serviceDataObj;
        next();
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
};

module.exports = reqValidationHandler;