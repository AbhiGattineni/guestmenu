
import React from 'react';
import { Typography, Container } from '@mui/material';

const UnauthorizedPage = () => {
    return (
        <Container sx={{ textAlign: 'center', mt: '20%' }}>
            <Typography variant="h3" color="error">Not Authorized</Typography>
            <Typography variant="body1">You do not have permission to view this page.</Typography>
        </Container>
    );
};

export default UnauthorizedPage;
