import  { useReducer, useCallback } from 'react';
const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null, data: null, extra: null, identifier: action.identifier };
    case 'RESPONSE':
      return { ...curHttpState, loading: false , data: action.responseData, extra: action.extra };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      throw Error('Should not be reached!');
  }
}

const useHttp = () => {
  const [ httpState, dispatchHttp ] =  useReducer(httpReducer , { 
    loading: false, 
    error: null, 
    data: null, 
    extra: null,
    identifier: null
  });

  const sendRequest = useCallback((url, method, body, extra, identifier) => {
    dispatchHttp({ type: 'SEND', identifier });
    fetch( url, {
      method,
      body,
      headers: {
          'Content-type': 'application/json'
      }
    })
    .then(res => {
        return res.json();
    })
    .then(responseData => {
        dispatchHttp({ type: 'RESPONSE', responseData, extra})
    })
    .catch(err => {
      dispatchHttp({ type: 'ERROR', errorMessage: err.message });
    });
  }, []);

  return {
      isLoading: httpState.loading,
      data: httpState.data,
      error: httpState.error,
      sendRequest,
      extra: httpState.extra,
      identifier: httpState.identifier
  };
};

export default useHttp;