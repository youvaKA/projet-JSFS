import * as fs from 'fs/promises';
import { getContentTypeFrom }  from '../src/scripts/contentTypeUtil.js';

const BASE = 'http://localhost/';
/**
*  define a controller to retrieve static resources
*/


export default class RequestController {

  #request;
  #response;
  #url;


  constructor(request, response) {
    this.#request = request,
    this.#response = response;
    this.#url = new URL(this.request.url, BASE).pathname;   // on ne considère que le "pathname" de l'URL de la requête
  //console.log(this.#url);
  }

  get response() {
    return this.#response;
  }
  get request() {
    return this.#request;
  }
  get url() {
    return this.#url;
  }

  /**
  * send the requested resource as it is, if it exists, else responds with a 404
  */

  async handleRequest() {
    this.response.setHeader("Content-Type" , getContentTypeFrom(this.url) );
    await this.buildResponse();
    //this.response.end();
    //demander au prof pk est ce que this.response.end(); ne fonctionne pas  ici   
  }

  async pageLoader(path) {
    try {
      //console.log("dans content: "+path);
      // check if resource is available
      await fs.access(path);
      // read the requested resource content
      const data = await fs.readFile(path);
      // send resource content
      this.response.statusCode = 200;
      this.response.write(data);
      //console.log(data);
      //this.response.write('erreur');
      //console.log('try');
    }
    catch (err) { // resource is not available
    
      this.response.statusCode = 404;
      this.response.write('erreur');
      //console.log('catch');
    

    }
    this.response.end();
    //demander au prof pk est ce que   this.response.end(); fonctionne que ici
  }

  async buildResponse() {
    if (this.#url == '/') {
      this.pageLoader('src/public/html/index.html');
     
    } else if (this.#url == '/about') {
      this.pageLoader('src/public/html/about.html');
    }
    else if (this.#url == '/styles/index.css') {
      this.pageLoader('src/public/styles/index.css');
    }
    else if (this.#url == '/pfc') {
      this.pageLoader('src/public/html/pfc.html');
    } 
    else if (this.#url == '/scripts/client.js'){
      this.pageLoader('src/public/scripts/client.js');
    }
    else if (this.#url == '/scripts/indexClient.js'){
      this.pageLoader('src/public/scripts/indexClient.js');
    }
    else {this.pageLoader('err');
      //this.response.statusCode = 404;
      
    }

  }
}
