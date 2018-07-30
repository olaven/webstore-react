// This file exports all relevant urls in this app 

const PREFIX = "/app/com.enonic.app.webstore.react"; 

const URLS = {
	storefront : PREFIX + "/storefront", 
	cart : PREFIX + "/cart", 
	admin : {
		items : PREFIX + "/admin", 
		categories: PREFIX + "/admin/categories", 
		images : PREFIX + "/admin/images"
	}
};

module.exports = URLS; URLS;