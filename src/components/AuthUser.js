import React from "react";

const AuthUser  = ({ userInfo }) => {
    // Check if userInfo is null or undefined
    if (!userInfo) {
        return <div className="auth-user">User not signed in</div>; // Fallback UI when user is not signed in
    }

    // Extract relevant user properties
    const { username, fullName, email } = userInfo;

    return (
        <div className="auth-user">
            <h2>Welcome, {fullName || username}</h2>
            {/* <p>Email: {email || "No email available"}</p> */}
            {/* Add other user properties as needed */}
        </div>
    );
};

export default AuthUser ;