import Updatable from './updatable';
import Image from './image'; 
import Category from './category';

export default class Item extends Updatable{
	constructor(data){
		super();
		this.name = data.name; 
		this.info = data.info;  
		this.image = data.image || new Image({}); 
		this.id = data.id || new Date().valueOf();
		this.visible = data.visible == undefined ? true: data.visible;
		this.category = data.category || new Category({title : "others", filter : "others"}); 
		this.edited = data.edited == undefined ? true : data.edited;
		this.type = 'item';
	}
} 