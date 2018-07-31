import Updatable from './updatable'; 
/**
 * Interface for an image 
 * @param {name : string, source : string} data 
 * @throws If name is not defined 
 */
export default class Image extends Updatable{
	constructor(data) {
		super(); 
		this.name = data.name || 'unnamed';
		this.id = data.id || new Date().valueOf(); 
		this.type = 'image';
		this.edited = data.edited == undefined ? true : data.edited;
		this.file = data.file || null;
		this.source = data.file ? URL.createObjectURL(data.file) : data.source;
	}
} 