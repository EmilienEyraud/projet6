const jwt = require('jsonwebtoken');			

//Vérification du TOKEN de l'utilisateur, si le seveur reconnait que le TOKEN a bien été créé par lui et
 //que le userId correspond alors valide la requête de l'utilisateur

module.exports = (req, res, next) => {			
  try {			
    const token = req.headers.authorization.split(' ')[1];			
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);			
    const userId = decodedToken.userId;			
    if (req.body.userId && req.body.userId !== userId) {			
      throw 'ID utilisateur invalide';			
    } else {			
      next();			
    }			
  } catch {			
    res.status(401).json({			
      error: new Error('Requête non authentifiée!')			
    });			
  }			
};			