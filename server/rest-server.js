import {normalizePort} from '../helpers.js';
import debugModule from 'debug';
import http from 'http';

const debug = debugModule('server:server');

export class RestServer {
  constructor(port, expressServer){
    this.port = normalizePort(port);

    expressServer.app.set('port', this.port);

    this.createServer(expressServer);
  }

  createServer = (expressServer) => {
    this.server = http.createServer(expressServer.app);
  }

  start = () => {
    this.server.listen(this.port);
    this.server.on('error', this.handleError);
    this.server.on('listening', this.handleListening);
  }

  handleError = (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    const bind = typeof this.port === 'string'
      ? 'Pipe ' + this.port
      : 'Port ' + this.port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  handleListening = () => {
    const addr = this.server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }

}
