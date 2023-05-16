import { useAppContext } from '../context/AppContext';
import { Typography } from '@mui/material';
import ContainerChart from '../components/ContainerChart';

const ContainerView = () => {
  const { currentContainer, stats } = useAppContext();

  return (
    <>
      <h3>Content in the container view {currentContainer}</h3>
      <h3>cpu: {stats[currentContainer]?.cpu}</h3>
      <Typography>MEM %: {stats[currentContainer]?.memory}</Typography>
      <hr />
      <ContainerChart />
    </>
  );
};

export default ContainerView;
