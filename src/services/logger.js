/**
 * Services Structure
 */

/**
 * System and 3rd party libs
 */
const log4js = require("log4js");
const morgan = require("morgan");

/**
 * Declarations & Implementations
 */
const log = log4js.getLogger();
log.level = process.env.LOG_LEVEL || "all";
const morganInstance = morgan("dev", {
  stream: {
    write: (str) => {
      log.debug(str);
    },
  },
});

/**
 * Service Export
 */
module.exports = {
  log,
  morgan: morganInstance,
};
