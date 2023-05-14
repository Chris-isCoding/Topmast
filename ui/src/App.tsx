import { Routes, Route } from 'react-router-dom';
import DashboardView from './views/DashboardView';
import ContainerView from './views/ContainerView';
import LogsDashboard from './components/LogsDashboard';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Logo from '../assets/topmast_cruise.svg';

export function App() {
  return (
    <>
      <Box display="flex" alignItems="center">
        <Typography variant="h2">Topmast</Typography>
        <img
          src={Logo}
          alt="Topmast Logo"
          style={{ marginLeft: '10px', width: '50px', height: '50px' }}
        />
      </Box>

      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/container" element={<ContainerView />} />
        <Route path="/containerlogs" element={<LogsDashboard />} />
      </Routes>
    </>
  );
}
