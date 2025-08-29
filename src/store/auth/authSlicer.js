import { createSlice } from "@reduxjs/toolkit"


const initialState={
    user:null
}

export const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        saveLogin:(state,action)=>{
            state.user=action.payload
        },
        removeLogin:(state,action)=>{
            state.user=null
        }
    }
})

export const {saveLogin,removeLogin}=authSlice.actions;
export default authSlice.reducer;