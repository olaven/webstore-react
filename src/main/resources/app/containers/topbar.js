import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Material UI 
import AppBar from '@material-ui/core/AppBar'; 
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton'; 
import Typography from '@material-ui/core/Typography'; 
import MenuIcon from '@material-ui/icons/Menu'; 
import StoreIcon from '@material-ui/icons/Store'; 
import CloudCircleIcon from '@material-ui/icons/CloudCircle'; 
import CartIcon from '@material-ui/icons/ShoppingCart'; 
import Badge from '@material-ui/core/Badge'; 
import Tooltip from '@material-ui/core/Tooltip'; 

import '../styles/topbar.less'; 

import { connect } from 'react-redux';

import ToasterComponent from '../components/ToasterComponent';

// Project URLS 
import URLS from '../urls'; 


class TopBar extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			clicked : null, 
			screenWidth : screen.width// decide what to render on desktop/mobile
		};
	}

	componentDidMount() {
		window.addEventListener('resize', this.updateScreenWidth.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateScreenWidth.bind(this)); 
	}

	updateScreenWidth() {
		this.setState({
			screenWidth: window.innerWidth
		}); 
	}

	getCorrectIcons(page) {
		// needed to differentiate between storefront and cart 
		const cart = this.props.location.pathname.includes('cart'); 

		const icons = (page === 'store' ? <div>
			<Link to={URLS.storefront}>
				<Tooltip title="To store">
					<IconButton>
						<StoreIcon color={!cart ? 'disabled' : 'inherit'} />
					</IconButton>
				</Tooltip>
			</Link>
			<Link to={URLS.cart}>
				<Tooltip title="To Cart">
					<IconButton>
						{this.props.cartItems.size > 0 ? <Badge badgeContent={this.props.cartItems.size} color="secondary">
							<CartIcon color={cart ? 'disabled' : 'inherit'} />
						</Badge> : <CartIcon color={cart ? 'disabled' : 'inherit'} />}
						{/* <Badge badgeContent={this.props.cartItems.size} color="secondary">
							<CartIcon color={cart ? 'disabled' : 'inherit'}/>
						</Badge> */}
					</IconButton>
				</Tooltip>
			</Link> 
			<Link to={URLS.headless}>
				<Tooltip title="Headless">
					<IconButton>
						<CloudCircleIcon />
					</IconButton>
				</Tooltip>
			</Link> 
		</div>: null); 

		return icons; 
	}

	getTitle(page) {
		/**
         * The title takes a lot of space on mobile. 
         * The icon also makes its job redundant. Therefore, 
         * it is not shown on mobile, on the material-design mobile breakpoint
         */
		if(this.state.screenWidth <= 960) {
			// To fill the same amount of relative space 
			return <Typography className="TopBar-FlexGrow"/>;
		}
		return <Typography
			className="Topbar-Headline"
			variant="headline">
			{page === 'admin' ? "Enonic Webstore Admin Console" : "Enonic Webstore"}
		</Typography>
	}

	render() { 
		const path = this.props.location.pathname; 
		const page = path.includes(URLS.admin.items) ? 'admin' : 'store' ;
        
		return (
			<div className="TopBar-FlexGrow"> 
				<AppBar 
					className="TopBar"                  
					color={page === 'store' ? 
						'primary' : 
						'secondary'}> 
                    
					<AppBar 
						position="static"
						color={page === 'store' ? 'primary' : 'secondary'}>
						<Toolbar>
							<Tooltip title="Open menu">
								<IconButton>
									<MenuIcon onClick={this.props.onToggleMenu} /> 
								</IconButton>
							</Tooltip>

							{this.getCorrectIcons.bind(this)(page)}

							{this.getTitle.bind(this)(page)}

							

							<Link to={page === 'store' ? URLS.admin.items : URLS.storefront}>
								<Tooltip title={page === 'store' ? "Admin page" : "Back to store"}>
									<Typography variant="button">{page === 'store' ? "ADMIN" : "BACK TO STORE"}</Typography>
								</Tooltip>
							</Link>
						</Toolbar>                        
					</AppBar>
				</AppBar>
				<ToasterComponent 
					visible={this.props.toasterVisible} 
					message={this.props.toasterMessage}
				/>
			</div>
		);
	}
}


TopBar.propTypes = {
	toasterVisible : PropTypes.bool,
	toasterMessage : PropTypes.string

};

TopBar.defaultProps = {
	onToggleMenu : PropTypes.func,
	buttons : PropTypes.object 
};


function mapStateToProps(state) {
	let toaster = state.get('toaster'); 
	let cartItems = state.get('app').get('cartItems');
	return {
		toasterVisible : toaster.get('visible'), 
		toasterMessage : toaster.get('message'), 
		cartItems: cartItems, 
	};
}

function mapDispatchToProps(dispatch) {
	return {
        
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
