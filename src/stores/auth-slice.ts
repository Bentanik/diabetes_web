import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialState {
    sendRegisterEmail: REQUEST.TSendRegisterEmail | null;
    verifyRegisterEmail: REQUEST.TVerifyRegisterEmail | null;
}

const initialState: InitialState = {
    sendRegisterEmail: null,
    verifyRegisterEmail: null,
};

const authSlice = createSlice({
    name: "authSlice",
    initialState: initialState,
    reducers: {
        setSendRegisterEmail: (
            state,
            action: PayloadAction<REQUEST.TSendRegisterEmail>
        ) => {
            state.sendRegisterEmail = { ...action.payload };
        },
        clearSendRegisterEmail: (state) => {
            state.sendRegisterEmail = null;
        },
        setVerifyRegisterEmail: (
            state,
            action: PayloadAction<REQUEST.TVerifyRegisterEmail>
        ) => {
            state.verifyRegisterEmail = { ...action.payload };
        },
        clearVerifyRegisterEmail: (state) => {
            state.verifyRegisterEmail = null;
        },
        clearAllRegister: (state) => {
            state.sendRegisterEmail = null;
            state.verifyRegisterEmail = null;
        },
    },
});

export const {
    setSendRegisterEmail,
    clearSendRegisterEmail,
    setVerifyRegisterEmail,
    clearVerifyRegisterEmail,
    clearAllRegister,
} = authSlice.actions;

export default authSlice.reducer;
