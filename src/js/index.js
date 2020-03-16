import Search from './models/Search';
import {elements, renderLoader , clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import Recipe from './models/Recipe';
import List from './models/List';


const state = {};
window.state = state;

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

		if(state.search) {
			searchView.highlightSelected(id);
		}

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

/////////////////////
///List Controller///
/////////////////////

const controlList = () =>{

	//If there is no list create List
	if (!state.list) state.list = new List();

	//Adding items to the list
	state.recipe.ingredients.forEach(el => {

		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderitem(item);
	});

}

elements.shopping.addEventListener('click', e=> {

	const id = e.target.closest('.shopping__item').dataset.itemid;

	if(e.target.matches('.shopping__delete, .shopping__delete *')){

		state.list.deleteItem(id);

		listView.deleteItem(id); 
	}
	else if (e.target.matches('.shopping__count-value')){

		const value = parseFloat(e.target.value, 10);
		state.list.updateItem(id, value);
	}
})


//Handling Servings
elements.recipe.addEventListener('click', e =>{

	if(e.target.matches('.btn-decrease, .btn-decrease *')){

		if(state.recipe.servings >1){
			state.recipe.updateServings('dec');
			recipeView.updateServingsingredients(state.recipe);
		}
	}
	else if(e.target.matches('.btn-increase, .btn-increase *')){		
			state.recipe.updateServings('inc');		
			recipeView.updateServingsingredients(state.recipe);
	}
	else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
		controlList();
	}
	
});


