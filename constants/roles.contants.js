const constants = {};

constants.SUPERADMIN = process.env.SUPERADMIN_ROLE  || "superadmin";
constants.ADMIN = process.env.ADMIN_ROLE  || "admin";
constants.USER  = process.env.USER.ROLE   || "user";
constants.ENUM  = [constants.SUPERADMIN, constants.ADMIN, constants.USER];

module.exports = constants;