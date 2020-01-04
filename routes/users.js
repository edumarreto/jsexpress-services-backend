import moment from "moment";
import jwt from "jwt-simple";

module.exports = app => {

  const Users = app.db.models.Users;
  const UserCompany = app.db.models.UserCompany;
  const Company = app.db.models.Company;
  const cfg = app.libs.config;
  const beh = app.businesserrorhandler;


  app.route("/user")
    .all(app.auth.authenticate())

    /**
    * @api {get} /user Exibe usuário autenticado
    * @apiGroup Usuario
    * @apiHeader {String} Authorization Token de usuário
    * @apiHeaderExample {json} Header
    * {"Authorization": "JWT xyz.abc.123.hgf"} 
    * @apiSuccess {Number} id Id de registro
    * @apiSuccess {String} name Nome
    * @apiSuccess {String} email Email
    * @apiSuccessExample {json} Sucesso
    * HTTP/1.1 200 OK
    * {
    * "id": 1,
    * "name": "John Connor",
    * "email": "teste@test.com"
    * }
    * @apiErrorExample {json} Erro de consulta
    * HTTP/1.1 412 Precondition Failed
    */

    .get((req, res) => {

      Users.findOne({ where: { id: req.user.id }, attributes: ["id", "name", "email", "userGovernmentId1", "userGovernmentId2", "phone", "pictureURL", "status", "workAt", "createdAt", 'updatedAt'] })
        .then(result => {
          res.json(result);
        })
        .catch(error => {
          res.status(412).json({ msg: error.message });
        });

    })

    .put((req, res) => {
      req.body.lastUserIp = req.ip;

      if (req.body.email || req.body.password) {
        res.status(400).json({ msg: "key user data cannot be change from this API" });
      }
      else {
        Users.update(req.body, { where: { id: req.user.id } })
          .then(user => {
            Users.findOne({ where: { id: req.user.id }, attributes: ["id", "name", "email", "userGovernmentId1", "userGovernmentId2", "phone", "pictureURL", "status", "workAt", "createdAt", 'updatedAt'] })
              .then(result => {
                res.json(result);
              })
          })
          .catch(error => {
            res.status(412).json({ msg: error.message });
          });
      }

    });


  // User creation, auth not required
  app.post("/users", (req, res) => {

    var dataform = req.body;

    req.body.lastUserIp = req.ip;
    req.body.createUserIp = req.ip;

    //Input validation
    req.assert('name', 'ERROR: name is required').notEmpty();
    req.assert('email', 'ERROR: email is required').notEmpty();
    req.assert('password', 'ERROR: password is required').notEmpty();
    req.assert('phone', 'ERROR: phone is required').notEmpty();
    req.assert('passNumber', 'ERROR: passNumber is required').notEmpty();
    req.assert('userGovernmentId1', 'ERROR: userGovernmentId1 is required').notEmpty();
    req.assert('workAt', 'ERROR: userGovernmentId1 is required').notEmpty();

    req.body.status = "ACTIVE";
    var error = req.validationErrors();
    if (error) {
      res.status(400).json(error);
    }
    else {
      Users.findOne({ where: { email: req.body.email } })
        .then(result => {
          if (!result) {

            //Insert into database using sequelize 

            Users.create(req.body)
              .then(result => {
                var expires = moment().add(60, "minutes").valueOf();
                const payload = {
                  user_id: result.id,
                  email: result.email,
                  exp: expires,
                  type: "USER"
                };
                res.status(200).json({
                  id: result.id, email: result.email, status: result.status,
                  token: jwt.encode(payload, cfg.jwtSecret),
                  expiration: moment().add(15, "minutes").format("DD-MM-YYYY HH:mm:ss")
                });
              })

          }
          else {
            res.status(412).json({
              msg: beh.translate(
                req.headers["accept-language"],
                "USER_ALREADY_REGISTERED",
                "email already in use for Users"
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


