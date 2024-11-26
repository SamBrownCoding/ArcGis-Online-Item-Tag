import React, { useState, useEffect } from "react";
import IdentityManager from '@arcgis/core/identity/IdentityManager.js';
import OAuthInfo from '@arcgis/core/identity/OAuthInfo.js';
import Portal from '@arcgis/core/portal/Portal.js';
import LoginButton from "./components/LoginButton.js";
import LogoutButton from "./components/LogoutButton.js";
import AuthUser from "./components/AuthUser.js";
import UserItems from "./components/UserItems.js";
import '../src/style.css';

const APP_ID = "uyraRvZ6pdkx1MLM"; // your actual appId
const PORTAL_URL = "https://www.arcgis.com"; // Replace with your portal URL if different

function App() {
    const [userInfo, setUserInfo] = useState(null);
    const [isSignedIn, setIsSignedIn] = useState(false);

    useEffect(() => {
        const oauthInfo = new OAuthInfo({
            appId: APP_ID,
            popup: false,
            portalUrl: PORTAL_URL,
        });
        IdentityManager.registerOAuthInfos([oauthInfo]);

        IdentityManager.checkSignInStatus(`${oauthInfo.portalUrl}/sharing`)
            .then(() => handleSignedIn())
            .catch(() => handleSignedOut());
    }, []);

    const handleSignedIn = async () => {
        setIsSignedIn(true);
        const credential = IdentityManager.findCredential(`${PORTAL_URL}/sharing`);

        if (credential) {
            const portal = new Portal();
            try {
                await portal.load();
                const user = portal.user;
                console.log("User Info:", user);
                setUserInfo(user);
            } catch (error) {
                console.error("Error loading portal:", error);
                handleSignedOut();
            }
        }
    };

    const handleSignedOut = () => {
        IdentityManager.destroyCredentials(); // Clear stored credentials
        setIsSignedIn(false);
        setUserInfo(null);
    };

    return (
        <div className="App centered-container">
            {isSignedIn ? (
                <>
                    <AuthUser  userInfo={userInfo} />
                    <UserItems userInfo={userInfo} />
                    <LogoutButton onClick={handleSignedOut} />
                </>
            ) : (
                <LoginButton portalUrl={PORTAL_URL} />
            )}
        </div>
    );
}

export default App;