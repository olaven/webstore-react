import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

// Material UI 
import AppBar from '@material-ui/core/AppBar'; 
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton'; 
import Typography from '@material-ui/core/Typography'; 
import MenuIcon from '@material-ui/icons/Menu'; 
import StoreIcon from '@material-ui/icons/Store'; 
import CartIcon from "@material-ui/icons/ShoppingCart"; 
import Badge from '@material-ui/core/Badge'; 
import Tooltip from '@material-ui/core/Tooltip'; 

import '../styles/topbar.less'; 

import { connect } from 'react-redux';

import ToasterComponent from '../components/ToasterComponent';

// Project URLS 
import URLS from '../urls'; 


class TopBar extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            clicked : null, 
            screenWidth : screen.width// decide what to render on desktop/mobile
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateScreenWidth.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateScreenWidth.bind(this)); 
    }

    updateScreenWidth() {
        this.setState({
            screenWidth: window.innerWidth
        }); 
    }

    onPage = {
        admin: this.props.location.pathname.includes("admin"), 
        storefront : this.props.location.pathname.includes("storefront")
    }

    getCorrectIcons = (page) => {
        // needed to differentiate between storefront and cart 
        const cart = this.props.location.pathname.includes("cart"); 

        const icons = (page === "store" ? <div>
            <Link to={URLS.storefront}>
                <Tooltip title="To store">
                    <IconButton>
                        <StoreIcon color={!cart ? "disabled" : "inherit"} />
                    </IconButton>
                </Tooltip>
            </Link>
            <Link to={URLS.cart}>
                <Tooltip title="To Cart">
                    <IconButton>
                        <Badge badgeContent={this.props.cartItems.size} color="secondary">
                            <CartIcon color={cart ? "disabled" : "inherit"}/>
                        </Badge>
                    </IconButton>
                </Tooltip>
            </Link> 
        </div>: <Link to={URLS.storefront}>
            <IconButton>
                <StoreIcon title="Back to store"/>
            </IconButton>
        </Link>); 

        return icons; 
    }

    getTitle = (page) => {
        /**
         * The title takes a lot of space on mobile. 
         * The icon also makes its job redundant. Therefore, 
         * it is not shown on mobile, on the material-design mobile breakpoint
         */
        if(this.state.screenWidth <= 960) {
            // To fill the same amount of relative space 
            return <Typography className="TopBar-FlexGrow"/>
        }
        return <Typography
            variant="headline"
            className="TopBar-FlexGrow"
            align="center"
            color={page === 'admin' ? 'textSecondary' : 'inherit'}>
            <Link to={URLS.storefront}>
                {page === 'admin' ? 'Back to store' : 'Enonic Webstore'}
            </Link>
        </Typography>
    }

    render() { 
        const path = this.props.location.pathname; 
        const page = (path.includes("store") || path.includes("cart")) ? "store" : "admin"
        
        return (
            <div className="TopBar-FlexGrow"> 
                <AppBar 
                    className="TopBar"                  
                    color={page === "store" ? 
                        "primary" : 
                        "secondary"}> 
                    
                    <AppBar 
                        position="static"
                        color={page === 'store' ? 'primary' : 'secondary'}>
                        <Toolbar>
                            <Tooltip title="Open menu">
                                <IconButton>
                                    <MenuIcon onClick={this.props.onToggleMenu} /> 
                                </IconButton>
                            </Tooltip>

                            {this.getCorrectIcons(page)}

                            {this.getTitle(page)}

                            {page !== "admin" ?
                                <Link className="TopBar-Col" to={URLS.admin.items} className="TopBar-AdminLink">
                                    <Tooltip title="Admin panel"> 
                                        <Typography variant="button">Admin</Typography>
                                    </Tooltip>
                                </Link> :
                                <div className="TopBar-Col"></div>}
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
}


function mapStateToProps(state) {
    let toaster = state.get('toaster'); 
    let cartItems = state.get('app').get('cartItems');
    return {
        toasterVisible : toaster.get('visible'), 
        toasterMessage : toaster.get('message'), 
        cartItems: cartItems, 
    }
}

function mapDispatchToProps(dispatch) {
    return {
        
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(TopBar)
