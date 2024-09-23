const {sequelize, Sequelize} = require('../config/database');
const employeeModel = require("../models/employees")(sequelize,Sequelize);

exports.listAll = (req,res) => {
    employeeModel.findAll(
        {
            order:[['gross_salary','DESC']]
        }
    ).then(results=>{
        if(results.length != 0){
            for(let i = 0; i < results.length; i++){
            let depId = results[i]['department'];
            results[i]['department'] = departmentJSON[depId];
            results[i]['gross_salary'] = results[i]['gross_salary'].toFixed(2);
            results[i]['liquid_salary'] = results[i]['liquid_salary'].toFixed(2);
            }
        }
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
        liquid_salary: calcSalLiq(req.body.gross_salary),
        department: req.body.department
    };
    
    employeeModel.create(employeeData).then(data => {
        console.log("empregado inserido");
        res.redirect('/');
    }).catch(err => {
        console.log("Error " + err);
    });
}

const departmentJSON = {
    1: 'Administrativo',
    2: 'Designer',
    3: 'Contábil',
    4: 'Fábrica'
}

calcSalLiq = (employeeSalary) => {
    const INSS = employeeSalary * 0.11;

    let IRPF;

    if(employeeSalary > 4664.68) {
        IRPF = (employeeSalary - 4664.68) * 0.275 + 413.42;
    }

    else if(employeeSalary > 3751.06) {
        IRPF = (employeeSalary - 3751.06) * 0.225 + 207.86;
    }

    else if(employeeSalary > 2826.65) {
        IRPF = (employeeSalary - 2826.65) * 0.15 + 69.20;
    }

    else if(employeeSalary > 1903.98) {
        IRPF = (employeeSalary - 1903.98) * 0.075;
    }

    else{
        IRPF = 0;
    }

    let salLiq = employeeSalary - INSS - IRPF;

    return salLiq;

}