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
