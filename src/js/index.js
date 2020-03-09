import Search from './models/Search'

const state = {};

const controlSearch = async () => {

	const query = 'pizza';

	//Get query
	if (query) {

		//New search object
		state.search = new Search(query);

		//Prepar UI


		//Search for Recipe
		await state.search.getResults();

		//Send it back to UI
		console.log(state.search.data);



	}
}

document.querySelector('.search').addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});



















