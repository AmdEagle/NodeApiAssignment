const CONFIG = require( '../config.json' );
const log4js = require( '../node_modules/log4js' );
const coreDb = require( './core-db.js' );
log4js.configure( require( '../log4jsConfig.json' ));

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

module.exports = KRONOS;