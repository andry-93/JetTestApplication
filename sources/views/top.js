import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		let menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='fas #icon#' style='width: 18px;'></span> #value# ",
			on: {
				onAfterSelect: () => {
					this.$$("headerApp").setHTML(this.$$("top:menu").getSelectedItem().value);
				}
			},
			data: [
				{value: "Contacts", id: "contacts", icon: "fa-users"},
				{value: "Activities", id: "activities", icon: "fa-calendar-alt"},
				{value: "Settings", id: "settings", icon: "fa-cogs"}
			]
		};

		let ui = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			rows: [
				{localId: "headerApp", type: "header", template: "Activaties", css: "webix_header app_header"},
				{
					cols: [
						{
							rows: [{css: "webix_shadow_medium", rows: [menu]}]
						},
						{
							type: "wide",
							rows: [
								{$subview: true}
							]
						}
					]
				}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}
}
