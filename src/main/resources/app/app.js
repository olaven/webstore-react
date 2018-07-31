import React, {Component} from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import * as repoService from "./services/repoService";

// Containers
import StorefrontPage from "./containers/storefrontPage";
import AdminPage from "./containers/adminPage";
import NotFound from "./containers/notFoundPage";
import TopBar from "./containers/TopBar"; 
import SideBar from "./containers/SideBar"; 
import CartPage from "./containers/cartPage"; 

// Redux Actions 
import * as mainActions from "./actions/mainActions";
import * as categoryActions from "./actions/categoryActions";
import * as imageActions from "./actions/imageActions"; 

// Interfaces 
import Item from "./interfaces/item"; 
import Category from "./interfaces/category";
import Image from "./interfaces/image";
// Material UI 
import { MuiThemeProvider } from "@material-ui/core/styles";
// Local modules
import Theme from "./theme";
import URLS from "./urls"; 
// Stylesheets
import "./styles/main.less";
// Fonts
import "typeface-roboto";





class App extends Component {

	constructor(props) {
		super(props); 
		this.state = {
			menuVisible : false
		};
	}

	// STATE HOLDS TEST ITEMS 
	componentDidMount() {
		this.props.onLoad()
	}

    

	toggleMenu() {
		this.setState({
			menuVisible : !this.state.menuVisible
		}); 
	}


	render () {
		return (
			<div className="App">
				{/*
                <TopBar onToggleMenu={this.toggleMenu.bind(this)} />
                <SideBar open={this.state.menuVisible} onToggleMenu={this.toggleMenu.bind(this)} />
            */}
				<MuiThemeProvider theme={Theme}>
					<Route path="/" 
						render={(props) =>
							<TopBar 
								{...props} 
								onToggleMenu={this.toggleMenu.bind(this)} 
								style={{position: "fixed", top: 0}} 
							/>}                    
					/> 
					<Route path="/" render={(props) => 
						<SideBar {...props} open={this.state.menuVisible} onToggleMenu={this.toggleMenu.bind(this)} />}
					/> 
					<Switch className="App-Content">    
						<Route path={URLS.admin.items} component={AdminPage} />
						<Route path={URLS.storefront} component={StorefrontPage} />
						<Route path={URLS.cart} component={CartPage} />

						<Route component={NotFound} />
					</Switch>
				</MuiThemeProvider>
			</div>
		);
	}
}


function mapStateToProps(state) {
	return {
		items: state.get("app").get("allItems")
	};
}

function mapDispatchToProps(dispatch) {
	return {
		createItem: (arg) => { mainActions.createItem(dispatch, arg); },
		createCategory: (arg) => { categoryActions.createCategory(dispatch, arg); },
		addImage: (arg) => { imageActions.addImage(dispatch, arg); },
		onLoad:() => {mainActions.onLoad(dispatch)}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App); 
