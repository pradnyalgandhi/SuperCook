import axios from 'axios';


export default class Search{

	constructor(query){
		this.query = query;
	}

	async  getResults(){
	try{
		const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
		const data = res.data.recipes;
		console.log(data);
		//create

	}
	catch(error){
		alert(error);
	}
	
}


}


