module.exports = app => {

	/**
	* @api {get} / API Status
	* @apiGroup Status
	* @apiSuccess {String} API message status
	* @apiSuccessExample {json} Success
	* HTTP/1.1 200 OK
	* {"status": "NTask API"}
	*/
	app.get("/", (req, res) => {
		res.json({status: "up"});
	});
};