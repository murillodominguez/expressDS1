const { sequelize, Sequelize } = require('../config/database');
const Op = Sequelize.Op;
const employeeModel = require("../models/employees")(sequelize, Sequelize);

exports.listAll = (req, res) => {
    if (req.query.search === undefined) {
        req.query.search = '';
    }
    employeeModel.findAll(
        {
            where: {
                [Op.or]: {
                    name: {
                        [Op.like]: '%' + req.query.search + '%'
                    },
                    // gross_salary: {
                    //     [Op.like]: req.query.search
                    // },
                    // liquid_salary: {
                    //     [Op.like]: parseInt(req.query.search)
                    // },
                    department: {
                        [Op.like]: '%' + req.query.search + '%'
                    }
                }
            },
            order: [['id', 'ASC']],
        }
    ).then(results => {
        if (results.length != 0) {
            for (let i = 0; i < results.length; i++) {
                let depId = results[i]['department'];
                results[i]['department'] = departmentJSON[depId];
                results[i]['gross_salary'] = results[i]['gross_salary'].toFixed(2);
                results[i]['liquid_salary'] = results[i]['liquid_salary'].toFixed(2);
            }
            //results = orderBy(results, 'gross_salary', 1);
        }
        res.render('listAll', { data: results })
    }).catch(err => {
        res.status(500).send({ message: "Error" + err.message });
        2
    });
}

exports.listOne = (req, res) => {
    const id_param = req.params.id;
    employeeModel.findAll({
        where: { id: id_param }
    }).then(result => {
        if (!result) {
            req.status(400).json(
                { message: "An error occurred..." }
            );
        }
        console.log(result);
        let data = result[0].dataValues;
        res.render('updateEmployees', { data: data });
    }).catch(err => {
        res.status(500).send({ message: "Error " + err.message });
    });
}

exports.insertForm = (req, res) => {
    res.render('insertEmployees');
}

exports.insertData = (req, res) => {
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

exports.delete = (req, res) => {
    const id_param = req.params.id;
    employeeModel.destroy({
        where: { id: id_param }
    }).then((result) => {
        if (!result) {
            req.status(400).json(
                { message: "An error occurred..." }
            );
        }
        res.redirect("/");
    }).catch((err) => {
        res.status(500).json({ message: "Could not delete such object." });
        console.log(err);
    }
    )
}

exports.update = (req, res) => {
    employeeModel.update(
        {
            name: req.body.name,
            gross_salary: req.body.gross_salary,
            liquid_salary: calcSalLiq(req.body.gross_salary),
            department: req.body.department
        }, {
        where: { id: req.body.id_for_updating }
    }
    ).then(anything => {
        if (!anything) {
            req.status(400).send({ message: "An error ocurred." })
        }
        res.redirect('/');
    }).catch(err => {
        res.status(500).send({
            message: "Error when trying to access the database"
        })
    })

}

calcSalLiq = (employeeSalary) => {
    const INSS = employeeSalary * 0.11;

    let IRPF;

    if (employeeSalary > 4664.68) {
        IRPF = (employeeSalary - 4664.68) * 0.275 + 413.42;
    }

    else if (employeeSalary > 3751.06) {
        IRPF = (employeeSalary - 3751.06) * 0.225 + 207.86;
    }

    else if (employeeSalary > 2826.65) {
        IRPF = (employeeSalary - 2826.65) * 0.15 + 69.20;
    }

    else if (employeeSalary > 1903.98) {
        IRPF = (employeeSalary - 1903.98) * 0.075;
    }

    else {
        IRPF = 0;
    }

    let salLiq = employeeSalary - INSS - IRPF;

    return salLiq;

}