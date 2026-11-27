import { combineReducers } from '@reduxjs/toolkit';

import { constructorSlice } from './slices/constructor';
import { ingredientsSlice } from './slices/ingredients';
import { ordersSlice } from './slices/orders';
import { userSlice } from './slices/user';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: constructorSlice.reducer,
  orders: ordersSlice.reducer,
  user: userSlice.reducer,
});
