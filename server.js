                       const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Inicializar base de datos SQLite
const dbPath = path.join(__dirname, 'employees.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    initializeDatabase();
  }
});

// Inicializar tabla de empleados
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      position TEXT NOT NULL,
      department TEXT NOT NULL,
      salary REAL NOT NULL,
      hire_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear tabla:', err.message);
    } else {
      console.log('Tabla de empleados lista.');
      // Insertar datos de ejemplo
      insertSampleData();
    }
  });
}

// Insertar datos de ejemplo
function insertSampleData() {
  const checkData = `SELECT COUNT(*) as count FROM employees`;
  db.get(checkData, (err, row) => {
    if (err) {
      console.error('Error al verificar datos:', err.message);
      return;
    }

    if (row.count === 0) {
      const sampleEmployees = [
        ['Juan Pérez', 'juan.perez@empresa.com', 'Desarrollador Senior', 'Tecnología', 75000, '2022-01-15'],
        ['María García', 'maria.garcia@empresa.com', 'Gerente de Proyectos', 'Operaciones', 65000, '2021-03-20'],
        ['Carlos López', 'carlos.lopez@empresa.com', 'Diseñador UX', 'Diseño', 55000, '2023-06-10'],
        ['Ana Rodríguez', 'ana.rodriguez@empresa.com', 'Analista de Datos', 'Analítica', 60000, '2022-11-05']
      ];

      const insert = `INSERT INTO employees (name, email, position, department, salary, hire_date)
                     VALUES (?, ?, ?, ?, ?, ?)`;

      sampleEmployees.forEach(emp => {
        db.run(insert, emp, function(err) {
          if (err) {
            console.error('Error al insertar empleado de ejemplo:', err.message);
          }
        });
      });
      console.log('Datos de ejemplo insertados.');
    }
  });
}

// Rutas de la API

// Obtener todos los empleados
app.get('/api/employees', (req, res) => {
  const sql = `SELECT * FROM employees ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Obtener un empleado por ID
app.get('/api/employees/:id', (req, res) => {
  const sql = `SELECT * FROM employees WHERE id = ?`;
  const params = [req.params.id];

  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Empleado no encontrado' });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Crear nuevo empleado
app.post('/api/employees', (req, res) => {
  const { name, email, position, department, salary, hire_date } = req.body;

  // Validaciones básicas
  if (!name || !email || !position || !department || !salary || !hire_date) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const sql = `INSERT INTO employees (name, email, position, department, salary, hire_date, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;

  const params = [name, email, position, department, salary, hire_date];

  db.run(sql, params, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'El email ya está registrado' });
      } else {
        res.status(400).json({ error: err.message });
      }
      return;
    }
    res.json({
      message: 'Empleado creado exitosamente',
      data: { id: this.lastID },
      id: this.lastID
    });
  });
});

// Actualizar empleado
app.put('/api/employees/:id', (req, res) => {
  const { name, email, position, department, salary, hire_date } = req.body;

  if (!name || !email || !position || !department || !salary || !hire_date) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const sql = `UPDATE employees
               SET name = ?, email = ?, position = ?, department = ?, salary = ?, hire_date = ?, updated_at = CURRENT_TIMESTAMP
               WHERE id = ?`;

  const params = [name, email, position, department, salary, hire_date, req.params.id];

  db.run(sql, params, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'El email ya está registrado' });
      } else {
        res.status(400).json({ error: err.message });
      }
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Empleado no encontrado' });
      return;
    }

    res.json({
      message: 'Empleado actualizado exitosamente',
      changes: this.changes
    });
  });
});

// Eliminar empleado
app.delete('/api/employees/:id', (req, res) => {
  const sql = `DELETE FROM employees WHERE id = ?`;
  const params = [req.params.id];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: 'Empleado no encontrado' });
      return;
    }

    res.json({
      message: 'Empleado eliminado exitosamente',
      changes: this.changes
    });
  });
});

// Obtener estadísticas
app.get('/api/stats', (req, res) => {
  const queries = {
    totalEmployees: `SELECT COUNT(*) as total FROM employees`,
    totalSalary: `SELECT SUM(salary) as total FROM employees`,
    avgSalary: `SELECT AVG(salary) as average FROM employees`,
    byDepartment: `SELECT department, COUNT(*) as count FROM employees GROUP BY department`
  };

  const results = {};
  let completed = 0;
  const totalQueries = Object.keys(queries).length;

  Object.keys(queries).forEach(key => {
    db.get(queries[key], [], (err, row) => {
      if (err) {
        console.error(`Error en query ${key}:`, err.message);
      } else {
        results[key] = row;
      }

      completed++;
      if (completed === totalQueries) {
        res.json({
          message: 'success',
          data: results
        });
      }
    });
  });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Cerrar conexión a la base de datos al terminar
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Conexión a la base de datos cerrada.');
    process.exit(0);
  });
});