/**
 * shortcutd
 *
 * A daemon that executes commands on keyboard shortcuts.  
 *
 * By listening directly to kernel input events from device files it doesn't
 * requires any graphical environment and works whatever software stack is run.
 */

const logger = require('./logger');
const configParser = require('./config-parser');
const devicePoller = require('./device-poller');
const deviceListener = require('./device-listener');
const pressedKeysHandler = require('./pressed-keys-handler');

/**
 * Set verbose mode
 */
exports.verbose = function (bool) {
    logger.verbose(bool);
};

/**
 * Run shortcutd 
 */
exports.run = function (configFile) {

    const config = configParser.parse(configFile);

    devicePoller.logger(logger);

    deviceListener.logger(logger);

    pressedKeysHandler.logger(logger);
    pressedKeysHandler.shortcuts(config.shortcuts);

    devicePoller.poll(config.device, () => {
        deviceListener.listen(config.device, pressedKeys => {
            pressedKeysHandler.handle(pressedKeys);
        });
    });

}
