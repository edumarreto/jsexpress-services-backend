//Node app start - lib sequelize applying database changes

import fs from "fs";

module.exports = app => {
	if (process.env.NODE_ENV !== "test") {
		app.listen(app.get("port"), () => {
			console.log("Environment - " + process.env.NODE_ENV);
			console.log("==================================");
			console.log(`Node APIs - port ${app.get("port")}`);
		});
	}
};