import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";
import {activities} from "../../models/activities";
import {files} from "../../models/files";
import ActivitiesInfo from "./activitiesInfo";
import FilesInfo from "./filesInfo";

export default class Start extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		let Toolbar = {
			view: "toolbar",
			borderless: true,
			elements: [
				{
					rows: [
						{},
						{
							template: this.selectedName,
							type: "clean",
							autoheight: true,
							borderless: true,
							css: "contact-info",
							localId: "templateName"
						},
						{}
					]
				},
				{
					view: "button",
					autowidth: true,
					type: "icon",
					icon: "far fa-trash-alt",
					label: _("Delete"),
					click() {
						this.$scope.deleteContact();
					}
				},
				{
					view: "button",
					autowidth: true,
					type: "icon",
					icon: "far fa-edit",
					label: _("Edit"),
					click() {
						this.$scope.getParentView().setParam("mode", "Edit");
						this.$scope.show("contacts.edit");
					}
				}
			]
		};

		let Info = {
			paddingX: -10,
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
			type: "form",
			localId: "container",
			rows: [
				{
					rows: [
						Toolbar,
						{
							cols: [
								Info
							]
						},
						{height: 20},
						{
							borderless: true,
							rows: [
								{
									view: "tabbar",
									localId: "contactTableTabBar",
									multiview: true,
									options: [
										{id: "ActivitiesInfo", value: _("Activities")},
										{id: "FilesInfo", value: _("Files")}
									]
								},
								{
									cells: [
										{id: "ActivitiesInfo", $subview: ActivitiesInfo},
										{id: "FilesInfo", $subview: FilesInfo}
									]
								}
							]
						}
					]
				}
			]
		};
	}

	urlChange() {
		let id = this.getParam("contactId", true);
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			if (id && contacts.exists(id)) {
				let contactItem = contacts.getItem(id);
				this.$$("templateName").setValues({value: contactItem.value});
				this.$$("templateImg").setValues({
					Photo: contactItem.Photo,
					Status: statuses.getItem(contactItem.StatusID).Value,
					Icon: statuses.getItem(contactItem.StatusID).Icon
				});
				this.$$("templateInfo").setValues(contactItem);
			}
		});
	}

	selectedContactImg(obj) {
		let photo = obj.Photo || "./sources/styles/img/nouser.jpg";
		let status = obj.Status || "";
		let icon = obj.Icon || "";
		return `
			<img src="${photo}" class="contact-info_photo" ondragstart="return false"/>
			<div class="text-center"><span class='fas ${icon}' style='width: 18px;'></span> ${status}</div>
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

	selectedName(obj) {
		return `<span>${obj.value || ""}</span>`;
	}

	deleteContact() {
		const _ = this.app.getService("locale")._;
		const id = this.getParam("contactId", true);
		const activitiList = activities.find(obj => obj.ContactID.toString() === id.toString());
		const fileList = files.find(obj => obj.ContactID.toString() === id.toString());
		webix.confirm({
			title: _("Delete"),
			text: _("Are you sure?")
		}).then(() => {
			contacts.remove(id);
			if (!this.isEmpty(activitiList)) {
				activitiList.forEach(obj => activities.remove(obj.id));
			}
			if (!this.isEmpty(fileList)) {
				fileList.forEach(obj => files.remove(obj.id));
			}
			this.show("contacts.contactView");
		});
		return false;
	}

	isEmpty(obj) {
		return Object.keys(obj).length === 0;
	}
}
