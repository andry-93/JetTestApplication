import {JetView} from "webix-jet";
import {files} from "../../models/files";

export default class FilesInfo extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		
		const contactTable = {
			view: "datatable",
			localId: "filesTable",
			select: true,
			scroll: true,
			rightSplit: 1,
			columns: [
				{
					id: "Name",
					header: _("Name"),
					sort: "string",
					minWidth: 150,
					fillspace: true
				},
				{
					id: "Change",
					header: _("Change date"),
					sort: "date",
					minWidth: 150,
					fillspace: true,
					format: webix.i18n.longDateFormatStr
				},
				{
					id: "Size",
					header: _("Size"),
					minWidth: 100,
					fillspace: true,
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
							label: ` ${_("Upload files")}`,
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
		const _ = this.$scope.app.getService("locale")._;
		webix.confirm({
			title: _("Delete"),
			text: _("Are you sure?")
		}).then(() => {
			files.remove(id);
		});
		return false;
	}
}
