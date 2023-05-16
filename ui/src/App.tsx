import { Routes, Route, Link } from 'react-router-dom';
import DashboardView from './views/DashboardView';
import ContainerView from './views/ContainerView';
import LogsDashboard from './components/LogsDashboard';
import { Typography, Button, ButtonGroup, Box } from '@mui/material';

import Logo from '../assets/topmast_cruise.svg';

export function App() {
  return (
    <>
      <Box sx={{ marginBottom: '20px' }} display="flex" alignItems="center">
        <Typography variant="h2" sx={{ marginRight: '10px' }}>
          Topmast
        </Typography>
        <img
          src={Logo}
          alt="Topmast Logo"
          style={{ width: '50px', height: '50px' }}
        />
      </Box>

      <ButtonGroup
        sx={{ marginBottom: '20px' }}
        size="small"
        variant="contained"
        aria-label="main navigation"
      >
        <Button component={Link} to="/">
          Dashboard
        </Button>
        <Button component={Link} to="/containerlogs">
          Logs
        </Button>
      </ButtonGroup>

      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/container" element={<ContainerView />} />
        <Route path="/containerlogs" element={<LogsDashboard />} />
      </Routes>
    </>
  );
}
