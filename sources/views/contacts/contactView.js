import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";
import {activities} from "../../models/activities";
import {files} from "../../models/files";
import activitiesInfo from "./activitiesInfo";
import filesInfo from "./filesInfo";

export default class Start extends JetView {
	config() {
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
					label: "Delete",
					click: () => {
						const id = this.getParam("id", true);
						webix.confirm({
							title: "Delete",
							text: "Are you sure?"
						}).then((_e) => {
							this.deleteContact(_e, id);
						});
						return false;
					}
				},
				{
					view: "button",
					autowidth: true,
					type: "icon",
					icon: "far fa-edit",
					label: "Edit",
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
										{id: "activitiesInfo", value: "Activities"},
										{id: "filesInfo", value: "Files"}
									]
								},
								{
									cells: [
										{id: "activitiesInfo", $subview: activitiesInfo},
										{id: "filesInfo", $subview: filesInfo}
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
		let id = this.getParentView().getParam("id");
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			if (id && contacts.exists(id)) {
				let contactItem = contacts.getItem(id);
				this.$$("templateName").setValues({value: contactItem.value});
				this.$$("templateImg").setValues({Photo: contactItem.Photo, Status: statuses.getItem(contactItem.StatusID).Value});
				this.$$("templateInfo").setValues(contactItem);
			}
		});
	}

	selectedContactImg(obj) {
		let photo = obj.Photo || "./sources/styles/img/nouser.jpg";
		let status = obj.Status || "";
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

	selectedName(obj) {
		return `<span>${obj.value || ""}</span>`;
	}

	deleteContact(_e, id) {
		contacts.remove(id);
		const activitiList = activities.find(obj => obj.ContactID.toString() === id.toString());
		if (activitiList.length !== 0) {
			activitiList.forEach(obj => activities.remove(obj.id));
		}
		const fileList = files.find(obj => obj.ContactID.toString() === id.toString());
		if (fileList.length !== 0) {
			fileList.forEach(obj => files.remove(obj.id));
		}
		this.show("contacts.contactView");
	}
}
