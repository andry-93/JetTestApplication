const dateFormat = webix.Date.strToDate("%d-%m-%Y %h:%i");

export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			obj.DueDate = dateFormat(obj.DueDate);
		},
		$save: (obj) => {
			obj.DueDate = webix.i18n.parseFormatStr(obj.DueDate);
		}
	}
});
