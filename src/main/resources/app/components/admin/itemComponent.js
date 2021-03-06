
import React from 'react';

// Components
import ItemListComponent from './itemListComponent';
import SearchComponent from '../searchComponent';
import DialogComponent from '../dialogComponent';
import SaveCancel from './saveCancelButtonComponent';

// Material UI
import Paper from '@material-ui/core/Paper'; 
import Table from '@material-ui/core/Table'; 
import TableBody from '@material-ui/core/TableBody'; 
import TableHead from '@material-ui/core/TableHead'; 
import TableRow from '@material-ui/core/TableRow'; 
import TableCell from '@material-ui/core/TableCell'; 
import Typography from '@material-ui/core/Typography'; 
import Button from '@material-ui/core/Button'; 


export default class ItemComponent extends React.PureComponent {
	constructor(arg){
		super(arg);
		this.state = {
			open: false,
			searchValue: '',
			dialogType: '',
			message: '',
			itemToBeRemoved: null,
			itemToBeEdited: null
		};
        
	}

    

	searchItemOnChange(value){
		this.setState({
			searchValue : value
		});
	}

	toggleDialog(type, message, item){
		if(type){
			this.setState({ 
				dialogType: type, 
				open: true, 
				message: message, 
				itemToBeRemoved: item
			});
		} else {
			
			this.setState({ 
				dialogType: '', 
				open: false, 
				message: '',
				itemToBeEdited: null,
				itemToBeRemoved: null
			 });
		}
	}

	editItem(item){
		this.setState({itemToBeEdited: item});
		this.toggleDialog('ITEM');
	}


	render(){ 
		return (
			<div>
				<DialogComponent 
					type= {this.state.dialogType} 
					onClose={this.toggleDialog.bind(this)}
                    
					toBeEdited={this.state.itemToBeEdited}
					submit = {this.state.itemToBeEdited ?  item => {
						this.props.editItem(item); 
						this.setState({itemToBeEdited: null});
					} : this.props.submit}
					open = {this.state.open} 
					categories={this.props.categories}
                    
					remove={this.props.deleteItem}
					toBeRemoved={this.state.itemToBeRemoved}
                    
					openToaster={this.props.openToaster} 
					message={this.state.message}
                    
					images={this.props.images}
					addImage={this.props.addImage}
				/>

				<Typography variant="display3" gutterBottom>
                    Items
				</Typography>

				<SearchComponent 
					value={this.state.searchValue} 
					onChange={this.searchItemOnChange.bind(this)}
					helperText="Filter items"/>
				<div className="admin-button-container">
					<div className="admin-button-left">
						<Button 
							onClick={()=> this.toggleDialog('ITEM')}
							color="primary"
						>
								Add new item
						</Button>
					</div>
					<div className="admin-button-right">
						< SaveCancel 
							edited={this.props.edited}
							save={this.props.save}
							cancelSave={this.props.cancelSave}
						/>
					</div>
				</div>
                
				<Paper>
					<Table>
						<TableHead>
							<TableRow >
								<TableCell>Category</TableCell>
								<TableCell>Image</TableCell>
								<TableCell>Title</TableCell>
								<TableCell>Description</TableCell>
								<TableCell>Active</TableCell>

								<TableCell>Delete</TableCell>
								{/* <TableCell>Edit</TableCell> */}
							</TableRow>
						</TableHead>
						<TableBody>
							{this.props.items.map((item, index) => {
								if (item.name.toUpperCase()
									.includes(this.state.searchValue.toUpperCase()
									) || item.category.filter.toUpperCase()
									.includes(this.state.searchValue.toUpperCase()
									)) {
									return <ItemListComponent
										key={index}
										toggleDialog={this.toggleDialog.bind(this)}
										item={item} 
										edit={this.editItem.bind(this)}
										visible={item.visible} 
										toggleVisible={this.props.toggleVisible} />;
								}
							})}
						</TableBody>
					</Table>
                
				</Paper>
			</div>
		);
	}
}