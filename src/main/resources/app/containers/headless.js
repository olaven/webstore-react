import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as mainActions from '../actions/mainActions' 

// Components 
import StorefrontItemComponent from "../components/storefront/storefrontItemComponent"
import SearchComponent from "../components/searchComponent"; 
import DialogComponent from '../components/dialogComponent';

// Material UI 
import Grid from '@material-ui/core/Grid'; 

// Stylesheets
import '../styles/storefront/StorefrontPage.less'
import URLS from '../urls';

class HeadlessPage extends React.PureComponent { 
  constructor(props) {
    super(props); 

  }

  componentWillMount() {
    this.props.history.push(URLS.headless)
  }


  renderItems() {
    return this.props.items.map((item, index) =>
    
      <Grid key={index} item xs={12} lg={4} xl={3}>
        item 
      </Grid>
    )
  }

 

  render() {
    return (
      <div className="StorefrontPage">
        <Grid 
          container 
          item 
          spacing={24} 
          alignContent="center" 
          className="Storefront-Item-Grid-Container" 
        >
          {this.renderItems()}
        </Grid>
      </div>
    );
  }
}

HeadlessPage.propTypes = {
  items: PropTypes.object,
};

HeadlessPage.defaultProps = {
}


function mapStateToProps(state){
	return {
    items: state.get('app').get('allItems')
	};
}

function mapDispatchToProps(dispatch) {
  return {
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(HeadlessPage)
