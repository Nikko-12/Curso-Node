const express = require('express');
const fs = require('fs');
const path = require('path');
const { DefaultDeserializer } = require('v8');

const usuarios = [] // Lista de usuarios en memoria
const app = express();
const PORT = 3000;

// Middleware para recibir datos de formularios HTML
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde /public
app.use(express.static('public'));
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta del formulario de registro
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Ruta del wellcome
app.get('/wellcome', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'wellcome.html'));
});

// Ruta para recibir los datos del formulario y registrar al usuario
app.post('/signup', (req, res) => {
  
    const { nombre, email, password } = req.body;

    //Ruta del archivo donde guardamos los usuarios
    
  
    const filePath = path.join(__dirname, 'usuarios.json');
    
  
    // Leer el archivo actual o iniciar un array vacío si no existe
    fs.readFile(filePath, 'utf8', (err, data) => {
      let usuarios = [];
  
      if (!err && data) {
        try {
          usuarios = JSON.parse(data);
        } catch (e) {
          console.error('Error al parsear el archivo JSON:', e);
        }
      }
      // Comprobamos si el email ya está registrado
    const emailExiste = usuarios.find(u => u.email === email);

    if (emailExiste) {
      return res.status(400).send('El email ya está registrado. Por favor, usa otro.');
    }

      //Sino existe, agregamos al nuevo usuario
      const nuevoUsuario = { nombre, email, password };
      usuarios.push(nuevoUsuario);
      
      // Guardar el array actualizado en el archivo
      fs.writeFile(filePath, JSON.stringify(usuarios, null, 2), (err) => {
        if (err) {
          console.error('Error al guardar usuario:', err);
          return res.status(500).send('Error al guardar el usuario');
        }
  
        console.log('Usuario guardado:', nuevoUsuario);
        res.send(`Usuario ${nombre} registrado con éxito.`);
      });
    });
  });
  
 // ruta para logearse

  app.post('/login', (req, res) => {
    const { email, password } = req.body;  // Obtenemos los datos del formulario de login
  
    const filePath = path.join(__dirname, 'usuarios.json');
  
    // Leemos el archivo de usuarios para obtener la lista de usuarios registrados
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer archivo de usuarios:', err);
        return res.status(500).send('Error al leer los datos de los usuarios');
      }
  
      let usuarios = [];
      try {
        usuarios = JSON.parse(data);  // Convertimos el contenido JSON en un array
      } catch (e) {
        console.error('Error al parsear el archivo JSON:', e);
        return res.status(500).send('Error al procesar los datos de los usuarios');
      }
  
      // Buscamos si existe un usuario con el email y la contraseña ingresada
      const usuario = usuarios.find(u => u.email === email && u.password === password);
  
      if (usuario) {
        // Si el login es exitoso, redirigimos a la página welcome.html
        res.redirect('/wellcome');
      } else {
        // Si las credenciales son incorrectas, devolvemos un error
        res.status(401).send('Credenciales incorrectas');
      }
    });
  });
  

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

