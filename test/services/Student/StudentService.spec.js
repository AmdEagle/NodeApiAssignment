const stubs = {
    '../../dataAccess/Studentdb.js': () => 
    {
        function suspend( student )
        {
            return new Promise(( resolve, reject ) =>
            {
                resolve(
                {
                    fieldCount: 0,
                    affectedRows: 1,
                    insertId: 0,
                    serverStatus: 2,
                    warningCount: 0,
                    message: '',
                    protocol41: true,
                    changedRows: 0
                });
            })
        }

        return Object.freeze(
        {
            suspend
        });
    },
};
const proxyquire        = require('proxyquire')
const studentService    = proxyquire( "../../../services/Student/StudentService", stubs );
var expect              = require('chai').expect;
let KRONOS = {};
KRONOS.getLogger = () =>
{
    function debug( msg )
    {
    }
    return {debug};
};
studentServiceObj = studentService( KRONOS );
describe("Student Service Unit Tests", () =>
{
    it('Verify that a valid valid req body will suspend the student successfully', async () =>
    {
        let req = 
        {
            body: 
            {
                student: "studentToSuspend@gmail.com"
            }
        };

        let result  = await studentServiceObj.suspend( req );
        expect( result.status ).to.equal( 204 );
        expect( result.data ).to.equal('Student studentToSuspend@gmail.com has been successfully suspended');
    });

    it('Verify that an error will be shown when req body is missing student property', async () =>
    {
        let req = { body:{}};
        let result  = await studentServiceObj.suspend( req );
        expect( result.status ).to.equal( 400 );
        expect( result.data ).to.equal('Bad Request: No student email received to suspend');
    });

    it('Verify that an error will be shown when req is missing body', async () =>
    {
        let req = { body:{}};
        let result  = await studentServiceObj.suspend( req );
        expect( result.status ).to.equal( 400 );
        expect( result.data ).to.equal('Bad Request: No student email received to suspend');
    });
});