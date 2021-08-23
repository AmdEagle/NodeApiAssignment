const CONFIG = require( '../../config.json' );
const buildStudent      = require( '../../model/Student' );
const studentDataAccess = require( '../../dataAccess/Studentdb.js' );

function StudentController( KRONOS )
{
    let studentdbConn = studentDataAccess( KRONOS.dbConn );
    async function suspend( req )
    {
        KRONOS.getLogger().debug( req.body );
        if( !req.body || !req.body.student )
        {
            return { status: 400, data: `Bad Request: No student email received to suspend` };
        }

        if( typeof( req.body.student ) !== "string" )
        {
            return { status: 400, data: `Bad Request: Student email expected as a string Not array or any other format. Only one student can suspended at a time.` };
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

            KRONOS.getLogger().debug( `Calling service internally to check if users entered are valid users` );
            let validUsers = await KRONOS.ServiceManager.apiCall( "getUserByEmailId" )( validUserQueryObj );
            KRONOS.getLogger().debug( validUsers );
            if( validUsers.data.length == 0 )
            {
                return { status: 400, data: `Bad Request: Student ${ req.body.student } is not a registered student` };
            }

            if( validUsers.data[0].Type !== 'Student' )
            {
                return { status: 400, data: `Bad Request: ${ req.body.student } is not a student but a ${validUsers.data[0].Type}` };
            }
        }
        
        let student = await buildStudent({ StudentEmail : req.body.student, IsSuspended: true });
        return studentdbConn.suspend( student )
        .then( result => ({ status: 204, data: `Student ${req.body.student} has been successfully suspended` }));
    }

    async function getSuspendedStudents()
    {
        return studentdbConn.getSuspendedStudents()
        .then( result => ({ status: 200, data: result }));
    }

    async function deleteSuspendedStudents( req )
    {
        if( !req.body || !req.body.students )
        {
            return { status: 400, data: `Bad Request: No student email received for deletion of students` };
        }
        if( !Array.isArray( req.body.students ))
        {
            return { status: 400, data: `Bad Request: Expecting students as an array` };
        }
        return studentdbConn.deleteSuspendedStudents( req.body.students )
        .then( result => ({ status: 200, data: { message:  `Deleted ${result.affectedRows} rows` }}));
    }

    async function deleteAllStudents( req )
    {
        return studentdbConn.deleteAllStudents()
        .then( result => ({ status: 200, data: { message:  `Deleted ${result.affectedRows} rows` }}));
    }

    async function getSuspendedStudentUnderTeacher( req )
    {
        if( !req.params || !req.query.teacher )
        {
            return { status: 400, data: `Bad Request: No teacher email received to get students` };
        }

        return studentdbConn.getSuspendedStudentUnderTeacher( req.query.teacher )
        .then( res => ({ status: 204, data: result }));
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