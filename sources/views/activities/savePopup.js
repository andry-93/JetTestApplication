import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {activityTypes} from "../../models/activityTypes";
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
					{template: "Add (*edit) activity", type: "header", borderless: true, localId: "headerWindow"},
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
						options: activityTypes
					},
					{
						view: "richselect",
						label: "Contact",
						name: "ContactID",
						localId: "contact",
						options: contacts
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
								autoWidth: true,
								css: "webix_primary"
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

	init() {
		const formView = this.$$("editForm");
		const button = this.$$("onSave");
		this.on(button, "onItemClick", () => {
			if (formView.validate()) {
				if (this.id) { activities.updateItem(this.id, formView.getValues()); }
				else { activities.add(formView.getValues()); }
				this.closeWindow();
			}
		});
	}

	showWindow(id, disable = false) {
		this.getRoot().show();
		this.id = id;
		webix.promise.all([
			contacts.waitData,
			activityTypes.waitData,
			activities.waitData
		]).then(() => {
			const formView = this.$$("editForm");
			const button = this.$$("onSave");
			let mode = this.id ? "Edit" : "Add";
			button.setValue(mode);
			this.$$("headerWindow").setHTML(`${mode} activity`);
			if (this.id) formView.setValues(activities.getItem(this.id));
			if (disable) this.$$("contact").disable();
			else this.$$("contact").enable();
		});
	}

	closeWindow() {
		const formView = this.$$("editForm");
		formView.clear();
		formView.clearValidation();
		this.getRoot().hide();
	}
}
