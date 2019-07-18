import {JetView} from "webix-jet";

export default class Locale extends JetView {
	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.$$("language").getValue();
		langs.setLang(value);
	}

	config() {
		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();

		return {
			type: "form",
			rows: [
				{
					view: "segmented",
					value: lang,
					localId: "language",
					options: [
						{id: "en", value: _("English")},
						{id: "ru", value: _("Russian")}
					],
					click: () => {
						this.toggleLanguage();
					}
				},
				{}
			]
		};
	}
}
