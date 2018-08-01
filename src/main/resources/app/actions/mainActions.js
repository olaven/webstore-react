import * as toasterActions from './toasterActions';
import * as imageActions from './imageActions';
import * as categoryActions from './categoryActions';
import * as itemActions from './imageActions';

import * as repoService from '../services/repoService';

// Sample data 
import SampleData from '../../sampledata/sampleData.json'; 

import Item from '../interfaces/item';
import Image from '../interfaces/image';
import Category from '../interfaces/category';

// fetch api
export const actions = {
	createItem: 'CREATE_ITEM',
	addItems: 'ADD_ITEMS',
	deleteItem: 'DELETE_ITEM',
	changeItem: 'CHANGE_ITEM',
	save: 'SAVE_ITEM',
	cancelSave: 'CANCEL_SAVE',
	toggleItemVisible: 'TOGGLE_VISIBLE',

	addItemToCart: 'ADD_ITEM_TO_CART',
	removeItemFromCart: 'REMOVE_ITEM_FROM_CART',

	checkout: 'CHECKOUT',

	searchCategory: 'SEARCH_CATEGORY',
};


function createItemAction(arg, edit){
	return {
		type: actions.createItem,	
		item: arg,
		edit: edit
	};
}

function deleteItemAction(arg){
	return {
		type: actions.deleteItem,	
		item: arg
	};
}

function changeItemAction(arg){
	return {
		type: actions.changeItem,	
		data: arg
	};
}

function addItemToCartAction(arg){
	return {
		type: actions.addItemToCart,	
		item: arg
	};
}

function removeItemFromCartAction(arg){
	return {
		type: actions.removeItemFromCart,	
		item: arg
	};
}

function toggleItemVisibleAction(arg){
	return {
		type: actions.toggleItemVisible,
		item: arg
	};
}


function checkoutAction(){
	return {
		type: actions.checkout,
	};
}



function searchCategoryAction(arg){
	return {
		type: actions.searchCategory,
		data: arg
	};
}

function saveAction(){
	return {
		type: actions.save,
	};
}

function cancelSaveAction(items){
	return {
		type: actions.cancelSave,
		items: items
	};
}

function addItemsAction(items){
	return {
		type: actions.addItems,
		items: items
	};
}


function createSampleImages(){
	let images = SampleData.images
	return Promise.all(images.map(image => 
		Promise.resolve(new Image(image))
	))
}

function createSampleCategories(){
	let categories = SampleData.categories
	return Promise.all(categories.map(category => 
		Promise.resolve(new Category(category))
	))
}

function createSampleItems(categories, images){
	let items = SampleData.items;
	items.map(item => {
		item.image = images[item.image]
		item.category = categories[item.category]
		return item
	})
	return Promise.all(items.map(item => 
		Promise.resolve(new Item(item))
	))
}



export function onLoad(dispatch){
	/*
	1. load images
	2. create image objects
	3. store image objects in redux with one action
	4. create category...
	
	6. create items objects based on items and images

	*/
	Promise.all([

		repoService.getImages()
			.then(
			//success fetching images
			images => { 
				return Promise.all(images.map(image => {
					image['edited'] = false
					return Promise.resolve(new Image(image))
				}))
					
			
				}
			)
			.catch(
			//error on fetching images
			
				response => {
					if(response.status == 404){

					// create images
						return new Promise((resolve, reject) => {	

							createSampleImages().then(images=> {
								if(images.length == SampleData.images.length){
									Promise.all(images.map(image => 
										repoService.addImage(image)
											.catch(e => {
												console.error('Something went wrong adding images to repo', e);
												reject(images);
											})
									))
								
										.then(() => {
											resolve(images);
										});
								} 
							
								else {
									console.error('something went wrong creating sampleImages');
									reject(images);
								}
							});
						});
					} else {
						console.error('something went wrong fetching images from repo', response);
					}
				}
			),

		repoService.getCategories()
			.then(
			//success on fetching categories
			categories => {
				return Promise.all(categories.map(category => {
					category['edited'] = false
					return Promise.resolve(new Category(category))
				}))
			}
		)
		.catch(

			//error on fetching categories
				response => {
					if(response.status == 404){
					// create categories
						return new Promise((resolve, reject) => {	

							createSampleCategories().then(categories => {
								
								if(categories.length == SampleData.categories.length){
									Promise.all(categories.map(category => 
										repoService.addCategory(category)
											.catch(e => {

												console.error('Something went wrong adding category to repo', e);
												reject(categories);
											})
									))
								
										.then(() => {
											resolve(categories);
										});
								} 
							
								else {
									console.error('something went wrong creating sampleCategories');
									reject(categories);
								}
							});
						});
					} else {
						console.error('something went wrong fetching categories from repo', response);
					}
				}
			)
	])
		
	//create items
		.then(objects => {
			let images = objects[0];
			let categories = objects[1];
			dispatch(imageActions.addImagesAction(images));
			dispatch(categoryActions.addCategoriesAction(categories));
			console.log(images)
		return repoService.getItems()
		.then(
			//success on fetching Items
			items => {

				items.map(item => {
					
					item.image = images.filter(image => image.id == item.image.id)[0]
					item.category = categories.filter(category => category.id == item.category.id)[0]
					return item
				})
				return Promise.all(items.map(item => {
					item['edited'] = false
					return Promise.resolve(new Item(item))
				}))
			}
		)
		.catch(
			//error on fetching items
			response => {
				if(response.status == 404){

					// create items
					return new Promise((resolve, reject) => {	

						createSampleItems(categories, images).then(items => {

							if(items.length == SampleData.items.length){

								Promise.all(items.map(item => 
									repoService.addItem(item)
									.catch(e => {

										console.error("Something went wrong adding item to repo", e)
										reject(items)
									})
								))
								
											.then(() => {
												resolve(items);
											});
									} 
							
									else {
										console.error('something went wrong creating sampleItems');
										reject(items);
									}
								});
							});
						} else {
							console.error('something went wrong fetching items from repo', response);
						}
					}
				);


		})
		.then(items => 
			dispatch(addItemsAction(items))
		);
	


}


export function cancelSave(dispatch){
	repoService.getItems().then(response =>
		response = response.map(data => new Item(data))
	).then(items =>
		dispatch(cancelSaveAction(items))
	);
}

export function save(dispatch){
	toasterActions.showToaster(dispatch, 'Saved');
	dispatch(saveAction());
}


export function searchCategory(dispatch, arg){
	dispatch(searchCategoryAction(arg));
}


export function checkout(dispatch){
	toasterActions.showToaster(dispatch, 'Thank you for your purchase!');
	dispatch(checkoutAction());
}


export function toggleItemVisible(dispatch, arg){
	dispatch(toggleItemVisibleAction(arg));
}

export function createItem(dispatch, arg, edit){ 
	//promise 
	//repo.add(arg)
	dispatch(createItemAction(arg, edit));
}

export function deleteItem(dispatch, arg){ 
	//promise 
	dispatch(deleteItemAction(arg));
}

export function changeItem(dispatch, arg){ 
	//promise 
	dispatch(changeItemAction(arg));
}

export function addItemToCart(dispatch, arg){ 
	//promise 
	toasterActions.showToaster(dispatch, 'Item was added to cart');
	dispatch(addItemToCartAction(arg));
}

export function removeItemFromCart(dispatch, arg){ 
	//promise 
	dispatch(removeItemFromCartAction(arg));
}