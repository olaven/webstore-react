// Should probably be treated as an extendable class only 
/**
 * Implements an update-method. 
 * This method receives an object. 
 * If the object contains the same key as on the 
 * inheriting class, it will be replaced (updated)
 */
export default class Updatable {
	/**
     * Update {key : newValue}
     * @param {object} data 
     */
	update(data) {
		for (let key of Object.keys(data)) {
			if (this.hasOwnProperty(key)) {
				this[key] = data[key];
				this.edited = true; 
			}
		}
	}
}