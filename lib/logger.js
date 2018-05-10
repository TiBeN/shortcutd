/**
 * Simple logger module
 */

const inputCodes = require('./input-event-codes');

var verbose = false;

/**
 * Set verbose mode
 */
exports.verbose = function (bool) {
    verbose = bool;    
};

/**
 * Send log message to stdout if in verbose mode
 */
exports.log = function log(str) {
    if (verbose) {
        console.log(str);
    }
}

/**
 * Send to stdout the pressedKeys 
 *
 * @param pressedKeys read from a device
 */
exports.logPressedKeys = function (pressedKeys) {
    var pressedKeysStr = '', pressedKeyCodesStr = '';
    for (i in pressedKeys) {

        pressedKeysStr += pressedKeys[i];
        if ((i+1) < pressedKeys.length) {
            pressedKeysStr += '+';            
        }

        for (j in inputCodes) {
            if (pressedKeys[i] == inputCodes[j]) {
                pressedKeyCodesStr += j;
                if ((i+1) < pressedKeys.length) {
                    pressedKeyCodesStr += '+';
                }
            }
        }
    }
    this.log(`Keys: ${pressedKeyCodesStr} (${pressedKeysStr})`);
}
