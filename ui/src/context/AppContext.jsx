import { useContext, useReducer, createContext, useEffect } from 'react';
import {
  CHANGE_STATS,
  CHANGE_LOGS,
  CHANGE_CONTAINERS,
  CHANGE_CURRENT_CONTAINER,
} from './actions';
import reducer from './reducer';
import { createDockerDesktopClient } from '@docker/extension-api-client';

const client = createDockerDesktopClient();

const savedState = localStorage.getItem('state');

const initialState = {
  containers: [],
  logs: {},
  stats: [],
  currentContainer: '',
};

const currentState = savedState ? JSON.parse(savedState) : initialState;

const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, currentState);
  useEffect(() => {
    // Load saved state from localStorage
    const savedState = localStorage.getItem('state');
    if (savedState) {
      dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
    }
  }, []);

  useEffect(() => {
    // Save state to localStorage whenever it changes
    localStorage.setItem('state', JSON.stringify(state));
  }, [state]);

  const changeStats = (result) => {
    dispatch({
      type: CHANGE_STATS,
      payload: result,
    });
  };

  const changeLogs = (result) => {
    dispatch({
      type: CHANGE_LOGS,
      payload: result,
    });
  };

  const changeCurrentContainer = (result) => {
    dispatch({
      type: CHANGE_CURRENT_CONTAINER,
      payload: result,
    });
  };

  const changeContainers = (result) => {
    dispatch({
      type: CHANGE_CONTAINERS,
      payload: result,
    });
  };

  const getContainers = async () => {
    try {
      const result = await client.docker.cli.exec('ps', [
        '--all',
        '--format',
        '"{{json .}}"',
      ]);
      const containers = result.parseJsonLines();
      changeContainers(containers);
    } catch (error) {
      console.error('Failed to fetch containers:', error);
    }
  };

  const getLogs = async (containers) => {
    const logPromises = containers?.map(async (container) => {
      try {
        const logs = await client.docker.cli.exec(
          `container logs --details --timestamps ${container.ID}`,
          []
        );
        return logs;
      } catch (error) {
        console.error(
          `Error getting logs for container ${container.ID}:`,
          error
        );
        return null;
      }
    });

    const logResults = await Promise.all(logPromises);

    logResults.forEach((result, index) => {
      if (result) {
        changeLogs([containers[index].ID, result.stdout, result.stderr]);
      }
    });
  };

  const setCurrentContainer = (id) => {
    changeCurrentContainer(id);
  };

  const getStats = async (containers) => {
    const statsPromises = containers?.map((container) =>
      ddClient.docker.cli.exec('stats', ['--no-stream', container.ID])
    );

    const results = await Promise.all(statsPromises);

    results.forEach((result, index) => {
      const parsedStats = result.stdout.replace(/([ ]{2,})|(\n)/g, ',');
      const arr = parsedStats.split(',');
      changeStats([containers[index].ID, arr[10], arr[12]]);
    });
  };

  const startContainer = async (containerID) => {
    try {
      await ddClient.docker.cli.exec('container start', [containerID]);
      console.log(`Container ${containerID} started successfully.`);
    } catch (error) {
      console.error(`Error starting container ${containerID}:`, error);
    }
  };

  const killContainer = (containerID) => {
    ddClient.docker.cli.exec('container stop', [containerID]);
  };

  const superKillContainer = (containerID) => {
    ddClient.docker.cli.exec('container rm', ['-f', containerID]);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        client,
        changeStats,
        changeLogs,
        changeContainers,
        changeCurrentContainer,
        setCurrentContainer,
        getContainers,
        getLogs,
        getStats,
        saveState,
        startContainer,
        killContainer,
        superKillContainer,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const saveState = (state) => {
  localStorage.setItem('state', JSON.stringify(state));
};

const useAppContext = () => useContext(AppContext);

export { AppContextProvider, useAppContext, initialState, saveState };
