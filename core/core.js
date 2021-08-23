const CONFIG = require( '../config.json' );
const log4js = require( '../node_modules/log4js' );
const coreDb = require( './core-db.js' );
log4js.configure( require( '../log4jsConfig.json' ));
const path      = require('path');
const fs        = require( 'fs' );
const registry  = require( '../routes/routeRegistry.json' );

const logger = log4js.getLogger('CORE');
const KRONOS = {};
KRONOS.getConfig = () => CONFIG;
KRONOS.getLogger = () => logger;

logger.info(`
██   ██ ██████   ██████  ███    ██  ██████  ███████     ██    ██ ███████ ██████       ██████      ██ 
██  ██  ██   ██ ██    ██ ████   ██ ██    ██ ██          ██    ██ ██      ██   ██     ██  ████    ███ 
█████   ██████  ██    ██ ██ ██  ██ ██    ██ ███████     ██    ██ █████   ██████      ██ ██ ██     ██ 
██  ██  ██   ██ ██    ██ ██  ██ ██ ██    ██      ██      ██  ██  ██      ██   ██     ████  ██     ██ 
██   ██ ██   ██  ██████  ██   ████  ██████  ███████       ████   ███████ ██   ██      ██████  ██  ██                                                                                                                                 
`);

KRONOS.getLogger().debug( "Logger Initialized" );
KRONOS.dbConn = coreDb( KRONOS ).initDbConnection();

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

KRONOS.ServiceManager.getSvcAndOpsFromApi = ( apiName ) =>
{
    let svcObj = registry.apiEndpoints[ apiName ];
    KRONOS.getLogger().debug( `Routing to Service: ${ svcObj.ServiceId } and Operation: ${ svcObj.OperationId }` );
    return { svc: svcObj.ServiceId, ops: svcObj.OperationId };
};

KRONOS.ServiceManager.apiCall = ( apiName ) =>
{
    let svcObj = registry.apiEndpoints[ apiName ];
    return KRONOS.ServiceManager[ svcObj.ServiceId ][ svcObj.OperationId ]
};

KRONOS.getLogger().debug( 'Initializing Service Manager : Completed' );


module.exports = KRONOS;