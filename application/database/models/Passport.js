module.exports = (Sequelize, DataTypes) =>
    Sequelize.define('Passport', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        device_type: {
            type: DataTypes.TEXT
        },
        payload: {
            type: DataTypes.TEXT
        },
        strategy: {
            type: DataTypes.TEXT
        },
        verified: {
            type: DataTypes.BOOLEAN
        }
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        classMethods: {
            associate: (models) => {
                models.Passport.belongsTo(models.User)
            }
        }
    })
