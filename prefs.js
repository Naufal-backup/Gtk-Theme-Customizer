import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class GtkThemeCustomizerPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        // Main Page
        const page = new Adw.PreferencesPage({
            title: _('Settings'),
            icon_name: 'preferences-system-symbolic',
        });
        window.add(page);

        // Button Size Group
        const sizeGroup = new Adw.PreferencesGroup({
            title: _('Button Size'),
            description: _('Configure button size and spacing'),
        });
        page.add(sizeGroup);

        // Icon Size
        const iconSizeRow = new Adw.SpinRow({
            title: _('Icon Size'),
            subtitle: _('Icon size in pixels'),
            adjustment: new Gtk.Adjustment({
                lower: 16,
                upper: 48,
                step_increment: 1,
                page_increment: 5,
            }),
        });
        settings.bind('icon-size', iconSizeRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        sizeGroup.add(iconSizeRow);

        // Border Radius
        const borderRadiusRow = new Adw.SpinRow({
            title: _('Border Radius'),
            subtitle: _('Button corner roundness (0 = square, 999 = fully rounded)'),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 999,
                step_increment: 1,
                page_increment: 10,
            }),
        });
        settings.bind('border-radius', borderRadiusRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        sizeGroup.add(borderRadiusRow);

        // Button Padding
        const paddingRow = new Adw.SpinRow({
            title: _('Button Padding'),
            subtitle: _('Inner space around icon'),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 20,
                step_increment: 1,
                page_increment: 2,
            }),
        });
        settings.bind('button-padding', paddingRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        sizeGroup.add(paddingRow);

        // Button Margin
        const marginRow = new Adw.EntryRow({
            title: _('Button Margin'),
            text: settings.get_string('button-margin'),
        });
        marginRow.connect('changed', (entry) => {
            settings.set_string('button-margin', entry.get_text());
        });
        sizeGroup.add(marginRow);

        // Button Background Color
        const buttonBgRow = this._createColorRow(
            _('Default Button Background'),
            _('Default background color for all buttons'),
            settings,
            'button-bg-color'
        );
        sizeGroup.add(buttonBgRow);

        // GTK 3 Specific Settings Group
        const gtk3Group = new Adw.PreferencesGroup({
            title: _('GTK 3 Settings'),
            description: _('Specific configuration for GTK 3 applications'),
        });
        page.add(gtk3Group);

        const gtk3MinHeightRow = new Adw.SpinRow({
            title: _('Button Min Height'),
            subtitle: _('Minimum height for GTK 3 buttons'),
            adjustment: new Gtk.Adjustment({
                lower: 20,
                upper: 60,
                step_increment: 1,
                page_increment: 5,
            }),
        });
        settings.bind('gtk3-min-height', gtk3MinHeightRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        gtk3Group.add(gtk3MinHeightRow);

        const gtk3MinWidthRow = new Adw.SpinRow({
            title: _('Button Min Width'),
            subtitle: _('Minimum width for GTK 3 buttons'),
            adjustment: new Gtk.Adjustment({
                lower: 20,
                upper: 60,
                step_increment: 1,
                page_increment: 5,
            }),
        });
        settings.bind('gtk3-min-width', gtk3MinWidthRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        gtk3Group.add(gtk3MinWidthRow);

        const gtk3MarginTopRow = new Adw.SpinRow({
            title: _('Margin Top'),
            subtitle: _('Top margin for GTK 3 buttons'),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 20,
                step_increment: 1,
                page_increment: 2,
            }),
        });
        settings.bind('gtk3-margin-top', gtk3MarginTopRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        gtk3Group.add(gtk3MarginTopRow);

        const gtk3MarginBottomRow = new Adw.SpinRow({
            title: _('Margin Bottom'),
            subtitle: _('Bottom margin for GTK 3 buttons'),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 20,
                step_increment: 1,
                page_increment: 2,
            }),
        });
        settings.bind('gtk3-margin-bottom', gtk3MarginBottomRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        gtk3Group.add(gtk3MarginBottomRow);

        const gtk3MarginLeftRow = new Adw.SpinRow({
            title: _('Margin Left'),
            subtitle: _('Left margin for GTK 3 buttons'),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 20,
                step_increment: 1,
                page_increment: 2,
            }),
        });
        settings.bind('gtk3-margin-left', gtk3MarginLeftRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        gtk3Group.add(gtk3MarginLeftRow);

        const gtk3MarginRightRow = new Adw.SpinRow({
            title: _('Margin Right'),
            subtitle: _('Right margin for GTK 3 buttons'),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 20,
                step_increment: 1,
                page_increment: 2,
            }),
        });
        settings.bind('gtk3-margin-right', gtk3MarginRightRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        gtk3Group.add(gtk3MarginRightRow);

        const gtk3IconScaleRow = new Adw.SpinRow({
            title: _('Icon Scale'),
            subtitle: _('Scale factor for GTK 3 icons (1.0 = normal)'),
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0.5,
                upper: 3.0,
                step_increment: 0.1,
                page_increment: 0.5,
            }),
        });
        settings.bind('gtk3-icon-scale', gtk3IconScaleRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        gtk3Group.add(gtk3IconScaleRow);

        // Close Button Group
        const closeGroup = new Adw.PreferencesGroup({
            title: _('Close Button'),
            description: _('Color and opacity for close button'),
        });
        page.add(closeGroup);

        const closeColorRow = this._createColorRow(
            _('Close Color'),
            _('Main color for close button'),
            settings,
            'close-color'
        );
        closeGroup.add(closeColorRow);

        const closeBgOpacityRow = new Adw.SpinRow({
            title: _('Background Opacity'),
            subtitle: _('Normal background transparency (0.0 - 1.0)'),
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0.0,
                upper: 1.0,
                step_increment: 0.05,
                page_increment: 0.1,
            }),
        });
        settings.bind('close-bg-opacity', closeBgOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        closeGroup.add(closeBgOpacityRow);

        const closeHoverOpacityRow = new Adw.SpinRow({
            title: _('Hover Opacity'),
            subtitle: _('Background transparency on hover (0.0 - 1.0)'),
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0.0,
                upper: 1.0,
                step_increment: 0.05,
                page_increment: 0.1,
            }),
        });
        settings.bind('close-hover-opacity', closeHoverOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        closeGroup.add(closeHoverOpacityRow);

        // Minimize Button Group
        const minimizeGroup = new Adw.PreferencesGroup({
            title: _('Minimize Button'),
            description: _('Color and opacity for minimize button'),
        });
        page.add(minimizeGroup);

        const minimizeColorRow = this._createColorRow(
            _('Minimize Color'),
            _('Main color for minimize button'),
            settings,
            'minimize-color'
        );
        minimizeGroup.add(minimizeColorRow);

        const minimizeBgOpacityRow = new Adw.SpinRow({
            title: _('Background Opacity'),
            subtitle: _('Normal background transparency (0.0 - 1.0)'),
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0.0,
                upper: 1.0,
                step_increment: 0.05,
                page_increment: 0.1,
            }),
        });
        settings.bind('minimize-bg-opacity', minimizeBgOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        minimizeGroup.add(minimizeBgOpacityRow);

        const minimizeHoverOpacityRow = new Adw.SpinRow({
            title: _('Hover Opacity'),
            subtitle: _('Background transparency on hover (0.0 - 1.0)'),
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0.0,
                upper: 1.0,
                step_increment: 0.05,
                page_increment: 0.1,
            }),
        });
        settings.bind('minimize-hover-opacity', minimizeHoverOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        minimizeGroup.add(minimizeHoverOpacityRow);

        // Maximize Button Group
        const maximizeGroup = new Adw.PreferencesGroup({
            title: _('Maximize Button'),
            description: _('Color and opacity for maximize button'),
        });
        page.add(maximizeGroup);

        const maximizeColorRow = this._createColorRow(
            _('Maximize Color'),
            _('Main color for maximize button'),
            settings,
            'maximize-color'
        );
        maximizeGroup.add(maximizeColorRow);

        const maximizeBgOpacityRow = new Adw.SpinRow({
            title: _('Background Opacity'),
            subtitle: _('Normal background transparency (0.0 - 1.0)'),
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0.0,
                upper: 1.0,
                step_increment: 0.05,
                page_increment: 0.1,
            }),
        });
        settings.bind('maximize-bg-opacity', maximizeBgOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        maximizeGroup.add(maximizeBgOpacityRow);

        const maximizeHoverOpacityRow = new Adw.SpinRow({
            title: _('Hover Opacity'),
            subtitle: _('Background transparency on hover (0.0 - 1.0)'),
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0.0,
                upper: 1.0,
                step_increment: 0.05,
                page_increment: 0.1,
            }),
        });
        settings.bind('maximize-hover-opacity', maximizeHoverOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        maximizeGroup.add(maximizeHoverOpacityRow);

        // Reset Button
        const actionsGroup = new Adw.PreferencesGroup({
            title: _('Actions'),
        });
        page.add(actionsGroup);

        // Apply to Root Button
        const applyToRootRow = new Adw.ActionRow({
            title: _('Apply to Root'),
            subtitle: _('Copy themes and GTK configurations to root user'),
        });
        const applyToRootButton = new Gtk.Button({
            label: _('Apply'),
            valign: Gtk.Align.CENTER,
            css_classes: ['suggested-action'],
        });
        applyToRootButton.connect('clicked', () => {
            this._applyToRoot(window);
        });
        applyToRootRow.add_suffix(applyToRootButton);
        actionsGroup.add(applyToRootRow);

        const resetRow = new Adw.ActionRow({
            title: _('Reset to Default'),
            subtitle: _('Restore all settings to default values'),
        });
        const resetButton = new Gtk.Button({
            label: _('Reset'),
            valign: Gtk.Align.CENTER,
            css_classes: ['destructive-action'],
        });
        resetButton.connect('clicked', () => {
            this._resetToDefaults(settings);
        });
        resetRow.add_suffix(resetButton);
        actionsGroup.add(resetRow);
    }

    _createColorRow(title, subtitle, settings, key) {
        const row = new Adw.ActionRow({
            title: title,
            subtitle: subtitle,
        });

        const colorButton = new Gtk.ColorButton({
            valign: Gtk.Align.CENTER,
        });

        // Set initial color
        const hexColor = settings.get_string(key);
        const rgba = new Gdk.RGBA();
        rgba.parse(hexColor);
        colorButton.set_rgba(rgba);

        // Connect color change
        colorButton.connect('color-set', () => {
            const color = colorButton.get_rgba();
            const hex = this._rgbaToHex(color);
            settings.set_string(key, hex);
        });

        row.add_suffix(colorButton);
        return row;
    }

    _rgbaToHex(rgba) {
        const r = Math.round(rgba.red * 255);
        const g = Math.round(rgba.green * 255);
        const b = Math.round(rgba.blue * 255);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    _resetToDefaults(settings) {
        const dialog = new Gtk.MessageDialog({
            text: _('Reset to Default?'),
            secondary_text: _('This will restore all settings to their default values.'),
            message_type: Gtk.MessageType.WARNING,
            buttons: Gtk.ButtonsType.OK_CANCEL,
            modal: true,
        });

        dialog.connect('response', (widget, response) => {
            if (response === Gtk.ResponseType.OK) {
                // Reset all settings
                settings.reset('icon-size');
                settings.reset('border-radius');
                settings.reset('button-padding');
                settings.reset('button-margin');
                settings.reset('button-bg-color');
                
                settings.reset('close-color');
                settings.reset('close-bg-opacity');
                settings.reset('close-hover-opacity');
                
                settings.reset('minimize-color');
                settings.reset('minimize-bg-opacity');
                settings.reset('minimize-hover-opacity');
                
                settings.reset('maximize-color');
                settings.reset('maximize-bg-opacity');
                settings.reset('maximize-hover-opacity');
                
                settings.reset('gtk3-min-height');
                settings.reset('gtk3-min-width');
                settings.reset('gtk3-margin-top');
                settings.reset('gtk3-margin-bottom');
                settings.reset('gtk3-margin-left');
                settings.reset('gtk3-margin-right');
                settings.reset('gtk3-icon-scale');
            }
            dialog.destroy();
        });

        dialog.show();
    }

    _applyToRoot(window) {
        const dialog = new Gtk.MessageDialog({
            text: _('Apply to Root User?'),
            secondary_text: _('This will copy your themes and GTK configurations to the root user, including your current theme and dark/light mode settings. You will be prompted for your password.'),
            message_type: Gtk.MessageType.QUESTION,
            buttons: Gtk.ButtonsType.OK_CANCEL,
            modal: true,
            transient_for: window,
        });

        dialog.connect('response', (widget, response) => {
            if (response === Gtk.ResponseType.OK) {
                const scriptPath = GLib.build_filenamev([this.path, 'apply-to-root.sh']);
                const homeDir = GLib.get_home_dir();
                const userName = GLib.get_user_name();
                
                try {
                    // Run the script with pkexec
                    const [success, pid] = GLib.spawn_async(
                        null,
                        ['pkexec', scriptPath, homeDir, userName],
                        null,
                        GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD,
                        null
                    );

                    if (success) {
                        GLib.child_watch_add(GLib.PRIORITY_DEFAULT, pid, (pid, status) => {
                            if (status === 0) {
                                this._showInfoDialog(
                                    window,
                                    _('Success'),
                                    _('Themes and configurations have been successfully applied to root user.')
                                );
                            } else {
                                this._showInfoDialog(
                                    window,
                                    _('Error'),
                                    _('Failed to apply configurations to root. Please check if the script has proper permissions.')
                                );
                            }
                            GLib.spawn_close_pid(pid);
                        });
                    }
                } catch (e) {
                    this._showInfoDialog(
                        window,
                        _('Error'),
                        _('Failed to run the apply script: ') + e.message
                    );
                }
            }
            dialog.destroy();
        });

        dialog.show();
    }

    _showInfoDialog(window, title, message) {
        const dialog = new Gtk.MessageDialog({
            text: title,
            secondary_text: message,
            message_type: Gtk.MessageType.INFO,
            buttons: Gtk.ButtonsType.OK,
            modal: true,
            transient_for: window,
        });

        dialog.connect('response', () => {
            dialog.destroy();
        });

        dialog.show();
    }
}
