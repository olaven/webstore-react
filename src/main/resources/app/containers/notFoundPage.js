import React from 'react';

// styless
import '../styles/notFoundPage.less'; 

// URL 
import urls from '../urls'; 

export default class NotFound extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		return (
			<h1 className="NotFoundPage">
        This page does not exist... Go back to <a href={urls.storefront}>store</a> :)
			</h1>
		);
	}
}