/**
 * Made for testing 
 * Represents an item in the store 
 */
import React, {Component} from 'react'; 
import PropTypes from 'prop-types';
// Material UI 
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Stylesheets
import '../../styles/storefront/storefrontItemComponent.less'; 

export default class StorefrontItemComponent extends Component {
    

	addClick(){
		console.log("Am in add")
		this.props.add(this.props.item);
	}

	render() {
		const {
			image,
			name,
			info
		} = this.props.item;
		return (
			<div >
				<Card>
					<div className="Item-Card" onClick={() => this.props.onClick(this.props.item)} style={{ cursor: "pointer" }} >
						<CardMedia
							image={image.source}
							className="Item-Card-Media"
						/>
						<CardContent className="Item-Cart-Content">
							<Typography gutterBottom variant="headline" component="h2">
								{name}
							</Typography>
							<Typography component="p">
								{info}
							</Typography>
						</CardContent>
					</div>
					<CardActions>
						<Button onClick={this.addClick.bind(this)}>
							Add to cart +
						</Button>
					</CardActions>
				</Card>
			</div>
		);
	}
}

StorefrontItemComponent.propTypes = {
	name : PropTypes.string, 
	info : PropTypes.string, 
	image : PropTypes.string
};

StorefrontItemComponent.defaultProps = {
};
