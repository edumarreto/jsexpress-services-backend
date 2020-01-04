module.exports = (sequelize, DataType) => {
	const Company = sequelize.define("Company", {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
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
		name: {
			type: DataType.STRING,
			unique: false,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		governmentId: {
			type: DataType.STRING,
			unique: false,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		type: {
			type: DataType.STRING,
			unique: false,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		createUserId: {
			type: DataType.STRING,
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
        lastUserId: {
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
		}
	},
	//One Company has many User Company objects - database modelling 1 to N
		{
			classMethods: {
				associate: (models) => {
					Company.hasMany(models.UserCompany);				}
			}
		});
	return Company;
};