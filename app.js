const express = require('express');
const app = express();
app.use(express.json());

let tareas = [
  {
    titulo: 'Ejemplo',
    descripcion: 'Descripción de ejemplo',
    estado: 'pendiente',
    pasos: ['Paso 1', 'Paso 2']
  }
];

// 1. Obtener lista completa de tareas
app.get('/tareas', (req, res) => {
  res.json(tareas);
});

// 2. Obtener tarea por nombre (titulo)
app.get('/tareas/:titulo', (req, res) => {
  const tarea = tareas.find(t => t.titulo === req.params.titulo);
  if (tarea) {
    res.json(tarea);
  } else {
    res.status(404).json({ mensaje: 'Tarea no encontrada' });
  }
});

// 3. Obtener listado de tareas pendientes
app.get('/tareas/estado/pendiente', (req, res) => {
  const pendientes = tareas.filter(t => t.estado === 'pendiente');
  res.json(pendientes);
});

// 4. Obtener listado de tareas completadas
app.get('/tareas/estado/completada', (req, res) => {
  const completadas = tareas.filter(t => t.estado === 'completada');
  res.json(completadas);
});

// 5. Agregar nueva tarea
app.post('/tareas', (req, res) => {
  const nuevaTarea = req.body;
  // Validación sencilla
  if (!nuevaTarea.titulo || !nuevaTarea.descripcion || !nuevaTarea.estado || !nuevaTarea.pasos) {
    return res.status(400).json({ mensaje: 'Faltan datos en la tarea' });
  }
  tareas.push(nuevaTarea);
  res.status(201).json({ mensaje: 'Tarea agregada', tarea: nuevaTarea });
});

// 6. Actualizar tarea existente
app.put('/tareas/:titulo', (req, res) => {
  const indice = tareas.findIndex(t => t.titulo === req.params.titulo);
  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  }
  const tareaActualizada = req.body;
  tareas[indice] = tareaActualizada;
  res.json({ mensaje: 'Tarea actualizada', tarea: tareaActualizada });
});

// 7. Actualizar estado de una tarea
app.patch('/tareas/:titulo/estado', (req, res) => {
  const tarea = tareas.find(t => t.titulo === req.params.titulo);
  if (!tarea) {
    return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  }
  if (!req.body.estado) {
    return res.status(400).json({ mensaje: 'Estado es requerido' });
  }
  tarea.estado = req.body.estado;
  res.json({ mensaje: 'Estado actualizado', tarea });
});

// 8. Eliminar tarea específica
app.delete('/tareas/:titulo', (req, res) => {
  const indice = tareas.findIndex(t => t.titulo === req.params.titulo);
  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  }
  tareas.splice(indice, 1);
  res.json({ mensaje: 'Tarea eliminada' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
