const {sequelize, Sequelize} = require('../config/database');
const employeeModel = require("../models/employees")(sequelize,Sequelize);

exports.listAll = (req,res) => {

    employeeModel.findAll(
        {
            order:[['gross_salary','ASC']]
        }
    ).then(results=>{
        console.log(results);
        res.render('listAll', {data: results})
    }).catch(err => {
        res.status(500).send({message: "Error" + err.message});
    });

}

exports.insertForm = (req,res) => {
    res.render('insertEmployees');
}

exports.insertData = (req,res) => {
    const employeeData = {
        name: req.body.name,
        gross_salary: req.body.gross_salary,
        department: req.body.department
    };

    employeeModel.create(employeeData).then(data => {
        console.log("empregado inserido");
        res.redirect('/');
    }).catch(err => {
        console.log("Error " + err);
    });
}