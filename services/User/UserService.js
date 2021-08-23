const buildUser         = require( '../../model/User' );
const userDataAccess    = require( '../../dataAccess/Userdb.js' );

function UserController( KRONOS )
{
    let userdbConn = userDataAccess( KRONOS.dbConn );
    async function getUsers( req )
    {
        return userdbConn.getUsers()
        .then( result => ({ status: 200, data: result }));
    }

    async function getUserByEmailId( req )
    {
        let emailId = req.query.emailId;
        if( !emailId )
        {
            return ({ status: 400, data: "Bad Request:  No email id was provided for Query" });
        }
        return userdbConn.getUserByEmailId( emailId )
        .then( result => ({ status: 200, data: result }));
    }

    async function addUser( req )
    {
        if( !req.body )
        {
            return ({ status: 400, data: `Bad Request: No User data to load` });
        }
        let userObj = await buildUser( req.body );
        return userdbConn.addUser( userObj )
        .then( result => ({ status: 200, data: { message : `Added user successfully` }})) 
        .catch( err => 
        {
            if( err.sqlMessage && err.sqlMessage.includes( 'Duplicate entry' ))
            {
                return ({ status: 400, data: `Bad Request: User already exits in database` });
            }
            else
            {
                return err;
            }
        });
    }

    return Object.freeze({
        getUsers,
        getUserByEmailId,
        addUser
    });
};
module.exports = UserController;