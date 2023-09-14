import React, { useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./components/PaymentForm";
import SubscriptionForm from "./components/SubscriptionForm";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string);

function App() {
    return (
        <div>
            <div>
                <h1>Payment</h1>
            </div>
            <Elements stripe={stripePromise}>
                <PaymentForm />
            </Elements>
            <div>
                <h1>Get List Subscription</h1>
            </div>
            <Elements stripe={stripePromise}>
                <SubscriptionForm />
            </Elements>
        </div>
    );
}

export default App;
