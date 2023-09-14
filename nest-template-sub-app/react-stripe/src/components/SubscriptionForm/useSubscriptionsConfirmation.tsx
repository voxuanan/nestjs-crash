import { useStripe } from "@stripe/react-stripe-js";
import axios from "axios";

function useSubscriptionConfirmation() {
    const stripe = useStripe();

    const confirmSubscription = async () => {
        const subscriptionResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/subscriptions/monthly`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (subscriptionResponse.data.status == "incomplete") {
            const secret = subscriptionResponse.data.latest_invoice.payment_intent.client_secret;
            if (secret) await stripe?.confirmCardPayment(secret);
        }
    };

    return {
        confirmSubscription,
    };
}

export default useSubscriptionConfirmation;
