import express from 'express';
//para poder trabajar con el directorio public
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const app = express();
const PORT = 3000;

// Estas líneas son necesarias para obtener __dirname en módulos ES6 (para cargar la carpeta public)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

//MIDDLEWARE para el uso de json y procesar datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());// Importante: analiza el JSON del body


const peliculas = [
    {
        id: Date.now(),
        titulo: 'El Padrino',
        director: 'Francis Ford Coppola',
        anio: 1972
    },
    {
        id: Date.now() + 1,
        titulo: 'Pulp Fiction',
        director: 'Quentin Tarantino',
        anio: 1994
    },
    {
        id: Date.now() + 2,
        titulo: 'Parásitos',
        director: 'Bong Joon-ho',
        anio: 2019
    }
];

// Ruta para devolver la lista de películas (devuelve array de objetos)
app.get('/peliculas', (req, res) => {
    res.json(peliculas);
});


// Ruta para añadir una película(devuelve array de objetos)
app.post('/anadir-pelicula', (req, res) => {
    const { titulo, director, anio } = req.body;

    const nuevaPelicula = {
        id: Date.now(),
        titulo,
        director,
        anio
    };

    peliculas.push(nuevaPelicula);
    res.redirect("/");
});


// Ruta para eliminar una película por id
app.delete('/eliminar-pelicula', (req, res) => {
    const { id } = req.body;

    const index = peliculas.findIndex(p => p.id === Number(id));

    if (index !== -1) {
        peliculas.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: `Película con id ${id} no encontrada` });
    }
});

//Ruta para editar
app.post("/editar-pelicula", (req, res) => {
  const { idPelicula, titulo, director, anio } = req.body;
  const index = peliculas.findIndex(pelicula => pelicula.id === parseInt(idPelicula))
  console.log("El indice es", index);
  
  if (index !== -1) {
    /* peliculas[index].id = parseInt(idPelicula); */ // No es necesario reasignar el id, ya que no cambia
    peliculas[index].titulo = titulo;
    peliculas[index].director = director;
    peliculas[index].anio = anio;
    res.redirect("/?mensaje=Película actualizada correctamente");
  } else {
    res.status(404).json({ error: "Película no encontrada" });
  }
})

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});