import React, { useState, useEffect } from 'react';
import { applyMiddleware, createStore } from 'redux';
import axios from 'axios';
import { thunk } from 'redux-thunk';



export const FETCH_DATA = 'FETCH_DATA';
export const ERROR = 'ERROR';


export const fetchUserData = (users) => ({ type: FETCH_DATA, payload: users });
export const showError = (error) => ({ type: ERROR, payload: error });


const reducer = (state = { users: [], error: null }, action) => {
  switch (action.type) {
    case FETCH_DATA:
      return { ...state, users: action.payload, error: null };
    case ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};


const store = createStore(reducer, applyMiddleware(thunk));


const fetchData = () => (dispatch) => {
  axios.get('https://jsonplaceholder.typicode.com/users')
    .then((res) => dispatch(fetchUserData(res.data)))
    .catch((error) => dispatch(showError(error.message)));
};

const UserData = () => {
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setData(store.getState().users);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleDataVisibility = () => {
    setShowData(!showData);
  };

  return (
    <div>
      {showData && (
        <div>
          {data.map((item) => (
            <div key={item.id}>
              <div>
                <h3>{item.name}</h3>
                <h4>{item.email}</h4>
              </div>
              <hr />
            </div>
          ))}
        </div>
      )}

      <button style={{ fontSize: '20px' }} onClick={() => { store.dispatch(fetchData()); toggleDataVisibility(); }}>
        {showData ? 'Hide Data' : 'Fetch Data'}
      </button>
    </div>
  );
};

export default UserData;
