const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: QueryInterface }) => {
        await QueryInterface.addColumn('users', 'disabled', {
            type: DataTypes.BOOLEAN,
        })
    },
    down: async ({ context: QueryInterface }) => {
        await QueryInterface.removeColumn('users', 'disabled')
    }
}