import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: false,
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.value = true
    },
    closeLoading: (state) => {
      state.value = false
    }
  },
})

// Action creators are generated for each case reducer function
export const { showLoading, closeLoading} = loadingSlice.actions

export default loadingSlice.reducer