import React, { useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredient, action) => {
 switch (action.type) {
   case 'SET':
      return action.ingredients;
   case 'ADD':
      return [...currentIngredient, action.ingredient];
   case 'DELETE':
      return currentIngredient.filter(ing => ing.id !== action.id)
   default:
    throw new Error('Should not get there!');
 } 
}

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw Error('Should not be reached!');
  }
}

const Ingredients = () => {
  const [ userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [ httpState, dispatchHttp ] =  useReducer(httpReducer , { loading: false, error: null });
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsloading] = useState(false);
  // const [error, setError] = useState();

  const addIngredientHandler = ingredient => {
    dispatchHttp({ type: 'SEND'});
    fetch('https://react-hook-update-c7bff.firebaseio.com//ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        dispatchHttp({ type: 'RESPONSE'});
        return response.json();
      })
      .then(responseData => {
        // setUserIngredients(prevIngredients => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient }
        // ]);
        dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient }})
      });
  };

  const filteredIngredientsHandler = useCallback(filteredIngredient => {
    // setUserIngredients(filteredIngredient)
    dispatch({type: 'SET', ingredients: filteredIngredient});
  }, []);
  const removeIngredientHandler = ingredientId => {
    dispatchHttp({ type: 'SEND'});
    fetch(`https://react-hook-update-c7bff.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    })
    .then(res => {
      dispatchHttp({ type: 'RESPONSE'});
      // setUserIngredients(prevIngredients =>
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      // );
      dispatch({ type: 'DELETE', id: ingredientId });
    })
    .catch(err => {
      dispatchHttp({ type: 'ERROR', errorMessage: err.message });
    });
  };

  const clearError = () => {
    dispatchHttp({ type: 'CLEAR' });
  }

  return (
    <div className="App">
     {httpState.error && <ErrorModal onClose={clearError} >{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
