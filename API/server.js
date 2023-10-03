const express = require('express');  // Maneja la libreria oara el uso de HTTP
const bodyParser = require('body-parser'); // Obtiene informacion de lo del HTML
const { Pool } = require('pg'); // Postgress  
const cors = require('cors');
const moment = require('moment');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'libreria',
  password: '12345',
  port: 5432,
});

// Rutas CRUD aquí

app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Manejo de Libros SAMS');
  });

// Para obtener todos los libros 
app.get('/libros', async(req, res) => {
  try{
    const result = await pool.query('SELECT * FROM libro');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Para obtener un libro por id 
app.get('/libros/:id', async(req, res) => {
  try{
    const {id} = req.params;
    const result = await pool.query('SELECT * FROM libro WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Crear un nuevo libro 
app.post('/libros', async (req, res) => {
  try{
    let{ titulo, autor, descripcion, publicado } = req.body;
    console.log({titulo, autor, descripcion, publicado});
    // Formatea la fecha a 'DD/MM/YYYY' usando moment.js
    const fechaFormateada = publicado ? moment(publicado, 'YYYY-MM-DD').format('DD/MM/YYYY') : null;
    console.log(fechaFormateada);
    const result= await pool.query('INSERT INTO libro (titulo, autor, descripcion, publicado) VALUES ($1, $2, $3, $4)  RETURNING *', [titulo, autor, descripcion, fechaFormateada]);
    res.json(result.rows[0]);
  
  } catch(error){
    console.log('Error inserting libro:', error);
    res.status(500).json({error: error.message})
  }
  
});

// Actualizar un libro por su id
app.put('/libros/:id', async(req,res) => {
  try{
    const {id} = req.params;
    const {titulo, autor, descripcion, publicado} = req.body;
    await pool.query('UPDATE libro SET titulo = $1, autor = $2, descripcion = $3, publicado = $4 WHERE id = $5', [titulo, autor, descripcion, publicado, id]);
    res.json({ message : 'Libro actualizado exitosamente'});
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// Eliminar un libro 
app.delete('/libros/:id', async(req,res) => { 
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM libro WHERE id = $1', [id]);
    res.json({message: 'Libro eliminado exitosamente'});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});