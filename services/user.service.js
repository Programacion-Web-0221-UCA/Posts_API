const User = require("@app/models/User");
const ServiceResponse = require("@app/classes/ServiceResponse");

const { verifyToken } = require("@app/utils/jwt.tools");
const { ROLES } = require("@app/constants");

const service = {};

service.register = async ({username, email, password }, role = ROLES.USER) => {
  try{
    const user = new User({
      username,
      email,
      password,
      role
    });

    const newUser = await user.save();

    if (!newUser) return new ServiceResponse(false);

    return new ServiceResponse(true);
  } catch (error) {
    throw error;
  }
}

service.findOneByUsernameOrEmail = async ({username, email}) => {
  try{
    const user = await User.findOne({
      $or: [{ username: username}, {email: email}]
    });

    if(!user) return new ServiceResponse(false);

    return new ServiceResponse(true, user);
  } catch (error) {
    throw error;
  }
}

service.findOneById = async (id) => {
  try{
    const user = await User.findById(id)
      .select("-hashedPassword -validTokens -salt");

    if(!user) return new ServiceResponse(false);

    return new ServiceResponse(true, user);
  } catch (error) {
    throw error;
  }
}

service.findAll = async () => {
  try{
    const users = await User.find({})
      .select("-hashedPassword -validTokens -salt");

    return new ServiceResponse(true, users);
  } catch (error) {
    throw error;
  }
}

service.insertValidToken = async (id, token) => {
  try{
    const user = await User.findById(id);
    if(!user) return new ServiceResponse(false);

    user.validTokens = user.validTokens.filter(token => verifyToken(token));

    const newTokens = [token, ...user.validTokens.slice(0,4)];
    user.validTokens = newTokens;

    const userSaved = await user.save();

    if(!userSaved) return new ServiceResponse(false);
    return new ServiceResponse(true);
  } catch (error) {
    throw error;
  }
}

service.verifyValidToken = async (id, token) => {
  try{
    const user = await User.findById(id);
    if(!user) return new ServiceResponse(false);

    user.validTokens = user.validTokens.filter(token => verifyToken(token));

    const index =  user.validTokens.findIndex(vToken => vToken === token);
    if(index < 0) return new ServiceResponse(false);

    return new ServiceResponse(true)
  } catch (error) {
    throw error;
  }
}

service.updatePassword = async (user, password, reqToken=undefined) => {
  try{
    user.password = password;
    user.validTokens = reqToken ? [reqToken] : [];

    const userSaved = user.save();

    if(!userSaved) return new ServiceResponse(false);
    return new ServiceResponse(true); 
  } catch (error) {
    throw error;
  }
}

service.updateRole = async (user, role) => {
  try{
    user.role = role;

    const userSaved = user.save();

    if(!userSaved) return new ServiceResponse(false);
    return new ServiceResponse(true);
  } catch (error) {
    throw error;
  }
}

module.exports = service;