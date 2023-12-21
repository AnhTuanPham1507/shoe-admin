/* eslint-disable import/no-named-as-default */
import { configureStore } from '@reduxjs/toolkit'

import  tokenSlice  from './slices/TokenSlice'


export const store = configureStore({
  reducer: {
    token: tokenSlice,
  },
})