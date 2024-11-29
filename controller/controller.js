const jwt = require('jsonwebtoken');
const pool = require('../db'); 

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Credenciales incorrectas ' + user.email });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, typeuser: user.typeuser });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Error al hacer login' });
    }
};


const getEntidades = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM entidades');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching companies:', err);
        res.status(500).json({ error: 'Error al obtener las entidades' });
    }
};

const getEmpleados = async (req, res) => {
    const { id } = req.query;
    try {
        const result = await pool.query('SELECT * FROM empleados WHERE entidad_id = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching companies:', err);
        res.status(500).json({ error: 'Error al obtener los empleados' });
    }
};


const createEntidades = async (req, res) => {
    const { nombre, direccion } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO entidades (nombre, direccion) VALUES ($1, $2) RETURNING  nombre, direccion',
            [nombre, direccion]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error during create entidad:', err);
        res.status(500).json({ error: 'Error creando la entidad' });
    }
};

const updateEntidades = async (req, res) => {
    const { nombre, direccion, id } = req.body;
    try {
        const result = await pool.query(
            `UPDATE entidades SET nombre = $1, direccion = $2 WHERE id = $3 RETURNING nombre, direccion`,
            [nombre, direccion, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating entidad:', err);
        res.status(500).json({ error: 'Error updating entidad' });
    }
};


const createEmpleados = async (req, res) => {
    const { nombre, email, cargo, entidad_id } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO empleados (nombre, email, cargo, entidad_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, email, cargo, entidad_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error during create empleado:', err);
        res.status(500).json({ error: 'Error creando el empleado' });
    }
};

const updateEmpleados = async (req, res) => {
    const { nombre, email, cargo, id} = req.body;
    try {
        const result = await pool.query(
            `UPDATE empleados SET nombre = $1, email = $2, cargo = $3 WHERE id = $4 RETURNING *`,
            [nombre, email, cargo, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating empleado:', err);
        res.status(500).json({ error: 'Error updating empleado' });
    }
};

module.exports = { loginUser, getEntidades, getEmpleados, createEntidades, updateEntidades, createEmpleados, updateEmpleados };