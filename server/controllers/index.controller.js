const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'my_database',
  password: 'postgres',
  port: 5432,
});



const bcrypt = require("bcrypt");
const saltRounds = 10

const getUsers = async (req, res) => {
  const response = await pool.query("SELECT * FROM users WHERE role != 'admin' ORDER BY id DESC")
  res.status(200).json(response.rows)
}

const register = (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
      console.log(err);
    }
  pool.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [name, email, hash, 'user' ],
  (err, result) => {
      console.log(err)
      } 
  )
})
};

const logout = (req, res) => {
    res.clearCookie('userId', {path: '/'}).status(200).send('Ok.');
  };

const login = (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
};


const login2 = (req, res) => {
  const email = req.body.email
  const password = req.body.password

  pool.query('SELECT * FROM users WHERE email = $1', [email],
(err, result) =>{
  if(err){
    res.send({err:err});
  }
  if (result.rowCount>0){
   bcrypt.compare(password, result.rows[0].password, (error, responce) =>{
       if (responce){
         req.session.user = result;
         console.log(req.session.user);
           res.send(result)
       } else {
          res.send({message: "Неверный пароль"})
       }
   })
  } else{
    res.send({message: "Несуществующий пользователь"})
  }
}
  )
};

const getPositions = async (req, res) => {
  const response = await pool.query('SELECT * FROM positions ORDER BY id_positions DESC')
  res.status(200).json(response.rows)
}

const getPositionById = async (req, res) => {
  const id = req.params.id
  const response = await pool.query('SELECT * FROM positions WHERE id_positions = $1', [id])
  res.json(response.rows)
}

const updatePosition = async (req, res) => {
  const id = req.params.id
  const { name } = req.body
  const response = await pool.query('UPDATE positions SET name = $1 WHERE id_positions = $2', [
      name,
      id
  ])
  console.log(response);
  res.send('position updated')
}

const deletePosition = async (req, res) => {
  const id = req.params.id
  const response = await pool.query('DELETE FROM positions WHERE id_positions = $1', [id])
  console.log(response)
  res.json('position' + id + 'deleted')
}

const createPosition = async (req, res) => {
  const { name } = req.body
  const response = await pool.query('INSERT INTO positions (name) VALUES ($1)', [name])
  console.log(response)
  res.send('created')
}

const getDepartments = async (req, res) => {
  const response = await pool.query('SELECT * FROM departments ORDER BY id_departments DESC')
  res.status(200).json(response.rows)
}

const getDepartmentById = async (req, res) => {
  const id = req.params.id
  const response = await pool.query('SELECT * FROM departments WHERE id_departments = $1', [id])
  res.json(response.rows)
}

const updateDepartment = async (req, res) => {
  const id = req.params.id
  const { name } = req.body
  const response = await pool.query('UPDATE departments SET name = $1 WHERE id_departments = $2', [
      name,
      id
  ])
  console.log(response);
  res.send('department updated')
}

const createDepartment = async (req, res) => {
  const { name } = req.body
  const response = await pool.query('INSERT INTO departments (name) VALUES ($1)', [name])
  console.log(response)
  res.send('created')
}

const deleteDepartment = async (req, res) => {
  const id = req.params.id
  const response = await pool.query('DELETE FROM departments WHERE id_departments = $1', [id])
  console.log(response)
  res.json('department' + id + 'deleted')
}

const getEmployees = async (req, res) => {
  const response = await pool.query('SELECT Employees.id_employees as id_employees ,Employees.fio as fio, Departments.name as dname, Positions.name as pname FROM Employees LEFT JOIN Departments ON Employees.depatments_id=Departments .id_departments LEFT JOIN Positions ON Employees.positions_id=Positions.id_positions ORDER BY id_employees DESC')
  res.status(200).json(response.rows)
}

const getEmployeeById = async (req, res) => {
  const id = req.params.id
  const response = await pool.query('SELECT Employees.fio as fio, Employees.phone as phone, Employees.skills as skills, Employees.education as education, Employees.experience as experience, Departments.name as dname, Positions.name as pname FROM Employees LEFT JOIN Departments ON Employees.depatments_id=Departments .id_departments LEFT JOIN Positions ON Employees.positions_id=Positions.id_positions WHERE id_employees = $1', [id])
  res.json(response.rows)
}

const updateEmployee = async (req, res) => {
  const id = req.params.id
  const { fio, phone, skills, education, experience, dname, pname } = req.body
  const response = await pool.query('UPDATE employees SET fio = $1, phone = $2, skills = $3, education = $4, experience = $5, depatments_id = (SELECT id_departments FROM departments WHERE name = $6), positions_id = (SELECT id_positions FROM positions WHERE name = $7) WHERE id_employees = $8', [
    fio, phone, skills, education, experience, dname, pname, id
  ])
  console.log(response);
  res.send('employees updated')
}

const deleteEmployee = async (req, res) => {
  const id = req.params.id
  const response = await pool.query('DELETE FROM employees WHERE id_employees = $1', [id])
  console.log(response)
  res.json('employees ' + id + ' deleted')
}

const createEmployee = async (req, res) => {
  const { fio, phone, skills, education, experience, dname, pname } = req.body
  const response = await pool.query('INSERT INTO Employees (fio, phone, skills, education, experience, positions_id, depatments_id) VALUES ($1, $2, $3, $4, $5, (SELECT id_positions FROM positions WHERE name = $6), (SELECT id_departments FROM departments WHERE name = $7))', [
    fio, phone, skills, education, experience, pname, dname
  ])
  console.log(response)
  res.send('created')
}

const getVacancies = async (req, res) => {
  const response = await pool.query("SELECT Vacancies.id_vacancies as id_vacancies, Positions.name as pname, Departments.name as dname, Vacancies.demands as demands, Users.name as uname, TO_CHAR(Vacancies.date, 'DD.MM.YYYY') as date, (case when Vacancies.status = false then 'закрыта' else 'в работе' end) status FROM Vacancies LEFT JOIN Departments ON Vacancies.departments_id=Departments.id_departments LEFT JOIN Positions ON Vacancies.positions_id=Positions.id_positions LEFT JOIN Users ON Vacancies.users_id=Users.id ORDER BY id_vacancies DESC")
  res.status(200).json(response.rows)
}

const getVacancieById = async (req, res) => {
  const id = req.params.id
  const response = await pool.query("SELECT Positions.name as pname, Departments.name as dname, Vacancies.demands as demands, Users.name as uname, TO_CHAR(Vacancies.date, 'YYYY-MM-DD') as date, (case when Vacancies.status = false then 'закрыта' else 'в работе' end) status FROM Vacancies LEFT JOIN Departments ON Vacancies.departments_id=Departments.id_departments LEFT JOIN Positions ON Vacancies.positions_id=Positions.id_positions LEFT JOIN Users ON Vacancies.users_id=Users.id WHERE id_vacancies = $1", [id])
  res.json(response.rows)
}

const updateVacancie = async (req, res) => {
  const id = req.params.id
  const { demands, date, dname, pname, uname } = req.body
  const response = await pool.query('UPDATE vacancies SET demands = $1, date = $2, departments_id = (SELECT id_departments FROM departments WHERE name = $3), positions_id = (SELECT id_positions FROM positions WHERE name = $4), users_id =  (SELECT id FROM users WHERE name = $5) WHERE id_vacancies = $6', [
    demands, date, dname, pname, uname, id
  ])
  console.log(response);
  res.send('vacancie updated')
}

const deleteVacancie = async (req, res) => {
  const id = req.params.id
  const response = await pool.query('UPDATE vacancies SET status = false WHERE id_vacancies = $1', [id])
  console.log(response)
  res.json('vacancie ' + id + ' deleted')
}

const createVacancie = async (req, res) => {
  const { demands, pname, dname, uname } = req.body
  const response = await pool.query('INSERT INTO Vacancies (demands, positions_id, departments_id, users_id, date, status) VALUES ($1, (SELECT id_positions FROM positions WHERE name = $2), (SELECT id_departments FROM departments WHERE name = $3), (SELECT id FROM users WHERE name = $4), current_date, true)', [
    demands, pname, dname, uname
  ])
  console.log(response)
  res.send('created')
}

module.exports = {
    getUsers,
    register,
    login,
    login2,
    logout,
    getPositions,
    getPositionById,
    updatePosition,
    deletePosition,
    createPosition,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    createDepartment,
    deleteDepartment,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    createEmployee,
    getVacancies,
    getVacancieById,
    updateVacancie,
    deleteVacancie,
    createVacancie}