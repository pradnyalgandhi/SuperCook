import Search from './models/Search';
import {elements, renderLoader , clearLoader} from './views/base';
import * as searchView from './views/searchView';

const state = {};

const controlSearch = async () => {

	const query = searchView.getInput();
	console.log(query);

	//Get query
	if (query) {

		//New search object
		state.search = new Search(query);

		//Prepar UI

		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		//Search for Recipe
		await state.search.getResults();

		//Send it back to UI
		//console.log(state.search.data);
		clearLoader();
		searchView.renderResults(state.search.data)


	}
}

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});



