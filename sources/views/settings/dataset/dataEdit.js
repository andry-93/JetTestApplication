import {JetView} from "webix-jet";
import {icons} from "../../../models/icons";

export default class DataEdit extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this._dta = data;
	}

	config() {
		return {
			rows: [
				{
					view: "datatable",
					localId: "dataTable",
					editable: true,
					editaction: "click",
					css: "webix_shadow_medium",
					scroll: "auto",
					rightSplit: 1,
					columns: [
						{id: "Value", editor: "text", header: "Value", minWidth: 110, fillspace: true},
						{
							id: "Icon",
							editor: "combo",
							collection: icons,
							header: "Icon",
							width: 50,
							template: "<span class='fas #Icon#' style='width: 18px;'></span>",
							suggest: {
								template: "#value#",
								body: {
									template: "<span class='fas #value#' style='width: 18px;'></span>"
								}
							}
						},
						{header: "", width: 40, template: "{common.trashIcon()}"}
					],
					onClick: {
						"wxi-trash": this.deleteColumn
					}
				},
				{view: "button", value: "Add", click: () => { this.addRow(); }}
			]
		};
	}

	init() {
		this.$$("dataTable").sync(this._dta);
	}

	addRow() {
		let dataTable = this.$$("dataTable");
		let data = {id: "", Value: "", Icon: ""};
		dataTable.editStop();
		this._dta.waitSave(() => {
			this._dta.add(data, 0);
		}).then((res) => {
			dataTable.editRow(res.id);
		});
	}

	deleteColumn(_e, id) {
		webix.confirm({
			title: "Delete",
			text: "Are you sure?"
		}).then(() => {
			this.$scope._dta.remove(id);
		});
		return false;
	}
}
