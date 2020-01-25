import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

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

const Ingredients = () => {
  const [ userIngredients, dispatch] = useReducer(ingredientReducer, []);

  const { isLoading, error, data, sendRequest } = useHttp();

  const addIngredientHandler = useCallback(ingredient => {
    // dispatchHttp({ type: 'SEND'});
    fetch('https://react-hook-update-c7bff.firebaseio.com//ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        // dispatchHttp({ type: 'RESPONSE'});
        return response.json();
      })
      .then(responseData => {
        dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient }})
      });
  }, []);

  const filteredIngredientsHandler = useCallback(filteredIngredient => {
    dispatch({type: 'SET', ingredients: filteredIngredient});
  }, []);
  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(`https://react-hook-update-c7bff.firebaseio.com/ingredients/${ingredientId}.json`, 'DELETE');
  }, [sendRequest]);

  const clearError = useCallback(() => {
    // dispatchHttp({ type: 'CLEAR' });
  }, []);

  const ingredientList = useMemo(() => {
    return (
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
     {error && <ErrorModal onClose={clearError} >{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
