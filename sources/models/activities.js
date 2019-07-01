const dateFormat = webix.Date.strToDate("%d-%m-%Y %H:%i");
const saveFormatDate = webix.Date.dateToStr("%Y-%m-%d");
const saveFormatTime = webix.Date.dateToStr("%H:%i");
const saveFormatDateTime = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			obj.DueDate = dateFormat(obj.DueDate);
			obj.DueTime = obj.DueDate;
		},
		$update: (obj) => {
			obj.DueDate = `${saveFormatDate(obj.DueDate)} ${saveFormatTime(obj.DueTime)}`;
			obj.DueDate = new Date(obj.DueDate);
		},
		$save: (obj) => {
			obj.DueDate = saveFormatDateTime(obj.DueDate);
		}
	}
});
