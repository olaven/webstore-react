import { fromJS } from 'immutable';
import * as Item from '../actions/itemActions'

const initialState = fromJS({
  allItems: [],
  cartItems: []
});

function createItem(oldState, action){
  let state = oldState
  state = state.updateIn(['allItems'], function (items) {
    items = items.push(action.item)
    return items
  });
  return state
}

function deleteItem(oldState, action){
  let state = oldState
  state = state.updateIn(['allItems'], function (items) {
    items = items.splice(items.indexOf(action.item), 1)
    return items
  });
  return state
}

function changeItem(oldState, action){
  let state = oldState
  return state
}

function addItemToCart(oldState, action){
  let state = oldState
  return state
}

function removeItemFromCart(oldState, action){
  let state = oldState
  return state
}



export function itemReducer(state = initialState, action) {
  switch (action.type) {
    case Item.actions.removeItemFromCart:
      return removeItemFromCart(state, action)
    case Item.actions.addItemToCart:
      return addItemToCart(state, action)
    case Item.actions.changeItem:
      return changeItem(state, action)
    case Item.actions.deleteItem:
      return deleteItem(state, action)
    case Item.actions.createItem:
      return createItem(state, action)
    default:
      return state;
  }
}