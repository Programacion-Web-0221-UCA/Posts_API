const { verifyToken } = require('@app/utils/jwt.tools');
const { isValid } = require('mongoose').Types.ObjectId;
const userService = require('@app/services/user.service');
const { ROLES } = require('@app/constants');

const debug = require('debug')("app:auth");

const middlewares = {};

const tokenPrefix = process.env.TOKEN_PREFIX || "Bearer";

const rolesPriority = {};
rolesPriority[ROLES.SUPERADMIN] = 2;
rolesPriority[ROLES.ADMIN] = 1;
rolesPriority[ROLES.USER] = 0;

middlewares.authRequired = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    //Field validation
    if(!authorization){
      return res.status(400).json({ error: "Auth: Authorization required" });
    }

    //Split token and prefix
    const [prefix, token] = authorization.split(" ");

    //Prefix validation
    if(prefix !== tokenPrefix){
      return res.status(400).json({ error: "Auth: Invalid token prefix" });
    }

    //Token existance validation
    if(!token){
      return res.status(400).json({ error: "Auth: Token is required"});
    }

    //Token integrity validation
    const tokenObject = verifyToken(token);
    if(!tokenObject) {
      return res.status(403).json({ error: "Auth: Invalid token"});
    }

    //User id integrity validation
    const { _id: userID } = tokenObject;
    debug(`User id: ${userID}`);
    if(!isValid(userID)) {
      return res.status(403).json({ error: "Auth: Invalid token"});
    }

    //User existance validation
    const { status: userExists, content: user } 
      = await userService.findOneById(userID);

    if(!userExists) {
      return res.status(404).json({ error: "Auth: User not found" });
    }

    //Token existance validation
    const { status: isValidToken } = await userService.verifyValidToken(userID, token);
    if(!isValidToken){
      return res.status(403).json({ error: "Auth: Token not registered" });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
}

middlewares.roleValidatorHelper = (roleToVerify) => (req, res, next) => {
  const { role } = req.user;

  const roleMatching = rolesPriority[role] >= rolesPriority[roleToVerify];
  if(!roleMatching){
    return res.status(401).json({ error: "Auth: Unauthorized to access here"});
  }

  next();
}

module.exports = middlewares;