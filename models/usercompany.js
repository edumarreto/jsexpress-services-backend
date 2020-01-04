import bcrypt from "bcryptjs";

module.exports = (sequelize, DataType) => {
	const UserCompany = sequelize.define("UserCompany", {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		role: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		status: {
			type: DataType.STRING,
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
		},
		}, 
		//One User company belongs to many Users and Companies - this entity is used to handle NxM relation between User and Company
		{
		classMethods: {
			associate: models => {
				UserCompany.belongsTo(models.Company , { foreignKey: { allowNull: false }});
				UserCompany.belongsTo(models.Users , { foreignKey: { allowNull: false }});
			}
		}
	});
	return UserCompany;
};