import Updatable from './updatable';

export default class Item extends Updatable{
	constructor(data){
		super();
		this.name = data.name; 
		this.info = data.info;  
		this.image = data.image; 
		this.id = data.id || new Date().valueOf();
		this.visible = data.visible == undefined ? true: data.visible;
		this.category = data.category || 'others'; 
		this.edited = data.edited == undefined ? true : data.edited;
		this.type = 'item';
	}
} 