import {JetView} from "webix-jet";
import "./style.css";
import {contacts} from "../../models/contacts";

export default class Start extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					cols: [
						{
							type: "list",
							rows: [
								{
									view: "text",
									placeholder: _("Find a contact"),
									on: {
										onTimedKeyPress() {
											let text = this.getValue().toString().toLowerCase();
											this.$scope.$$("contactList").filter((obj) => {
												let filter = [
													obj.value,
													obj.Company,
													obj.Address,
													obj.Job,
													obj.Website,
													obj.Phone,
													obj.Email
												].join("|");
												filter = filter.toString().toLowerCase();
												return filter.indexOf(text) !== -1;
											});
										}
									}
								},
								{
									view: "list",
									borderless: true,
									localId: "contactList",
									select: true,
									scroll: "auto",
									css: "contact-list",
									template: "<div class='contact-list_avatar' style='background-image: url(#Photo#)'></div><div><div>#FirstName# #LastName#</div><div>#Email#</div></div>",
									width: 300,
									type: {
										height: 62
									},
									on: {
										onAfterSelect(id) {
											this.$scope.show({contactId: id}).then(() => this.$scope.show("contacts.contactView"));
										}
									}
								},
								{},
								{
									view: "button",
									type: "icon",
									icon: "fas fa-plus",
									label: _("Add contact"),
									click() {
										this.$scope.setParam("mode", "Add");
										this.$scope.show("contacts.edit");
									}
								}
							]
						},
						{view: "resizer"},
						{$subview: true}
					]
				}
			]
		};
	}

	init() {
		this.$$("contactList").sync(contacts);
	}

	urlChange() {
		const contactList = this.$$("contactList");
		const idSelectItem = contactList.getSelectedId();
		const id = this.getParam("contactId");
		contacts.waitData.then(
			() => {
				if (id && contactList.exists(id)) {
					if (!idSelectItem) {
						contactList.select(id);
					}
				}
				else contactList.select(contactList.getFirstId());
			}
		);
	}
}
