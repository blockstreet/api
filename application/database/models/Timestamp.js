import { baseModel } from '../models'

module.exports = (Sequelize, DataTypes) => {
    const Model = Sequelize.define('Timestamp', {
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

    // Build relations between this model and others
    Model.associate = (models) => {

    }

    Model.hasPrimaryKey = baseModel.hasPrimaryKey
    Model.bulkUpsert = baseModel.bulkUpsert

    return Model
}
