import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {BASE_URL} from "../../utils/constants";

export const createUser = createAsyncThunk(
    "users/createUser",
    async (payload, thunkAPI) => {
        try {
            const res = await axios.post(`${BASE_URL}/users`, payload);
            return res.data;
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async (payload, thunkAPI) => {
        try {
            const res = await axios.put(`${BASE_URL}/users/${payload.id}`, payload);
            return res.data;
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
);
export const loginUser = createAsyncThunk(
    "users/loginUser",
    async (payload, thunkAPI) => {
        try {

            const cookies = document.cookie.split('; ');
            let accessToken;

            for (let cookie of cookies) {
                const [name, value] = cookie.split('=');
                if (name === 'accessToken') {
                    accessToken = value;
                }
            }

            if (accessToken === undefined) {
                const res = await axios.post(`${BASE_URL}/auth/login`, payload);

                document.cookie = `accessToken=${res.data.access_token};`;
                // document.cookie = `refreshToken=${res.data.refresh_token};`;
                // document.cookie = `accessToken=${res.data.access_token}; Secure; HttpOnly`;
                // document.cookie = `refreshToken=${res.data.refresh_token}; Secure; HttpOnly`;
                accessToken = res.data.access_token
            }


            const login = await axios(`${BASE_URL}/auth/profile`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            return login.data;
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const getLoginUser = createAsyncThunk(
    "users/getLoginUser",
    async (payload, thunkAPI) => {
        try {
            const res = await axios.post(`${BASE_URL}/auth/login`, payload);

            const login = await axios(`${BASE_URL}/auth/profile`, {
                headers: {
                    "Authorization": `Bearer ${res.data.access_token}`
                }
            });
            return login.data;
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
);

const addCurrentUser = (state, { payload }) => {
    state.currentUser = payload;
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        cart: [],
        isLoading: false,
        formType: "signup",
        showForm: false,
    },
    reducers: {
        addItemToCart: (state, {payload}) => {

            let newCart = [...state.cart];
            const found = state.cart.find(({id}) => id === payload.id);

            if (found) {
                newCart = newCart.map((item) => {
                    console.log(item, payload)
                    return item.id === payload.id
                        ? {...item, quantity: payload.quantity || item.quantity + 1}
                        : item;
                });
            } else newCart.push({...payload, quantity: 1});

            state.cart = newCart;
        },
        removeItemFromCart : (state, {payload}) => {
           state.cart = state.cart.filter((item) => +item.id !== +payload)
        },
        toggleForm: (state, {payload}) => {
            state.showForm = payload
        },
        toggleFormType: (state, {payload}) => {
             state.formType = payload
        }

    },
    extraReducers: (builder) => {
        builder.addCase(createUser.fulfilled, addCurrentUser)
        builder.addCase(updateUser.fulfilled, addCurrentUser)
        builder.addCase(loginUser.fulfilled, addCurrentUser)
    },
})

export const { addItemToCart, toggleForm, toggleFormType, removeItemFromCart } = userSlice.actions
export default userSlice.reducer