import {JetView} from "webix-jet";
import {files} from "../../models/files";

export default class FilesInfo extends JetView {
	config() {
		const contactTable = {
			view: "datatable",
			localId: "filesTable",
			select: true,
			scroll: true,
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
					width: 150,
					format: webix.i18n.longDateFormatStr
				},
				{
					id: "Size",
					header: "Size",
					template: obj => `${Math.floor(obj.Size / 1024)} Kb`,
					sort: (n, o) => n.Size - o.Size
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
									const id = this.getParam("contactId", true);
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
			files.data.filter(file => file.contactId.toString() === this.getParam("contactId", true).toString());
			this.$$("filesTable").sync(files);
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
