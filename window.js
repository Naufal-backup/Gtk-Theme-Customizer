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

        // Button Margin
        const marginRow = new Adw.EntryRow({
            title: _('Button Margin'),
            text: this._settings.get_string('button-margin'),
        });
        marginRow.connect('changed', (entry) => {
            this._settings.set_string('button-margin', entry.get_text());
        });
        sizeGroup.add(marginRow);

        // Button Background Color
        const buttonBgRow = this._createColorRow(
            _('Default Button Background'),
            _('Default background color for all buttons'),
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

        // Close Button Group
        const closeGroup = new Adw.PreferencesGroup({
            title: _('Close Button'),
            description: _('Color and opacity for close button'),
        });
        page.add(closeGroup);

        const closeColorRow = this._createColorRow(
            _('Close Color'),
            _('Main color for close button'),
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
        this._settings.bind('close-bg-opacity', closeBgOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
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
        this._settings.bind('close-hover-opacity', closeHoverOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
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
        this._settings.bind('minimize-bg-opacity', minimizeBgOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
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
        this._settings.bind('minimize-hover-opacity', minimizeHoverOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
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
        this._settings.bind('maximize-bg-opacity', maximizeBgOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
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
        this._settings.bind('maximize-hover-opacity', maximizeHoverOpacityRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        maximizeGroup.add(maximizeHoverOpacityRow);

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

    _rgbaToHex(rgba) {
        const r = Math.round(rgba.red * 255);
        const g = Math.round(rgba.green * 255);
        const b = Math.round(rgba.blue * 255);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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
        const closeBgOpacity = this._settings.get_double('close-bg-opacity');
        const closeHoverOpacity = this._settings.get_double('close-hover-opacity');
        
        const minimizeColor = this._settings.get_string('minimize-color');
        const minimizeBgOpacity = this._settings.get_double('minimize-bg-opacity');
        const minimizeHoverOpacity = this._settings.get_double('minimize-hover-opacity');
        
        const maximizeColor = this._settings.get_string('maximize-color');
        const maximizeBgOpacity = this._settings.get_double('maximize-bg-opacity');
        const maximizeHoverOpacity = this._settings.get_double('maximize-hover-opacity');
        
        const buttonBgColor = this._settings.get_string('button-bg-color');
        
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
    margin: ${buttonMargin};
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
/* Close Button */
headerbar windowcontrols > button.close image,
.titlebar windowcontrols > button.close image { 
    color: ${this._hexToRgba(closeColor, 0.8)}; 
    background-color: ${this._hexToRgba(closeColor, closeBgOpacity)}; 
}
headerbar windowcontrols > button.close:hover image,
.titlebar windowcontrols > button.close:hover image { 
    background-color: ${this._hexToRgba(closeColor, closeHoverOpacity)} !important; 
    color: #ffffff; 
}

/* Minimize Button */
headerbar windowcontrols > button.minimize image,
.titlebar windowcontrols > button.minimize image { 
    color: ${this._hexToRgba(minimizeColor, 0.8)}; 
    background-color: ${this._hexToRgba(minimizeColor, minimizeBgOpacity)}; 
}
headerbar windowcontrols > button.minimize:hover image,
.titlebar windowcontrols > button.minimize:hover image { 
    background-color: ${this._hexToRgba(minimizeColor, minimizeHoverOpacity)} !important; 
    color: #ffffff; 
}

/* Maximize Button */
headerbar windowcontrols > button.maximize image,
.titlebar windowcontrols > button.maximize image { 
    color: ${this._hexToRgba(maximizeColor, 0.8)}; 
    background-color: ${this._hexToRgba(maximizeColor, maximizeBgOpacity)}; 
}
headerbar windowcontrols > button.maximize:hover image,
.titlebar windowcontrols > button.maximize:hover image { 
    background-color: ${this._hexToRgba(maximizeColor, maximizeHoverOpacity)} !important; 
    color: #ffffff; 
}

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
/* Close Button */
headerbar button.titlebutton.close,
.titlebar button.titlebutton.close { 
    color: ${this._hexToRgba(closeColor, 0.8)}; 
    background-color: ${this._hexToRgba(closeColor, closeBgOpacity)}; 
}
headerbar button.titlebutton.close:hover,
.titlebar button.titlebutton.close:hover { 
    background-color: ${this._hexToRgba(closeColor, closeHoverOpacity)} !important; 
    color: #ffffff; 
}

/* Minimize Button */
headerbar button.titlebutton.minimize,
.titlebar button.titlebutton.minimize { 
    color: ${this._hexToRgba(minimizeColor, 0.8)}; 
    background-color: ${this._hexToRgba(minimizeColor, minimizeBgOpacity)}; 
}
headerbar button.titlebutton.minimize:hover,
.titlebar button.titlebutton.minimize:hover { 
    background-color: ${this._hexToRgba(minimizeColor, minimizeHoverOpacity)} !important; 
    color: #ffffff; 
}

/* Maximize Button */
headerbar button.titlebutton.maximize,
.titlebar button.titlebutton.maximize { 
    color: ${this._hexToRgba(maximizeColor, 0.8)}; 
    background-color: ${this._hexToRgba(maximizeColor, maximizeBgOpacity)}; 
}
headerbar button.titlebutton.maximize:hover,
.titlebar button.titlebutton.maximize:hover { 
    background-color: ${this._hexToRgba(maximizeColor, maximizeHoverOpacity)} !important; 
    color: #ffffff; 
}

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
                this._settings.reset('button-margin');
                this._settings.reset('button-bg-color');
                
                this._settings.reset('close-color');
                this._settings.reset('close-bg-opacity');
                this._settings.reset('close-hover-opacity');
                
                this._settings.reset('minimize-color');
                this._settings.reset('minimize-bg-opacity');
                this._settings.reset('minimize-hover-opacity');
                
                this._settings.reset('maximize-color');
                this._settings.reset('maximize-bg-opacity');
                this._settings.reset('maximize-hover-opacity');
                
                this._settings.reset('gtk3-min-height');
                this._settings.reset('gtk3-min-width');
                this._settings.reset('gtk3-margin-top');
                this._settings.reset('gtk3-margin-bottom');
                this._settings.reset('gtk3-margin-left');
                this._settings.reset('gtk3-margin-right');
                this._settings.reset('gtk3-icon-scale');
                
                this._settings.reset('header-max-height');
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
