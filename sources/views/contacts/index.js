import {JetView} from "webix-jet";
import "./style.css";
import {contacts} from "../../models/contacts";

export default class Start extends JetView {
	config() {
		return {
			rows: [
				{
					cols: [
						{
							type: "list",
							rows: [
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
										onAfterSelect: (id) => {
											this.setParam("id", id, true);
											this.show("contacts.contactView");
										}
									}
								},
								{},
								{
									view: "button",
									type: "icon",
									icon: "fas fa-plus",
									label: "Add contact",
									click() {
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
		const id = this.getParam("id");
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
