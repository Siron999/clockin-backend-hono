/**
 * Simple logger for Lambda environment
 */
const logger = {
  info: (message: any, ...args: any[]) => {
    console.log(new Date().toISOString(), message, ...args);
  },
  error: (message: any, ...args: any[]) => {
    console.error(new Date().toISOString(), message, ...args);
  },
  warn: (message: any, ...args: any[]) => {
    console.warn(new Date().toISOString(), message, ...args);
  },
  debug: (message: any, ...args: any[]) => {
    console.debug(new Date().toISOString(), message, ...args);
  },
};

export default logger;
