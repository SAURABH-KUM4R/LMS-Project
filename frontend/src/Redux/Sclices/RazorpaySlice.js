import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { axiosInstance } from "../../Helpers/axiosInstance"
import toast from "react-hot-toast";

const initialState = {
    key: "",
    subscription_id: "",
    isPaymentVerified: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: []
}

export const getRazorPayId = createAsyncThunk("/razorpay/getId", async () => {
    try {
        const response = await axiosInstance.get("/payments/razorpay-key");
        return response.data;
    } catch (error) {
        toast.error("Failed to load data");
    }
})

export const purchaseCourseBundle = createAsyncThunk("/purchaseCourse", async () => {
    try {
        const response = await axiosInstance.post("/payments/Subscribe");
        return response.data
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const verifySubscription = createAsyncThunk("/payments/verify", async () => {
    try {
        const response = await axiosInstance.post("/payments/verify", {
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_subscription_id: data.razorpay_subscription_id,
            razorpay_signature: data.razorpay_signature
        });
        return response.data
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const getPaymentRecord = createAsyncThunk("/payments/record", async () => {
    try {
        const response = axiosInstance.get("/payments?counts=100");
        toast.promise(response, {
            loading: "Getting the payment records",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to get payment records"
        })
        return (await response).data
    } catch (error) {
        toast.error("Failed to get data!!");
    }
});

export const cancleCourseBundle = createAsyncThunk("/payments/cancle", async () => {
    try {
        const response = axiosInstance.post("/payments/unsubscribe");
        toast.promise(response, {
            loading: "Unsubscribing the bundle",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to unsubscribe"
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

const razorpaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: () => {
        builder
        .addCase(getRazorPayId.fulfilled, (state, action) => {
            state.key = action?.payload?.key;
        })
        .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
            state.subscription_id = action?.payload?.subscription_id;
        })
        .addCase(verifySubscription.fulfilled, (state, action) => {
            toast.success(action?.payload?.message);
            state.isPaymentVerified = action?.payload?.success;
        })
        .addCase(verifySubscription.rejected, (state, action) => {
            toast.success(action?.payload?.message);
            state.isPaymentVerified = action?.payload?.success;
        })
        .addCase(getPaymentRecord.rejected, (state, action) => {
            state.allPayments = action?.payload?.allPayments;
            state.finalMonths = action?.payload?.finalMonths;
            state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
        })
    }
});


export default razorpaySlice.reducer;