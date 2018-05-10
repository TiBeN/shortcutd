/**
 * Device file poller
 */

const fs = require('fs');

var logger;

/**
 * Set logger
 */
exports.logger = function (obj) {
    logger = obj;
}

/**
 * Look at the given device file on the file system then execute the given
 * callback when it is available
 */
exports.poll = function (device, callback) {

    if (fs.existsSync(device)) {
        logger.log(
            `Device file detected: ${device}`);
        callback();
    }

    var watcher = fs.watchFile(device, (current, previous) => {
        if (current.dev === 0) {
            logger.log(`Device file not detected: ${device}`);
        } else {
            logger.log(`Device file detected: ${device}`);
            callback();
        }
    });

}
