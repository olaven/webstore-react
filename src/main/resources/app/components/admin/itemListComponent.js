import React from 'react';

// Material UI 
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Avatar from '@material-ui/core/Avatar';


export default class ItemListComponent extends React.PureComponent {
	constructor(arg){
		super(arg);
        
	}

	
	remove() {
		this.props.remove(this.props.item);
	}
    
	toggleVisible(){
		this.props.toggleVisible(this.props.item);
	}

	render(){ 
		let styleClass = this.props.item.edited ? 'adminListComponent-edit' : 'adminListComponent';
		return <TableRow 
				className={styleClass}
				onClick={() => 
					{this.props.edit(this.props.item)}
				}>
			<TableCell>{this.props.item.category.title}</TableCell>
			<TableCell>
				<Avatar alt="Thumbnail" src={this.props.item.image.source} />
			</TableCell>
			<TableCell>{this.props.item.name}</TableCell>
			<TableCell style={wrapping}>{this.props.item.info}</TableCell>
			<TableCell>
				<Checkbox
					checked={this.props.item.visible ? true : false}
					onChange={this.toggleVisible.bind(this)}
				/>
			</TableCell>

			
			<TableCell>
				<IconButton onClick={() => this.props.toggleDialog('DELETE', this.props.item.name, this.props.item)}>
					<DeleteIcon />
				</IconButton>
			</TableCell>
			{/* <TableCell>
				<IconButton onClick={() => this.props.edit(this.props.item)}>
					<EditIcon />
				</IconButton>
			</TableCell> */}
		</TableRow>;
	}
}

const wrapping = {
	maxWidth: "100px", 
	wordWrap: "break-word"
}