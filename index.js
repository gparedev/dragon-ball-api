window.addEventListener("DOMContentLoaded", function () {

    todosLosPersonajes();
    juegoAdvinaPersonaje();

    let inputNumeroPersonaje = document.getElementById("inputNumeroPersonaje");
    let btnPedir = document.getElementById("btnPedir");
    let cajaInfo = this.document.getElementById("cajaInfo");
    let infoImagen = document.getElementById("infoImagen");
    let infoTexto = document.getElementById("infoTexto");

    btnPedir.addEventListener('click', pedirPersonaje);

    function pedirPersonaje() {
        // Obtiene el valor introducido por el usuario
        numero = inputNumeroPersonaje.value;

        // Valida que el campo no esté vacío y que el número esté en el rango permitido
        if (numero.trim() === "" || (numero < 1 || numero > 44)) {
            document.getElementById("infoImagen").style.display = "none";
            alert("⚠️Debes introducir un ID del 1 al 44 para buscar un personaje");
            console.log("Error 1: espacios, menor que 1 o mayor que 44");
        }
        // Si el número es válido, realiza la petición a la API
        else if (numero) {
            fetch(`https://dragonball-api.com/api/characters/${numero}`)
                // el primer .then recibe la respuesta de la API
                .then(response => {
                    console.log(response.status);
                    // verifica si la respuesta es exitosa
                    if (!response.ok) {
                        // Si no es exitosa, lanza un error para que lo capture el catch
                        throw new Error("Personaje no encontrado");
                    }
                    // si es exitosa, convierte la respuesta a JSON
                    return response.json();
                })
                // el segundo .then recibe los datos ya convertidos a objeto JS
                .then(data => {
                    document.getElementById("infoImagen").style.display = "block";
                    mostrarDatos(data);
                })
                // el catch captura cualquier error ocurrido en la petición o en los then anteriores
                .catch(error => {
                    document.getElementById("infoImagen").style.display = "none";
                    alert("⚠️Personaje número " + numero + " no encontrado en la API");
                    console.log("Error 2: no se puede cargar el personaje número " + numero);
                })

            function mostrarDatos(data) {
                let imagen = data.image;
                let nombre = data.name;
                let ki = data.ki;
                let maxki = data.maxKi;
                let raza = data.race;
                let description = data.description;

                infoImagen.innerHTML = `<img src="${imagen}"/>`;

                infoTexto.innerHTML = `
            <h2><strong>${nombre} </strong></h2>
            <p><strong>Ki: ${ki} </strong></p>
            <p><strong>MaxKi: ${maxki} </strong></p>
            <p><strong>Raza: ${raza}</strong></p>
            <p><strong>Descripción: ${description}</strong></p>
            `;
            }
        }
    }

    function todosLosPersonajes() {
        let contenedorPersonajes = document.getElementById("contenedorPersonajes");
        contenedorPersonajes.innerHTML = "";

        for (let posicionPersonaje = 1; posicionPersonaje <= 44; posicionPersonaje++) {
            let numero = posicionPersonaje;
            console.log(numero);

            fetch(`https://dragonball-api.com/api/characters/${numero}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Personaje no encontrado");
                    }
                    return response.json();
                })
                .then(data => {
                    let miniPersonaje = document.createElement("a");
                    miniPersonaje.className = "cajaMiniPersonaje";
                    miniPersonaje.href = "#";
                    miniPersonaje.addEventListener("click", mostrarPersonaje => {
                        inputNumeroPersonaje.value = posicionPersonaje;
                        btnPedir.click();
                    });
                    miniPersonaje.style.textDecoration = "none";
                    miniPersonaje.style.color = "inherit";
                    miniPersonaje.style.border = "1px solid #ccc";
                    miniPersonaje.style.borderRadius = "20px";
                    miniPersonaje.style.padding = "1rem";
                    miniPersonaje.style.background = "#fff";
                    miniPersonaje.style.width = "220px";
                    miniPersonaje.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                    miniPersonaje.style.display = "flex";
                    miniPersonaje.style.flexDirection = "column";
                    miniPersonaje.style.alignItems = "center";

                    miniPersonaje.innerHTML = `
                        <img src="${data.image}" alt="${data.name}" style="width:100px; height:auto; border-radius:6px; margin-bottom:0.5rem;"/>
                        <h3 style="font-size:1.1rem; margin:0.5rem 0 0.2rem 0;">${numero}. ${data.name}</h3>
                    `;
                    contenedorPersonajes.appendChild(miniPersonaje);
                })
                .catch(error => {
                    console.log("Error al cargar personaje número " + numero)
                });
        }
    }

    let puntuacion = 0;

    function juegoAdvinaPersonaje() {
        let personajeRandom;
        do {
            personajeRandom = Math.floor(Math.random() * 44) + 1;
        } while (personajeRandom === 36 || personajeRandom === 41);

        fetch(`https://dragonball-api.com/api/characters/${personajeRandom}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Personaje no encontrado");
                }
                return response.json();
            })
            .then(data => {
                document.getElementById("imagenJuego").innerHTML = `<img src="${data.image}"/>`;

                // Se obtiene el botón con id "btnComprobar" y se guarda en la variable btnComprobar.
                // Luego, se define una función llamada nuevoListener que, cuando se ejecute, llamará a comprobarRespuesta pasando como argumento data.name.
                // Esta función se usará como manejador (listener) del evento click en el botón.
                let btnComprobar = document.getElementById("btnComprobar");
                let nuevoListener = function () { comprobarRespuesta(data.name); };
                btnComprobar.replaceWith(btnComprobar.cloneNode(true));
                document.getElementById("btnComprobar").addEventListener('click', nuevoListener);

                console.log(data);
            })
            .catch(error => {
                console.log("Error al cargar personaje aleatorio");
            });

        function comprobarRespuesta(nombreCorrecto) {
            let inputRespuesta = document.getElementById("inputNombreJuego").value.trim().toLowerCase();
            let nombrePersonaje = nombreCorrecto.toLowerCase();

            if (inputRespuesta === "") {
                alert("⚠️ Debes introducir un nombre de personaje");
            } else if (inputRespuesta === nombrePersonaje) {
                alert("🎉 ¡Correcto! Has adivinado el personaje.");
                document.getElementById("inputNombreJuego").value = ""; // Limpiar el campo de respuesta
                puntuacion++;
                document.getElementById("puntuacion").innerText = `Puntuación: ${puntuacion}`;
                juegoAdvinaPersonaje(); // Reiniciar el juego
            } else {
                alert(`❌ Incorrecto. El personaje era ${nombreCorrecto}`);
                document.getElementById("inputNombreJuego").value = ""; // Limpiar el campo de respuesta
                juegoAdvinaPersonaje();
            }
        }
    }

    console.log("DOM completamente cargado");


});

// expresión lambda
// window.addEventListener('DOMContentLoaded', () => {
// });