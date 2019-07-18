import {JetView} from "webix-jet";
import {activities} from "../../models/activities";
import {contacts} from "../../models/contacts";
import {activityTypes} from "../../models/activityTypes";
import SaveForm from "./savePopup";
import "./style.css";

function activitiesFilter(obj) {
	const currentDate = new Date().setHours(0, 0, 0, 0);
	let currentYear = new Date(currentDate).getFullYear();
	let currentMonth = new Date(currentDate).getMonth();
	let tomorrowDate = new Date(currentDate);
	tomorrowDate.setDate(tomorrowDate.getDate() + 1);
	let lastDayWeek = new Date(currentDate);
	let lastDayMonth = new Date(currentYear, currentMonth + 1, 0);
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
						return +actualDate >= +currentDate && +actualDate <= +lastDayMonth;
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
		const _ = this.app.getService("locale")._;

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
						{id: "all", value: _("All")},
						{id: "today", value: _("Today")},
						{id: "tomorrow", value: _("Tomorrow")},
						{id: "thisWeek", value: _("This week")},
						{id: "thisMonth", value: _("This month")},
						{id: "overdue", value: _("Overdue")},
						{id: "completed", value: _("Completed")}
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
					label: _("Add activity"),
					click: () => this.window.showWindow()
				}
			]
		};

		let ActivitiesTable = {
			view: "datatable",
			scroll: true,
			css: "activities-table",
			localId: "activitiesTable",
			leftSplit: 1,
			rightSplit: 2,
			columns: [
				{id: "State", header: "", width: 40, checkValue: "Close", uncheckValue: "Open", template: "{common.checkbox()}"},
				{
					id: "TypeID",
					header: [_("Activity type"), {content: "richSelectFilter"}],
					width: 150,
					options: activityTypes,
					template: (obj, common, val, config) => {
						const item = config.collection.getItem(obj.TypeID);
						return `<span class='fas ${item.Icon}' style='width: 18px;'></span> ${item.Value}`;
					},
					sort: "string"
				},
				{id: "DueDate", header: [_("Due date"), {content: "dateRangeFilter"}], width: 300, sort: "date", format: webix.i18n.dateFormatStr},
				{id: "Details", minWidth: 250, fillspace: true, sort: "string", header: [_("Details"), {content: "textFilter"}]},
				{id: "ContactID", header: [_("Contacts"), {content: "richSelectFilter"}], minWidth: 250, fillspace: true, collection: contacts, sort: "string"},
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
			activityTypes.waitData
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
		const _ = this.$scope.app.getService("locale")._;
		webix.confirm({
			title: _("Delete"),
			text: _("Are you sure?")
		}).then(() => {
			activities.remove(id);
		});
		return false;
	}
}
