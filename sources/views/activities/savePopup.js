import {JetView} from "webix-jet";

export default class SaveForm extends JetView {
	config() {
		return {
			view: "window",
			position: "center",
			modal: true,
			id: "window",
			move: true,
			width: 500,
			head: {
				cols: [
					{template: "Title", type: "header", borderless: true},
					{view: "icon",
						icon: "wxi-close",
						tooltip: "Close window",
						click: () => this.closeWindow()
					}
				]
			},
			body: {
				padding: 10,
				rows: [
					{
						view: "textarea",
						label: "Details",
						height: 150
					},
					{
						view: "combo",
						label: "Type"
					},
					{
						view: "combo",
						label: "Contact"
					},
					{
						margin: 10,
						cols: [
							{
								view: "datepicker",
								label: "Date"
							},
							{
								view: "datepicker",
								type: "time",
								label: "Time"
							}
						]
					},
					{
						view: "checkbox",
						labelRight: "Completed",
						labelWidth: 0
					},
					{
						cols: [
							{},
							{
								view: "button",
								label: "Add (*save)",
								autoWidth: true
							},
							{
								view: "button",
								label: "Cancel",
								autoWidth: true,
								click: () => this.closeWindow()
							}
						]
					}
				]
			}
		};
	}

	showWindow() {
		this.getRoot().show();
	}

	closeWindow() {
		this.getRoot().close();
	}
}
