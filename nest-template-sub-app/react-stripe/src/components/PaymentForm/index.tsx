import React from "react";
import { CardElement } from "@stripe/react-stripe-js";
import usePaymentForm from "./usePaymentForm";

const PaymentForm = () => {
    const { handleSubmit } = usePaymentForm();

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: "flex" }}>
                <CardElement className="CardElement" />
                <button style={{ flex: 1 }}>Pay</button>
            </div>
        </form>
    );
};

export default PaymentForm;
