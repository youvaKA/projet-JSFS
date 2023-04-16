//Fichier indexController.js

const path = require('path');


class indexController {

  constructor() {

    this.home = this.home.bind(this);

  }


  home(_, res) {

    const options = {
      root: './public/pages',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

    res.sendFile('home.html', options);
    }

}

module.exports = new indexController();
