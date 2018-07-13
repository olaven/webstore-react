
import React from 'react';

import ItemListComponent from './itemListComponent';
import SearchComponent from '../searchComponent';
import DialogComponent from '../dialogComponent';


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
        super(arg)
        this.state = {
            open: false,
            searchValue: "",
            dialogType: "",
            message: "",
            itemToBeRemoved: null
        }
        
    }

    

    searchItemOnChange(value){
        this.setState({
            searchValue : value
        })
    }

    toggleDialog(type, message, item){
        if(type){
            this.setState({ dialogType: type, open: true, message: message , itemToBeRemoved: item})
        } else {
            this.setState({ dialogType: "", open: false, message: "" })
        }
    }

    render(){ 
        return (
            <div>
                <DialogComponent 
                    type= {this.state.dialogType} 
                    onClose={this.toggleDialog.bind(this)}
                    submit = {this.props.submit}
                    open = {this.state.open} 
                    categories={this.props.categories}
                    message={this.state.message}
                    remove={this.props.deleteItem}
                    openToaster={this.props.openToaster} 
                    toBeRemoved={this.state.itemToBeRemoved}
                />

                <Typography variant="display3" gutterBottom>
                    Items
                </Typography>
                <SearchComponent value={this.state.searchValue} onChange={this.searchItemOnChange.bind(this)}/>
                <Button 
                    onClick={()=> this.toggleDialog("ITEM")}
                    color="primary">
                    Add new item
                </Button>
                
                <Paper>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Items</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Info</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Id</TableCell>
                        <TableCell>Visible</TableCell>
                        <TableCell>Delete</TableCell>
                        <TableCell>Edit</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.items.map(item => {
                        if (item.name.toUpperCase()
                            .includes(this.state.searchValue.toUpperCase()
                            ) || item.category
                            .toUpperCase()
                            .includes(
                            this.state.searchValue.toUpperCase()
                            )) {
                        return <ItemListComponent 
                            toggleDialog={this.toggleDialog.bind(this)}
                            item={item} key={item.id} 
                            edit={this.editItem}
                            visible={item.visible} 
                            toggleVisible={this.props.toggleVisible} />;
                        }
                    })}
                    </TableBody>
                </Table>
                <Button 
                    color="primary"
                    onClick={() => this.props.openToaster("Changes were saved, NOT! This button does nothing....")} 
                >
                    Save changes
                </Button>
                </Paper>
            </div>
        )
    }
}