import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {activitytypes} from "../../models/activitytypes";
import {activities} from "../../models/activities";

export default class SaveForm extends JetView {
	config() {
		return {
			view: "window",
			position: "center",
			modal: true,
			id: "window",
			move: true,
			width: 500,
			head: {
				cols: [
					{template: "Add (*edit) activity", type: "header", borderless: true},
					{view: "icon",
						icon: "wxi-close",
						tooltip: "Close window",
						click: () => this.closeWindow()
					}
				]
			},
			body: {
				view: "form",
				padding: 10,
				localId: "editForm",
				elements: [
					{
						view: "textarea",
						label: "Details",
						name: "Details",
						height: 150
					},
					{
						view: "richselect",
						label: "Type",
						name: "TypeID",
						options: {
							body: {
								template: "#value#",
								data: activitytypes
							}
						}
					},
					{
						view: "richselect",
						label: "Contact",
						name: "ContactID",
						options: {
							body: {
								template: "#value#",
								data: contacts
							}
						}
					},
					{
						margin: 10,
						cols: [
							{
								view: "datepicker",
								name: "DueDate",
								label: "Date"
							},
							{
								view: "datepicker",
								name: "DueTime",
								type: "time",
								label: "Time"
							}
						]
					},
					{
						view: "checkbox",
						name: "State",
						labelRight: "Completed",
						checkValue: "Close",
						uncheckValue: "Open",
						labelWidth: 0
					},
					{
						cols: [
							{},
							{
								view: "button",
								localId: "onSave",
								label: "Add (*save)",
								autoWidth: true
							},
							{
								view: "button",
								label: "Cancel",
								autoWidth: true,
								click: () => this.closeWindow()
							}
						]
					}
				],
				rules: {
					DueDate: webix.rules.isNotEmpty,
					DueTime: webix.rules.isNotEmpty
				}
			}
		};
	}

	showWindow(id) {
		this.getRoot().show();
		webix.promise.all([
			contacts.waitData,
			activitytypes.waitData,
			activities.waitData
		]).then(() => {
			const formView = this.$$("editForm");
			if (id) {
				formView.setValues(activities.getItem(id));
				this.$$("onSave").attachEvent("onItemClick", () => {
					if (formView.validate()) {
						activities.updateItem(id, formView.getValues());
						this.closeWindow();
					}
				});
			}
			else {
				this.$$("onSave").attachEvent("onItemClick", () => {
					if (formView.validate()) {
						activities.add(formView.getValues());
						this.closeWindow();
					}
				});
			}
		});
	}

	closeWindow() {
		this.getRoot().close();
	}

	onEdit(id) {
		this.$$("editForm").setValues(activities.getItem(id));
		// activities.updateItem(id, this.$$("editForm").getValues());
	}
}
