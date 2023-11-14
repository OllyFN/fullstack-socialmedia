import { configureStore, createSlice } from '@reduxjs/toolkit'

// This will store the logged in user data
const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser: (_, action) => action.payload,
  },
})

const themeSlice = createSlice({
  name: 'theme',
  initialState: 'dark',
  reducers: {
    toggleTheme: (state) => (state === 'dark' ? 'light' : 'dark'),
  },
})

const headerOpenSlice = createSlice({
  name: 'headerOpen',
  initialState: true,
  reducers: {
    setHeaderState: (_, action) => action.payload,
  },
})

export const { toggleTheme } = themeSlice.actions
export const { setHeaderState } = headerOpenSlice.actions
export const { setUser } = userSlice.actions

export type storeType = {
  theme: 'dark' | 'light'
  headerOpen: boolean
}

export default configureStore({
  reducer: {
    theme: themeSlice.reducer,
    headerOpen: headerOpenSlice.reducer,
  },
})
