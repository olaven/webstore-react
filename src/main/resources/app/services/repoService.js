const itemRepoUrl =
  '/app/com.enonic.app.webstore.react/_/service/com.enonic.app.webstore.react/itemService';

const categoryRepoUrl =
  '/app/com.enonic.app.webstore.react/_/service/com.enonic.app.webstore.react/categoryService';
    
const imageRepoUrl =
  '/app/com.enonic.app.webstore.react/_/service/com.enonic.app.webstore.react/imageService';
    


/**
 * ITEMS
 */

export function addItem(item){
	item.edited = null;
	return fetch(itemRepoUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(item)
	});
    
}

export function removeItem(item){
	return fetch(itemRepoUrl, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(item)
	});
}

export function editItem(item){
	item.edited = null;
	return fetch(itemRepoUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(item)
	});
}

export function getItems(){
	return fetch(itemRepoUrl)
		.then(response => response.length == 0  ? response : response.json()
			.then(data =>  data.nodes.filter(node => node.data ? node : null))
			.then(nodes => nodes.map(node => node.data))

		);
}



/**
 * CATEGORIES
 */

export function addCategory(item){

	return fetch(categoryRepoUrl, {
		method: 'POST',
		body: JSON.stringify(item)
	});
    
}

export function removeCategory(item){
	return fetch(categoryRepoUrl, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(item)
	});
}

export function editCategory(item){
	return fetch(categoryRepoUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(item)
	});
}

export function getCategories(){
	return fetch(categoryRepoUrl)
		.then(response => response.length == 0 ? response : response.json()
			.then(data =>  data.nodes.filter(node => node.data ? node : null))
			.then(nodes => nodes.map(node => node.data))
		);
}



/**
 * IMAGES
 */

export function addImage(image){
	return fetch(imageRepoUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(image)
	});
    
}

export function removeImage(image){
	return fetch(imageRepoUrl, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json; charset=utf-8'
		},
		body: JSON.stringify(image)
	});
}

export function editImage(image){
	let formdata = new FormData();
	formdata.append('name', image.name);
	formdata.append('id', image.id);
	formdata.append('type', image.type);

	image.file ? formdata.append('file', image.file)
		:   formdata.append('source', image.name);
	return fetch(imageRepoUrl, {
		method: 'PUT',
		body: formdata
	});

}



export function getImages(){
	return new Promise((resolve, reject) => {

		fetch(imageRepoUrl, {
			method: 'GET'
		}).then(response => {
			if(response.status != 200){
				reject(response);
			} else {
				response.json()
					.then(data => 
						Promise.all(
							data.nodes.map(node => {
								node.data.edited = false;
								if(node.data.file){
									return getImageFile(node.data.id)
										.then(image => {
											node.data.file = image;
											return node.data;
										});
								} else {
									return Promise.resolve(node.data);
								}
							})
						)
					).then(images => resolve(images));
			}
   
		});
	});
}

function getImageFile(key){
	return new Promise((resolve, reject) => {

		var xhr = new XMLHttpRequest();

		xhr.open('GET', imageRepoUrl + '?data=' + key, true);
		xhr.responseType = 'blob';
		xhr.send();

		xhr.onload = (event) => {
			resolve(xhr.response);
		};

	});

	/*
    return fetch(imageRepoUrl)
    .then(response => {
        console.log("response: ", response)  /*
        var file = new File([blob], 'file', {type: 'image/jpeg', lastModified: Date.now()});
        console.log("after convertion:", file)
        let url = URL.createObjectURL(file)
        console.log(url)
            })
    
    })
        .then(response => response.length == 0 ? response : response.json()
            .then(data => console.log("response:", data))
            
        )

                
                data.nodes.filter(node => node.data ? node : null))
            .then(nodes => nodes.map(node => node.data))
        )
        */
}
/*
getAudio(storeName, value) {

    return new Promise((resolve, reject) => {

        var xhr = new XMLHttpRequest();

        xhr.open('GET', appUrl + '/getAudio?key=' + value, true);
        xhr.responseType = "blob";
        xhr.send();

        xhr.onload = (event) => {
            resolve(xhr.response);
        };

    });


}
*/