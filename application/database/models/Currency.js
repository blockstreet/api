module.exports = (Sequelize, DataTypes) =>
    Sequelize.define('Currency', {
        id: {
            type: DataTypes.TEXT,
            required: true,
            primaryKey: true
        },
        symbol: {
            type: DataTypes.TEXT
        },
        name: {
            type: DataTypes.TEXT
        },
        supply: {
            type: DataTypes.BIGINT
        },
        updated_history_at: {
            type: DataTypes.DATE
        },
        updated_price_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: 'Currencies',
        classMethods: {
            associate: (models) => { }
        }
    })
