import type { RootState } from './store';

export const selectIngredients = (state: RootState): RootState['ingredients']['items'] =>
  state.ingredients.items;
export const selectIngredientsState = (state: RootState): RootState['ingredients'] =>
  state.ingredients;
export const selectConstructor = (state: RootState): RootState['burgerConstructor'] =>
  state.burgerConstructor;
export const selectUser = (state: RootState): RootState['user']['user'] =>
  state.user.user;
export const selectUserState = (state: RootState): RootState['user'] => state.user;
export const selectOrders = (state: RootState): RootState['orders'] => state.orders;
export const selectFeed = (state: RootState): RootState['orders']['feed'] =>
  state.orders.feed;
