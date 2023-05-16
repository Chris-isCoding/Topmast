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
  Menu,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';

const LogsDashboard = () => {
  const { logs, containers, getLogs } = useAppContext();
  const [selectedContainers, setSelectedContainers] = useState<Set<string>>(
    () => {
      const savedSelectedContainers =
        localStorage.getItem('selectedContainers');
      return savedSelectedContainers
        ? new Set(JSON.parse(savedSelectedContainers))
        : new Set();
    }
  );

  const [logsRows, setLogsRows] = useState<GridRowModel[]>([]);
  const logsRef = useRef(logs);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dropdownContent, setDropdownContent] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (containers && containers.length > 0) {
        getLogs(containers);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [containers]);

  useEffect(() => {
    logsRef.current = logs;
    const newLogsRows = combinedRows(logsRef.current);
    setLogsRows(newLogsRows);
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(
      'selectedContainers',
      JSON.stringify(Array.from(selectedContainers))
    );
  }, [selectedContainers]);

  const handleCheckboxChange = (containerId: string, checked: boolean) => {
    const newSelectedContainers = new Set(selectedContainers);
    checked
      ? newSelectedContainers.add(containerId)
      : newSelectedContainers.delete(containerId);
    setSelectedContainers(newSelectedContainers);
  };

  const combinedRows = (logs) => {
    return Object.entries(logs)
      .filter(
        ([containerId]) =>
          selectedContainers.size === 0 || selectedContainers.has(containerId)
      )
      .flatMap(([containerId, { output, errors }]: any[]) => {
        output = output || [];
        errors = errors || [];

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
              timestamp: date,
              content,
            };
          })
          .filter(Boolean);

        const errorRows = errors
          .map(({ timestamp, content }, index) => {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
              console.warn(`Invalid timestamp: ${timestamp}`);
              return;
            }
            return {
              id: `${containerId}-e${index}`,
              containerId,
              type: 'Error',
              timestamp: date,
              content,
            };
          })
          .filter(Boolean);

        return [...outputRows, ...errorRows];
      });
  };

  const columns: GridColDef[] = [
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      width: 200,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      },
      sortComparator: (v1, v2, param1, param2) =>
        new Date(param1.value).getTime() - new Date(param2.value).getTime(),
    },
    { field: 'containerId', headerName: 'Container ID', width: 150 },
    { field: 'type', headerName: 'Type', width: 100 },
    {
      field: 'content',
      headerName: 'Content',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ padding: '10px' }}>
            <Typography>{params.value}</Typography>
          </Box>
        );
      },
    },
  ];

  const clearLogs = () => {
    console.log('Clearing logs');
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>, param) => {
    setDropdownContent(param.row.content);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {/* <Toolbar sx={{ marginBottom: '10px', paddingRight: '10px' }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" color="secondary" onClick={clearLogs}>
          Clear Logs
        </Button>
      </Toolbar> */}
      <Paper elevation={3} sx={{ margin: '20px', padding: '20px' }}>
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
      <Box sx={{ height: '90vh', width: '100%' }}>
        <DataGrid
          rows={logsRows}
          columns={columns}
          onRowClick={(param, event) => handleOpen(event, param)}
        />
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: '80vh',
            width: 'auto',
            overflow: 'auto',
          },
        }}
      >
        <Typography sx={{ padding: '10px' }}>{dropdownContent}</Typography>
      </Menu>
    </div>
  );
};

export default LogsDashboard;
