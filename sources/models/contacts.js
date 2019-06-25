export const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (obj) => {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			obj.Birthday = new Date(obj.Birthday.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
			obj.StartDate = new Date(obj.StartDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
		}
	}
});
