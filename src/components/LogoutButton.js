import React from "react";

const LogoutButton = ({ onClick }) => {
    return <button className="logout-button" onClick={onClick}>Sign Out</button>;
};

export default LogoutButton;