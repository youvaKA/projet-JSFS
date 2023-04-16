const Object = require('../models/objectModel').model;
const User = require('../models/user.model').model;

//Ajoute un nouvel objet au catalogue
  module.exports.add = async (req, res) =>{
    //console.log('req = ', req.body);
  
    try {
      const objectsData = {
                          ...req.body,
                       };
      const newObject = await Object.create(objectsData); // save user in the database
      res.status(201).json(objectsData);
    }
    catch (err){
      console.log(`ATTENTION : pb d'ajout d'un objet ${err.message}`);
      res.status(409).json({ message : err.message });
    }
  }
  
// Permet d'envoyer la liste des objets et leur status
  module.exports.list = async (_, res) =>  {
    const objectListOwner = await Object.find().populate('owner', 'name' );
    const objectListborrowedBy = await Object.find().populate('borrowedBy', 'name' );
    res.status(200).json({ description : objectListOwner,  borrowBy: objectListborrowedBy});
  }
  
// efface un pbjet du catalogue
  module.exports.dell = async (req, res) => {
    try {
      const objectId = req.body.id; // Récupérer l'ID de l'objet à supprimer depuis les paramètres de la requête
      await Object.findByIdAndDelete(objectId); // Supprimer l'objet de la base de données
      res.status(200).json({ message: 'L\'objet a été supprimé avec succès.' });
    } catch (err) {
      console.log(`ATTENTION : pb de suppression d'un objet ${err.message}`);
      res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de l\'objet.' });
    }
  };

// affect un objet à un utilisateur et le rajoute dans sa liste d'objets emprunter limité à 2 MAX
  module.exports.borroweObj = async (req, res) => {
    try {
      const idObj = req.body.idObj;
      const borrowedById = req.body.borrowedBy;
      // console.log('recu du client = ', idObj)
      // console.log('recu du son ID = ', borrowedById)
      const user = await User.findById(borrowedById)
      
      if (user.Objects.length <= 1) {
        
        const objectToBorrow = await Object.findById(idObj)
        objectToBorrow.borrowedBy = borrowedById
        user.Objects.push(idObj)
        await user.save() 
        objectToBorrow.save()
        
        //console.log('user.Objects = ', user.Objects)
      }else {
        
        res.status(400).send({ message: 'limite emprunt atteinte' })
      }
      
    } catch (err) {
      console.log(`ATTENTION : pb de mise à jour de l'objet ${err.message}`)
      res.status(400).json({ message: err.message })
    }
  }
  
// remet un objet en location et l'efface de la liste de l'utilisateur 
  module.exports.returnObj = async (req, res) =>{
    try {
      const idObj = req.body.idObj;
      const borrowedById = req.body.borrowedBy;
      // console.log('objet du client = ', idObj)
      // console.log('ID du client = ', borrowedById)
      
      const objectToBorrow = await Object.findById(idObj)
      const user = await User.findById(borrowedById)
      objectToBorrow.borrowedBy = null;
      
      user.Objects.pull(idObj)
      await user.save() 
      objectToBorrow.save()
      
      //console.log('user.Objects = ', user.Objects)
      res.status(200).send({ message: 'Objet emprunté avec succès' })
    } catch (err) {
      console.log(`ATTENTION : pb de mise à jour de l'objet ${err.message}`)
      res.status(400).json({ message: err.message })
    }
  }