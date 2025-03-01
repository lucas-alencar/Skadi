import winston, { format } from 'winston';
import path from 'path';
import process from 'process';

const logDirectory = path.join(process.cwd(), 'logs');

interface LogEntry extends winston.Logform.TransformableInfo {
  module?: string;
}

const getCallerInfo = (manuallyFunctionName: string): string => {
  try {
    const err = new Error();

    const originalPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
  
    const stack = err.stack as unknown as NodeJS.CallSite[];
  
    Error.prepareStackTrace = originalPrepareStackTrace;
    const caller = stack[3];
  
    if (caller) {
      const fileName = path.basename(caller.getFileName() || manuallyFunctionName);
      const functionName = caller.getFunctionName() || manuallyFunctionName;
      let arquivoSemExtensao = fileName.replace(/\.[^/.]+$/, "");
  
      return `${arquivoSemExtensao}.${functionName}`;
    }
  
    return manuallyFunctionName;    
  } catch (error) {
    return manuallyFunctionName;   
  }

};

const getLogLevel = () : string => {
  const devEnv = 'development';
  console.log(devEnv)
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV == devEnv)
    return 'debug';
  else
    return 'info';
}

const logger = winston.createLogger({
  level: getLogLevel(),
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf((info: LogEntry) => {
      const { timestamp, level, message, module } = info;
      return `${timestamp} [${level}] [${module || 'unknown'}] - ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info: LogEntry) => {
          const { timestamp, level, message, module } = info;
          return `${timestamp} [${level}] ${module || 'unknown'}: ${message}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, 'app.log'),
      format: format.printf((info: LogEntry) => {
          const { timestamp, level, message, module } = info;
          return `${timestamp} [${level}] ${module || 'unknown'}: ${message}`;
        }
      ),
    })
  ]
});

const logWithContext = (level: string, message: string, functionName: string): void => {
  const module = getCallerInfo(functionName);
  logger.log({ level, message, module });
};

const logFunctions = {
  info: (msg: string, functionName: string = 'undefined') => logWithContext('info', msg, functionName),
  warn: (msg: string, functionName: string = 'undefined') => logWithContext('warn', msg, functionName),
  error: (msg: string, functionName: string = 'undefined') => logWithContext('error', msg, functionName),
  debug: (msg: string, functionName: string = 'undefined') => logWithContext('debug', msg, functionName)
};

export { logger };
export default logFunctions;