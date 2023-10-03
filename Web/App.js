import React, {  useState, useEffect } from 'react';
import axios from 'axios'; // Realiza solicitudes HTTP desde el navegador o desde Node.js
import 'bootstrap/dist/css/bootstrap.min.css';
import AgregarEditarLibro from './libro/agregar_editar_libro'; // Asegúrate de ajustar la ruta de importación según tu estructura de archivos


function App() {

  const[libros, setLibros] = useState([]);
  const[libroActual, setLibroActual] = useState({ titulo: '', autor: '', descripcion: '', publicado: '' });
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = 'http://localhost:3000/libros';

  useEffect(() => {
    fetchLibros();
  }, []);


  // Carga los libros, ya sea que se hayan agregado o actualizado 
  const fetchLibros = async() =>{
    try{
      const response = await axios.get(API_URL);
      setLibros(response.data);
    
    } catch(error){
      console.log(error);
      console.error('Error fetching libros:', error);
    }
  };

  const handleAgregarEditarLibro = async (libro) => {
    try{ 
      if (isEditing) {
        await axios.put(`${API_URL}/${libro.id}`, libro);
      } else {
        await axios.post(API_URL, libro);
      }
      fetchLibros();
      setLibroActual({ titulo: '', autor: '', descripcion: '', publicado: '' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error adding or updating libro:', error);
    }
  };

  // Setea el libro
  const handleEditLibro = (libro) => {
    setLibroActual(libro);
    setIsEditing(true);
  };
// Elimina el libro 
  const handleDeleteLibro = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchLibros();
    } catch (error) {
      console.error('Error deleting libro:', error);
    }
  };

  const handleCancelar = () => {
    setLibroActual({ titulo: '', autor: '', descripcion: '', publicado: '' });
    setIsEditing(false);
  };


  return (
    <div className="container">
      <h1 className="my-4">Librería</h1>
      <AgregarEditarLibro 
        onAgregarEditar={handleAgregarEditarLibro} 
        libroActual={libroActual} 
        isEditing={isEditing} 
        onCancelar={handleCancelar} 
      />
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr className="table-primary">
              <th>ID</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Descripción</th>
              <th>Publicado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {libros.map((libro, index) => (
              <tr key={libro.id} className={index % 2 === 0 ? 'table-light' : 'table-secondary'}>
                <td>{libro.id}</td>
                <td>{libro.titulo}</td>
                <td>{libro.autor}</td>
                <td>{libro.descripcion}</td>
                <td>{libro.publicado}</td>
                <td>
                  <button onClick={() => handleEditLibro(libro)} className="btn btn-primary btn-sm me-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                    <path d="M16 5l3 3" />
                  </svg>
                  </button>
                  <button onClick={() => handleDeleteLibro(libro.id)} className="btn btn-danger btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M4 7l16 0" />
                    <path d="M10 11l0 6" />
                    <path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}

export default App;
