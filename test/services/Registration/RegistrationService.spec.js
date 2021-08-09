const stubs = {
    '../../dataAccess/StudentRegistrationdb.js': () => 
    {
        function register( studentsToRegister )
        {
            return new Promise(( resolve, reject ) =>
            {
                resolve({ msg: "Registered" });
            })
        }

        return Object.freeze(
        {
            register
        });
    },
};
const proxyquire        = require('proxyquire')
const registrationService    = proxyquire( "../../../services/Registration/RegistrationService", stubs );
var expect              = require('chai').expect;
let KRONOS = {};
KRONOS.getLogger = () =>
{
    function debug( msg ){}
    function trace( msg ){}
    return {debug, trace};
};
registrationServiceObj = registrationService( KRONOS );
describe("StudentRegistration Service Unit Tests", () =>
{
    it('Verify that a valid valid req body will register the student successfully', async () =>
    {
        let req = 
        {
            body: 
            {
                teacher: "teacher@gamil.com",
                students: 
                [
                    "student1@gmail.com",
                    "student2@gmail.com"
                ]
            }
        };

        let result  = await registrationServiceObj.register( req );
        expect( result.status ).to.equal( 204 );
        expect( result.data ).to.equal('Registered Students to teacher successfully');
    });

    it('Verify that an error will be shown when req body is missing student property', async () =>
    {
        let req = { body:{teacher: "teacher@gamil.com"}};
        let result  = await registrationServiceObj.register( req );
        expect( result.status ).to.equal( 400 );
        expect( result.data ).to.equal('Bad Request: [Missing]- request student info');
    });

    it('Verify that an error will be shown when req is missing body', async () =>
    {
        let req = 
        {
            body: 
            {
                students: 
                [
                    "student1@gmail.com",
                    "student2@gmail.com"
                ]
            }
        };
        let result  = await registrationServiceObj.register( req );
        expect( result.status ).to.equal( 400 );
        expect( result.data ).to.equal('Bad Request: [Missing]- request teacher info');
    });
});