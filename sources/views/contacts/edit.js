import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";

export default class EditView extends JetView {
	config() {
		return {
			rows: [
				{type: "header", template: "Edit (*add new) contact", css: "webix_header app_header"},
				{
					view: "form",
					localId: "formView",
					elements: [
						{
							margin: 30,
							cols: [
								{
									rows: [
										{
											view: "text",
											label: "First name",
											name: "FirstName",
											labelWidth: 90
										},
										{
											view: "text",
											label: "Last name",
											name: "LastName",
											labelWidth: 90
										},
										{
											view: "datepicker",
											label: "Joining date",
											name: "StartDate",
											labelWidth: 90
										},
										{
											view: "richselect",
											label: "Contact",
											name: "StatusID",
											labelWidth: 90,
											options: {
												body: {
													template: "#value#",
													data: statuses
												}
											}
										},
										{
											view: "text",
											label: "Job",
											name: "Job",
											labelWidth: 90
										},
										{
											view: "text",
											label: "Company",
											name: "Company",
											labelWidth: 90
										},
										{
											view: "text",
											label: "Website",
											labelWidth: 90
										},
										{
											view: "textarea",
											label: "Address",
											name: "Address",
											labelWidth: 90
										}
									]
								},
								{
									rows: [
										{
											view: "text",
											name: "Email",
											label: "Email"
										},
										{
											view: "text",
											name: "Skype",
											label: "Skype"
										},
										{
											view: "text",
											name: "Phone",
											label: "Phone"
										},
										{
											view: "datepicker",
											name: "Birthday",
											label: "Birthday"
										}
									]
								}
							]
						},
						{},
						{
							cols: [
								{},
								{
									view: "button",
									autowidth: true,
									value: "Cancel",
									click() {
										this.$scope.show("contacts.contactView");
									}
								},
								{
									view: "button",
									autowidth: true,
									value: "Save (*add)",
									localId: "onSave"
								}
							]
						}
					]
				}
			]
		};
	}

	init() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			let formView = this.$$("formView");
			this.$$("onSave").attachEvent("onItemClick", () => {
				if (formView.validate()) {
					contacts.add(formView.getValues());
				}
			});
		});
	}
}
