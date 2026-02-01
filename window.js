import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';

const APP_ID = 'com.github.naufal453.GtkThemeCustomizer';
const SCHEMA_ID = 'org.gnome.shell.extensions.gtk-theme-customizer';

function _(str) {
    return str;
}

export const GtkThemeCustomizerWindow = GObject.registerClass(
class GtkThemeCustomizerWindow extends Adw.PreferencesWindow {
    constructor(application) {
        super({
            application: application,
            title: _('GTK Theme Customizer'),
            default_width: 700,
            default_height: 800,
            search_enabled: true,
        });

        // Get or create settings
        this._settings = this._getSettings();
        
        // Connect to settings changes
        this._settingsChangedId = this._settings.connect('changed', () => {
            this._updateCssFiles();
        });
        
        // Build UI
        this._buildUI();
        
        // Initial CSS generation
        this._updateCssFiles();
    }

    _getSettings() {
        const schemaDir = '/usr/share/gtk-theme-customizer/schemas';
        const schemaSource = Gio.SettingsSchemaSource.new_from_directory(
            schemaDir,
            Gio.SettingsSchemaSource.get_default(),
            false
        );
        
        const schema = schemaSource.lookup(SCHEMA_ID, false);
        if (!schema) {
            throw new Error(`Schema ${SCHEMA_ID} not found`);
        }
        
        return new Gio.Settings({ settings_schema: schema });
    }

    _buildUI() {
        // Main Page
        const page = new Adw.PreferencesPage({
            title: _('Settings'),
            icon_name: 'preferences-system-symbolic',
        });
        this.add(page);

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
        this._settings.bind('icon-size', iconSizeRow, 'value', Gio.SettingsBindFlags.DEFAULT);
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
        this._settings.bind('border-radius', borderRadiusRow, 'value', Gio.SettingsBindFlags.DEFAULT);
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
        this._settings.bind('button-padding', paddingRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        sizeGroup.add(paddingRow);

        // GTK 4 Specific Settings Group
        const gtk4Group = new Adw.PreferencesGroup({
            title: _('GTK 4 Settings'),
            description: _('Specific configuration for GTK 4 applications'),
        });
        page.add(gtk4Group);

        const gtk4MarginTopRow = new Adw.SpinRow({
            title: _('Margin Top'),
            subtitle: _('Top margin for GTK 4 buttons'),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 20,
                step_increment: 1,
                page_increment: 2,
            }),
        });
        this._settings.bind('gtk4-margin-top', gtk4MarginTopRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        gtk4Group.add(gtk4MarginTopRow);

        const gtk4MarginBottomRow = new Adw.SpinRow({
            title: _('Margin Bottom'),
            subtitle: _('Bottom margin for GTK 4 buttons'),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 20,
                step_increment: 1,
                page_increment: 2,
            }),
        });
        this._settings.bind('gtk4-margin-bottom', gtk4MarginBottomRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        gtk4Group.add(gtk4MarginBottomRow);

        const gtk4MarginLeftRow = new Adw.SpinRow({
            title: _('Margin Left'),
            subtitle: _('Left margin for GTK 4 buttons'),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 20,
                step_increment: 1,
                page_increment: 2,
            }),
        });
        this._settings.bind('gtk4-margin-left', gtk4MarginLeftRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        gtk4Group.add(gtk4MarginLeftRow);

        const gtk4MarginRightRow = new Adw.SpinRow({
            title: _('Margin Right'),
            subtitle: _('Right margin for GTK 4 buttons'),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 20,
                step_increment: 1,
                page_increment: 2,
            }),
        });
        this._settings.bind('gtk4-margin-right', gtk4MarginRightRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        gtk4Group.add(gtk4MarginRightRow);

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
        this._settings.bind('gtk3-min-height', gtk3MinHeightRow, 'value', Gio.SettingsBindFlags.DEFAULT);
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
        this._settings.bind('gtk3-min-width', gtk3MinWidthRow, 'value', Gio.SettingsBindFlags.DEFAULT);
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
        this._settings.bind('gtk3-margin-top', gtk3MarginTopRow, 'value', Gio.SettingsBindFlags.DEFAULT);
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
        this._settings.bind('gtk3-margin-bottom', gtk3MarginBottomRow, 'value', Gio.SettingsBindFlags.DEFAULT);
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
        this._settings.bind('gtk3-margin-left', gtk3MarginLeftRow, 'value', Gio.SettingsBindFlags.DEFAULT);
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
        this._settings.bind('gtk3-margin-right', gtk3MarginRightRow, 'value', Gio.SettingsBindFlags.DEFAULT);
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
        this._settings.bind('gtk3-icon-scale', gtk3IconScaleRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        gtk3Group.add(gtk3IconScaleRow);

        // Header Size Group
        const headerGroup = new Adw.PreferencesGroup({
            title: _('Header Size'),
            description: _('Configure headerbar dimensions (applies to both GTK 3 and GTK 4)'),
        });
        page.add(headerGroup);

        const headerMaxHeightRow = new Adw.SpinRow({
            title: _('Max Height'),
            subtitle: _('Maximum height for headerbar'),
            adjustment: new Gtk.Adjustment({
                lower: 30,
                upper: 80,
                step_increment: 1,
                page_increment: 5,
            }),
        });
        this._settings.bind('header-max-height', headerMaxHeightRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        headerGroup.add(headerMaxHeightRow);

        // Titlebar Text Mode
        const titlebarTextModeRow = new Adw.ComboRow({
            title: _('Titlebar Text Mode'),
            subtitle: _('Control how titlebar text is displayed'),
        });
        
        const titlebarTextModel = new Gtk.StringList();
        titlebarTextModel.append(_('Show'));
        titlebarTextModel.append(_('Hide'));
        titlebarTextModel.append(_('Follow App Name'));
        titlebarTextModeRow.set_model(titlebarTextModel);
        
        // Set initial selection
        const currentMode = this._settings.get_string('titlebar-text-mode');
        if (currentMode === 'show') {
            titlebarTextModeRow.set_selected(0);
        } else if (currentMode === 'hide') {
            titlebarTextModeRow.set_selected(1);
        } else if (currentMode === 'wmclass') {
            titlebarTextModeRow.set_selected(2);
        }
        
        // Connect change handler
        titlebarTextModeRow.connect('notify::selected', () => {
            const selected = titlebarTextModeRow.get_selected();
            if (selected === 0) {
                this._settings.set_string('titlebar-text-mode', 'show');
            } else if (selected === 1) {
                this._settings.set_string('titlebar-text-mode', 'hide');
            } else if (selected === 2) {
                this._settings.set_string('titlebar-text-mode', 'wmclass');
            }
        });
        
        headerGroup.add(titlebarTextModeRow);

        // Custom Icons Group
        const customIconsGroup = new Adw.PreferencesGroup({
            title: _('Custom Icons'),
            description: _('Use custom PNG images or SVG code for window control buttons'),
        });
        page.add(customIconsGroup);

        // Use Custom Icons Switch
        const useCustomIconsRow = new Adw.SwitchRow({
            title: _('Use Custom Icons'),
            subtitle: _('Enable custom PNG icons or SVG code instead of theme icons'),
        });
        this._settings.bind('use-custom-icons', useCustomIconsRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        customIconsGroup.add(useCustomIconsRow);

        // Icon Opacity
        const iconOpacityRow = new Adw.SpinRow({
            title: _('Icon Opacity'),
            subtitle: _('Transparency of custom icons (0.0 = transparent, 1.0 = opaque)'),
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0.0,
                upper: 1.0,
                step_increment: 0.05,
                page_increment: 0.1,
            }),
        });
        this._settings.bind('custom-icon-opacity', iconOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        customIconsGroup.add(iconOpacityRow);

        // Icon Hover Opacity
        const iconHoverOpacityRow = new Adw.SpinRow({
            title: _('Icon Hover Opacity'),
            subtitle: _('Transparency of custom icons on hover (0.0 = transparent, 1.0 = opaque)'),
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0.0,
                upper: 1.0,
                step_increment: 0.05,
                page_increment: 0.1,
            }),
        });
        this._settings.bind('custom-icon-hover-opacity', iconHoverOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        customIconsGroup.add(iconHoverOpacityRow);

        // Close Button Icon
        this._createIconExpanderRow(
            customIconsGroup,
            _('Close Button Icon'),
            _('Choose PNG file or paste SVG code'),
            'close'
        );

        // Minimize Button Icon
        this._createIconExpanderRow(
            customIconsGroup,
            _('Minimize Button Icon'),
            _('Choose PNG file or paste SVG code'),
            'minimize'
        );

        // Maximize Button Icon
        this._createIconExpanderRow(
            customIconsGroup,
            _('Maximize Button Icon'),
            _('Choose PNG file or paste SVG code'),
            'maximize'
        );

        // Close Button Group
        const closeGroup = new Adw.PreferencesGroup({
            title: _('Close Button'),
            description: _('Color and opacity for close button'),
        });
        page.add(closeGroup);

        const closeColorRow = this._createColorRow(
            _('Background Color'),
            _('Background color for close button'),
            'close-color'
        );
        closeGroup.add(closeColorRow);

        const closeIconColorRow = this._createColorRow(
            _('Icon Color'),
            _('Icon/foreground color for close button'),
            'close-icon-color'
        );
        closeGroup.add(closeIconColorRow);

        // Minimize Button Group
        const minimizeGroup = new Adw.PreferencesGroup({
            title: _('Minimize Button'),
            description: _('Color and opacity for minimize button'),
        });
        page.add(minimizeGroup);

        const minimizeColorRow = this._createColorRow(
            _('Background Color'),
            _('Background color for minimize button'),
            'minimize-color'
        );
        minimizeGroup.add(minimizeColorRow);

        const minimizeIconColorRow = this._createColorRow(
            _('Icon Color'),
            _('Icon/foreground color for minimize button'),
            'minimize-icon-color'
        );
        minimizeGroup.add(minimizeIconColorRow);

        // Maximize Button Group
        const maximizeGroup = new Adw.PreferencesGroup({
            title: _('Maximize Button'),
            description: _('Color and opacity for maximize button'),
        });
        page.add(maximizeGroup);

        const maximizeColorRow = this._createColorRow(
            _('Maximize Color'),
            _('Background color for maximize button'),
            'maximize-color'
        );
        maximizeGroup.add(maximizeColorRow);

        const maximizeIconColorRow = this._createColorRow(
            _('Icon Color'),
            _('Icon/foreground color for maximize button'),
            'maximize-icon-color'
        );
        maximizeGroup.add(maximizeIconColorRow);

        // Actions Group
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
            this._applyToRoot();
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
            this._resetToDefaults();
        });
        resetRow.add_suffix(resetButton);
        actionsGroup.add(resetRow);
    }

    _createColorRow(title, subtitle, key) {
        const row = new Adw.ActionRow({
            title: title,
            subtitle: subtitle,
        });

        const colorButton = new Gtk.ColorButton({
            valign: Gtk.Align.CENTER,
        });

        // Set initial color
        const hexColor = this._settings.get_string(key);
        const rgba = new Gdk.RGBA();
        rgba.parse(hexColor);
        colorButton.set_rgba(rgba);

        // Connect color change
        colorButton.connect('color-set', () => {
            const color = colorButton.get_rgba();
            const hex = this._rgbaToHex(color);
            this._settings.set_string(key, hex);
        });

        row.add_suffix(colorButton);
        return row;
    }

    _createIconFileRow(title, subtitle, key) {
        const row = new Adw.ActionRow({
            title: title,
            subtitle: subtitle,
        });

        // Create a box to hold both the file path label and buttons
        const box = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 6,
            valign: Gtk.Align.CENTER,
        });

        // File path label
        const fileLabel = new Gtk.Label({
            label: this._settings.get_string(key) || _('No file selected'),
            ellipsize: 3, // PANGO_ELLIPSIZE_END
            max_width_chars: 20,
            xalign: 1,
        });
        box.append(fileLabel);

        // Clear button
        const clearButton = new Gtk.Button({
            icon_name: 'edit-clear-symbolic',
            tooltip_text: _('Clear icon'),
            css_classes: ['flat'],
        });
        clearButton.connect('clicked', () => {
            this._settings.set_string(key, '');
            fileLabel.set_label(_('No file selected'));
        });
        box.append(clearButton);

        // Choose file button
        const chooseButton = new Gtk.Button({
            icon_name: 'document-open-symbolic',
            tooltip_text: _('Choose icon file'),
            css_classes: ['flat'],
        });
        chooseButton.connect('clicked', () => {
            this._selectIconFile(key, fileLabel);
        });
        box.append(chooseButton);

        row.add_suffix(box);
        return row;
    }

    _createIconExpanderRow(group, title, subtitle, buttonType) {
        const expanderRow = new Adw.ExpanderRow({
            title: title,
            subtitle: subtitle,
        });
        group.add(expanderRow);

        // Icon Size for this button
        const iconSizeRow = new Adw.SpinRow({
            title: _('Icon Size'),
            subtitle: _('Size for this button icon in pixels'),
            adjustment: new Gtk.Adjustment({
                lower: 16,
                upper: 64,
                step_increment: 1,
                page_increment: 5,
            }),
        });
        const sizeKey = `${buttonType}-icon-size`;
        this._settings.bind(sizeKey, iconSizeRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        expanderRow.add_row(iconSizeRow);

        // Background Opacity for this button
        const bgOpacityRow = new Adw.SpinRow({
            title: _('Background Opacity'),
            subtitle: _('Opacity of button background (0.0 = transparent, 1.0 = opaque)'),
            digits: 2,
            adjustment: new Gtk.Adjustment({
                lower: 0.0,
                upper: 1.0,
                step_increment: 0.05,
                page_increment: 0.1,
            }),
        });
        const opacityKey = `${buttonType}-bg-opacity`;
        this._settings.bind(opacityKey, bgOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        expanderRow.add_row(bgOpacityRow);

        // PNG File Option
        const pngRow = new Adw.ActionRow({
            title: _('PNG File'),
            subtitle: _('Select a PNG image file'),
        });

        const pngBox = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 6,
            valign: Gtk.Align.CENTER,
        });

        const pathKey = `${buttonType}-icon-path`;
        const fileLabel = new Gtk.Label({
            label: this._settings.get_string(pathKey) || _('No file'),
            ellipsize: 3,
            max_width_chars: 15,
            xalign: 1,
        });
        pngBox.append(fileLabel);

        const clearPngButton = new Gtk.Button({
            icon_name: 'edit-clear-symbolic',
            tooltip_text: _('Clear'),
            css_classes: ['flat'],
        });
        clearPngButton.connect('clicked', () => {
            this._settings.set_string(pathKey, '');
            fileLabel.set_label(_('No file'));
        });
        pngBox.append(clearPngButton);

        const choosePngButton = new Gtk.Button({
            icon_name: 'document-open-symbolic',
            tooltip_text: _('Choose PNG file'),
            css_classes: ['flat'],
        });
        choosePngButton.connect('clicked', () => {
            this._selectIconFile(pathKey, fileLabel);
        });
        pngBox.append(choosePngButton);

        pngRow.add_suffix(pngBox);
        expanderRow.add_row(pngRow);

        // SVG Code Option
        const svgRow = new Adw.ActionRow({
            title: _('SVG Code'),
            subtitle: _('Paste SVG code directly'),
        });

        const svgBox = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 6,
            valign: Gtk.Align.CENTER,
        });

        const svgKey = `${buttonType}-icon-svg`;
        const hasSvg = this._settings.get_string(svgKey).length > 0;
        
        const svgStatusLabel = new Gtk.Label({
            label: hasSvg ? _('SVG set') : _('No SVG'),
            ellipsize: 3,
            max_width_chars: 15,
            xalign: 1,
        });
        svgBox.append(svgStatusLabel);

        const clearSvgButton = new Gtk.Button({
            icon_name: 'edit-clear-symbolic',
            tooltip_text: _('Clear SVG'),
            css_classes: ['flat'],
        });
        clearSvgButton.connect('clicked', () => {
            this._settings.set_string(svgKey, '');
            svgStatusLabel.set_label(_('No SVG'));
        });
        svgBox.append(clearSvgButton);

        const editSvgButton = new Gtk.Button({
            icon_name: 'document-edit-symbolic',
            tooltip_text: _('Edit SVG code'),
            css_classes: ['flat'],
        });
        editSvgButton.connect('clicked', () => {
            this._showSvgDialog(svgKey, svgStatusLabel);
        });
        svgBox.append(editSvgButton);

        svgRow.add_suffix(svgBox);
        expanderRow.add_row(svgRow);
    }

    _showSvgDialog(key, statusLabel) {
        const dialog = new Adw.Window({
            title: _('Edit SVG Code'),
            modal: true,
            transient_for: this,
            default_width: 600,
            default_height: 400,
        });

        const toolbarView = new Adw.ToolbarView();
        dialog.set_content(toolbarView);

        const headerBar = new Adw.HeaderBar();
        toolbarView.add_top_bar(headerBar);

        const cancelButton = new Gtk.Button({
            label: _('Cancel'),
        });
        cancelButton.connect('clicked', () => {
            dialog.close();
        });
        headerBar.pack_start(cancelButton);

        const saveButton = new Gtk.Button({
            label: _('Save'),
            css_classes: ['suggested-action'],
        });
        headerBar.pack_end(saveButton);

        const scrolled = new Gtk.ScrolledWindow({
            vexpand: true,
            hexpand: true,
        });

        const textView = new Gtk.TextView({
            monospace: true,
            left_margin: 12,
            right_margin: 12,
            top_margin: 12,
            bottom_margin: 12,
            wrap_mode: Gtk.WrapMode.WORD,
        });

        const buffer = textView.get_buffer();
        buffer.set_text(this._settings.get_string(key), -1);
        
        scrolled.set_child(textView);
        toolbarView.set_content(scrolled);

        saveButton.connect('clicked', () => {
            const [start, end] = buffer.get_bounds();
            const text = buffer.get_text(start, end, false);
            this._settings.set_string(key, text);
            statusLabel.set_label(text.length > 0 ? _('SVG set') : _('No SVG'));
            dialog.close();
        });

        dialog.present();
    }


    _selectIconFile(key, label) {
        const dialog = new Gtk.FileDialog({
            title: _('Select Icon File'),
            modal: true,
        });

        // Create file filter for PNG images
        const pngFilter = new Gtk.FileFilter();
        pngFilter.set_name(_('PNG Images'));
        pngFilter.add_mime_type('image/png');
        pngFilter.add_pattern('*.png');

        const allFilter = new Gtk.FileFilter();
        allFilter.set_name(_('All Files'));
        allFilter.add_pattern('*');

        const filterList = new Gio.ListStore({ item_type: Gtk.FileFilter });
        filterList.append(pngFilter);
        filterList.append(allFilter);
        dialog.set_filters(filterList);
        dialog.set_default_filter(pngFilter);

        dialog.open(this, null, (source, result) => {
            try {
                const file = dialog.open_finish(result);
                if (file) {
                    const path = file.get_path();
                    this._settings.set_string(key, path);
                    label.set_label(GLib.path_get_basename(path));
                }
            } catch (e) {
                if (e.code !== Gtk.DialogError.DISMISSED) {
                    console.error(`Error selecting file: ${e}`);
                }
            }
        });
    }


    _rgbaToHex(rgba) {
        const r = Math.round(rgba.red * 255);
        const g = Math.round(rgba.green * 255);
        const b = Math.round(rgba.blue * 255);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    _escapeSvg(svg, color) {
        // Replace currentColor with actual color
        let processedSvg = svg.replace(/currentColor/g, color || '#000000');
        
        // Escape SVG for use in CSS data URI
        return processedSvg
            .replace(/\n/g, ' ')
            .replace(/\r/g, '')
            .replace(/\t/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/"/g, "'")
            .replace(/#/g, '%23')
            .replace(/</g, '%3C')
            .replace(/>/g, '%3E')
            .replace(/&/g, '%26')
            .trim();
    }

    _hexToRgbaWithOpacity(hex, opacity) {
        // Convert hex color to rgba with opacity
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    _updateCssFiles() {
        const css = this._generateCss();
        
        // Write to GTK 4.0 config
        const gtk4Path = GLib.build_filenamev([GLib.get_home_dir(), '.config', 'gtk-4.0', 'gtk.css']);
        this._writeCssFile(gtk4Path, css.gtk4);
        
        // Write to GTK 3.0 config
        const gtk3Path = GLib.build_filenamev([GLib.get_home_dir(), '.config', 'gtk-3.0', 'gtk.css']);
        this._writeCssFile(gtk3Path, css.gtk3);
    }

    _writeCssFile(path, content) {
        try {
            // Create directory if it doesn't exist
            const dir = GLib.path_get_dirname(path);
            GLib.mkdir_with_parents(dir, 0o755);
            
            // Write file
            const file = Gio.File.new_for_path(path);
            file.replace_contents(
                content,
                null,
                false,
                Gio.FileCreateFlags.REPLACE_DESTINATION,
                null
            );
            
            console.log(`GTK Theme Customizer: Updated ${path}`);
        } catch (e) {
            console.error(`GTK Theme Customizer: Error writing ${path}: ${e}`);
        }
    }

    _generateCss() {
        // Get settings
        const iconSize = this._settings.get_int('icon-size');
        const borderRadius = this._settings.get_int('border-radius');
        const buttonPadding = this._settings.get_int('button-padding');
        const buttonMargin = this._settings.get_string('button-margin');
        
        // Colors
        const closeColor = this._settings.get_string('close-color');
        const closeIconColor = this._settings.get_string('close-icon-color');
        const closeHoverColor = this._settings.get_string('close-hover-color');
        const closeHoverIconColor = this._settings.get_string('close-hover-icon-color');
        
        const minimizeColor = this._settings.get_string('minimize-color');
        const minimizeIconColor = this._settings.get_string('minimize-icon-color');
        const minimizeHoverColor = this._settings.get_string('minimize-hover-color');
        const minimizeHoverIconColor = this._settings.get_string('minimize-hover-icon-color');
        
        const maximizeColor = this._settings.get_string('maximize-color');
        const maximizeIconColor = this._settings.get_string('maximize-icon-color');
        const maximizeHoverColor = this._settings.get_string('maximize-hover-color');
        const maximizeHoverIconColor = this._settings.get_string('maximize-hover-icon-color');
        
        const buttonBgColor = this._settings.get_string('button-bg-color');
        
        // GTK 4 Specific Settings
        const gtk4MarginTop = this._settings.get_int('gtk4-margin-top');
        const gtk4MarginBottom = this._settings.get_int('gtk4-margin-bottom');
        const gtk4MarginLeft = this._settings.get_int('gtk4-margin-left');
        const gtk4MarginRight = this._settings.get_int('gtk4-margin-right');
        
        // GTK 3 Specific Settings
        const gtk3MinHeight = this._settings.get_int('gtk3-min-height');
        const gtk3MinWidth = this._settings.get_int('gtk3-min-width');
        const gtk3MarginTop = this._settings.get_int('gtk3-margin-top');
        const gtk3MarginBottom = this._settings.get_int('gtk3-margin-bottom');
        const gtk3MarginLeft = this._settings.get_int('gtk3-margin-left');
        const gtk3MarginRight = this._settings.get_int('gtk3-margin-right');
        const gtk3IconScale = this._settings.get_double('gtk3-icon-scale');
        
        // Header Settings
        const headerMaxHeight = this._settings.get_int('header-max-height');
        
        // Titlebar Text Settings
        const titlebarTextMode = this._settings.get_string('titlebar-text-mode');
        
        // Custom Icon Settings
        const useCustomIcons = this._settings.get_boolean('use-custom-icons');
        const customIconOpacity = this._settings.get_double('custom-icon-opacity');
        const closeIconPath = this._settings.get_string('close-icon-path');
        const closeIconSvg = this._settings.get_string('close-icon-svg');
        const closeIconSize = this._settings.get_int('close-icon-size');
        const closeBgOpacity = this._settings.get_double('close-bg-opacity');
        const minimizeIconPath = this._settings.get_string('minimize-icon-path');
        const minimizeIconSvg = this._settings.get_string('minimize-icon-svg');
        const minimizeIconSize = this._settings.get_int('minimize-icon-size');
        const minimizeBgOpacity = this._settings.get_double('minimize-bg-opacity');
        const maximizeIconPath = this._settings.get_string('maximize-icon-path');
        const maximizeIconSvg = this._settings.get_string('maximize-icon-svg');
        const maximizeIconSize = this._settings.get_int('maximize-icon-size');
        const maximizeBgOpacity = this._settings.get_double('maximize-bg-opacity');
        
        // Generate GTK 4 CSS
        const gtk4Css = `/* ==========================================================================
   GTK Theme Customizer - Auto-generated
   Generated: ${new Date().toLocaleString()}
   ========================================================================== */

/* ==========================================================================
   HEADER SIZE: Limit headerbar height
   ========================================================================== */
headerbar,
.titlebar {
    min-height: ${headerMaxHeight}px;
    max-height: ${headerMaxHeight}px;
    padding-top: 0;
    padding-bottom: 0;
}

/* Constrain title text to prevent header expansion */
headerbar .title,
headerbar windowtitle,
headerbar windowtitle > label,
.titlebar .title,
.titlebar windowtitle,
.titlebar windowtitle > label {
    font-size: 1em;
    line-height: 1.2;
    margin: 0;
    padding: 0;
}

/* Force single line with ellipsis for long titles */
headerbar windowtitle,
.titlebar windowtitle {
    max-height: ${headerMaxHeight - 8}px;
    overflow: hidden;
}

headerbar windowtitle > label,
.titlebar windowtitle > label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

${titlebarTextMode === 'hide' ? `
/* ==========================================================================
   TITLEBAR TEXT CONTROL: Hide titlebar text for all applications
   ========================================================================== */
headerbar .title,
headerbar windowtitle,
headerbar windowtitle > label,
.titlebar .title,
.titlebar windowtitle,
.titlebar windowtitle > label {
    opacity: 0;
    font-size: 0;
    color: transparent;
}
` : titlebarTextMode === 'wmclass' ? `
/* ==========================================================================
   TITLEBAR TEXT CONTROL: Show app name from WM Class
   ========================================================================== */
headerbar windowtitle > label,
.titlebar windowtitle > label {
    /* Hide original title */
    font-size: 0;
    opacity: 0;
}

headerbar windowtitle::before,
.titlebar windowtitle::before {
    content: attr(class);
    font-size: 1em;
    opacity: 1;
    text-transform: capitalize;
}
` : ''}

/* ==========================================================================
   WINDOW CONTROLS: Reset & Configuration
   ========================================================================== */
headerbar windowcontrols > button,
.titlebar windowcontrols > button {
    background-image: none !important;
    box-shadow: none !important;
    border: none !important;
    -gtk-icon-shadow: none !important;
    outline: none !important;
    
    border-radius: ${borderRadius}px;
    padding: 0;
    margin-top: ${gtk4MarginTop}px;
    margin-bottom: ${gtk4MarginBottom}px;
    margin-left: ${gtk4MarginLeft}px;
    margin-right: ${gtk4MarginRight}px;
    transition: all 0.2s ease-in-out;
    
    /* Prevent button size from being affected by header height */
    min-height: ${gtk3MinHeight}px;
    min-width: ${gtk3MinWidth}px;
    
    background-color: transparent; 
}

/* Icon Size */
headerbar windowcontrols image,
.titlebar windowcontrols image {
    -gtk-icon-size: ${iconSize}px;
    padding: ${buttonPadding}px;
}

/* ==========================================================================
   BUTTON COLORS - Applied to image/icon element
   ========================================================================== */
${useCustomIcons && (closeIconPath || closeIconSvg) ? `
/* Close Button - Custom Icon */
headerbar windowcontrols > button.close,
.titlebar windowcontrols > button.close {
    background-color: ${this._hexToRgbaWithOpacity(closeColor, closeBgOpacity)};
    background-image: ${closeIconSvg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(closeIconSvg, closeIconColor)}')` : `url('${closeIconPath}')`};
    background-size: ${closeIconSize}px ${closeIconSize}px;
    background-position: center;
    background-repeat: no-repeat;
    opacity: ${customIconOpacity};
}
headerbar windowcontrols > button.close image,
.titlebar windowcontrols > button.close image {
    opacity: 0;
}
headerbar windowcontrols > button.close:hover,
.titlebar windowcontrols > button.close:hover {
    background-color: ${closeHoverColor} !important;
    background-image: ${closeIconSvg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(closeIconSvg, closeHoverIconColor)}')` : `url('${closeIconPath}')`} !important;
    background-size: ${closeIconSize}px ${closeIconSize}px !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    opacity: ${this._settings.get_double('custom-icon-hover-opacity')};
}
` : `
/* Close Button */
headerbar windowcontrols > button.close image,
.titlebar windowcontrols > button.close image { 
    color: ${closeIconColor}; 
    background-color: ${this._hexToRgbaWithOpacity(closeColor, closeBgOpacity)}; 
}
headerbar windowcontrols > button.close:hover image,
.titlebar windowcontrols > button.close:hover image { 
    background-color: ${closeHoverColor} !important; 
}
`}

${useCustomIcons && (minimizeIconPath || minimizeIconSvg) ? `
/* Minimize Button - Custom Icon */
headerbar windowcontrols > button.minimize,
.titlebar windowcontrols > button.minimize {
    background-color: ${this._hexToRgbaWithOpacity(minimizeColor, minimizeBgOpacity)};
    background-image: ${minimizeIconSvg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(minimizeIconSvg, minimizeIconColor)}')` : `url('${minimizeIconPath}')`};
    background-size: ${minimizeIconSize}px ${minimizeIconSize}px;
    background-position: center;
    background-repeat: no-repeat;
    opacity: ${customIconOpacity};
}
headerbar windowcontrols > button.minimize image,
.titlebar windowcontrols > button.minimize image {
    opacity: 0;
}
headerbar windowcontrols > button.minimize:hover,
.titlebar windowcontrols > button.minimize:hover {
    background-color: ${minimizeHoverColor} !important;
    background-image: ${minimizeIconSvg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(minimizeIconSvg, minimizeHoverIconColor)}')` : `url('${minimizeIconPath}')`} !important;
    background-size: ${minimizeIconSize}px ${minimizeIconSize}px !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    opacity: ${this._settings.get_double('custom-icon-hover-opacity')};
}
` : `
/* Minimize Button */
headerbar windowcontrols > button.minimize image,
.titlebar windowcontrols > button.minimize image { 
    color: ${minimizeIconColor}; 
    background-color: ${this._hexToRgbaWithOpacity(minimizeColor, minimizeBgOpacity)}; 
}
headerbar windowcontrols > button.minimize:hover image,
.titlebar windowcontrols > button.minimize:hover image { 
    background-color: ${minimizeHoverColor} !important; 
}
`}

${useCustomIcons && (maximizeIconPath || maximizeIconSvg) ? `
/* Maximize Button - Custom Icon */
headerbar windowcontrols > button.maximize,
.titlebar windowcontrols > button.maximize {
    background-color: ${this._hexToRgbaWithOpacity(maximizeColor, maximizeBgOpacity)};
    background-image: ${maximizeIconSvg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(maximizeIconSvg, maximizeIconColor)}')` : `url('${maximizeIconPath}')`};
    background-size: ${maximizeIconSize}px ${maximizeIconSize}px;
    background-position: center;
    background-repeat: no-repeat;
    opacity: ${customIconOpacity};
}
headerbar windowcontrols > button.maximize image,
.titlebar windowcontrols > button.maximize image {
    opacity: 0;
}
headerbar windowcontrols > button.maximize:hover,
.titlebar windowcontrols > button.maximize:hover {
    background-color: ${maximizeHoverColor} !important;
    background-image: ${maximizeIconSvg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(maximizeIconSvg, maximizeHoverIconColor)}')` : `url('${maximizeIconPath}')`} !important;
    background-size: ${maximizeIconSize}px ${maximizeIconSize}px !important;
    opacity: ${this._settings.get_double('custom-icon-hover-opacity')};
    background-position: center !important;
    background-repeat: no-repeat !important;
}
` : `
/* Maximize Button */
headerbar windowcontrols > button.maximize image,
.titlebar windowcontrols > button.maximize image { 
    color: ${maximizeIconColor}; 
    background-color: ${this._hexToRgbaWithOpacity(maximizeColor, maximizeBgOpacity)}; 
}
headerbar windowcontrols > button.maximize:hover image,
.titlebar windowcontrols > button.maximize:hover image { 
    background-color: ${maximizeHoverColor} !important; 
}
`}

/* Active State Fix */
headerbar windowcontrols > button:active { 
    background-image: none !important; 
    box-shadow: none !important; 
}
`;

        // Generate GTK 3 CSS
        const gtk3Css = `/* ==========================================================================
   GTK Theme Customizer - Auto-generated
   Generated: ${new Date().toLocaleString()}
   ========================================================================== */

/* ==========================================================================
   HEADER SIZE: Limit headerbar height
   ========================================================================== */
headerbar,
.titlebar {
    min-height: ${headerMaxHeight}px;
    max-height: ${headerMaxHeight}px;
    padding-top: 0;
    padding-bottom: 0;
}

/* Constrain title text to prevent header expansion */
headerbar .title,
headerbar label.title,
.titlebar .title,
.titlebar label.title {
    font-size: 1em;
    line-height: 1.2;
    margin: 0;
    padding: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 600px;
}

${titlebarTextMode === 'hide' ? `
/* ==========================================================================
   TITLEBAR TEXT CONTROL: Hide titlebar text for all applications
   ========================================================================== */
headerbar .title,
headerbar label.title,
.titlebar .title,
.titlebar label.title {
    opacity: 0;
    font-size: 0;
    color: transparent;
}
` : titlebarTextMode === 'wmclass' ? `
/* ==========================================================================
   TITLEBAR TEXT CONTROL: Show app name from WM Class
   ========================================================================== */
headerbar label.title,
.titlebar label.title {
    /* Hide original title */
    font-size: 0;
    opacity: 0;
}

headerbar label.title::before,
.titlebar label.title::before {
    content: attr(class);
    font-size: 1em;
    opacity: 1;
    text-transform: capitalize;
}
` : ''}

/* ==========================================================================
   WINDOW CONTROLS: Reset & Configuration
   ========================================================================== */
headerbar button.titlebutton,
.titlebar button.titlebutton {
    background-image: none !important;
    box-shadow: none !important;
    border: none !important;
    text-shadow: none !important;
    icon-shadow: none !important;
    outline: none !important;
    
    border-radius: ${borderRadius}px;
    padding: ${buttonPadding}px;
    transition: all 0.2s ease-in-out;
    
    /* GTK 3 Specific Settings */
    min-height: ${gtk3MinHeight}px;
    min-width: ${gtk3MinWidth}px;
    margin-top: ${gtk3MarginTop}px;
    margin-bottom: ${gtk3MarginBottom}px;
    margin-left: ${gtk3MarginLeft}px;
    margin-right: ${gtk3MarginRight}px;
    
    background-color: ${buttonBgColor}; 
}

/* GTK 3 Icon Scale */
headerbar button.titlebutton image,
.titlebar button.titlebutton image {
    -gtk-icon-transform: scale(${gtk3IconScale});
    padding: 0;
}

/* ==========================================================================
   BUTTON COLORS
   ========================================================================== */
${useCustomIcons && (closeIconPath || closeIconSvg) ? `
/* Close Button - Custom Icon */
headerbar button.titlebutton.close,
.titlebar button.titlebutton.close {
    color: transparent;
    background-color: ${this._hexToRgbaWithOpacity(closeColor, closeBgOpacity)};
    background-image: ${closeIconSvg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(closeIconSvg, closeIconColor)}')` : `url('${closeIconPath}')`};
    background-size: calc(${closeIconSize}px * ${gtk3IconScale});
    background-position: center;
    background-repeat: no-repeat;
    opacity: ${customIconOpacity};
}
headerbar button.titlebutton.close image,
.titlebar button.titlebutton.close image {
    opacity: 0;
}
headerbar button.titlebutton.close:hover,
.titlebar button.titlebutton.close:hover {
    background-color: ${closeHoverColor} !important;
    background-image: ${closeIconSvg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(closeIconSvg, closeHoverIconColor)}')` : `url('${closeIconPath}')`} !important;
    background-size: calc(${closeIconSize}px * ${gtk3IconScale}) !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    opacity: ${this._settings.get_double('custom-icon-hover-opacity')};
}
` : `
/* Close Button */
headerbar button.titlebutton.close,
.titlebar button.titlebutton.close { 
    color: ${closeIconColor}; 
    background-color: ${this._hexToRgbaWithOpacity(closeColor, closeBgOpacity)}; 
}
headerbar button.titlebutton.close:hover,
.titlebar button.titlebutton.close:hover { 
    background-color: ${closeHoverColor} !important; 
}
`}

${useCustomIcons && (minimizeIconPath || minimizeIconSvg) ? `
/* Minimize Button - Custom Icon */
headerbar button.titlebutton.minimize,
.titlebar button.titlebutton.minimize {
    color: transparent;
    background-color: ${this._hexToRgbaWithOpacity(minimizeColor, minimizeBgOpacity)};
    background-image: ${minimizeIconSvg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(minimizeIconSvg, minimizeIconColor)}')` : `url('${minimizeIconPath}')`};
    background-size: calc(${minimizeIconSize}px * ${gtk3IconScale});
    background-position: center;
    background-repeat: no-repeat;
    opacity: ${customIconOpacity};
}
headerbar button.titlebutton.minimize image,
.titlebar button.titlebutton.minimize image {
    opacity: 0;
}
headerbar button.titlebutton.minimize:hover,
.titlebar button.titlebutton.minimize:hover {
    background-color: ${minimizeHoverColor} !important;
    background-image: ${minimizeIconSvg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(minimizeIconSvg, minimizeHoverIconColor)}')` : `url('${minimizeIconPath}')`} !important;
    background-size: calc(${minimizeIconSize}px * ${gtk3IconScale}) !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    opacity: ${this._settings.get_double('custom-icon-hover-opacity')};
}
` : `
/* Minimize Button */
headerbar button.titlebutton.minimize,
.titlebar button.titlebutton.minimize { 
    color: ${minimizeIconColor}; 
    background-color: ${this._hexToRgbaWithOpacity(minimizeColor, minimizeBgOpacity)}; 
}
headerbar button.titlebutton.minimize:hover,
.titlebar button.titlebutton.minimize:hover { 
    background-color: ${minimizeHoverColor} !important; 
}
`}

${useCustomIcons && (maximizeIconPath || maximizeIconSvg) ? `
/* Maximize Button - Custom Icon */
headerbar button.titlebutton.maximize,
.titlebar button.titlebutton.maximize {
    color: transparent;
    background-color: ${this._hexToRgbaWithOpacity(maximizeColor, maximizeBgOpacity)};
    background-image: ${maximizeIconSvg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(maximizeIconSvg, maximizeIconColor)}')` : `url('${maximizeIconPath}')`};
    background-size: calc(${maximizeIconSize}px * ${gtk3IconScale});
    background-position: center;
    background-repeat: no-repeat;
    opacity: ${customIconOpacity};
}
headerbar button.titlebutton.maximize image,
.titlebar button.titlebutton.maximize image {
    opacity: 0;
}
headerbar button.titlebutton.maximize:hover,
.titlebar button.titlebutton.maximize:hover {
    background-color: ${maximizeHoverColor} !important;
    background-image: ${maximizeIconSvg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(maximizeIconSvg, maximizeHoverIconColor)}')` : `url('${maximizeIconPath}')`} !important;
    background-size: calc(${maximizeIconSize}px * ${gtk3IconScale}) !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    opacity: ${this._settings.get_double('custom-icon-hover-opacity')};
}
` : `
/* Maximize Button */
headerbar button.titlebutton.maximize,
.titlebar button.titlebutton.maximize { 
    color: ${maximizeIconColor}; 
    background-color: ${this._hexToRgbaWithOpacity(maximizeColor, maximizeBgOpacity)}; 
}
headerbar button.titlebutton.maximize:hover,
.titlebar button.titlebutton.maximize:hover { 
    background-color: ${maximizeHoverColor} !important; 
}
`}

/* Active State Fix */
headerbar button.titlebutton:active,
.titlebar button.titlebutton:active { 
    background-image: none !important; 
    box-shadow: none !important; 
}
`;

        return {gtk4: gtk4Css, gtk3: gtk3Css};
    }

    _hexToRgba(hex, alpha) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    _resetToDefaults() {
        const dialog = new Adw.MessageDialog({
            heading: _('Reset to Default?'),
            body: _('This will restore all settings to their default values.'),
            modal: true,
            transient_for: this,
        });

        dialog.add_response('cancel', _('Cancel'));
        dialog.add_response('reset', _('Reset'));
        dialog.set_response_appearance('reset', Adw.ResponseAppearance.DESTRUCTIVE);
        dialog.set_default_response('cancel');

        dialog.connect('response', (widget, response) => {
            if (response === 'reset') {
                // Reset all settings
                this._settings.reset('icon-size');
                this._settings.reset('border-radius');
                this._settings.reset('button-padding');
                
                this._settings.reset('close-color');
                this._settings.reset('close-icon-color');
                
                this._settings.reset('minimize-color');
                this._settings.reset('minimize-icon-color');
                
                this._settings.reset('maximize-color');
                this._settings.reset('maximize-icon-color');
                
                this._settings.reset('gtk4-margin-top');
                this._settings.reset('gtk4-margin-bottom');
                this._settings.reset('gtk4-margin-left');
                this._settings.reset('gtk4-margin-right');
                
                this._settings.reset('gtk3-min-height');
                this._settings.reset('gtk3-min-width');
                this._settings.reset('gtk3-margin-top');
                this._settings.reset('gtk3-margin-bottom');
                this._settings.reset('gtk3-margin-left');
                this._settings.reset('gtk3-margin-right');
                this._settings.reset('gtk3-icon-scale');
                
                this._settings.reset('header-max-height');
                
                this._settings.reset('titlebar-text-mode');
                
                this._settings.reset('use-custom-icons');
                this._settings.reset('custom-icon-opacity');
                this._settings.reset('close-icon-path');
                this._settings.reset('close-icon-svg');
                this._settings.reset('close-icon-size');
                this._settings.reset('close-bg-opacity');
                this._settings.reset('minimize-icon-path');
                this._settings.reset('minimize-icon-svg');
                this._settings.reset('minimize-icon-size');
                this._settings.reset('minimize-bg-opacity');
                this._settings.reset('maximize-icon-path');
                this._settings.reset('maximize-icon-svg');
                this._settings.reset('maximize-icon-size');
                this._settings.reset('maximize-bg-opacity');
            }
        });

        dialog.present();
    }

    _applyToRoot() {
        const dialog = new Adw.MessageDialog({
            heading: _('Apply to Root User?'),
            body: _('This will copy your themes and GTK configurations to the root user. You will be prompted for your password.'),
            modal: true,
            transient_for: this,
        });

        dialog.add_response('cancel', _('Cancel'));
        dialog.add_response('apply', _('Apply'));
        dialog.set_response_appearance('apply', Adw.ResponseAppearance.SUGGESTED);
        dialog.set_default_response('cancel');

        dialog.connect('response', (widget, response) => {
            if (response === 'apply') {
                const scriptPath = '/usr/share/gtk-theme-customizer/apply-to-root.sh';
                const homeDir = GLib.get_home_dir();
                const userName = GLib.get_user_name();
                
                try {
                    // Run the script with pkexec
                    GLib.spawn_async(
                        null,
                        ['pkexec', scriptPath, homeDir, userName],
                        null,
                        GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD,
                        null
                    );
                } catch (e) {
                    this._showErrorDialog(_('Failed to run the apply script: ') + e.message);
                }
            }
        });

        dialog.present();
    }

    _showErrorDialog(message) {
        const dialog = new Adw.MessageDialog({
            heading: _('Error'),
            body: message,
            modal: true,
            transient_for: this,
        });

        dialog.add_response('ok', _('OK'));
        dialog.set_default_response('ok');
        dialog.present();
    }
});
