import React from "react";
import useSubscriptionConfirmation from "./useSubscriptionsConfirmation";

const SubscriptionForm = () => {
    const { confirmSubscription } = useSubscriptionConfirmation();

    return (
        <div style={{ display: "flex" }}>
            <button style={{ flex: 1 }} onClick={confirmSubscription}>
                Subscription
            </button>
        </div>
    );
};

export default SubscriptionForm;
