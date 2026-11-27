import { createSlice, nanoid } from '@reduxjs/toolkit';

import { createOrder } from './orders';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TConstructorState,
  TIngredient,
  TConstructorIngredient,
} from '@utils-types';

const initialState: TConstructorState = { bun: null, ingredients: [] };

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() },
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      if (
        from < 0 ||
        to < 0 ||
        from >= state.ingredients.length ||
        to >= state.ingredients.length
      )
        return;
      const [item] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, item);
    },
  },
  extraReducers: (builder) => builder.addCase(createOrder.fulfilled, () => initialState),
});

export const { addIngredient, removeIngredient, moveIngredient } =
  constructorSlice.actions;
