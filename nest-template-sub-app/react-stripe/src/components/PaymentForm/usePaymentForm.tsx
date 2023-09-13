import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FormEvent } from "react";
import axios from "axios";

function usePaymentForm() {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const amountToCharge = 100;

        const cardElement = elements?.getElement(CardElement);

        if (!stripe || !elements || !cardElement) {
            return;
        }

        const stripeResponse = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        const { error, paymentMethod } = stripeResponse;

        if (error || !paymentMethod) {
            return;
        }

        const response1 = await axios.post(
            `${process.env.REACT_APP_API_URL}/credit-cards`,
            { paymentMethodId: paymentMethod.id },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("response1: ", response1);
        const clientSecret = (response1 as any).data.client_secret;
        stripe?.confirmCardSetup(clientSecret);

        const response2 = await axios.post(
            `${process.env.REACT_APP_API_URL}/payment/charge`,
            {
                paymentMethodId: paymentMethod.id,
                amount: amountToCharge,
            },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("response2: ", response2);
        if ((response2 as any).data && (response2 as any).data.status !== "succeeded") {
            const secret = (response2 as any).data.client_secret;
            stripe?.confirmCardPayment(secret);
        }
    };

    return {
        handleSubmit,
    };
}

export default usePaymentForm;
