import axios from 'axios';

let get_data = (callback) => {
	console.log('hi from backend');
	axios.get('https://www.mohfw.gov.in/data/datanew.json').then(resp => {
	    console.log(resp.data);
	    callback(resp.data);
	});
}


export {
	get_data
}