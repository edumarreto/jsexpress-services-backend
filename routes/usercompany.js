module.exports = app => {

    const Users = app.db.models.Users;
    const UserCompany = app.db.models.UserCompany;
    const Company = app.db.models.Company;
    const beh = app.businesserrorhandler;


    app.route("/usercompany")
        .all(app.auth.authenticate())

        /**
        * @api {get} /userCompany Exibe Company associado ao User
        * @apiGroup Usuario
        * @apiHeader {String} Authorization Token - Login
        * @apiHeaderExample {json} Header
        * {"Authorization": "JWT xyz.abc.123.hgf"}
        * @email {String} email Mandatory
        * @apiParam {String} role Mandatory
        * @apiSuccess {Number} Id de registro
        * @apiSuccess {String} role Role do usuario
        * @apiSuccess {String} status Status do usuario-empresa
        * @apiSuccess {String} createdAt Data de criacao do relacionamento user empresa
        * @apiSuccess {String} updatedAt Data de atualizacao do relacionamento user empresa
        * @apiSuccess {String} CompanyId Identificador da empresa
        * @apiSuccess {String} UserId Identificador do usuario
        * @apiSuccessExample {json} Sucesso
        * HTTP/1.1 200 OK
        *  [
        *  {
        *  "id": 52,
        *  "role": "VIEW",
        *  "status": "ACTIVE",
        *  "CompanyId": 50,
        *  "UserId": 415,
        *  "updatedAt": "2016-09-06T13:57:38.000Z",
        *  "createdAt": "2016-09-06T13:57:38.000Z"
        *  }]
        * @apiErrorExample {json} Erro de consulta
        * HTTP/1.1 412 Precondition Failed
        */

        .get((req, res) => {
            UserCompany.findAll({
                where: { companyId: req.user.company_id }, include: [Users]
            })
                .then(uc => {
                    res.json({ uc });
                })
                .catch(error => {
                    res.status(412).json({ msg: error.message });
                })
        })

        /**
        * @api {post} /userCompany Exibe Company associado ao User
        * @apiGroup Usuario
        * @apiHeader {String} Authorization Token - Login
        * @apiHeaderExample {json} Header
        * {"Authorization": "JWT xyz.abc.123.hgf"}
        * @email {String} email Mandatory
        * @apiParam {String} role Mandatory
        * @apiSuccess {Number} Id de registro
        * @apiSuccess {String} role Role do usuario
        * @apiSuccess {String} status Status do usuario-empresa
        * @apiSuccess {String} createdAt Data de criacao do relacionamento user empresa
        * @apiSuccess {String} updatedAt Data de atualizacao do relacionamento user empresa
        * @apiSuccess {String} CompanyId Identificador da empresa
        * @apiSuccess {String} UserId Identificador do usuario
        * @apiSuccessExample {json} Sucesso
        * HTTP/1.1 200 OK
        *  {
        *  "id": 52,
        *  "role": "VIEW",
        *  "status": "ACTIVE",
        *  "CompanyId": 50,
        *  "UserId": 415,
        *  "updatedAt": "2016-09-06T13:57:38.000Z",
        *  "createdAt": "2016-09-06T13:57:38.000Z"
        *  }
        * @apiErrorExample {json} Erro de consulta
        * HTTP/1.1 412 Precondition Failed
        */
        .post((req, res) => {

            var dataform = req.body;

            req.body.createUserId = req.user.id;
            req.body.createUserIp = req.ip;
            req.body.lastUserId = req.user.id;
            req.body.lastUserIp = req.ip;


            //validacao de dados de entrada
            req.assert('email', 'ERROR: name is required').notEmpty();
            req.assert('role', 'ERROR: role is required').notEmpty();

            var error = req.validationErrors();

            if (error) {
                res.status(400).json(error);
            }
            else {

                var role = req.body.role;

                Users.findOne({ where: { email: req.body.email } })
                    .then(user => {
                        if (user) {
                            UserCompany.findOne({ where: { UserId: user.id, CompanyId: req.user.company_id, status: "ACTIVE" } })
                                .then(uc => {
                                    if (!uc) {
                                        UserCompany.create({
                                            role: role.toUpperCase(),
                                            status: "ACTIVE",
                                            CompanyId: req.user.company_id,
                                            UserId: user.id,
                                            createUserId: req.body.createUserId,
                                            lastUserId: req.body.lastUserId,
                                            createUserIp: req.body.createUserIp,
                                            lastUserIp: req.body.lastUserIp
                                        })
                                            .then(usercompany => {
                                                res.json(usercompany);
                                            });
                                    }
                                    else {
                                        res.status(412).json({
                                            msg: beh.translate(
                                                req.headers["accept-language"],
                                                "USERCOMPANY_ALREADY_REGISTERED",
                                                "User already assigned for company"
                                            )
                                        });
                                    }
                                })
                        }
                        else {
                            res.status(412).json({
                                msg: beh.translate(
                                    req.headers["accept-language"],
                                    "USERCOMPANY_EMAIL_NOT_FOUND",
                                    "User e-mail not found"
                                )
                            });
                        }
                    })

                    .catch(error => {
                        res.status(412).json({ msg: error.message });
                    })
            }
        })

        .put((req, res) => {

            var dataform = req.body;

            req.body.lastUserId = req.user.id;
            req.body.lastUserIp = req.ip;
            //input validation
            req.assert('email', 'ERROR: name is required').notEmpty();
            req.assert('role', 'ERROR: role is required').notEmpty();
            req.assert('status', 'ERROR: status is required').notEmpty();

            var error = req.validationErrors();

            var role = req.body.role;

            if (error) {
                res.status(400).json(error);
            }
            else {
                Users.findOne({ where: { email: req.body.email } })
                    .then(user => {
                        if (user) {
                            UserCompany.update({
                                role: req.body.role.toUpperCase(),
                                status: req.body.status.toUpperCase(),
                                lastUserId: req.body.lastUserId,
                                lastUserIp: req.body.lastUserIp
                            }, {
                                where: {
                                    UserId: user.id,
                                    status: "ACTIVE",
                                    CompanyId: req.user.company_id
                                }
                            }).then(uc => {
                                res.json({
                                    userid: user.id,
                                    email: user.email,
                                    role: req.body.role.toUpperCase(),
                                    status: req.body.status.toUpperCase(),
                                    companyId: req.user.companyId
                                });
                            })
                        }
                        else {
                            res.status(412).json({
                                msg: beh.translate(
                                    req.headers["accept-language"],
                                    "USERCOMPANY_NOT_ACTIVE",
                                    "No active user found for your company with this email"
                                )
                            });
                        }
                    })
                    .catch(error => {
                        res.status(412).json({ msg: error.message });
                    });
            }
        });
};