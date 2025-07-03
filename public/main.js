//container para peliculas + formulario
const listaPeliculas = document.querySelector("#lista-peliculas");
const formulario = document.querySelector("#form-pelicula");
//boton envio
const btnEnvio = document.querySelector("#btnEnvio");

//inputs
const inputId = document.querySelector("#idPelicula");
const inputTitulo = document.querySelector("#titulo");
const inputDirector = document.querySelector("#director");
const inputAnio = document.querySelector("#anio");

//diálogo
const dialog = document.getElementById("confirm-dialog");
const btnYes = document.getElementById("confirm-yes");
const btnNo = document.getElementById("confirm-no");

peliculaAEliminarId = null;// Guardamos aquí el id de la película a eliminar


async function obtenerPeliculas() {
  const response = await fetch("/peliculas");//hace una petición GET al servidor para pedir todas las peliculas.
  const peliculas = await response.json();//convierte la respuesta del servidor (en formato JSON) en un array de objetos JavaScript (libros).
  console.log(peliculas);


  listaPeliculas.replaceChildren();//limpiar lista

  //Renderiza cada película en el contenedor
  peliculas.forEach(pelicula => {

    const contenedorPelicula = document.createElement("div");

    const titulo = document.createElement("h3");
    titulo.textContent = pelicula.titulo;

    const director = document.createElement("p");
    director.textContent = `Director: ${pelicula.director}`;

    const anio = document.createElement("p");
    anio.textContent = `Año: ${pelicula.anio}`;

    contenedorPelicula.append(titulo, director, anio);

    // Agregar clase para estilos
    contenedorPelicula.classList.add("pelicula");

    // Crear contenedor de botones
    const botonesContainer = document.createElement("div");
    botonesContainer.classList.add("botones-container");

    // Crear boton de eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.dataset.id = pelicula.id;
    btnEliminar.addEventListener("click", (e) => {
      e.preventDefault();

      peliculaAEliminarId = pelicula.id; // Guardamos el id para eliminar después
      /*  dialog.dataset.id= pelicula.id; */
      dialog.showModal(); // Abrimos el diálogo

    });
    

    // crear boton de editar
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn-editar");
    btnEditar.dataset.id = pelicula.id;
    btnEditar.addEventListener("click", (e) => {
      e.preventDefault();
      cargarDatosPeliculaEditar(pelicula.id);
    })

    botonesContainer.append(btnEditar,btnEliminar);
    contenedorPelicula.appendChild(botonesContainer);
    listaPeliculas.appendChild(contenedorPelicula);

  });
}

// borrar película
async function eliminarPelicula(id) {
  const response = await fetch('/eliminar-pelicula', { //Se hace una petición al servidor.
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }, //indica que se está enviando JSON
    body: JSON.stringify({ id })  // Enviamos id en el body
  })
  console.log("esto es response:", response);

  //Se espera que el servidor devuelva una respuesta en formato JSON (como { success: true } o { error: "..." }).
  const data = await response.json();
  console.log("esto es data:", data);

  if (data.success) { // Si la respuesta es correcta
    obtenerPeliculas();
  } else {
    console.error("Error al eliminar la película");
  }
};

// Cargar datos de la película a editar en el formulario
async function cargarDatosPeliculaEditar(id) {
  const response = await fetch("/peliculas");
  const peliculas = await response.json();
  const peliculaEditar = peliculas.find(pelicula => pelicula.id === parseInt(id));
  console.log(peliculaEditar);


  inputTitulo.value = peliculaEditar.titulo;
  inputDirector.value = peliculaEditar.director;
  inputAnio.value = peliculaEditar.anio;
  inputId.value = id;

  formulario.action = "/editar-pelicula";
  btnEnvio.textContent = "Actualizar";
}

//Evento que espera que cargue todo el html
document.addEventListener("DOMContentLoaded", () => {
  obtenerPeliculas();
})

btnYes.addEventListener("click", (e) => {
  console.log(dialog.dataset.id);

  eliminarPelicula(peliculaAEliminarId);
  dialog.close();
});

// Cuando cancela:
btnNo.addEventListener("click", () => {
  dialog.close();
});


