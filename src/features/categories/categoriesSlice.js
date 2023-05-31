import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {BASE_URL} from "../../utils/constants";

export const getCategories = createAsyncThunk(
    'categories/getCategories',
    // Declare the type your function argument here:
    async (_, thunkAPI) => {
        try {
            const response = await axios(`${BASE_URL}/categories`)
            // Inferred return type: Promise<MyData>
            return response.data
        } catch (err) {
            console.log(err)
            return thunkAPI.rejectedWithValue(err)
        }

    }
)

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        list: [],
        isLoading: false
    },
    extraReducers: (builder) => {
        builder.addCase(getCategories.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getCategories.fulfilled, (state, { payload }) => {
            state.list = payload;
            state.isLoading = false;
        })
        builder.addCase(getCategories.rejected, (state) => {
            state.isLoading = false;
        })
    },
})

export default categoriesSlice.reducer