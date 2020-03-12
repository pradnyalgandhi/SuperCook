import Search from './models/Search';
import {elements, renderLoader , clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView'
import Recipe from './models/Recipe';


const state = {};

///////////////////////
// Search Controller //
///////////////////////

const controlSearch = async () => {

	const query = searchView.getInput();
	

	//Get query
	if (query) {

		//New search object
		state.search = new Search(query);

		//Prepar UI
		searchView.clearInput();
		searchView.clearResults();
		renderLoader(elements.searchRes);

		try{

			//Search for Recipe
			await state.search.getResults();

			//Send it back to UI
			clearLoader();
			searchView.renderResults(state.search.data);
		}
		catch(err){
			alert("Item not found");
			clearLoader();
		}
		
	}
};

elements.searchForm.addEventListener('submit', e => {
	e.preventDefault();
	controlSearch();
});



elements.searchResPages.addEventListener('click', e=>{
	const btn = e.target.closest('.btn-inline');
	if(btn){
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.data, goToPage);
	}
});

/////////////////////
//Recipe Controller//
/////////////////////

const controlRecipe = async() => {

	const id = window.location.hash.replace('#', '');
	console.log(id);

	if (id){

		//Prepare UI
		recipeView.clearRecipe();
		renderLoader(elements.recipe);

		//Create new Recipe object
		state.recipe = new Recipe(id);


		try{

			//Get recipe data
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();

			//Call servings and time functions
			state.recipe.calcServings();
			state.recipe.calcTime();

			//Update the UI
			clearLoader();
			recipeView.renderRecipe(state.recipe); 
			
		}
		catch (err){
			alert("Error Processing");
		}
		
	}
}
//Single Event Listener
['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));

