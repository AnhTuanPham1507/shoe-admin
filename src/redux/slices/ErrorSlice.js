import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {errorMessage: '', page: ''},
}

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setErrorValue: (state, action) => {
      state.value = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setErrorValue} = errorSlice.actions

export default errorSlice.reducer