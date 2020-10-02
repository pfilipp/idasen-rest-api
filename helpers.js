
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const  normalizePort = (portValue) => {
  const port = parseInt(portValue, 10);

  if (isNaN(port)) {
    // named pipe
    return portValue;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
