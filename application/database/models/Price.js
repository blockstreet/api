module.exports = (Sequelize, DataTypes) =>
    Sequelize.define('Price', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        currency_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Currencies',
                key: 'id'
            }
        },
        current: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        change_hour: {
            type: DataTypes.INTEGER
        },
        change_day: {
            type: DataTypes.INTEGER
        },
        change_week: {
            type: DataTypes.INTEGER
        },
        change_month: {
            type: DataTypes.INTEGER
        },
        volume: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: 'Prices',
        classMethods: {
            associate: (models) => { }
        }
    })
