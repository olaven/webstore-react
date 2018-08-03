import React from 'react';


// Material UI
import Button from '@material-ui/core/Button'; 



export default class SaveCancel extends React.PureComponent {
	constructor(arg){
		super(arg);
        
	}
    
	render(){
		return this.props.edited ? [
        
			<Button 
				key={1}
				color="primary"
				onClick={() => {
					this.props.save();
				}} 
			>
                Save changes
			</Button>,
			<Button 
				key={2}
				onClick={() => {
					this.props.cancelSave();
				}} 
				color="inherit"
			>
                cancel changes
			</Button> ]
			: [
				<Button 
					disabled
					key={1}
				>
                Save changes
				</Button>,
				<Button 
					disabled
					key={2}
				>
                cancel changes
				</Button> ];

	}

}