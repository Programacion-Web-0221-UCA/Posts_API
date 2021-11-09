const Mongoose = require("mongoose");
const debug = require("debug")("app:mongoose");

const dbhost = process.env.DBHOST || "localhost";
const dbport = process.env.DBPORT || "27017";
const dbname = process.env.DBNAME || "posts_pw2021";

const dburi = process.env.DBURI 
  || `mongodb://${dbhost}:${dbport}/${dbname}`;

const connect = async () => {
  try {
    await Mongoose.connect(dburi, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    debug("Connection successful");
  } catch (error) {
    debug("Failed to connect database");
    debug(error.message)
    process.exit(1);
  }
};

const disconnect = async () => {
  try {
    await Mongoose.disconnect();
    debug("Connection to database end");
  } catch {
    process.exit(1);  
  }
}

module.exports = {
  connect: connect,
  disconnect: disconnect
}
