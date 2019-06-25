import {JetView} from "webix-jet";
import "./style.css";
import {contacts} from "../../models/contacts";
import ContactView from "./contactView";

export default class Start extends JetView {
	config() {
		return {
			rows: [
				{type: "header", template: "Contacts", css: "webix_header app_header"},
				{
					cols: [
						{
							view: "list",
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
								}
							}
						},
						{view: "resizer"},
						ContactView
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
		const id = this.getParam("id");
		contacts.waitData.then(
			() => {
				if (id && contactList.exists(id)) {
					contactList.select(id);
				}
				else contactList.select(contactList.getFirstId());
			}
		);
	}
}
