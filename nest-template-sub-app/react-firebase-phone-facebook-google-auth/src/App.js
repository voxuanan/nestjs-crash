import { Button, Card, CardContent, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { auth, getTokenKey } from "./firebase";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider,
    getRedirectResult,
} from "firebase/auth";

const App = () => {
    const [phone, setPhone] = useState("+84787630820");
    const [hasFilled, setHasFilled] = useState(false);
    const [otp, setOtp] = useState("123456");

    useEffect(() => {
        getTokenKey();
    }, []);

    const generateRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha",
            {
                size: "invisible",
                callback: (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    // ...
                },
            },
            auth
        );
    };

    const handleSend = (event) => {
        event.preventDefault();
        setHasFilled(true);
        generateRecaptcha();
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phone, appVerifier)
            .then((confirmationResult) => {
                console.log(confirmationResult);
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
            })
            .catch((error) => {
                // Error; SMS not sent
                console.log(error);
            });
    };

    const handleLoginWithGoogle = (event) => {
        event.preventDefault();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(function (result) {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(credential, token);
                console.log("User>>Goole>>>>", user);
            })
            .catch(function (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.error("Error: hande error here>>>", error.code);
            });
    };

    const handleLoginWithFacebook = (event) => {
        event.preventDefault();
        const provider = new FacebookAuthProvider();
        signInWithPopup(auth, provider)
            .then(function (result) {
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(credential, token);
                console.log("User>>Goole>>>>", user);
            })
            .catch(function (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = FacebookAuthProvider.credentialFromError(error);
                console.error("Error: hande error here>>>", error.code);
            });
    };

    const verifyOtp = (event) => {
        let otp = event.target.value;
        setOtp(otp);

        if (otp.length === 6) {
            // verifu otp
            let confirmationResult = window.confirmationResult;
            confirmationResult
                .confirm(otp)
                .then((result) => {
                    // User signed in successfully.
                    let user = result.user;
                    console.log(user);
                    alert("User signed in successfully");
                    // ...
                })
                .catch((error) => {
                    // User couldn't sign in (bad verification code?)
                    // ...
                    alert("User couldn't sign in (bad verification code?)");
                });
        }
    };

    if (!hasFilled) {
        return (
            <div className="app__container">
                <Card sx={{ width: "300px" }}>
                    <CardContent
                        sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
                    >
                        <Typography sx={{ padding: "20px" }} variant="h5" component="div">
                            Enter your phone number
                        </Typography>
                        <form
                            onSubmit={handleSend}
                            style={{ display: "flex", flexDirection: "column" }}
                        >
                            <TextField
                                sx={{ width: "240px" }}
                                variant="outlined"
                                autoComplete="off"
                                label="Phone Number"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ width: "240px", marginTop: "20px" }}
                            >
                                Send Code
                            </Button>
                        </form>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ width: "240px", marginTop: "20px" }}
                            onClick={handleLoginWithGoogle}
                        >
                            Login with google
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ width: "240px", marginTop: "20px" }}
                            onClick={handleLoginWithFacebook}
                        >
                            Login with facebook
                        </Button>
                    </CardContent>
                </Card>
                <div id="recaptcha"></div>
            </div>
        );
    } else {
        return (
            <div className="app__container">
                <Card sx={{ width: "300px" }}>
                    <CardContent
                        sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
                    >
                        <Typography sx={{ padding: "20px" }} variant="h5" component="div">
                            Enter the OTP
                        </Typography>
                        <TextField
                            sx={{ width: "240px" }}
                            variant="outlined"
                            label="OTP "
                            value={otp}
                            onChange={verifyOtp}
                        />
                    </CardContent>
                </Card>
                <div id="recaptcha"></div>
            </div>
        );
    }
};

export default App;
