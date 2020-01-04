//Environment file is set according with variable NODE_ENV

module.exports = app => {
	const env = process.env.NODE_ENV;
	if (env) {
		return require(`./config.${env}.js`);
	}
	return require("./config.development.js");
};