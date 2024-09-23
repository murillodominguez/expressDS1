const { sequelize } = require("../config/database");

module.exports = (sequelize, DataTypes) => {
    var Employees = sequelize.define('employees',
        {
            id: {
                type: DataTypes.BIGINT(20),
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING
            },
            gross_salary: {
                type: DataTypes.DOUBLE
            },
            liquid_salary: {
                type: DataTypes.DOUBLE
            },
            department: {
                type: DataTypes.SMALLINT(1)
            }
        },{
            timestamps: false
        }
    );

    return Employees;
}