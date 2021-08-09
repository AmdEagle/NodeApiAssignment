const CONFIG = require( '../../config.json' );
const buildStudent      = require( '../../model/Student' );
const studentDataAccess = require( '../../dataAccess/Studentdb.js' );
const registry          = require( '../../routes/routeRegistry.json' );

function StudentController( KRONOS )
{
    let studentdbConn = studentDataAccess( KRONOS.dbConn );
    async function suspend( req )
    {
        return new Promise( async ( resolve, reject ) =>
        {
            KRONOS.getLogger().debug( req.body );
            if( !req.body || !req.body.student )
            {
                resolve({ status: 400, data: `Bad Request: No student email received to suspend` });
                return;
            }

            if( typeof( req.body.student ) !== "string" )
            {
                resolve({ status: 400, data: `Bad Request: Student email expected as a string Not array or any other format. Only one student can suspended at a time.` });
                return;
            }
            
            if( CONFIG.IsUserValidationRequired )
            {
                let validUserQueryObj = 
                { 
                    query: 
                    {
                        emailId : [ req.body.student ] 
                    }
                };
                let serviceDataObj = registry.apiEndpoints[ "getUserByEmailId" ];
                KRONOS.getLogger().debug( `Calling service internally to check if users entered are valid users` );
                KRONOS.getLogger().debug( `Routing to Service: ${ serviceDataObj.ServiceId } and Operation: ${ serviceDataObj.OperationId }` );
                let validUsers = await KRONOS.ServiceManager[ serviceDataObj.ServiceId ][ serviceDataObj.OperationId ]( validUserQueryObj ).catch( err => reject( err ));
                KRONOS.getLogger().debug( validUsers );
                if( validUsers.data.length == 0 )
                {
                    resolve({ status: 400, data: `Bad Request: Student ${ req.body.student } is not a registered student` });
                    return;
                }

                if( validUsers.data[0].Type !== 'Student' )
                {
                    resolve({ status: 400, data: `Bad Request: ${ req.body.student } is not a student but a ${validUsers.data[0].Type}` });
                    return;
                }
            }
            
            let student = await buildStudent({ StudentEmail : req.body.student, IsSuspended: true });
            let result  = await studentdbConn.suspend( student ).catch( err =>
            {
                reject( err );
            });
            if( result )resolve({ status: 204, data: `Student ${req.body.student} has been successfully suspended` });
        });
    }

    async function getSuspendedStudents()
    {
        return new Promise( async ( resolve, reject ) =>
        {
            let result  = await studentdbConn.getSuspendedStudents().catch( err =>
            {
                reject( err );
            });
            if( result )resolve({ status: 200, data: result });
        });
    }

    async function deleteSuspendedStudents( req )
    {
        return new Promise( async ( resolve, reject ) =>
        {
            if( !req.body || !req.body.students )
            {
                resolve({ status: 400, data: `Bad Request: No student email received for deletion of students` });
                return;
            }
            if( !Array.isArray( req.body.students ))
            {
                resolve({ status: 400, data: `Bad Request: Expecting students as an array` });
                return;
            }
            let result  = await studentdbConn.deleteSuspendedStudents( req.body.students ).catch( err =>
            {
                reject( err );
            });
            if( result )resolve({ status: 200, data: { message:  `Deleted ${result.affectedRows} rows` }});
        });
    }

    async function deleteAllStudents( req )
    {
        return new Promise( async ( resolve, reject ) =>
        {
            let result  = await studentdbConn.deleteAllStudents().catch( err =>
            {
                reject( err );
            });
            if( result )resolve({ status: 200, data: { message:  `Deleted ${result.affectedRows} rows` }});
        });
    }

    async function getSuspendedStudentUnderTeacher( req )
    {
        return new Promise( async ( resolve, reject ) =>
        {
            if( !req.params || !req.params.teacher )
            {
                resolve({ status: 400, data: `Bad Request: No teacher email received to get students` });
                return;
            }
            let result  = await studentdbConn.getSuspendedStudentUnderTeacher( teacherEmail ).catch( err =>
            {
                reject( err );
            });
            if( result )resolve({ status: 204, data: result });
        });
    }

    return Object.freeze({
        suspend,
        getSuspendedStudents,
        getSuspendedStudentUnderTeacher,
        deleteSuspendedStudents,
        deleteAllStudents
    });
};
module.exports = StudentController;