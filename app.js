const { initializeApp, cert } = require('firebase-admin/app');
const express = require("express");

// Initialisation de l'app
const app = express();

// Initialize Firebase
const serviceAccount = require('./config/liveteam-key.json');

initializeApp({
  credential: cert(serviceAccount)
});

const products = require("./routes/manageAccess");
app.use("/manageAccess", products);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Le serveur est bien lancer sur le port ${PORT}`);
});
