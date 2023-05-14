import { useAppContext } from '../context/AppContext';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CircleIcon from '@mui/icons-material/Circle';
import { red, green, grey, blue } from '@mui/material/colors';
import { Typography } from '@mui/material';
// import { useStats } from '../hooks';

const DashboardView = () => {
  const {
    containers,
    stats,
    getContainers,
    setCurrentContainer,
    getLogs,
    getStats,
    startContainer,
    killContainer,
    removeContainer,
  } = useAppContext();

  useEffect(() => {
    const fetchContainers = async () => {
      await getContainers();
    };

    // Call once immediately, then set up interval
    fetchContainers();
    const interval = setInterval(fetchContainers, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      await getLogs(containers);
    };

    // Call once immediately, then set up interval
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);

    return () => clearInterval(interval);
  }, [containers]); // Depend on containers

  useEffect(() => {
    const fetchStats = async () => {
      await getStats(containers);
    };

    // Call once immediately, then set up interval
    fetchStats();
    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, [containers]); // Depend on containers

  return (
    <div>
      <Typography
        sx={{
          fontWeight: 'bold',
          my: 2,
          fontSize: 12,
          textTransform: 'uppercase',
        }}
      >
        {' '}
        Dashboard |&nbsp;
        <Link to="/containerlogs" color="blue[600]">
          Container Logs
        </Link>
      </Typography>

      <Box
        component="span"
        sx={{
          color: grey[500],
          fontSize: 10,
          textTransform: 'uppercase',
          mt: 1,
        }}
      ></Box>

      {containers.map((container) => {
        if (container.Image !== 'moby-metrics/topmast:latest') {
          return (
            <Card key={container.ID}>
              <CardContent>
                <Box
                  m={1} //margin
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <CircleIcon
                    sx={{
                      fontSize: 16,
                      mr: 1,
                      ml: -1,
                      mt: 1,
                      color:
                        container.State === 'running' ? green[600] : red[300],
                    }}
                  />

                  <Link
                    to="/container"
                    style={{ textDecoration: 'none' }}
                    onClick={() => setCurrentContainer(container.ID)}
                  >
                    <Typography variant="h3" sx={{ color: blue[600] }}>
                      {container.Names}
                    </Typography>
                  </Link>
                </Box>

                <Typography sx={{ ml: 3 }}>
                  <Box
                    component="span"
                    sx={{
                      color: grey[500],
                      fontSize: 10,
                      textTransform: 'uppercase',
                      mt: 1,
                    }}
                  >
                    Container ID:
                  </Box>{' '}
                  {container.ID} &nbsp; &nbsp;
                  <Box
                    component="span"
                    sx={{
                      color: grey[500],
                      fontSize: 10,
                      textTransform: 'uppercase',
                      mt: 1,
                    }}
                  >
                    Image:
                  </Box>{' '}
                  {container.Image}
                </Typography>

                <Typography sx={{ ml: 3 }}>
                  <Box
                    component="span"
                    sx={{
                      color: grey[500],
                      fontSize: 10,
                      textTransform: 'uppercase',
                      mt: 1,
                    }}
                  >
                    Status:
                  </Box>{' '}
                  {container.Status} &nbsp; &nbsp;
                  <Box
                    component="span"
                    sx={{
                      color: grey[500],
                      fontSize: 10,
                      textTransform: 'uppercase',
                      mt: 1,
                    }}
                  >
                    CPU%:
                  </Box>{' '}
                  {stats[container.ID]?.cpu} &nbsp; &nbsp;
                  <Box
                    component="span"
                    sx={{
                      color: grey[500],
                      fontSize: 10,
                      textTransform: 'uppercase',
                      mt: 1,
                    }}
                  >
                    MEM%:
                  </Box>{' '}
                  {stats[container.ID]?.memory}
                </Typography>

                <Box
                  m={1} //margin
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 1,
                      mr: 1,
                      color:
                        container.State === 'running' ? grey[600] : green[600],
                    }}
                    onClick={() => {
                      startContainer(container.ID);
                    }}
                  >
                    START
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 1,
                      mr: 1,
                      color:
                        container.State === 'running' ? red[300] : grey[600],
                    }}
                    onClick={() => {
                      killContainer(container.ID);
                    }}
                  >
                    KILL
                  </Button>

                  <Button
                    variant="text"
                    size="small"
                    sx={{
                      mt: 1,
                      color: red[300],
                    }}
                    onClick={() => {
                      removeContainer(container.ID);
                    }}
                  >
                    FORCE REMOVE
                  </Button>
                </Box>
              </CardContent>

              {/* </CardActionArea> */}
            </Card>
          );
        }
      })}
    </div>
  );
};

export default DashboardView;
