import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Toolbar,
  Paper,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

const LogsDashboard = () => {
  // Get logs and containers from AppContext
  const { logs, containers, getLogs } = useAppContext();
  // Initialize selectedContainers state as an empty set
  const [selectedContainers, setSelectedContainers] = useState<Set<string>>(
    () => {
      // Try to retrieve selectedContainers from localStorage
      const savedSelectedContainers =
        localStorage.getItem('selectedContainers');
      // If found, return a new set from the saved JSON array
      // If not found, return an empty set
      return savedSelectedContainers
        ? new Set(JSON.parse(savedSelectedContainers))
        : new Set();
    }
  );

  // Initialize the logsRows state
  const [logsRows, setLogsRows] = useState<GridRowModel[]>([]);
  const logsRef = useRef(logs);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (containers && containers.length > 0) {
        // get logs for all containers
        getLogs(containers);
      }
    }, 5000); // fetch logs every 5 seconds

    return () => clearInterval(intervalId);
  }, [containers]);

  useEffect(() => {
    logsRef.current = logs;

    // Call the combinedRows function
    const newLogsRows = combinedRows(logsRef.current);
    // Update the logsRows state with the new rows
    setLogsRows(newLogsRows);
  }, [logs]); // Recalculate logsRows whenever logs change

  // Save selectedContainers to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'selectedContainers',
      JSON.stringify(Array.from(selectedContainers))
    );
  }, [selectedContainers]);

  // Define handleCheckboxChange function that updates the selectedContainers state
  const handleCheckboxChange = (containerId: string, checked: boolean) => {
    // Create a new set from selectedContainers
    const newSelectedContainers = new Set(selectedContainers);
    // If checked is true, add containerId to the new set
    // Else, delete containerId from the new set
    checked
      ? newSelectedContainers.add(containerId)
      : newSelectedContainers.delete(containerId);
    // Update selectedContainers state with the new set
    setSelectedContainers(newSelectedContainers);
  };

  // Define combinedRows function, which will create the logs to display in the DataGrid
  const combinedRows = (logs) => {
    // Use Object.entries() to transform logs object into an array of [containerId, logs] pairs
    // Filter this array to only include logs whose containerId is in selectedContainers,
    // or include all logs if selectedContainers is empty
    // Use flatMap() to create a new array of log rows, with each row including the containerId,
    // log type (Output/Error), and log content
    return Object.entries(logs)
      .filter(
        ([containerId]) =>
          selectedContainers.size === 0 || selectedContainers.has(containerId)
      )
      .flatMap(([containerId, { output, errors }]: any[]) => {
        // Check if output and errors are defined, if not, set them to empty arrays
        output = output || [];
        errors = errors || [];

        // For each container, create outputRows from output logs
        const outputRows = output
          .map(({ timestamp, content }, index) => {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
              console.warn(`Invalid timestamp: ${timestamp}`);
              return;
            }
            return {
              id: `${containerId}-o${index}`,
              containerId,
              type: 'Output',
              timestamp: date.toString(),
              content,
            };
          })
          .filter(Boolean); // filter out undefined rows

        // For each container, create errorRows from error logs
        const errorRows = errors
          .map(({ timestamp, content }, index) => {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
              console.warn(`Invalid timestamp: ${timestamp}`);
              return; // skip invalid timestamps
            }
            return {
              id: `${containerId}-e${index}`,
              containerId,
              type: 'Error',
              timestamp,
              content,
            };
          })
          .filter(Boolean); // filter out undefined rows

        // Combine outputRows and errorRows into a single array
        return [...outputRows, ...errorRows];
      });
  };

  const columns: GridColDef[] = [
    { field: 'timestamp', headerName: 'Timestamp', width: 200 },
    { field: 'containerId', headerName: 'Container ID', width: 150 },
    { field: 'type', headerName: 'Type', width: 100 },
    {
      field: 'content',
      headerName: 'Content',
      flex: 1,
      renderCell: (params) => {
        // Split log content into separate lines
        const lines = params.value.split('\n');
        // Render each line of log content as a Typography component
        return (
          <div>
            {lines.map((line, index) => (
              <Typography key={index}>{line}</Typography>
            ))}
          </div>
        );
      },
    },
  ];

  const clearLogs = () => {
    console.log('Clearing logs');
  };

  // Render LogsDashboard component
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Toolbar>
        <Button component={Link} to="/">
          Dashboard
        </Button>{' '}
        <Box sx={{ flexGrow: 1 }} /> {/* This pushes the button to the right */}
        <Button variant="contained" color="secondary" onClick={clearLogs}>
          Clear Logs
        </Button>
      </Toolbar>
      <Paper elevation={3} style={{ margin: '20px', padding: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Select Containers:
        </Typography>
        <Box display="flex" flexWrap="wrap">
          {containers.map((container: any) => (
            <FormControlLabel
              key={container.ID}
              control={
                <Checkbox
                  checked={selectedContainers.has(container.ID)}
                  onChange={(event) =>
                    handleCheckboxChange(container.ID, event.target.checked)
                  }
                />
              }
              label={container.Names}
            />
          ))}
        </Box>
      </Paper>
      {/* Render the DataGrid with the combinedRows and columns */}
      <Box style={{ height: '90vh', width: '100%' }}>
        <DataGrid rows={logsRows} columns={columns} />
      </Box>
    </div>
  );
};

export default LogsDashboard;
