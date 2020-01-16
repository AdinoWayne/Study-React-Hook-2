import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState();

  const addIngredientHandler = ingredient => {
    setIsloading(true);
    fetch('https://react-hook-update-c7bff.firebaseio.com//ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        setIsloading(false);
        return response.json();
      })
      .then(responseData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
      });
  };

  const filteredIngredientsHandler = useCallback(filteredIngredient => {
    setUserIngredients(filteredIngredient)
  }, []);
  const removeIngredientHandler = ingredientId => {
    setIsloading(true);
    fetch(`https://react-hook-update-c7bff.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    })
    .then(res => {
      setIsloading(false);
      setUserIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      );
    })
    .catch(err => {
      setError('Something went wrong!');
      setIsloading(false);
    });
  };

  const clearError = () => {
    setError(null);
    setIsloading(false);
  }

  return (
    <div className="App">
     {error && <ErrorModal onClose={clearError} >{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

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
