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
            default_width: 800,
            default_height: 850,
            search_enabled: true,
        });

        this._settings = this._getSettings();
        this._settings.connect('changed', () => this._updateCssFiles());
        
        this._buildUI();
        this._updateCssFiles();
    }

    _getSettings() {
        const schemaDir = '/usr/share/gtk-theme-customizer/schemas';
        const schemaSource = Gio.SettingsSchemaSource.new_from_directory(schemaDir, Gio.SettingsSchemaSource.get_default(), false);
        const schema = schemaSource.lookup(SCHEMA_ID, false);
        if (!schema) throw new Error(`Schema ${SCHEMA_ID} not found`);
        return new Gio.Settings({ settings_schema: schema });
    }

    _buildUI() {
        // --- PAGE 1: GENERAL ---
        const generalPage = new Adw.PreferencesPage({ title: _('General'), icon_name: 'preferences-system-symbolic' });
        this.add(generalPage);

        const globalGroup = new Adw.PreferencesGroup({ title: _('Global Styles') });
        generalPage.add(globalGroup);

        globalGroup.add(this._createColorRow(_('Button Background Color'), 'button-bg-color'));

        const iconSizeRow = new Adw.SpinRow({ title: _('Default Icon Size'), adjustment: new Gtk.Adjustment({ lower: 16, upper: 48, step_increment: 1 }) });
        this._settings.bind('icon-size', iconSizeRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        globalGroup.add(iconSizeRow);

        const borderRadiusRow = new Adw.SpinRow({ title: _('Border Radius'), adjustment: new Gtk.Adjustment({ lower: 0, upper: 999, step_increment: 1 }) });
        this._settings.bind('border-radius', borderRadiusRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        globalGroup.add(borderRadiusRow);

        const paddingRow = new Adw.SpinRow({ title: _('Button Padding'), adjustment: new Gtk.Adjustment({ lower: 0, upper: 20, step_increment: 1 }) });
        this._settings.bind('button-padding', paddingRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        globalGroup.add(paddingRow);

        const headerMaxHeightRow = new Adw.SpinRow({ title: _('Header Max Height'), adjustment: new Gtk.Adjustment({ lower: 30, upper: 80, step_increment: 1 }) });
        this._settings.bind('header-max-height', headerMaxHeightRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        globalGroup.add(headerMaxHeightRow);

        const titlebarTextModeRow = new Adw.ComboRow({ title: _('Titlebar Text Mode') });
        const titlebarTextModel = new Gtk.StringList();
        titlebarTextModel.append(_('Show')); titlebarTextModel.append(_('Hide')); titlebarTextModel.append(_('Follow App Name'));
        titlebarTextModeRow.set_model(titlebarTextModel);
        const currentMode = this._settings.get_string('titlebar-text-mode');
        if (currentMode === 'show') titlebarTextModeRow.set_selected(0);
        else if (currentMode === 'hide') titlebarTextModeRow.set_selected(1);
        else if (currentMode === 'wmclass') titlebarTextModeRow.set_selected(2);
        titlebarTextModeRow.connect('notify::selected', () => {
            const selected = titlebarTextModeRow.get_selected();
            if (selected === 0) this._settings.set_string('titlebar-text-mode', 'show');
            else if (selected === 1) this._settings.set_string('titlebar-text-mode', 'hide');
            else if (selected === 2) this._settings.set_string('titlebar-text-mode', 'wmclass');
        });
        globalGroup.add(titlebarTextModeRow);

        // Version Specific Groups
        const v4Group = new Adw.PreferencesGroup({ title: _('GTK 4 Specific') });
        generalPage.add(v4Group);
        this._addVersionRows(v4Group, 4);

        const v3Group = new Adw.PreferencesGroup({ title: _('GTK 3 Specific') });
        generalPage.add(v3Group);
        this._addVersionRows(v3Group, 3);

        const actionsGroup = new Adw.PreferencesGroup({ title: _('Actions') });
        generalPage.add(actionsGroup);
        const applyBtn = new Gtk.Button({ label: _('Apply to Root'), valign: Gtk.Align.CENTER, css_classes: ['suggested-action'] });
        applyBtn.connect('clicked', () => this._applyToRoot());
        const applyRow = new Adw.ActionRow({ title: _('Apply Configuration') });
        applyRow.add_suffix(applyBtn);
        actionsGroup.add(applyRow);

        const resetBtn = new Gtk.Button({ label: _('Reset Defaults'), valign: Gtk.Align.CENTER, css_classes: ['destructive-action'] });
        resetBtn.connect('clicked', () => this._resetToDefaults());
        const resetRow = new Adw.ActionRow({ title: _('Reset All Settings') });
        resetRow.add_suffix(resetBtn);
        actionsGroup.add(resetRow);


        // --- PAGE 2: BUTTON COLORS ---
        const buttonsPage = new Adw.PreferencesPage({ title: _('Icons Color'), icon_name: 'view-grid-symbolic' });
        this.add(buttonsPage);
        ['close', 'minimize', 'maximize', 'unmaximize'].forEach(type => {
            const group = new Adw.PreferencesGroup({ title: type.charAt(0).toUpperCase() + type.slice(1) + ' Button' });
            buttonsPage.add(group);
            group.add(this._createColorRow(_('Icon Color'), type + '-icon-color'));
            group.add(this._createColorRow(_('Hover Icon Color'), type + '-hover-icon-color'));
        });


        // --- PAGE 3: CUSTOM ICONS ---
        const iconsPage = new Adw.PreferencesPage({ title: _('Custom Icons'), icon_name: 'emblem-photos-symbolic' });
        this.add(iconsPage);

        const globalIconsGroup = new Adw.PreferencesGroup({ title: _('Global Icon Style') });
        iconsPage.add(globalIconsGroup);
        const opRow = new Adw.SpinRow({ title: _('Default Opacity'), digits: 2, adjustment: new Gtk.Adjustment({ lower: 0, upper: 1, step_increment: 0.05 }) });
        this._settings.bind('custom-icon-opacity', opRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        globalIconsGroup.add(opRow);
        const hop3Row = new Adw.SpinRow({ title: _('Hover Opacity (GTK 3)'), digits: 2, adjustment: new Gtk.Adjustment({ lower: 0, upper: 1, step_increment: 0.05 }) });
        this._settings.bind('gtk3-hover-opacity', hop3Row, 'value', Gio.SettingsBindFlags.DEFAULT);
        globalIconsGroup.add(hop3Row);
        const hop4Row = new Adw.SpinRow({ title: _('Hover Opacity (GTK 4)'), digits: 2, adjustment: new Gtk.Adjustment({ lower: 0, upper: 1, step_increment: 0.05 }) });
        this._settings.bind('gtk4-hover-opacity', hop4Row, 'value', Gio.SettingsBindFlags.DEFAULT);
        globalIconsGroup.add(hop4Row);

        this._buildCustomIconsSection(iconsPage, 4, _('GTK 4 Custom Icons'));
        this._buildCustomIconsSection(iconsPage, 3, _('GTK 3 Custom Icons'));
    }

    _addVersionRows(group, v) {
        const hRow = new Adw.SpinRow({ title: _('Min Height'), adjustment: new Gtk.Adjustment({ lower: 20, upper: 60, step_increment: 1 }) });
        this._settings.bind(`gtk${v}-min-height`, hRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        group.add(hRow);
        const wRow = new Adw.SpinRow({ title: _('Min Width'), adjustment: new Gtk.Adjustment({ lower: 20, upper: 60, step_increment: 1 }) });
        this._settings.bind(`gtk${v}-min-width`, wRow, 'value', Gio.SettingsBindFlags.DEFAULT);
        group.add(wRow);
        if (v === 3) {
            const scaleRow = new Adw.SpinRow({ title: _('Icon Scale'), digits: 2, adjustment: new Gtk.Adjustment({ lower: 0.5, upper: 3.0, step_increment: 0.1 }) });
            this._settings.bind('gtk3-icon-scale', scaleRow, 'value', Gio.SettingsBindFlags.DEFAULT);
            group.add(scaleRow);
        }
        const expander = new Adw.ExpanderRow({ title: _('Margins') });
        group.add(expander);
        ['top', 'bottom', 'left', 'right'].forEach(dir => {
            const row = new Adw.SpinRow({ title: dir.charAt(0).toUpperCase() + dir.slice(1), adjustment: new Gtk.Adjustment({ lower: 0, upper: 20, step_increment: 1 }) });
            this._settings.bind(`gtk${v}-margin-${dir}`, row, 'value', Gio.SettingsBindFlags.DEFAULT);
            expander.add_row(row);
        });
    }

    _buildCustomIconsSection(page, v, title) {
        const group = new Adw.PreferencesGroup({ title: title });
        page.add(group);

        const useRow = new Adw.SwitchRow({ title: _('Enable Custom Icons for GTK ') + v });
        this._settings.bind(`gtk${v}-use-custom-icons`, useRow, 'active', Gio.SettingsBindFlags.DEFAULT);
        group.add(useRow);

        ['close', 'minimize', 'maximize', 'unmaximize'].forEach(type => {
            const expander = new Adw.ExpanderRow({ title: type.charAt(0).toUpperCase() + type.slice(1) + ' Icon' });
            group.add(expander);
            
            const sizeRow = new Adw.SpinRow({ title: _('Size'), adjustment: new Gtk.Adjustment({ lower: 16, upper: 64, step_increment: 1 }) });
            this._settings.bind(`gtk${v}-${type}-icon-size`, sizeRow, 'value', Gio.SettingsBindFlags.DEFAULT);
            expander.add_row(sizeRow);

            // PNG Path
            const pathRow = new Adw.ActionRow({ title: _('PNG Path') });
            const pathBox = new Gtk.Box({ spacing: 6, valign: Gtk.Align.CENTER });
            const pathKey = `gtk${v}-${type}-icon-path`;
            const pathLabel = new Gtk.Label({ label: GLib.path_get_basename(this._settings.get_string(pathKey)) || _('None'), ellipsize: 3, max_width_chars: 15 });
            pathBox.append(pathLabel);
            const chooseBtn = new Gtk.Button({ icon_name: 'document-open-symbolic', css_classes: ['flat'] });
            chooseBtn.connect('clicked', () => this._selectIconFile(pathKey, pathLabel));
            pathBox.append(chooseBtn);
            const clearBtn = new Gtk.Button({ icon_name: 'edit-clear-symbolic', css_classes: ['flat'] });
            clearBtn.connect('clicked', () => { this._settings.set_string(pathKey, ''); pathLabel.set_label(_('None')); });
            pathBox.append(clearBtn);
            pathRow.add_suffix(pathBox);
            expander.add_row(pathRow);

            // SVG Code
            const svgRow = new Adw.ActionRow({ title: _('SVG Code') });
            const svgBox = new Gtk.Box({ spacing: 6, valign: Gtk.Align.CENTER });
            const svgKey = `gtk${v}-${type}-icon-svg`;
            const svgLabel = new Gtk.Label({ label: this._settings.get_string(svgKey) ? _('Set') : _('None') });
            svgBox.append(svgLabel);
            const editBtn = new Gtk.Button({ icon_name: 'document-edit-symbolic', css_classes: ['flat'] });
            editBtn.connect('clicked', () => this._showSvgDialog(svgKey, svgLabel));
            svgBox.append(editBtn);
            const clearSvgBtn = new Gtk.Button({ icon_name: 'edit-clear-symbolic', css_classes: ['flat'] });
            clearSvgBtn.connect('clicked', () => { this._settings.set_string(svgKey, ''); svgLabel.set_label(_('None')); });
            svgBox.append(clearSvgBtn);
            svgRow.add_suffix(svgBox);
            expander.add_row(svgRow);
        });
    }

    _createColorRow(title, key) {
        const row = new Adw.ActionRow({ title: title });
        const colorButton = new Gtk.ColorButton({ valign: Gtk.Align.CENTER });
        const rgba = new Gdk.RGBA();
        rgba.parse(this._settings.get_string(key));
        colorButton.set_rgba(rgba);
        colorButton.connect('color-set', () => this._settings.set_string(key, this._rgbaToHex(colorButton.get_rgba())));
        row.add_suffix(colorButton);
        return row;
    }

    _showSvgDialog(key, statusLabel) {
        const dialog = new Adw.Window({ title: _('Edit SVG Code'), modal: true, transient_for: this, default_width: 600, default_height: 400 });
        const toolbarView = new Adw.ToolbarView();
        dialog.set_content(toolbarView);
        const headerBar = new Adw.HeaderBar();
        toolbarView.add_top_bar(headerBar);
        const saveBtn = new Gtk.Button({ label: _('Save'), css_classes: ['suggested-action'] });
        headerBar.pack_end(saveBtn);
        const textView = new Gtk.TextView({ monospace: true, margin_top: 12, margin_bottom: 12, margin_start: 12, margin_end: 12 });
        textView.get_buffer().set_text(this._settings.get_string(key), -1);
        toolbarView.set_content(new Gtk.ScrolledWindow({ child: textView }));
        saveBtn.connect('clicked', () => {
            const buffer = textView.get_buffer();
            const text = buffer.get_text(buffer.get_start_iter(), buffer.get_end_iter(), false);
            this._settings.set_string(key, text);
            statusLabel.set_label(text ? _('Set') : _('None'));
            dialog.close();
        });
        dialog.present();
    }

    _selectIconFile(key, label) {
        const dialog = new Gtk.FileDialog({ title: _('Select Icon File'), modal: true });
        const filter = new Gtk.FileFilter();
        filter.set_name(_('PNG Images')); filter.add_mime_type('image/png');
        const filters = new Gio.ListStore({ item_type: Gtk.FileFilter });
        filters.append(filter);
        dialog.set_filters(filters);
        dialog.open(this, null, (source, result) => {
            try {
                const file = dialog.open_finish(result);
                if (file) {
                    this._settings.set_string(key, file.get_path());
                    label.set_label(GLib.path_get_basename(file.get_path()));
                }
            } catch (e) {}
        });
    }

    _rgbaToHex(rgba) {
        const r = Math.round(rgba.red * 255);
        const g = Math.round(rgba.green * 255);
        const b = Math.round(rgba.blue * 255);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    _escapeSvg(svg, color) {
        return svg.replace(/currentColor/g, color || '#000000')
            .replace(/\n/g, ' ').replace(/\r/g, '').replace(/\t/g, ' ').replace(/\s+/g, ' ')
            .replace(/"/g, "'").replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/&/g, '%26').trim();
    }

    _updateCssFiles() {
        const css = this._generateCss();
        [3, 4].forEach(v => {
            const path = GLib.build_filenamev([GLib.get_home_dir(), '.config', `gtk-${v}.0`, 'gtk.css']);
            try {
                GLib.mkdir_with_parents(GLib.path_get_dirname(path), 0o755);
                Gio.File.new_for_path(path).replace_contents(css[`gtk${v}`], null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null);
            } catch (e) { console.error(e); }
        });
    }

    _generateCss() {
        const s = this._settings;
        const data = {
            iconSize: s.get_int('icon-size'),
            borderRadius: s.get_int('border-radius'),
            buttonPadding: s.get_int('button-padding'),
            headerMaxHeight: s.get_int('header-max-height'),
            titlebarTextMode: s.get_string('titlebar-text-mode'),
            buttonBgColor: s.get_string('button-bg-color'),
            customIconOpacity: s.get_double('custom-icon-opacity'),
        };

        const getVersionData = (v) => {
            const vData = { ...data };
            vData.v = v;
            vData.useCustom = s.get_boolean(`gtk${v}-use-custom-icons`);
            vData.hoverOpacity = s.get_double(`gtk${v}-hover-opacity`);
            vData.minH = s.get_int(`gtk${v}-min-height`);
            vData.minW = s.get_int(`gtk${v}-min-width`);
            vData.mT = s.get_int(`gtk${v}-margin-top`);
            vData.mB = s.get_int(`gtk${v}-margin-bottom`);
            vData.mL = s.get_int(`gtk${v}-margin-left`);
            vData.mR = s.get_int(`gtk${v}-margin-right`);
            vData.scale = v === 3 ? s.get_double('gtk3-icon-scale') : 1;
            
            vData.btns = ['close', 'minimize', 'maximize', 'unmaximize'].reduce((acc, type) => {
                acc[type] = {
                    icon: s.get_string(type + '-icon-color'),
                    hIcon: s.get_string(type + '-hover-icon-color'),
                    path: s.get_string(`gtk${v}-${type}-icon-path`),
                    svg: s.get_string(`gtk${v}-${type}-icon-svg`),
                    size: s.get_int(`gtk${v}-${type}-icon-size`)
                };
                return acc;
            }, {});
            return vData;
        };

        return {
            gtk4: this._genVersionCss(getVersionData(4)),
            gtk3: this._genVersionCss(getVersionData(3))
        };
    }

    _genVersionCss(d) {
        const btnCss = (type, btn) => {
            const isCustom = d.useCustom && (btn.path || btn.svg);
            
            let selectors;
            if (d.v === 4) {
                const baseClass = type === 'unmaximize' ? 'maximize' : type;
                selectors = [`headerbar windowcontrols > button.${baseClass}`, `.titlebar windowcontrols > button.${baseClass}`];
                if (type === 'unmaximize') {
                    selectors = selectors.map(s => `window.maximized ${s}`);
                }
            } else {
                const baseClass = type === 'unmaximize' ? 'restore' : type;
                selectors = [`headerbar button.titlebutton.${baseClass}`, `.titlebar button.titlebutton.${baseClass}`];
            }
            
            const btnBase = selectors.join(', ');
            const btnHover = selectors.map(s => `${s}:hover`).join(', ');
            const imgBase = selectors.map(s => `${s} image`).join(', ');

            // For GTK4 standard icons, we target 'image' for color/bg-color
            // For others, we target 'button'
            const baseSel = d.v === 4 && !isCustom ? imgBase : btnBase;
            const hoverSel = d.v === 4 && !isCustom ? selectors.map(s => `${s}:hover image`).join(', ') : btnHover;

            if (isCustom) {
                const bgImg = btn.svg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(btn.svg, btn.icon)}')` : `url('${btn.path}')`;
                const hBgImg = btn.svg ? `url('data:image/svg+xml;utf8,${this._escapeSvg(btn.svg, btn.hIcon)}')` : `url('${btn.path}')`;
                const size = d.v === 3 ? `calc(${btn.size}px * ${d.scale})` : `${btn.size}px`;
                
                return `
${btnBase} {
    background-color: ${d.buttonBgColor}; background-image: ${bgImg}; background-size: ${size} ${size};
    background-position: center; background-repeat: no-repeat; opacity: ${d.customIconOpacity};
    color: transparent; border: none; box-shadow: none;
}
${imgBase} { opacity: 0; }
${btnHover} { 
    background-color: ${d.buttonBgColor} !important; 
    background-image: ${hBgImg} !important; 
    opacity: ${d.hoverOpacity};
}`;
            } else {
                return `
${baseSel} { color: ${btn.icon}; background-color: ${d.buttonBgColor}; }
${btnBase} { opacity: ${d.customIconOpacity}; }
${hoverSel} { color: ${btn.hIcon}; background-color: ${d.buttonBgColor} !important; }
${btnHover} { 
    opacity: ${d.hoverOpacity};
}`;
            }
        };

        return `
headerbar, .titlebar { min-height: ${d.headerMaxHeight}px; max-height: ${d.headerMaxHeight}px; padding: 0; }
${d.titlebarTextMode === 'hide' ? 'headerbar .title, headerbar windowtitle, .titlebar .title { opacity: 0; font-size: 0; }' : ''}
${d.v === 4 ? `
headerbar windowcontrols > button, .titlebar windowcontrols > button {
    border-radius: ${d.borderRadius}px; margin: ${d.mT}px ${d.mR}px ${d.mB}px ${d.mL}px;
    min-height: ${d.minH}px; min-width: ${d.minW}px; padding: 0; background-color: transparent; border: none; box-shadow: none;
}
headerbar windowcontrols image, .titlebar windowcontrols image { -gtk-icon-size: ${d.iconSize}px; padding: ${d.buttonPadding}px; border-radius: ${d.borderRadius}px; }
` : `
headerbar button.titlebutton, .titlebar button.titlebutton {
    border-radius: ${d.borderRadius}px; margin: ${d.mT}px ${d.mR}px ${d.mB}px ${d.mL}px;
    min-height: ${d.minH}px; min-width: ${d.minW}px; padding: ${d.buttonPadding}px; background-image: none; border: none; box-shadow: none;
}
headerbar button.titlebutton image, .titlebar button.titlebutton image { -gtk-icon-transform: scale(${d.scale}); icon-shadow: none; -gtk-icon-shadow: none; }
`}
${btnCss('close', d.btns.close)}
${btnCss('minimize', d.btns.minimize)}
${btnCss('maximize', d.btns.maximize)}
${btnCss('unmaximize', d.btns.unmaximize)}
`;
    }

    _resetToDefaults() {
        const dialog = new Adw.MessageDialog({ heading: _('Reset?'), body: _('Restore all defaults?'), modal: true, transient_for: this });
        dialog.add_response('cancel', _('Cancel'));
        dialog.add_response('reset', _('Reset'));
        dialog.set_response_appearance('reset', Adw.ResponseAppearance.DESTRUCTIVE);
        dialog.connect('response', (w, r) => {
            if (r === 'reset') {
                const keys = [
                    'icon-size', 'border-radius', 'button-padding', 'button-bg-color', 'header-max-height', 'titlebar-text-mode',
                    'gtk4-min-height', 'gtk4-min-width', 'gtk4-margin-top', 'gtk4-margin-bottom', 'gtk4-margin-left', 'gtk4-margin-right', 'gtk4-use-custom-icons',
                    'gtk4-close-icon-path', 'gtk4-close-icon-svg', 'gtk4-close-icon-size', 'gtk4-minimize-icon-path', 'gtk4-minimize-icon-svg', 'gtk4-minimize-icon-size', 'gtk4-maximize-icon-path', 'gtk4-maximize-icon-svg', 'gtk4-maximize-icon-size',
                    'gtk4-unmaximize-icon-path', 'gtk4-unmaximize-icon-svg', 'gtk4-unmaximize-icon-size',
                    'gtk3-min-height', 'gtk3-min-width', 'gtk3-margin-top', 'gtk3-margin-bottom', 'gtk3-margin-left', 'gtk3-margin-right', 'gtk3-icon-scale', 'gtk3-use-custom-icons',
                    'gtk3-close-icon-path', 'gtk3-close-icon-svg', 'gtk3-close-icon-size', 'gtk3-minimize-icon-path', 'gtk3-minimize-icon-svg', 'gtk3-minimize-icon-size', 'gtk3-maximize-icon-path', 'gtk3-maximize-icon-svg', 'gtk3-maximize-icon-size',
                    'gtk3-unmaximize-icon-path', 'gtk3-unmaximize-icon-svg', 'gtk3-unmaximize-icon-size',
                    'custom-icon-opacity', 'gtk3-hover-opacity', 'gtk4-hover-opacity',
                    'close-icon-color', 'close-hover-icon-color', 'minimize-icon-color', 'minimize-hover-icon-color', 'maximize-icon-color', 'maximize-hover-icon-color',
                    'unmaximize-icon-color', 'unmaximize-hover-icon-color'
                ];
                keys.forEach(k => this._settings.reset(k));
            }
        });
        dialog.present();
    }

    _applyToRoot() {
        const dialog = new Adw.MessageDialog({ heading: _('Apply to Root?'), body: _('Copy config to root user. Password required.'), modal: true, transient_for: this });
        dialog.add_response('cancel', _('Cancel'));
        dialog.add_response('apply', _('Apply'));
        dialog.connect('response', (w, r) => {
            if (r === 'apply') {
                try {
                    GLib.spawn_async(null, ['pkexec', '/usr/share/gtk-theme-customizer/apply-to-root.sh', GLib.get_home_dir(), GLib.get_user_name()], null, GLib.SpawnFlags.SEARCH_PATH, null);
                } catch (e) { this._showErrorDialog(e.message); }
            }
        });
        dialog.present();
    }

    _showErrorDialog(msg) {
        const dialog = new Adw.MessageDialog({ heading: _('Error'), body: msg, modal: true, transient_for: this });
        dialog.add_response('ok', _('OK'));
        dialog.present();
    }
});
