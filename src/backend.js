import axios from 'axios';

let get_data = (callback) => {
	axios.get('https://www.mohfw.gov.in/data/datanew.json').then(resp => {
	    callback(resp.data);
	});
}



export {
	get_data
}