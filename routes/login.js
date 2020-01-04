import jwt from "jwt-simple";
import moment from "moment";

module.exports = app => {

	const Users = app.db.models.Users;
	const UserCompany = app.db.models.UserCompany;
	const Company = app.db.models.Company;
	const cfg = app.libs.config;
	const beh = app.businesserrorhandler;


	/**
	* @api {post} /login User login route
	* @apiGroup Credencial
	* @apiParam {String} email User email
	* @apiParam {String} password User passowrd
	* @apiParamExample {json} Input
	* {
	* "email": "john@doe.net",
	* "password": "123456"
	* }
	* @apiSuccess {String} id UserCompany id
	* @apiSuccess {String} role User role
	* @apiSuccess {String} createdAt
	* @apiSuccess {String} updatedAt
	* @apiSuccess {String} CompanyId
	* @apiSuccess {String} UserId
	* @apiSuccess {Object} Company
	* @apiSuccess {String} Company.Id
	* @apiSuccess {String} Company.companyString
	* @apiSuccess {String} Company.status
	* @apiSuccess {String} Company.name
	* @apiSuccess {String} Company.governmentId
	* @apiSuccess {String} Company.type
	* @apiSuccess {String} Company.createdAt
	* @apiSuccess {String} Company.updatedAt
	* @apiSuccessExample {json} Success
	* HTTP/1.1 200 OK
	* [
	*	{
	*		"id": 3,
	*		"role": "ADMIN",
	*		"createdAt": "2016-08-31T13:31:01.000Z",
	*		"updatedAt": "2016-08-31T13:31:01.000Z",
	*		"CompanyId": 5,
	*		"UserId": 12,
	*		"Company": {
	*		"id": 5,
	*		"companyString": "goog",
	*		"status": false,
	*		"name": "Google",
	*		"governmentId": "123456/0001-9005",
	*		"type": "Retail",
	*		"pictureURL": null,
	*		"createdAt": "2016-08-31T13:31:01.000Z",
	*		"updatedAt": "2016-08-31T13:31:01.000Z"
	*		}
	*	}
	* ]
	* @apiErrorExample {json} Auth error
	* HTTP/1.1 401 Unauthorized
	*/
	app.post("/login", (req, res) => {

		var dataform = req.body;
		var expires = moment().add(cfg.expiration, cfg.expunit).valueOf();

		//request payload validation
		req.assert('email', 'ERROR: email is required').notEmpty();
		req.assert('password', 'ERROR: password is required').notEmpty();

		//Auth validation
		var error = req.validationErrors();
		if (error) {
			res.status(400).json(error);
		}
		else {
			const password = req.body.password;

			Users.findOne({ where: { email: req.body.email } })
				.then(user => {

					if (user) {
						//User might be active to login
						if (user.status == "ACTIVE") {

							if (Users.isPassword(user.password, password)) {
								const payload = {
									user_id: user.id,
									email: user.email,
									exp: expires,
									type: "USER"
								};

								res.json({
									token: jwt.encode(payload, cfg.jwtSecret),
									expiration: moment().add(cfg.expiration, cfg.expunit).format("DD-MM-YYYY HH:mm:ss")
								});

							}
							else {
								res.status(401).json({
									msg: beh.translate(
										req.headers["accept-language"],
										"WRONG_PASSWORD",
										"Wrong password"
									)
								});
							}
						}
						else {
							res.status(412).json({
								msg: beh.translate(
									req.headers["accept-language"],
									"USER_NOT_ACTIVE",
									"User not ACTIVE"
								)
							});
						}
					}

					else {
						res.status(401).json({
							msg: beh.translate(
								req.headers["accept-language"],
								"USERNAME_NOT_FOUND",
								"Username not found"
							)
						});
					}
				}).catch(error => {
					res.status(412).json({ msg: error.message });
				});
		}


	}
	)
}