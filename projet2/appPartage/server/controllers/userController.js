const User = require('../models/user.model').model;

module.exports.home = (_,res) => res.redirect('/home.html');

module.exports.me =
  async (req, res) =>  {
    const user = await User.findById(req.userId);
    //console.log(user);
    //console.log("Id de l'utilisateur",req.userId);
    res.status(200).json({ name : user.name , id : user.id});
  }