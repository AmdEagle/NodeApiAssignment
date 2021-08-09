const buildUser         = require( '../../model/User' );
const userDataAccess    = require( '../../dataAccess/Userdb.js' );

function UserController( KRONOS )
{
    let userdbConn = userDataAccess( KRONOS.dbConn );
    async function getUsers( req )
    {
        return new Promise( async ( resolve, reject ) =>
        {
            let result = await userdbConn.getUsers().catch( err =>
            {
                reject( err );
            });
            if( result )resolve({ status: 200, data: result });
        });
    }

    async function getUserByEmailId( req )
    {
        return new Promise( async ( resolve, reject ) =>
        {
            let emailId = req.query.emailId;
            if( !emailId )
            {
                resolve({ status: 400, data: "Bad Request:  No email id was provided for Query" });
            }
            let result = await userdbConn.getUserByEmailId( emailId ).catch( err => 
            {
                reject( err );
            });
            if( result )resolve({ status: 200, data: result });
        });
    }

    async function addUser( req )
    {
        return new Promise( async ( resolve, reject ) =>
        {
            if( !req.body )
            {
                resolve({ status: 400, data: `Bad Request: No User data to load` });
                return;
            }
            let userObj = await buildUser( req.body ).catch( err => 
            {
                reject( err );
            });
            await userdbConn.addUser( userObj ).catch( err => 
            {
                if( err.sqlMessage && err.sqlMessage.includes( 'Duplicate entry' ))
                    resolve({ status: 400, data: `Bad Request: User already exits in database` });
                reject( err );
            });
            resolve({ status: 200, data: { message : `Added user successfully` }});
        });
    }

    return Object.freeze({
        getUsers,
        getUserByEmailId,
        addUser
    });
};
module.exports = UserController;