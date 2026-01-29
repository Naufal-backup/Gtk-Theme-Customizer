import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class GtkThemeCustomizerExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        
        // Connect to settings changes
        this._settingsChangedId = this._settings.connect('changed', () => {
            this._updateCssFiles();
        });
        
        // Initial CSS generation
        this._updateCssFiles();
    }

    disable() {
        if (this._settingsChangedId) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }
        this._settings = null;
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
            const [, etag] = file.replace_contents(
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
        
        // Generate GTK 4 CSS
        const gtk4Css = `/* ==========================================================================
   GTK Theme Customizer - Auto-generated
   Generated: ${new Date().toLocaleString()}
   ========================================================================== */

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
    
    background-color: ${buttonBgColor}; 
}

/* Icon Size */
headerbar windowcontrols image,
.titlebar windowcontrols image {
    -gtk-icon-size: ${iconSize}px;
    padding: ${buttonPadding}px;
}

/* ==========================================================================
   BUTTON COLORS
   ========================================================================== */
/* Close Button */
headerbar windowcontrols > button.close { 
    color: ${this._hexToRgba(closeColor, 0.8)}; 
    background-color: ${this._hexToRgba(closeColor, closeBgOpacity)}; 
}
headerbar windowcontrols > button.close:hover { 
    background-color: ${this._hexToRgba(closeColor, closeHoverOpacity)} !important; 
    color: #ffffff; 
}

/* Minimize Button */
headerbar windowcontrols > button.minimize { 
    color: ${this._hexToRgba(minimizeColor, 0.8)}; 
    background-color: ${this._hexToRgba(minimizeColor, minimizeBgOpacity)}; 
}
headerbar windowcontrols > button.minimize:hover { 
    background-color: ${this._hexToRgba(minimizeColor, minimizeHoverOpacity)} !important; 
    color: #ffffff; 
}

/* Maximize Button */
headerbar windowcontrols > button.maximize { 
    color: ${this._hexToRgba(maximizeColor, 0.8)}; 
    background-color: ${this._hexToRgba(maximizeColor, maximizeBgOpacity)}; 
}
headerbar windowcontrols > button.maximize:hover { 
    background-color: ${this._hexToRgba(maximizeColor, maximizeHoverOpacity)} !important; 
    color: #ffffff; 
}

/* Active State Fix */
headerbar windowcontrols > button:active { 
    background-image: none !important; 
    box-shadow: none !important; 
}
`;

        // Generate GTK 3 CSS (similar but with GTK 3 syntax)
        const gtk3Css = `/* ==========================================================================
   GTK Theme Customizer - Auto-generated
   Generated: ${new Date().toLocaleString()}
   ========================================================================== */

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
        // Convert hex to rgba
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}
