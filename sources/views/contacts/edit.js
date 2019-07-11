import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";

export default class EditView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{type: "header", localId: "contactLabel", template: " ", css: "webix_header app_header"},
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
											label: _("First name"),
											name: "FirstName",
											labelWidth: 90,
											invalidMessage: "First name can't be empty"
										},
										{
											view: "text",
											label: _("Last name"),
											name: "LastName",
											labelWidth: 90,
											invalidMessage: "Last name can't be empty"
										},
										{
											view: "datepicker",
											label: _("Joining date"),
											name: "StartDate",
											labelWidth: 130,
											placeholder: "mm/dd/YYYY",
											invalidMessage: "Joining date is incorrect"
										},
										{
											view: "richselect",
											label: _("Contact"),
											name: "StatusID",
											labelWidth: 90,
											options: {
												body: {
													template: "<span class='fas #Icon# style='width: 18px;'></span> #Value#",
													data: statuses
												}
											}
										},
										{
											view: "text",
											label: _("Job"),
											name: "Job",
											labelWidth: 90
										},
										{
											view: "text",
											label: _("Company"),
											name: "Company",
											labelWidth: 90,
											invalidMessage: "Company can't be empty"
										},
										{
											view: "text",
											label: _("Website"),
											labelWidth: 90,
											name: "Website"
										},
										{
											view: "textarea",
											label: _("Address"),
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
											label: "Email",
											placeholder: "e@mail.com"
										},
										{
											view: "text",
											name: "Skype",
											label: "Skype"
										},
										{
											view: "text",
											name: "Phone",
											label: _("Phone"),
											placeholder: "+ 12 345 678 90 12",
											pattern: {mask: "+ ### ## ### ## ##", allow: /[0-9]/g},
											invalidMessage: "Phone can't be empty"
										},
										{
											view: "datepicker",
											name: "Birthday",
											labelWidth: 120,
											label: _("Birthday"),
											placeholder: "mm/dd/YYYY",
											invalidMessage: "Birthday is incorrect"
										},
										{
											cols: [
												{
													paddingY: 3,
													paddingX: 2,
													rows: [
														{
															borderless: false,
															type: "clean",
															data: {
																Photo: "./sources/styles/img/nouser.jpg"
															},
															template: "<div style='height: 100%; background-size: cover; background-position: center; background-image: url(#Photo#)'></div>",
															localId: "contactPhoto"
														}
													]
												},
												{
													rows: [
														{},
														{
															view: "uploader",
															value: _("Change photo"),
															accept: "image/jpeg, image/png, image/jpg",
															multiple: false,
															on: {
																onBeforeFileAdd: (upload) => {
																	const file = upload.file;
																	const contactPhoto = this.$$("contactPhoto");
																	let reader = new FileReader();
																	reader.onload = (evt) => {
																		contactPhoto.setValues({Photo: evt.target.result});
																	};
																	reader.readAsDataURL(file);
																	return false;
																}
															}
														},
														{
															view: "button",
															label: _("Delete photo"),
															click: () => {
																this.$$("contactPhoto").setValues({Photo: "./sources/styles/img/nouser.jpg"});
															}
														}
													]
												},
												{}
											]
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
									value: _("Cancel"),
									click() {
										this.$scope.show("contacts.contactView");
									}
								},
								{
									view: "button",
									autowidth: true,
									type: "form",
									value: "",
									localId: "onSave"
								}
							]
						}
					],
					rules: {
						FirstName: webix.rules.isNotEmpty,
						LastName: webix.rules.isNotEmpty,
						StatusID: webix.rules.isNotEmpty,
						Company: webix.rules.isNotEmpty,
						StartDate: value => value <= new Date() && value !== null,
						Birthday: value => value < new Date() && value !== null
					}
				}
			]
		};
	}

	init() {
		const _ = this.app.getService("locale")._;
		const contactLabel = this.$$("contactLabel");
		const onSave = this.$$("onSave");
		const contactPhoto = this.$$("contactPhoto");
		const formView = this.$$("formView");
		const mode = this.getParam("mode", true);
		if (mode) {
			contactLabel.setHTML(`${_(mode)} ${_("contact")}`);
			onSave.setValue(_(mode));
			onSave.resize();

			webix.promise.all([
				contacts.waitData,
				statuses.waitData
			]).then(() => {
				if (mode === "Edit") {
					const id = this.getParam("contactId", true);
					const contact = contacts.getItem(id);
					if (contact.Photo || contact.Photo !== "") {
						contactPhoto.setValues({Photo: contact.Photo});
					}
					formView.setValues(contact);
				}

				onSave.attachEvent("onItemClick", () => {
					if (formView.validate()) {
						const formValues = formView.getValues();
						formValues.Photo = contactPhoto.getValues().Photo;
						if (!formValues.id) {
							contacts.add(formValues);
						}
						else {
							contacts.updateItem(formValues.id, formValues);
						}
						this.show("contacts.contactView");
					}
				});
			});
		}
	}
}
