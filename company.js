module.exports = app => {
    const Sponsor = app.db.models.Sponsor;
    const Company = app.db.models.Company;
    const UserCompany = app.db.models.UserCompany;
    const Users = app.db.models.Users;
    const CompanyLR = app.db.models.CompanyLegalResponsibles;
    const beh = app.businesserrorhandler;

    app.route("/company")
        .all(app.auth.authenticate())

        /**
        * @api {post} /company Create Company
        * @apiGroup Sponsor
        * @apiParam {String} name Mandatory
        * @apiParam {String} governmentId Mandatory
        * @apiSuccessExample {json} Sucess
        * HTTP/1.1 200 OK
        * {
        * "companyId": 1,
        * "sponsorId": 1
        * }
        * @apiErrorExample {json} Error
        * HTTP/1.1 412 Precondition Failed
        */
        .post((req, res) => {

            req.body.createUserId = req.user.id;
            req.body.createUserIp = req.ip;
            req.body.lastUserId = req.user.id;
            req.body.lastUserIp = req.ip;

            var dataform = req.body;
            
            //API input validation - - - Company
            req.assert('name', 'ERROR: name is required').notEmpty();
            req.assert('governmentId', 'ERROR: governmentId is required').notEmpty();
            var error = req.validationErrors();
            if (error) {
                res.status(400).json(error);
            }
            else {

                Company.findOne({
                    where: {
                        governmentId: req.body.governmentId
                    }
                })
                    .then(result => {
                        if (!result) {
                            Users.findById(req.user.id)
                                .then(userresult => {
                                    if (userresult) {
                                        Company.create({
                                            name: req.body.name,
                                            governmentId: req.body.governmentId,
                                            status: "ACTIVE",
                                            type: "RETAIL",
                                            createUserId: req.body.createUserId,
                                            lastUserId: req.body.lastUserId,
                                            createUserIp: req.body.createUserIp,
                                            lastUserIp: req.body.lastUserIp
                                        })
                                    }
                                    else {
                                        res.status(401).json({
                                            message: "userId not found to create Company"
                                        });
                                    }

                                })
                        }
                        else {
                            res.status(412).json({
                                msg: beh.translate(
                                    req.headers["accept-language"],
                                    "COMPANY_ALREADY_REGISTERED",
                                    "governmentId already registered for Company"
                                )
                            });
                        }
                    })

                    .catch(error => {
                        res.status(412).json({ msg: error.message });
                    });
            }
        })

        .put((req, res) => {
            req.body.lastUserId = req.user.id;
            req.body.lastUserIp = req.ip;

            if (req.body.status || req.body.governmentId)
                res.status(412).json({ msg: " status and governmentId are not allowed for changes" });
            else {
                Company.update(req.body, { where: { id: req.body.companyId } })
                    .then(result => {
                        result => res.json(result);
                    })
                    .catch(error => {
                        res.status(412).json({ msg: error.message });
                    });
            }
        })

        .get((req, res) => {
            Company.findOne({
                where: { CompanyId: req.body.company_id }
            })
                .then(result => {
                    if (result) {
                        res.json(result);
                    }
                    else
                        res.status(412).json({ msg: "Company not found" });
                })
                .catch(error => {
                    res.status(412).json({ msg: error.message });
                });

        });
};
