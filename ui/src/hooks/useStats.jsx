import { useAppContext } from '../context/AppContext';
import { CHANGE_STATS } from '../context/actions';

const useStats = (ddClient, containers) => {
  const { dispatch } = useAppContext();

  // Return a function that fetches the stats and dispatches the action
  const fetchStats = async () => {
    const statsPromises = containers.map((container) =>
      ddClient.docker.cli.exec('stats', ['--no-stream', container.ID])
    );

    const results = await Promise.all(statsPromises);

    const parsedResults = results.map((result) => {
      const parsedStats = result.stdout.replace(/([ ]{2,})|(\n)/g, ',');
      const arr = parsedStats.split(',');
      return { id: container.ID, cpu: arr[10], mem: arr[12] };
    });

    dispatch({ type: CHANGE_STATS, payload: parsedResults });
  };

  return fetchStats;
};

export default useStats;
