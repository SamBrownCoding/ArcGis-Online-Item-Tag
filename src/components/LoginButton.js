import React from "react";
import IdentityManager from '@arcgis/core/identity/IdentityManager'; // Ensure correct import

const LoginButton = ({ portalUrl }) => {
    const handleLogin = async () => {
        try {
            await IdentityManager.getCredential(`${portalUrl}/sharing`);
            // Optionally, you can add any additional logic here after successful login
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="sign-in-box">
            <h2 style={{ color: 'white' }}>Welcome to ArcGIS Online</h2> {/* Optional title */}
            <button className="sign-in-button" onClick={handleLogin}>
                Sign In
            </button>
        </div>
    );
};

export default LoginButton;