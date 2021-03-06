import React from 'react';
import { connect } from 'react-redux';

// Components 
import ItemComponent from '../components/admin/itemComponent';
import CategoryComponent from '../components/admin/categoryComponent';
import ImageComponent from '../components/admin/imageComponent';

// Interfaces 
import Item from '../interfaces/item';
import Category from '../interfaces/category';

import { Route } from 'react-router-dom';

// Styles 
import '../styles/adminPage.less';

import * as toasterActions from '../actions/toasterActions'; 

// Material UI
import Typography from '@material-ui/core/Typography'; 


// Stylesheet 
import '../styles/adminPage.less'; // Dupliate? 

// Project urls 
import URLS from '../urls'; 


import * as mainActions from '../actions/mainActions'; 
import * as categoryActions from '../actions/categoryActions';
import * as imageActions from '../actions/imageActions'; 



class AdminPage extends React.PureComponent { 
  
	constructor(props){
		super(props);
	}

  
	getImage = id =>{
		return this.props.images.find(image => image.id == id)
	}
	
	getCategory = id => {
		return this.props.categories.find(category => category.id == id)
	}

	itemSubmitClick = data => {
		this.setState({ dialogOpen: false }); 
		data.image = this.getImage(data.image);
		data.category = this.getCategory(data.category)
		this.props.createItem(new Item({name: data.name, info: data.info, image: data.image, category: data.category, edited : true}), true); 
	}

	itemEdit = data => {
		data.image = this.getImage(data.image);
		data.category = this.getCategory(data.category)
		this.props.editItem(data)
	}

	categorySubmitClick = data => {
		this.setState({ dialogOpen: false }); 
		this.props.createCategory(new Category({title: data.title, filter: data.filter, visible: data.visible}), true); 
	}


  
	render() {
		return <div className="AdminPage">
			<Typography varian="display4" align="right">ADMIN</Typography>    
			<Typography varian="display2" align="right">ALL ACCESS GRANTED</Typography>   
			<Route exact path={URLS.admin.items} render={() => 
				<ItemComponent 
					submit={this.itemSubmitClick}
					deleteItem={this.props.deleteItem}
					editItem={this.itemEdit}
					toggleVisible={this.props.toggleItemVisible}
					items={this.props.items}
					categories={this.props.categories}
					openToaster={this.props.openToaster}
					images={this.props.images}
					addImage={this.props.addImage}
					save={this.props.save}
					cancelSave={this.props.cancelSave}
					edited={this.props.itemEdited}
            
  
				/>}  
			/>
			<Route path={URLS.admin.categories} render={() => 
				<CategoryComponent 
					submit={this.categorySubmitClick}
					editCategory={this.props.editCategory}
					deleteCategory={this.props.deleteCategory} 
					categories={this.props.categories}
					toggleVisible={this.props.toggleCategoryVisible}  
					openToaster={this.props.openToaster}
					save={this.props.save}
					cancelSave={this.props.cancelSave}
					edited={this.props.categoriesEdit}
				/>}
			/>

			<Route path={URLS.admin.images} render={() => 
				<ImageComponent 
					editImage={this.props.editImage}
					deleteImage={this.props.deleteImage} 
					images={this.props.images}
					openToaster={this.props.openToaster}
					save={this.props.save}
					cancelSave={this.props.cancelSave}
					edited={this.props.imagesEdit}
					addImage={this.props.addImage}
				/>}
			/>
        
		</div>;
	}
}



AdminPage.defaultProps = {
};


function mapStateToProps(state){
	return {
		items: state.get('app').get('allItems'),
		itemEdited: state.get('app').get('edited'),
    
		categories: state.get('categories').get('categories'), 
		categoriesEdit: state.get('categories').get('edited'),
    
		images: state.get('images').get('images'),
		imagesEdit: state.get('images').get('edited')

	};
}

function mapDispatchToProps(dispatch) {
	return {
		createItem : (arg, edit) => {mainActions.createItem(dispatch,arg, edit);},
		deleteItem : (arg) => {mainActions.deleteItem(dispatch,arg);},
		editItem : (item) => {mainActions.changeItem(dispatch,item);},
		toggleItemVisible: (arg) => {mainActions.toggleItemVisible(dispatch,arg);},  
		
		createCategory : (arg, edit) => {categoryActions.createCategory(dispatch,arg, edit);},
		deleteCategory : (arg) => {categoryActions.deleteCategory(dispatch,arg);},
		editCategory : (category) => {categoryActions.changeCategory(dispatch,category);},
		toggleCategoryVisible : (arg) => {categoryActions.toggleCategoryVisible(dispatch,arg);},
		
		addImage: (arg, edit) => {imageActions.addImage(dispatch, arg, edit);},
		deleteImage: (arg) => {imageActions.deleteImage(dispatch, arg);},
		editImage: (arg) => {imageActions.editImage(dispatch, arg);},
		
		cancelSave: () => {
			imageActions.cancelSave(dispatch)
			mainActions.cancelSave(dispatch)
			categoryActions.cancelSave(dispatch)
		},
		
		save: () => {
			imageActions.save(dispatch)
			mainActions.save(dispatch)
			categoryActions.save(dispatch)
		},

		openToaster: (message) => { toasterActions.showToaster(dispatch, message);}

	};
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
