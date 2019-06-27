const dateFormat = webix.Date.strToDate("%d-%m-%Y %h:%i");

export const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (obj) => {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			obj.Birthday = dateFormat(obj.Birthday);
			obj.StartDate = dateFormat(obj.StartDate);
		},
		$save: (obj) => {
			obj.Birthday = webix.i18n.parseFormatStr(obj.Birthday);
			obj.StartDate = webix.i18n.parseFormatStr(obj.StartDate);
		}
	}
});
