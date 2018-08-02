import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as mainActions from '../actions/mainActions' 

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
    const query = '{ guillotine { query( query : \"type=\'com.enonic.app.webstore.react:product\'\" ) { displayName } }}'; 

    fetch("http://localhost:8080/portal/master/headless/_/service/com.enonic.app.webstore.react/graphql",
      {
        method : "POST", 
        body: JSON.stringify({ query: query })
      }
      ).then(response => console.log(response.json().then(r => console.log(r)))); 

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
