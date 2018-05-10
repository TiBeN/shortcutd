shortcutd
=========

Launch commands when pressing keys combinations. Key features:

-   Reads Kernel input device nodes directly so there is no need of any
    graphical environment and works whatever the launched software
    stack.

-   Support for blocking and non blocking commands spawns.

-   Resilient to keyboard hotplugs. You can plug your keyboard only when
    needed. There is no need for it to be plugged when `shortcutd` is
    launched.

`shortcutd` is a daemon written in `NodeJS`. It works on **Linux** and
has been designed to execute low level/administrative commands like
`systemctl start some.service` using keyboard shortcuts, on headless or
embedded systems for example but is obviously not limited to.

Installation
------------

    $ npm install -g shortcutd

Configuration
-------------

shortcutd is configured via a JSON configuration file. Here is a simple
working configuration file:

    {
        "device": "/dev/input/by-id/usb-Logitech_USB_Keyboard-event-kbd",
        "shortcuts": [{
            "keys": "KEY_LEFTCTRL+KEY_LEFTALT+KEY_1",
            "blocking": true,
            "command": "echo Hello World!; sleep 5" 
        }, {
            "keys": "KEY_LEFTCTRL+KEY_LEFTALT+KEY_2",
            "blocking": false,
            "command": "echo Hello World!"
        },]
    }

### Device node

The input device node path of the keyboard must be specified via the
`device` property. Input device nodes are generaly located in
`/dev/input/`. If you are not sure which device node corresponds to the
keyboard you want to use — on some systems they are simply labeled
`event[0-9]+` — you can try them one by one by launching `shortcutd` in
verbose mode and see if pressed keys are displayed to your terminal (see
`Usage` below).

About (un|re)plug resilience: It is important for `shortcutd` to be able
to detect your keyboard when (re)plugged that the device node has the
same path. It is sometimes the case, like links inside the
`/dev/input/by-id` subdirectory. If not, this can be configured nowadays
on Linux systems through [`udev`](https://en.wikipedia.org/wiki/Udev)
rules.

Device nodes are only readable by `root` by default. This can be
configured with `udev` rules too.

### Shortcuts configuration

Shortcuts are configured inside the `shortcuts` property. Each shortcut
configuration object is defined by theses three properties:

#### keys

Define the keys combinations that will spawn the command when pressed.
Each key is separated by a `+` char. You can launch `shortcutd` in
verbose mode without any shortcuts configured to print the codes of the
keys in your terminal when they are pressed.

#### blocking

Tell `shortcutd` to wait (blocking) for the command to finish once
spawned before allowing the user to spawn it again.

#### command

The command to spawn when the keys combinations are pressed

Usage
-----

    $ shortcutd [-v] <config-file>

`-v` option enables verbose mode. Additionnaly to common verbose logs,
every keys press/releases events are logged. This is especially useful
to test device nodes and to get the name of the key codes.

`shortcutd` does not daemonize itself but can easily be launched like a
systemd service:

    [Unit]
    Description=Shortcutd

    [Install]
    WantedBy=multi-user.target

    [Service]
    ExecStart=/usr/bin/shortcutd /usr/local/etc/shortcutd.json

Known issues and improvments
----------------------------

-   `shortcutd` could be able to read input device events of others
    devices than keyboards (mouses, joysticks..) but only keyboard
    kernel event codes have been implemented.

-   Only english key mappings are supported. It means pressing a `a`
    char using an azerty keyboard is recorded as a `q` char. If key
    codes are configured as appearing in verbose mode this should not be
    an issue.

Contributions
-------------

... are welcome :)
