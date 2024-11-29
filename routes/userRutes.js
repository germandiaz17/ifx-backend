const express = require('express');
const { loginUser, getEntidades, getEmpleados, createEntidades, updateEntidades, createEmpleados, updateEmpleados}  = require('../controller/controller');
const router = express.Router();

//para login
router.post('/login', loginUser)

//para obtener entidades y empleados
router.get('/entidades', getEntidades)
router.get('/empleados', getEmpleados)

//para crear entidades y empleados
router.post('/createEmpleados', createEmpleados)
router.post('/createEntidades', createEntidades)

//para actualizar entidades y empleados
router.put('/updateEmpleados', updateEmpleados)
router.put('/updateEntidades', updateEntidades)

module.exports = router;