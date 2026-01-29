#!/usr/bin/env -S gjs -m

import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk?version=4.0';
import Adw from 'gi://Adw?version=1';
import System from 'system';

import { GtkThemeCustomizerWindow } from './window.js';

const APP_ID = 'com.github.naufal453.GtkThemeCustomizer';

const GtkThemeCustomizerApplication = GObject.registerClass(
class GtkThemeCustomizerApplication extends Adw.Application {
    constructor() {
        super({
            application_id: APP_ID,
            flags: Gio.ApplicationFlags.DEFAULT_FLAGS,
        });
    }

    vfunc_activate() {
        let window = this.active_window;
        if (!window) {
            window = new GtkThemeCustomizerWindow(this);
        }
        window.present();
    }
});

const app = new GtkThemeCustomizerApplication();
const exitCode = app.run([System.programInvocationName, ...ARGV]);
System.exit(exitCode);
