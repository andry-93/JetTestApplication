import {JetView} from "webix-jet";
import DataEdit from "./dataEdit";
import {activityTypes} from "../../../models/activityTypes";
import {statuses} from "../../../models/statuses";

export default class Dataset extends JetView {
	config() {
		let menu = {
			view: "list",
			localId: "dataMenu",
			scroll: "auto",
			select: true,
			data: [
				{id: "activityTypes", value: "Activity types"},
				{id: "statuses", value: "Statuses"}
			]
		};

		let cells = {
			cells: [
				{localId: "activityTypes", rows: [{$subview: new DataEdit(this.app, "", activityTypes)}]},
				{localId: "statuses", rows: [{$subview: new DataEdit(this.app, "", statuses)}]}
			]
		};

		let ui = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			cols: [
				{
					width: 200,
					rows: [menu]
				},
				cells
			]
		};

		return ui;
	}

	init() {
		let dataMenu = this.$$("dataMenu");
		dataMenu.attachEvent("onAfterSelect", (id) => {
			this.$$(id).show();
		});
		dataMenu.select(dataMenu.getFirstId());
	}
}
