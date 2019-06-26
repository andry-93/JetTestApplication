import {JetView} from "webix-jet";
import {activities} from "../../models/activities";
import {contacts} from "../../models/contacts";
import {activitytypes} from "../../models/activitytypes";
import SaveForm from "./savePopup";
import "./style.css";

export default class Activities extends JetView {
	config() {
		let Toolbar = {
			view: "toolbar",
			paddingX: 10,
			elements: [
				{},
				{
					view: "button",
					autowidth: true,
					type: "icon",
					icon: "fas fa-plus-square",
					label: "Add activity",
					click: () => this.ui(SaveForm).showWindow()
				}
			]
		};

		let ActivitiesTable = {
			view: "datatable",
			scroll: "auto",
			css: "activities-table",
			localId: "activitiesTable",
			columns: [
				{id: "check", header: "", width: 40, template: "{common.checkbox()}"},
				{id: "TypeID", header: ["Activity type", {content: "richSelectFilter"}], width: 150, collection: activitytypes, sort: "string"},
				{id: "DueDate", header: ["Due date", {content: "datepickerFilter"}], width: 150, sort: "date", format: webix.i18n.dateFormatStr},
				{id: "Details", minWidth: 250, fillspace: true, sort: "string", header: ["Details", {content: "textFilter"}]},
				{id: "ContactID", header: ["Contacts", {content: "richSelectFilter"}], minWidth: 250, fillspace: true, collection: contacts, sort: "string"},
				{header: "", width: 40, template: "{common.editIcon()}"},
				{header: "", width: 40, template: "{common.trashIcon()}"}
			],
			onClick: {
				"wxi-trash": this.deleteColumn
			}
		};

		return {
			rows: [
				{type: "header", template: "Activaties", css: "webix_header app_header"},
				Toolbar,
				ActivitiesTable
			]
		};
	}

	init() {
		webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activitytypes.waitData
		]).then(() => {
			this.$$("activitiesTable").sync(activities);
		});
	}

	deleteColumn(_e, id) {
		webix.confirm({
			title: "Delete",
			text: "Are you sure?"
		}).then(() => {
			activities.remove(id);
			return false;
		});
	}
}
