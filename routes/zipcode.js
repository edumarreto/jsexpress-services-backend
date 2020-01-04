import moment from "moment";
import request from 'request';

//Sample Rest request to retrieve brazilian zip code using an open API
module.exports = app => {

    app.route("/v1/brzipnumber/:cepnumber")
        .all(app.auth.authenticate())
        .get((req, res) => {
            var options = {
                uri: 'http://api.postmon.com.br/v1/cep/' + req.params.cepnumber,
                port: 80,
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                },
                json: true,
                timeout:5000
            };
            request(options, function (error, response, message) {
                if (!error && response.statusCode == 200) {
                    res.json(message);
                }
                else {
                    res.json(error);
                }
            })
        });
}