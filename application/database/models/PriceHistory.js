module.exports = (Sequelize, DataTypes) =>
    Sequelize.define('PriceHistory', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        currency_id: {
            type: DataTypes.TEXT,
            allowNull: false,
            references: {
                model: 'Currencies',
                key: 'id'
            }
        },
        time: {
            type: DataTypes.BIGINT
        },
        close: {
            type: DataTypes.BIGINT
        },
        high: {
            type: DataTypes.BIGINT
        },
        low: {
            type: DataTypes.BIGINT
        },
        open: {
            type: DataTypes.BIGINT
        },
        volumeFrom: {
            type: DataTypes.BIGINT
        },
        volumeTo: {
            type: DataTypes.BIGINT
        }
    }, {
        timestamps: false,
        paranoid: true,
        underscored: true,
        tableName: 'PriceHistories',
        classMethods: {
            associate: (models) => { }
        }
    })
