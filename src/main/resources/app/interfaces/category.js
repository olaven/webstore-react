import Updatable from './updatable'; 

export default class Category extends Updatable {
	constructor(data){
		super(); 
		console.log(data)
		this.title = data.title; 
		this.id = data.id || new Date().valueOf(); 
		this.visible = data.visible || true; 
		this.filter = data.filter;
		this.edited = data.edited == undefined ? true: data.edited;
		this.type = 'category';
	}
}