import {JetView, plugins} from "webix-jet";

export default class Settings extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		let menu = {
			view: "menu",
			localId: "menu",
			layout: "y",
			select: true,
			width: 180,
			template: "<span class='fas #icon#' style='width: 18px;'></span> #value#",
			data: [
				{id: "settings.locale", value: _("Locale"), icon: "fa-globe-europe"},
				{id: "settings.dataset", value: _("Dataset"), icon: "fa-table"}
			]
		};

		return {
			cols: [
				menu,
				{$subview: true}
			]
		};
	}

	init() {
		this.use(plugins.Menu, "menu");
	}
}
