const express = require('express');		// Utilisation du Framework Express
const bodyParser = require('body-parser');	// Extraire les objets au Format JSON
const mongoose = require ('mongoose') // Import dans mongoose
const helmet = require('helmet');// Utilisation helmet pour protéger notre application de certaines vulnérabilités
const path = require('path'); // Traiter les requêtes image
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


const router = express.Router();
		
// Utilisation MongoDB pour la base de données
mongoose.connect(process.env.MONGO_DNS,		
{ useNewUrlParser: true,			
  useUnifiedTopology: true },)			
.then(() => console.log('Connexion à MongoDB réussie !'))			
.catch(() => console.log('Connexion à MongoDB échouée !'));			

const app = express();	  

// Headers pour éviter les erreurs de CORS
app.use((req, res, next) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
// Utilisation body-parser pour extraire les objets en Json dans les requêtes de type POST
app.use(bodyParser.json());		

// Utilisation de la route path pour reconnaître les requêtes images
app.use('/images', express.static(path.join(__dirname, 'images'))); 

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use(helmet());

module.exports = app;		
