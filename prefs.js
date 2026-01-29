import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class GtkThemeCustomizerPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        // Main Page
        const page = new Adw.PreferencesPage({
            title: 'Pengaturan',
            icon_name: 'preferences-system-symbolic',
        });
        window.add(page);

        // Button Size Group
        const sizeGroup = new Adw.PreferencesGroup({
            title: 'Ukuran Tombol',
            description: 'Konfigurasi ukuran dan jarak tombol window',
        });
        page.add(sizeGroup);

        // Icon Size
        const iconSizeRow = new Adw.SpinRow({
            title: 'Ukuran Ikon',
            subtitle: 'Ukuran ikon dalam piksel',
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
            title: 'Border Radius',
            subtitle: 'Kelengkungan sudut tombol (0 = kotak, 999 = bulat penuh)',
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
            title: 'Padding Tombol',
            subtitle: 'Ruang dalam tombol di sekitar ikon',
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
            title: 'Margin Tombol',
            text: settings.get_string('button-margin'),
        });
        marginRow.connect('changed', (entry) => {
            settings.set_string('button-margin', entry.get_text());
        });
        sizeGroup.add(marginRow);

        // Button Background Color
        const buttonBgRow = this._createColorRow(
            'Background Tombol Default',
            'Warna background default untuk semua tombol',
            settings,
            'button-bg-color'
        );
        sizeGroup.add(buttonBgRow);

        // GTK 3 Specific Settings Group
        const gtk3Group = new Adw.PreferencesGroup({
            title: 'Pengaturan GTK 3',
            description: 'Konfigurasi khusus untuk aplikasi GTK 3',
        });
        page.add(gtk3Group);

        const gtk3MinHeightRow = new Adw.SpinRow({
            title: 'Min Height Tombol',
            subtitle: 'Tinggi minimum tombol GTK 3',
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
            title: 'Min Width Tombol',
            subtitle: 'Lebar minimum tombol GTK 3',
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
            title: 'Margin Top',
            subtitle: 'Margin atas tombol GTK 3',
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
            title: 'Margin Bottom',
            subtitle: 'Margin bawah tombol GTK 3',
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
            title: 'Margin Left',
            subtitle: 'Margin kiri tombol GTK 3',
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
            title: 'Margin Right',
            subtitle: 'Margin kanan tombol GTK 3',
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
            title: 'Skala Ikon',
            subtitle: 'Faktor skala untuk ikon GTK 3 (1.0 = normal)',
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
            title: 'Tombol Close',
            description: 'Warna dan opacity untuk tombol close',
        });
        page.add(closeGroup);

        const closeColorRow = this._createColorRow(
            'Warna Close',
            'Warna utama untuk tombol close',
            settings,
            'close-color'
        );
        closeGroup.add(closeColorRow);

        const closeBgOpacityRow = new Adw.SpinRow({
            title: 'Opacity Background',
            subtitle: 'Transparansi background normal (0.0 - 1.0)',
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
            title: 'Opacity Hover',
            subtitle: 'Transparansi background saat hover (0.0 - 1.0)',
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
            title: 'Tombol Minimize',
            description: 'Warna dan opacity untuk tombol minimize',
        });
        page.add(minimizeGroup);

        const minimizeColorRow = this._createColorRow(
            'Warna Minimize',
            'Warna utama untuk tombol minimize',
            settings,
            'minimize-color'
        );
        minimizeGroup.add(minimizeColorRow);

        const minimizeBgOpacityRow = new Adw.SpinRow({
            title: 'Opacity Background',
            subtitle: 'Transparansi background normal (0.0 - 1.0)',
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
            title: 'Opacity Hover',
            subtitle: 'Transparansi background saat hover (0.0 - 1.0)',
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
            title: 'Tombol Maximize',
            description: 'Warna dan opacity untuk tombol maximize',
        });
        page.add(maximizeGroup);

        const maximizeColorRow = this._createColorRow(
            'Warna Maximize',
            'Warna utama untuk tombol maximize',
            settings,
            'maximize-color'
        );
        maximizeGroup.add(maximizeColorRow);

        const maximizeBgOpacityRow = new Adw.SpinRow({
            title: 'Opacity Background',
            subtitle: 'Transparansi background normal (0.0 - 1.0)',
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
            title: 'Opacity Hover',
            subtitle: 'Transparansi background saat hover (0.0 - 1.0)',
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
            title: 'Aksi',
        });
        page.add(actionsGroup);

        const resetRow = new Adw.ActionRow({
            title: 'Reset ke Default',
            subtitle: 'Kembalikan semua pengaturan ke nilai default',
        });
        const resetButton = new Gtk.Button({
            label: 'Reset',
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
            text: 'Reset ke Default?',
            secondary_text: 'Ini akan mengembalikan semua pengaturan ke nilai default.',
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
}
