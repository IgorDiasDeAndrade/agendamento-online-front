import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API } from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'

// ** Fetch Invoices
export const fetchData = createAsyncThunk('appInvoice/fetchData', async (params, thunkAPI) => {
  const { token } = thunkAPI.getState().currentUser

  const response = await API.get('/agendas', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params
  })

  return response.data
})

export const deleteInvoice = createAsyncThunk('appInvoice/deleteData', async (id, { getState, dispatch }) => {
  const response = await axios.delete('/apps/invoice/delete', {
    data: id
  })
  await dispatch(fetchData(getState().invoice.params))

  return response.data
})

export const appInvoiceSlice = createSlice({
  name: 'appInvoice',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.invoices
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appInvoiceSlice.reducer
