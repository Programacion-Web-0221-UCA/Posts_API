const userService = require('@app/services/user.service');
const { createToken } = require('@app/utils/jwt.tools');

const controller = {};

controller.register = async (req, res, next) => {
  try{
    const { username, email } = req.body;

    const { status: userExists } = await userService.findOneByUsernameOrEmail({username, email});
    if(userExists) return res.status(409).json({error: "User already exists!"});

    const {status: userRegistered} = await userService.register(req.body);

    if(!userRegistered) return res.status(409).json({error: "User not creared!"});

    return res.status(201).json({
      message: "User registered"
    });    
  } catch (error) {
    next(error);
  }
}

controller.login = async (req, res, next) => {
  try{
    const { username, password } = req.body;

    const { status: userExists, content: user } = await userService.findOneByUsernameOrEmail({username: username, email: username});
    if(!userExists) return res.status(404).json({ error: "User not found!" });

    const isPasswordCorrect = user.comparePassword(password);
    if(!isPasswordCorrect) return res.status(401).json({error: "Password incorrect!"});

    const token = createToken(user._id);
    
    const { status: tokenSaved } = await userService.insertValidToken(user._id, token);
    if(!tokenSaved) return res.status(409).json({ error: "Cannot login!" });

    return res.status(200).json({ token: token, role: user.role });
  } catch (error) {
    next(error);
  }
}

controller.whoami = async (req, res, next) => {
  try{
    const { username } = req.user;
    return res.status(200).json({ username });
  } catch (error) {
    next(error);
  }
}

module.exports = controller;