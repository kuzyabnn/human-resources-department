const { Router } = require('express');
const router = Router();
const { getUsers, register, login, login2, logout, 
    getPositions, getPositionById, updatePosition, deletePosition, createPosition,
    getDepartments, getDepartmentById, updateDepartment, createDepartment, deleteDepartment, 
    getEmployees, getEmployeeById, updateEmployee, deleteEmployee, createEmployee,
    getVacancies, getVacancieById, updateVacancie, deleteVacancie, createVacancie } = require('../controllers/index.controller');

router.get('/positions', getPositions)
router.get('/position/:id', getPositionById)
router.put('/position/:id', updatePosition)
router.delete('/position/:id', deletePosition)
router.post('/newposition', createPosition)
router.get('/departments', getDepartments)
router.get('/department/:id', getDepartmentById)
router.put('/department/:id', updateDepartment)
router.post('/newdepartment', createDepartment)
router.delete('/department/:id', deleteDepartment)
router.get('/employees', getEmployees)
router.get('/employee/:id', getEmployeeById)
router.put('/employee/:id', updateEmployee)
router.delete('/employee/:id', deleteEmployee)
router.post('/newemployee', createEmployee)
router.get('/vacancies', getVacancies)
router.get('/vacancie/:id', getVacancieById)
router.put('/vacancie/:id', updateVacancie)
router.delete('/vacancie/:id', deleteVacancie)
router.post('/newvacancie', createVacancie)
router.get('/users', getUsers)
router.post('/register', register)
router.get('/login', login)
router.post('/login', login2)
router.get('/logout', logout)

module.exports = router;