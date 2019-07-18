import {JetView} from "webix-jet";
import {icons} from "../../../models/icons";

export default class DataEdit extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this._dta = data;
	}

	config() {
		const _ = this.app.getService("locale")._;

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
					leftSplit: 1,
					columns: [
						{
							id: "Icon",
							editor: "combo",
							collection: icons,
							header: '<i class="fas fa-icons"></i>',
							width: 45,
							template: "<span class='fas #Icon#' style='width: 18px;'></span>",
							suggest: {
								template: "#value#",
								body: {
									template: "<span class='fas #value#' style='width: 18px;'></span>"
								}
							}
						},
						{id: "Value", editor: "text", header: _("Value"), minWidth: 110, fillspace: true},
						{header: "", width: 40, template: "{common.trashIcon()}"}
					],
					onClick: {
						"wxi-trash": this.deleteColumn
					}
				},
				{view: "button", value: _("Add"), click: () => { this.addRow(); }}
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
