const bcrypt = require('bcryptjs')

module.exports = (Sequelize, DataTypes) =>
    Sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            },
            set(value) {
                this.setDataValue('email', value.toLowerCase())
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                // Salting and encrypting the password for security(should do 10 rounds of salting minimum)
                const salt = bcrypt.genSaltSync(10)
                const encrypted = bcrypt.hashSync(value, salt)

                this.setDataValue('password', encrypted)
                this.setDataValue('salt', salt)
            }
        },
        salt: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: true,
        paranoid: true,
        underscored: true,
        instanceMethods: {
            verifyPassword(password, callback) {
                return bcrypt.compare(password, this.password, (err, res) => callback(err, res))
            },

            publicAttributes() {
                return {
                    id: this.id,
                    email: this.email
                }
            }
        },
        classMethods: {
            associate: () => {
                // Link Relations
            }
        },
        scopes: {
            public: {
                attributes: {
                    exclude: ['password', 'salt']
                }
            }
        }
    })
