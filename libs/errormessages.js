//JSON structure to handle error messages to API - this sample uses portuguese (PT-BR)

module.exports = {
    "Errors":
    {
        "Messages": [

            {
                "errorCode": "WRONG_PASSWORD",
                "message": [
                    {
                        "language": "pt-BR",
                        "message": "Senha incorreta"
                    }
                ]
            },
            {
                "errorCode": "USER_NOT_ACTIVE",
                "message": [
                    {
                        "language": "pt-BR",
                        "message": "Usuário com status inativo"
                    }
                ]
            },
            {
                "errorCode": "USERNAME_NOT_FOUND",
                "message": [
                    {
                        "language": "pt-BR",
                        "message": "E-mail não encontrado"
                    }
                ]
            },
            {
                "errorCode": "USERCOMPANY_ALREADY_REGISTERED",
                "message": [
                    {
                        "language": "pt-BR",
                        "message": "Usuário já está ativo para sua empresa"
                    }
                ]
            },

            {
                "errorCode": "USERCOMPANY_EMAIL_NOT_FOUND",
                "message": [
                    {
                        "language": "pt-BR",
                        "message": "E-mail não encontrado"
                    }
                ]
            },

            {
                "errorCode": "USERCOMPANY_NOT_ACTIVE",
                "message": [
                    {
                        "language": "pt-BR",
                        "message": "Não encontrado este e-mail ativo na sua empresa"
                    }
                ]
            },

            {
                "errorCode": "USER_ALREADY_REGISTERED",
                "message": [
                    {
                        "language": "pt-BR",
                        "message": "E-mail já cadastrado"
                    }
                ]
            },

            {
                "errorCode": "USER_ALREADY_ACTIVE",
                "message": [
                    {
                        "language": "pt-BR",
                        "message": "Usuário já está ativo"
                    }
                ]
            }

        ]
    }
};