import {JetView} from "webix-jet";

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
					id: "name",
					header: "Name",
					sort: "string",
					fillspace: true
				},
				{
					id: "change",
					header: "Change date",
					sort: "date",
					format: webix.i18n.longDateFormatStr
				},
				{
					id: "size",
					header: "Size",
					template: obj => `${Math.floor(obj.size / 1024)} Kb`,
					sort: (n, o) => n.size - o.size
				},
				{
					id: "delete",
					header: "",
					template: "{common.trashIcon()}",
					width: 50
				}
			],
			onClick: {
				"wxi-trash": () => {
					webix.confirm({
						title: "Delete",
						text: "Are you sure you want to delete this data?"
					});
					return false;
				}
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
							autosend: false
						},
						{}
					]
				}
			]
		};
	}
}
