import {JetView} from "webix-jet";
import {activities} from "../../models/activities";
import {activityTypes} from "../../models/activityTypes";
import {contacts} from "../../models/contacts";
import SaveForm from "../activities/savePopup";

export default class ActivitiesInfo extends JetView {
	config() {
		const contactTable = {
			view: "datatable",
			localId: "contactActivitiesTable",
			select: true,
			scroll: true,
			leftSplit: 1,
			rightSplit: 2,
			columns: [
				{
					id: "State",
					header: "",
					template: "{common.checkbox()}",
					checkValue: "Close",
					uncheckValue: "Open",
					width: 40
				},
				{
					id: "TypeID",
					header: {content: "selectFilter"},
					fillspace: true,
					options: activityTypes
				},
				{
					id: "DueDate",
					header: {content: "dateRangeFilter"},
					format: webix.i18n.longDateFormatStr,
					fillspace: true
				},
				{
					id: "Details",
					header: {content: "textFilter"},
					fillspace: true
				},
				{
					id: "edit",
					header: "",
					template: "{common.editIcon()}",
					width: 40
				},
				{
					id: "delete",
					header: "",
					template: "{common.trashIcon()}",
					width: 40
				}
			],
			onClick: {
				"wxi-trash": this.deleteColumn,
				"wxi-pencil": this.editColumn
			}
		};

		return {
			rows: [
				contactTable,
				{
					cols: [
						{},
						{
							view: "button",
							autowidth: true,
							type: "icon",
							css: "webix_primary",
							label: "Add activity",
							icon: "fas fa-plus",
							click: () => this.window.showWindow()
						}
					]
				}
			]
		};
	}

	init() {
		this.window = this.ui(SaveForm);
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activityTypes.waitData
		]).then(() => {
			const table = this.$$("contactActivitiesTable");
			activities.filter(obj => +obj.ContactID === +this.getParam("contactId", true));
			table.sync(activities);
		});
	}

	deleteColumn(_e, id) {
		webix.confirm({
			title: "Delete",
			text: "Are you sure?"
		}).then(() => {
			activities.remove(id);
		});
		return false;
	}

	editColumn(_e, id) {
		this.$scope.window.showWindow(id, true);
		return false;
	}
}
