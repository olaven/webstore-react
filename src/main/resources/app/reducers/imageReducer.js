import { fromJS } from 'immutable';
import { cloneDeep } from 'lodash';

import * as imageActions from '../actions/imageActions';
import * as repoService from '../services/repoService';

const initialState = fromJS({
	images: [],
	deletedImages: [],
	backup: [],
	edited: false
});

function addImage(oldState, action) {
	let state = oldState;
	state = state.updateIn(['images'], function(images) {
		images = images.push(action.image);
		return images;
	});
	if (action.edit) {
		state = state.set('edited', true);
	}
	return state;
}

function addImages(oldState, action) {
	let state = oldState;
	state = state.updateIn(['images'], function(images) {
		images = images.concat(action.data);
		return images;
	});
	state = state.set('backup', cloneDeep(state.get('images')));
	return state;
}

function deleteImage(oldState, action) {
	let state = oldState;
	state = state.updateIn(['images'], function(images) {
		images = images.splice(images.indexOf(action.image), 1);
		return images;
	});
	state = state.updateIn(['deletedImages'], function(images) {
		images = images.push(action.image);
		return images;
	});
	state = state.set('edited', true);
	return state;
}

function editImage(oldState, action) {
	let state = oldState;
	state = state.updateIn(['images'], function(images) {
		let image = images.find(image => image.id == action.data.id);
		let oldImage = image;
		image.update(action.data);
		images = images.splice(images.indexOf(image), 1, image);
		return images;
	});
	state = state.set('edited', true);
	return state;
}

function save(oldState, action) {
	let state = oldState;
	state = state.updateIn(['images'], function(images) {
		images.forEach(image => {
			if (image.edited) {
				image.edited = false; 
				repoService.editImage(image);
			}
		});
		return images;
	});
	state = state.updateIn(['deletedImages'], function(images) {
		images.forEach(image => {
			repoService.removeImage(image);
		});
		return fromJS([]);
	});
	state = state.set('backup', cloneDeep(state.get('images'))); 
	state = state.set('edited', false);
	return state;
}

function cancelSave(oldState, action) {
	let state = oldState;
	state = state.set('images', cloneDeep(state.get('backup')));
	state = state.set('deletedImages', fromJS([]));
	state = state.set('edited', false);  
	return state;
}



export function imageReducer(state = initialState, action) {
	switch (action.type) {
	case imageActions.actions.addImages:
		return addImages(state, action);	
	case imageActions.actions.cancelSave:
		return cancelSave(state, action);
	case imageActions.actions.save:
		return save(state, action);
	case imageActions.actions.changeImage:
		return editImage(state, action);
	case imageActions.actions.addImage:
		return addImage(state, action);
	case imageActions.actions.deleteImage:
		return deleteImage(state, action);
	default:
		return state;
	}
}
