import {JetView} from "webix-jet";
import {files} from "../../models/files";

export default class filesInfo extends JetView {
	config() {
		const contactTable = {
			view: "datatable",
			localId: "contactFilesTable",
			select: true,
			scroll: "auto",
			rightSplit: 1,
			columns: [
				{
					id: "Name",
					header: "Name",
					sort: "string",
					fillspace: true
				},
				{
					id: "Change",
					header: "Change date",
					sort: "date",
					format: webix.i18n.longDateFormatStr
				},
				{
					id: "Size",
					header: "Size",
					template: obj => `${Math.floor(obj.size / 1024)} Kb`,
					sort: (n, o) => n.size - o.size
				},
				{
					id: "delete",
					header: "",
					template: "{common.trashIcon()}",
					width: 40
				}
			],
			onClick: {
				"wxi-trash": this.deleteColumn
			}
		};
		return {
			rows: [
				contactTable,
				{
					cols: [
						{},
						{
							autowidth: true,
							view: "uploader",
							type: "icon",
							label: " Upload file",
							icon: "fas fa-cloud-upload-alt",
							autosend: false,
							on: {
								onBeforeFileAdd: (upload) => {
									const id = this.getParam("id", true);
									files.add({
										Name: upload.name,
										Change: upload.file.lastModifiedDate,
										Size: upload.file.size,
										contactId: id
									});
									return false;
								}
							}
						},
						{}
					]
				}
			]
		};
	}

	urlChange() {
		files.waitData.then(() => {
			files.data.filter(file => file.contactId.toString() === this.getParam("id", true).toString());
			this.$$("contactFilesTable").sync(files);
		});
	}

	deleteColumn(_e, id) {
		webix.confirm({
			title: "Delete",
			text: "Are you sure?"
		}).then(() => {
			files.remove(id);
		});
		return false;
	}
}
