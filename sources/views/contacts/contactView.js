import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";

export default class Start extends JetView {
	config() {
		let Toolbar = {
			view: "toolbar",
			paddingX: 10,
			elements: [
				{
					view: "label",
					label: "Name Surname",
					localId: "fullName"
				},
				{
					view: "button",
					autowidth: true,
					type: "icon",
					icon: "far fa-trash-alt",
					disabled: true,
					label: "Delete"
				},
				{
					view: "button",
					autowidth: true,
					type: "icon",
					icon: "far fa-edit",
					disabled: true,
					label: "Edit"
				}
			]
		};

		let Info = {
			type: "form",
			cols: [
				{
					maxWidth: 200,
					borderless: true,
					template: this.selectedContactImg,
					autoheight: true,
					localId: "templateImg"
				},
				{rows: [
					{
						template: this.selectedContact,
						autoheight: true,
						borderless: true,
						css: "contact-info",
						localId: "templateInfo"
					}
				]}
			]

		};

		return {
			rows: [
				Toolbar,
				{
					cols: [
						Info
					]
				},
				{}
			]
		};
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			let id = this.getParam("id");
			if (id && contacts.exists(id)) {
				let contactItem = contacts.getItem(id);
				this.setLabel(this.$$("fullName"), `${contactItem.FirstName} ${contactItem.LastName}`);
				this.$$("templateImg").setValues({Photo: contactItem.Photo, Status: statuses.getItem(contactItem.StatusID).Value});
				this.$$("templateInfo").setValues(contactItem);
			}
		});
	}

	selectedContactImg(obj) {
		let photo = obj.Photo || "https://www.achievesuccesstutoring.com/wp-content/uploads/2019/05/no-photo-icon-22.jpg.png";
		let status = obj.Status || " ";
		return `
			<img src="${photo}" class="contact-info_photo" ondragstart="return false"/>
			<div class="text-center">${status}</div>
		`;
	}

	selectedContact(obj) {
		return `
			<div>
				<i class="fas fa-envelope"></i> <span>${obj.Email || ""}</span><br>
				<i class="fab fa-skype"></i> <span>${obj.Skype || ""}</span><br>
				<i class="fas fa-tag"></i> <span>${obj.Job || ""}</span><br>
				<i class="fas fa-briefcase"></i> <span>${obj.Company || ""}</span><br>
			</div>
			<div>
				<i class="far fa-calendar-alt"></i> <span>${webix.i18n.dateFormatStr(obj.Birthday) || ""}</span><br>
				<i class="fas fa-map-marker-alt"></i> <span>${obj.Address || ""}</span>
			</div>
		`;
	}

	setLabel(obj, value) {
		obj.define("label", value);
		obj.refresh();
	}
}
