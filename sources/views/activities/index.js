import {JetView} from "webix-jet";
import {activities} from "../../models/activities";
import {contacts} from "../../models/contacts";
import {activitytypes} from "../../models/activitytypes";
import SaveForm from "./savePopup";
import "./style.css";

function activitiesFilter(obj) {
	const currentDate = new Date().setHours(0, 0, 0, 0);
	let tomorrowDate = new Date(currentDate);
	tomorrowDate.setDate(tomorrowDate.getDate() + 1);
	let lastDayWeek = new Date(currentDate);
	lastDayWeek.setDate(lastDayWeek.getDate() - lastDayWeek.getDay() + 6);
	obj.table.registerFilter(
		obj.tabs,
		{
			compare: (val, filter, item) => {
				const actualDate = new Date(item.DueDate).setHours(0, 0, 0, 0);
				switch (filter) {
					case "all":
						return true;
					case "today":
						return +actualDate === +currentDate;
					case "tomorrow":
						return +actualDate === +tomorrowDate;
					case "thisWeek":
						return +actualDate >= +currentDate && +actualDate <= +lastDayWeek;
					case "thisMonth":
						return false;
					case "overdue":
						return +actualDate < +currentDate && item.State !== "Close";
					case "completed":
						return item.State === "Close";
					default:
						break;
				}
				return false;
			}
		},
		{
			getValue: filter => filter.getValue(),
			setValue: (filter, value) => {
				filter.setValue(value);
			}
		}
	);
}

export default class Activities extends JetView {
	config() {
		let Toolbar = {
			view: "toolbar",
			borderless: true,
			paddingX: 10,
			elements: [
				{
					view: "tabbar",
					localId: "activitiesTab",
					borderless: true,
					options: [
						{id: "all", value: "All"},
						{id: "today", value: "Today"},
						{id: "tomorrow", value: "Tomorrow"},
						{id: "thisWeek", value: "This week"},
						{id: "thisMonth", value: "This month"},
						{id: "overdue", value: "Overdue"},
						{id: "completed", value: "Completed"}
					],
					on: {
						onChange: () => {
							this.$$("activitiesTable").filterByAll();
						}
					}
				},
				{
					view: "button",
					css: "webix_primary",
					autowidth: true,
					type: "icon",
					icon: "fas fa-plus-square",
					label: "Add activity",
					click: () => this.window.showWindow()
				}
			]
		};

		let ActivitiesTable = {
			view: "datatable",
			scroll: "auto",
			css: "activities-table",
			localId: "activitiesTable",
			leftSplit: 1,
			rightSplit: 2,
			columns: [
				{id: "State", header: "", width: 40, checkValue: "Close", uncheckValue: "Open", template: "{common.checkbox()}"},
				{id: "TypeID", header: ["Activity type", {content: "richSelectFilter"}], width: 150, collection: activitytypes, sort: "string"},
				{id: "DueDate", header: ["Due date", {content: "dateRangeFilter"}], width: 300, sort: "date", format: webix.i18n.dateFormatStr},
				{id: "Details", minWidth: 250, fillspace: true, sort: "string", header: ["Details", {content: "textFilter"}]},
				{id: "ContactID", header: ["Contacts", {content: "richSelectFilter"}], minWidth: 250, fillspace: true, collection: contacts, sort: "string"},
				{header: "", width: 40, template: "{common.editIcon()}"},
				{header: "", width: 40, template: "{common.trashIcon()}"}
			],
			onClick: {
				"wxi-trash": this.deleteColumn,
				"wxi-pencil": this.editColumn
			}
		};

		return {
			rows: [
				Toolbar,
				ActivitiesTable
			]
		};
	}

	init() {
		this.window = this.ui(SaveForm);
		webix.promise.all([
			contacts.waitData,
			activities.waitData,
			activitytypes.waitData
		]).then(() => {
			activities.filter();
			const dataTable = this.$$("activitiesTable");
			const tabFilter = this.$$("activitiesTab");
			this.$$("activitiesTable").sync(activities);
			activitiesFilter({table: dataTable, tabs: tabFilter});
		});
	}

	editColumn(_e, id) {
		this.$scope.window.showWindow(id);
		return false;
	}

	deleteColumn(_e, id) {
		webix.confirm({
			title: "Delete",
			text: "Are you sure?"
		}).then(() => {
			activities.remove(id);
		});
		return false;
	}
}
