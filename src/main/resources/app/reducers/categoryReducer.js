import { fromJS } from 'immutable';
import { cloneDeep } from 'lodash';

import * as categoryActions from '../actions/categoryActions';
import * as repoService from '../services/repoService';

const initialState = fromJS({
	categories: [],
	deletedCategories: [],
	backup: [],
	edited: false
});


function sortCategories(state){
	state = state.updateIn(['categories'], function (categories) {
		return categories.sort((a,b) => b.id - a.id);
	});
	return state;
}

function createCategory(oldState, action){
	let state = oldState;
	state = state.updateIn(['categories'], function (categories) {
		categories = categories.push(action.category);
		return categories;
	});
	state = sortCategories(state);
	return state;
}

function addCategories(oldState, action){
	let state = oldState;
	state = state.updateIn(['categories'], function (categories) {
		categories = categories.concat(action.categories);
		return categories;
	});
	if(action.edit){
		state = state.set('edited', true);
	}
	state = sortCategories(state);
	state = state.set('backup', cloneDeep(state.get('categories')));
	return state;
}

function deleteCategory(oldState, action){
	let state = oldState;
	state = state.updateIn(['categories'], function (categories) {
		categories = categories.splice(categories.indexOf(action.category), 1);
		return categories;
	});
	state = state.updateIn(['deletedCategories'], function (categories) {
		categories = categories.push(action.category);
		return categories;
	});
	state = state.set('edited', true);
	return state;
}

function toggleCategoryVisible(oldState, action){
	let state = oldState;
	state = state.updateIn(['categories'], function(categories) {
		action.category.visible = action.category.visible ? false : true;
		action.category.edited = true;
		categories = categories.splice(categories.indexOf(action.category), 1, action.category);
		return categories;
	});
	state = state.set('edited', true);
	return state;
}

function changeCategory(oldState, action){
	let state = oldState;
	state = state.updateIn(['categories'], function (categories) {
		let category = categories.find(categorie => categorie.id == action.data.id);
		let oldCategoy = category;
		category.update(action.data);
		categories = categories.splice(categories.indexOf(oldCategoy), 1, category);
		return categories;
	});
	state = state.set('edited', true);
	return state;
}


function save(oldState, action){
	let state = oldState;
	state = state.updateIn(['categories'], function(categories) {
		categories.forEach(category => {
			if(category.edited){
				category.edited = false;
				repoService.editCategory(category);
			}
		});
		return categories;
	});
	state = state.updateIn(['deletedCategories'], function(categories) {
		categories.forEach(category => {
			repoService.removeCategory(category);
		});
		return fromJS([]);
	});

	state = state.set('edited', false);
	state = state.set('backup', cloneDeep(state.get('categories')));
	return state;
}

function cancelSave(oldState, action){
	let state = oldState;

	state = state.set('categories', cloneDeep(state.get('backup')));
	state = state.set('deletedCategories', fromJS([]));
	state = state.set('edited', false); 
	return state;
}



export function categoryReducer(state = initialState, action) {
	switch (action.type) {
	case categoryActions.actions.addCategories:
		return addCategories(state,action);
	case categoryActions.actions.cancelSave:
		return cancelSave(state,action);
	case categoryActions.actions.save:
		return save(state,action);
	case categoryActions.actions.changeCategory:
		return changeCategory(state,action);
	case categoryActions.actions.toggleCategoryVisible:
		return toggleCategoryVisible(state, action);
	case categoryActions.actions.deleteCategory:
		return deleteCategory(state, action);
	case categoryActions.actions.createCategory:
		return createCategory(state, action);

      
	default:
		return state;
	}
}