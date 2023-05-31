import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {BASE_URL} from "../../utils/constants";
import {shuffle} from "../../utils/common";

export const getProducts = createAsyncThunk(
    'products/getProducts',
    // Declare the type your function argument here:
    async (_, thunkAPI) => {
        try {
            const response = await axios(`${BASE_URL}/products`)
            // Inferred return type: Promise<MyData>
            return response.data
        } catch (err) {
            console.log(err)
            return thunkAPI.rejectedWithValue(err)
        }

    }
)

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        list: [],
        filtered: [],
        related: [],
        isLoading: false
    },
    reducers:{
        filterByPrice: (state, { payload }) => {
            console.log(payload)
            console.log(state.list)
            state.filtered = state.list.filter(({ price }) => price < payload)

        },
        getRelatedProducts: (state, { payload }) => {
            const list = state.list.filter(({ category: { id } }) => id === payload)
            state.related = shuffle(list)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getProducts.fulfilled, (state, { payload }) => {
            state.list = payload;
            state.isLoading = false;
        })
        builder.addCase(getProducts.rejected, (state) => {
            state.isLoading = false;
        })
    },
})
export const { filterByPrice, getRelatedProducts } = productsSlice.actions

export default productsSlice.reducer