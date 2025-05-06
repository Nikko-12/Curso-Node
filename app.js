const express = require('express');
const fs = require('fs');
const path = require('path');
const { DefaultDeserializer } = require('v8');

const usuarios = [] // Lista de usuarios en memoria
const app = express();
const PORT = 3000;

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

// Ruta para recibir los datos del formulario y registrar al usuario
app.post('/signup', (req, res) => {
    const { nombre, email, password } = req.body;
    const nuevoUsuario = { nombre, email, password };
  
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
  

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

