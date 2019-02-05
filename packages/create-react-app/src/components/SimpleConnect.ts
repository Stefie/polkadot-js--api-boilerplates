import {ApiPromise} from '@polkadot/api';
import {WsProvider} from '@polkadot/rpc-provider';

import React, {Component} from 'react';
import logo from './logo.svg';

import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators'
import { ajax } from 'rxjs/ajax';
import { combineEpics, ofType } from 'redux-observable';
 
// ACTION TYPES 	------------------------------------------------------------
const FETCH_USERS_START = "FETCH_USERS_START";
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";
 
const actionTypes = {
    FETCH_USERS_START,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
}
 
 
// ACTIONS      -------------------------------------------------------------
const actions = createActions({
    FETCH_USERS_START : () => {},
    FETCH_USERS_SUCCESS: users => ( { users } ),
    FETCH_USERS_FAILURE: errorMessage => ( { errorMessage } )
});
 
 
// REDUCERS     -------------------------------------------------------------
const usersReducer = handleActions({
    [FETCH_USERS_START]: (state, action) => Object.assign({}, state, {
     fetching: true
    }),
    [FETCH_USERS_SUCCESS]: (state, action) => Object.assign({}, state, {
      fetching: false, items: action.payload.users
    }),
    [FETCH_USERS_FAILURE]: (state, action) => Object.assign({}, state, {
      fetching: false, errorMessage: action.payload.errorMessage
    })
}, { items: [], fetching: false, errorMessage: '' })
 
 
// EPICS      -------------------------------------------------------------
// Our action is not a regular redux action, but an observable stream of actions
const fetchUserEpic = action => action.pipe(
  // Reacts to actions of type 'FETCH_USERS_START'
  ofType(actionTypes.FETCH_USERS_START),
  // Flattens created observable streams inside (is an alias for flatMap)
  mergeMap(() =>
    // Makes an ajax request and creates a new observable stream from the response
    ajax.getJSON("https://jsonplaceholder.typicode.com/users").pipe(
      // Observable value that will be returned if no error was thrown
      map(response => actions.fetchUsersSuccess(response)),
      // Observable value that will be returned if an error was thrown
      // 'of' creates a new observable Stream
      catchError(() => of(actions.fetchUsersFailure('damn :(')))
    )
  ),
);