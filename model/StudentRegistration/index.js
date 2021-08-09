let studentRegistrationValidator   = require('./StudentRegistrationValidator.js');
let buildStudentRegistration       = require('./StudentRegistration.js');


let studentRegistration = buildStudentRegistration( studentRegistrationValidator );
module.exports = studentRegistration;