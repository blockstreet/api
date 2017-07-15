module.exports = (Sequelize, DataTypes) =>
    Sequelize.define('Timestamp', {
        source: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        tableName: 'Timestamps'
    })
