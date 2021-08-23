const CONFIG = require( '../../config.json' );
const buildStudentRegistration      = require( '../../model/StudentRegistration' );
const studentRegistrationDBAccess   = require( '../../dataAccess/StudentRegistrationdb.js' );

function StudentRegistrationController( KRONOS )
{
    let studentRegistrationdbConn = studentRegistrationDBAccess( KRONOS.dbConn );
    async function register( req )
    {
        if( !req.body )
        {   
            return { status: 400, data: `Bad Request: [Missing]- request body` };
        }

        let studentList = req.body.students || req.body.student;
        let teacherList = req.body.teachers || req.body.teacher;

        if( !studentList )
        {   
            return { status: 400, data: `Bad Request: [Missing]- request student info` };
        }

        if( !teacherList )
        {   
            return { status: 400, data: `Bad Request: [Missing]- request teacher info` };
        }

        studentList = Array.isArray( studentList ) ? studentList : [studentList];
        teacherList = Array.isArray( teacherList ) ? teacherList : [teacherList];

        if( studentList.length == 0 )
        {
            return { status: 400, data: `Bad Request: Students list is empty. No students to register` };
        }

        if( teacherList.length == 0 )
        {
            return { status: 400, data: `Bad Request: Teachers list is empty. No Teacher to register under` };
        }
        if( CONFIG.IsUserValidationRequired )
        {
            let validUserQueryObj = 
            { 
                query: 
                {
                    emailId : [ ...studentList, ...teacherList ] 
                }
            };

            KRONOS.getLogger().debug( `Calling service internally to check if users entered are valid users` );
            let validUsers = await KRONOS.ServiceManager.apiCall( "getUserByEmailId" )( validUserQueryObj );
            if( validUsers.data.length != validUserQueryObj.query.emailId.length )
            {
                KRONOS.getLogger().trace( validUserQueryObj.query.emailId );
                let validUserList = validUsers.data.map( x => x.Email );
                KRONOS.getLogger().trace("--------------");
                KRONOS.getLogger().trace( validUserList );
                let invalidUsers = validUserQueryObj.query.emailId.filter( x => 
                {   
                    if( validUserList.indexOf( x ) < 0 )
                        return x;
                });
                return { status: 400, data: `Bad Request: Please ensure all the teachers and students belong to Users Table. Invalid Users are: ${invalidUsers.join(',')}` };
            }
        }

        let registrationSet = [];
        teacherList.forEach( teacher =>
        {
            studentList.forEach( student =>
            {
                registrationSet.push({ StudentEmail: student, TeacherEmail: teacher });
            });
        })

        KRONOS.getLogger().debug( `Create valid registration objects to inserted` );
        let dataSetTobeInserted = await Promise.all( registrationSet.map( async x => await buildStudentRegistration( x )));
        let registrationPromiseList = [];
        let listOfErrors = [];
        dataSetTobeInserted.forEach( x =>
        {
            registrationPromiseList.push( studentRegistrationdbConn.register( x ).catch( err => 
            {
                listOfErrors.push( err );
            }));
        })
        
        let results = await Promise.all( registrationPromiseList );
        KRONOS.getLogger().trace( results );
        KRONOS.getLogger().trace( listOfErrors );
        let noDuplicateKeyErrors = listOfErrors.filter( x => 
        {
            if( !x.sqlMessage.includes( 'Duplicate entry' ))
            {
                return x;
            }
        });
        if( noDuplicateKeyErrors.length > 0 )
        {
            return ( JSON.stringify( noDuplicateKeyErrors, null, 4 ));
        }
        else
        {
            return { status: 204, data: "Registered Students to teacher successfully" };
        }
    }

    async function commonstudents( req )
    {
        if ( !req.query.teacher )
        {
            return { status: 400, data: `Bad Request: No teacherId found` };
        }

        let teachers = req.query.teacher;
        teachers = Array.isArray( teachers ) ? teachers : [ teachers ];
        KRONOS.getLogger().debug( `Decode URI Component for all emails` );
        teachers = teachers.map( x =>  decodeURIComponent( x ));
        let result = await studentRegistrationdbConn.getStudentsForTeacherId( teachers );
        KRONOS.getLogger().debug( result );
        if( !result )return Promise.reject( result );
        if( teachers.length < 2 )
        {
            KRONOS.getLogger().debug( `If there is only 1 teacher return students that belong to that teacher` );
            return { status: 200, data: { students: result.map( x => x.StudentEmail ) }};
        }
        else
        {
            KRONOS.getLogger().debug( `Find the common students among the teachers` );
            let mapStudents = {}; 
            result.forEach( item =>
            {
                if( mapStudents[ item.StudentEmail ] == null )mapStudents[ item.StudentEmail ] = [];
                mapStudents[ item.StudentEmail ].push( item.TeacherEmail );
            })
            let commonStudents = [];
            for( let studentEmail in mapStudents )
            {
                if( mapStudents[ studentEmail ].length == teachers.length )
                {
                    commonStudents.push( studentEmail );
                }
            }
            return { status: 200, data: { students: commonStudents }};
        }
    }

    async function getStudentsEligibleForNotification( teacherEmail )
    {
        return studentRegistrationdbConn.getStudentsEligibleForNotification( teacherEmail )
        .then( result => ({ status: 200, data: result.map( x => x.StudentEmail )}));
    }

    async function getAllRegisteredStudents()
    {
        return studentRegistrationdbConn.getAllRegisteredStudents()
        .then( result => ({ status: 200, data: result }));
    }

    async function deleteAllRegisteredStudents()
    {
        return studentRegistrationdbConn.deleteAllRegisteredStudents()
        .then( result => ({ status: 200, data: { message:  `Deleted ${result.affectedRows} rows` }}));
    }
    
    return Object.freeze({
        register,
        commonstudents,
        getStudentsEligibleForNotification,
        deleteAllRegisteredStudents,
        getAllRegisteredStudents
    });
};
module.exports = StudentRegistrationController;