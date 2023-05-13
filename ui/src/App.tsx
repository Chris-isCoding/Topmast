import { Routes, Route } from 'react-router-dom';
import DashboardView from './views/DashboardView';
import ContainerView from './views/ContainerView';
import LogsDashboard from './components/LogsDashboard';

export function App() {
  return (
    <>
      <h2>Topmast</h2>

      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/container" element={<ContainerView />} />
        <Route path="/containerlogs" element={<LogsDashboard />} />
      </Routes>
    </>
  );
}
