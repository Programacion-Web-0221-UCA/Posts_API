const constants = {};

const rolesConsts = require("./roles.contants");
const regexpConsts = require("./regexp.constants");

constants.ROLES = { ...rolesConsts };
constants.REGEXP = { ...regexpConsts };

module.exports = constants;