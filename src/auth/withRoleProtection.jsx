
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext

const withRoleProtection = (WrappedComponent, allowedRoles) => {
    return (props) => {
        const { currentUser, userRole } = useAuth(); // Hooks to get user and role

        if (!currentUser) {
            return <Navigate to="/login" />;
        }

        if (!allowedRoles.includes(userRole)) {
            return <Navigate to="/unauthorized" />;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withRoleProtection;
