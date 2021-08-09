let studentValidator   = require('./StudentValidator.js');
let buildStudent       = require('./Student.js');

let student     = buildStudent( studentValidator );
module.exports  = student;