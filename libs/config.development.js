import logger from "./logger.js";


module.exports = {
	//MYSQL database strings
	host: "",
	database: "",
	username: "",
	password: "",
	dialect: "mysql",

	logging: (sql) => {logger.info(`[${new Date()}] ${sql}`);},

	//jwt secret token
	jwtSecret: "",
	jwtSession: {session: false},
	//token expiration time
	expiration: 12,
	//token expiration time unit
	expunit: "hours"
};