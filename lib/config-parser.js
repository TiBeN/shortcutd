/**
 * Configuration file parser
 */

const fs = require('fs');
const inputCodes = require('./input-event-codes');

/**
 * Parse configuration file
 * 
 * @return configuration object
 */
exports.parse = function (file) {
   
    try { 

        // try to use require instead here

        var content = fs.readFileSync(file, 'utf8');

    } catch (e) {
        throw `Error while reading the config file: ${e.message}`;
    }

    try {
        var config = JSON.parse(content);
    } catch (e) {
        throw `Error while parse config file: ${e}`;
    }

    if (typeof config.device !== 'string') {
        throw `'device' property misconfigured`;
    }

    if (!Array.isArray(config.shortcuts)) {
        throw `'shortcuts' property misconfigured`;
    }

    // Normalize shortcuts
    //
    // Transform key combinations from "+" separated string to nested objects 
    // by key properties
    // ex: {
    //      "keys": "KEY_LEFTCTRL+KEY_LEFTALT+KEY_1",
    //      "blocking": true,
    //      "command": "systemctl start service" 
    //  }
    //
    //  becomes:
    //
    //  {
    //      29: {
    //          56: {
    //             2: { blocking: true, command: "systemctl start service" }
    //          }
    //      }
    //  }

    var normalizedShortcuts = {};

    for (var i = 0; i < config.shortcuts.length; i++) {

        var pointer = normalizedShortcuts;
        var shortcut = config.shortcuts[i];

        if (typeof shortcut.keys !== 'string') {
            throw `'key' property of shortcut entry #${(i+1)} misconfigured`;
        }

        if (typeof shortcut.command !== 'string') {
            throw `'command' property of shortcut #${(i+1)} misconfigured`;
        }

        var keys = shortcut.keys.split('+');
        for (var j in keys) {
            if (typeof inputCodes[keys[j]] === 'undefined') {
                throw `Unknown '${keys[j]}' key code in shortcut #${(i+1)}`;
            }
            if (typeof pointer[inputCodes[keys[j]]] === 'undefined') {
                pointer[inputCodes[keys[j]]] = {};
            }
            pointer = pointer[inputCodes[keys[j]]];
        }

        if (shortcut.release === true) {
        	pointer[-1] = {};
        	pointer = pointer[-1];
        }

        pointer.command = shortcut.command;
        pointer.blocking = typeof shortcut.blocking !== 'undefined' 
            ? shortcut.blocking : false;
        
    }

    config.shortcuts = normalizedShortcuts;

    return config;
}
