import React from 'react';

// Components 
import UploadImageDialog from '../uploadImageDialog'; 

// Material UI 
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl'; 
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';



// Stylesheets 
import '../../styles/createItemComponent.less';



export default class CreateItemComponent extends React.PureComponent {
	constructor(arg){
		super(arg);
		const {itemToBeEdited} = this.props;
		this.state = {
			uploadImageDialogVisible : false, 
			name: itemToBeEdited ? itemToBeEdited.name : '',
			info: itemToBeEdited ? itemToBeEdited.info : '',
			image: itemToBeEdited ? itemToBeEdited.image.id : 'none',
            imageSource: itemToBeEdited ? itemToBeEdited.image.source : null,
			category: itemToBeEdited ? itemToBeEdited.category.id : 'none',
            id: itemToBeEdited ? itemToBeEdited.id : null,
		};
	}

	getImageItems() {
		return this.props.images.map((image, index) => {
			return <MenuItem key={index} value={image.id} className="admin-select-menu">{image.name}</MenuItem>;
		}); 
	}

	getCategoryItems() {
		return this.props.categories.map((category, index) => 
            <MenuItem key={index} value={category.id} className="admin-select-menu">{category.title}</MenuItem>
		);
	}

	handleChange(event) {
		this.setState({ [event.target.id]: event.target.value });
	}

	handleImageChange(event) {
		this.setState({
            image : event.target.value,
            imageSource: this.props.images.filter(image => image.id == event.target.value).get(0).source
		}); 
	}

	handleImageUpload(image) {
		this.setState({
            image : image.id,
            imageSource : image.source
		}); 
		this.props.addImage(image); 
	}

	handleCategoryChange(event) {
		this.setState({category: event.target.value});
	}

	validateAndSubmit() {
		if (this.state.name !== '' && this.state.info !== '') {
			this.props.submit(this.state);
			this.props.onClose();
		}
	}

	toggleUploadImageDialog() {
		this.setState({
			uploadImageDialogVisible : !this.state.uploadImageDialogVisible
		});
	}

	render(){
		return (
			<div className="CreateItemComponent">
				<form>
					{this.state.image !='none'? 

						<Card className="Item-Card-Edit">
							<CardMedia
                                image={this.state.imageSource}
								className="Item-Card-Media"
								onClick={this.toggleUploadImageDialog.bind(this)}
							/> 
						</Card> : null}
                    

					<FormControl className="item-formcontrol">

						<TextField
							label="Name"
							id="name"
							value={this.state.name}
							margin="normal"
							onChange={this.handleChange.bind(this)}
							required
							fullWidth
							error={this.state.name === ''}
						/>

						<TextField
							label="Info"
							id="info"
							value={this.state.info}
							margin="normal"
							onChange={this.handleChange.bind(this)}
							required
							error={this.state.info === ''}
							multiline
							fullWidth
							width="100%"
						/>
						<FormControl>
							<InputLabel>Category</InputLabel>
							<Select
								value={this.state.category}
								name="category"
								onChange={this.handleCategoryChange.bind(this)}
								autoWidth>
								<MenuItem value="" disabled>
									<em>None</em>
								</MenuItem>
								{this.getCategoryItems()}
							</Select>
						</FormControl>
						<div className="Image-Input-Section">
							<FormControl>
								<InputLabel>Image</InputLabel>
								<Select
									value={this.state.image}
									name="image"
									onChange={this.handleImageChange.bind(this)}
									autoWidth>
									<MenuItem value="" disabled>
										<em>None</em>
									</MenuItem>
									{this.getImageItems()}
								</Select>
							</FormControl>
							or 
							<Button onClick={this.toggleUploadImageDialog.bind(this)}>
								Upload image
							</Button>
						</div>
					</FormControl>
                    
				</form>
				<DialogActions>
					<Button onClick={() => this.props.onClose()} className="Greyed-Button">
						Cancel
					</Button>
					<Button onClick={this.validateAndSubmit.bind(this)} color="primary">
						{this.props.itemToBeEdited ? "Update" : "Create"}
					</Button>
				</DialogActions>

				{/*Displayed when user wants to upload image*/}
				<UploadImageDialog
					open={this.state.uploadImageDialogVisible}
					onClose={this.toggleUploadImageDialog.bind(this)}
					onUpload={this.handleImageUpload.bind(this)}
				/>
			</div>
		);
	}
}
