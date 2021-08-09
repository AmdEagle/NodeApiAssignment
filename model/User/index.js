let userValidator   = require('./UserValidator.js');
let buildUser       = require('./User.js');


let user = buildUser( userValidator );
module.exports = user;