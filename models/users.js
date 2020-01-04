import bcrypt from "bcryptjs";

module.exports = (sequelize, DataType) => {
	const Users = sequelize.define("Users", {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		userGovernmentId1: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		workAt: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		password: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		email: {
			type: DataType.STRING,
			unique: true,
			primaryKey: false,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		phone: {
			type: DataType.STRING,
			unique: false,
			primaryKey: false,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		pictureURL: {
			type: DataType.STRING,
			unique: false,
			primaryKey: false,
			allowNull: true,
			validate: {
				notEmpty: false
			}
		},
		status: {
			type: DataType.STRING,
			unique: false,
			primaryKey: false,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		createUserIp: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		lastUserIp: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
	}, {
		//Method used to encrypt password on user creation and user update
			hooks: {
				beforeCreate: user => {
					const salt = bcrypt.genSaltSync();
					user.password = bcrypt.hashSync(user.password, salt);
				},
				beforeUpdate: user => {
					const salt = bcrypt.genSaltSync();
					user.password = bcrypt.hashSync(user.password, salt);
				}
			},
			//One User has many User Company objects - database modelling 1 to N
			classMethods: {
				associate: models => {
					Users.hasMany(models.UserCompany, { onDelete: 'cascade' });
				},
				isPassword: (encodedPassword, password) => {
					return bcrypt.compareSync(password, encodedPassword);
				}
			}
		});
	return Users;
};