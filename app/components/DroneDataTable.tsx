import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import { useDroneStorage } from 'lib/useDroneStorage';
import { averageFieldData } from 'utils/IDVCalculator';
import CircularProgress from '@material-ui/core/CircularProgress';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';

const useStyles = makeStyles((theme) => ({
  table: {
    maxWidth: '100%',
    overflow: 'hidden'
  },
  image: {
    maxWidth: '100px',
    maxHeight: '100px',
    outline: '4px solid black',
    padding: '2px',
  },
  tableBody: {
    maxHeight: '60vh'
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(3, 0),
  },
  spinner: {
    marginLeft: theme.spacing(2)
  },

  noContentMsg: {
    display: 'grid',
    placeItems: 'center',
    minHeight: theme.spacing(10),
    marginTop: theme.spacing(3)
  }
}));

const DroneDataTable = ({ customerId, inspectionId, inspectionStarted, onSimulationEnd }) => {
  const { data, fetch, insert } = useDroneStorage()
  const classes = useStyles();
  const [avgValues, setAvgValues] = useState(null)
  const rows: any = data && data.sort((a:any, b:any)=> (new Date(b.Timestamp) > new Date(a.Timestamp))? 1 : -1 )
    .reduce((acc: any = [], row: any) => {
      delete row.isDone;
      acc.push(row)
      return acc
    }, []) || [];
  useEffect(() => {
    const avg = averageFieldData(rows)
    setAvgValues(avg)
  }, [data])

  const [fetchCounter, setFetchCounter] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      if (inspectionStarted === true) {
        fetch(customerId, inspectionId)
        setFetchCounter(fetchCounter + 1)
      } else {
        setFetchCounter(0)
      }
    }, 3000)
    if (fetchCounter === 0) {
      fetch(customerId, inspectionId)
    }
  }, [inspectionStarted, fetchCounter])
  // const [counter, setCounter] = useState(0);
  useEffect(() => {
    if (inspectionStarted === true) {
      const lastData = data && data.find((item: any) => item.isDone === 'true')
      if (lastData ) { //|| counter > 20
        onSimulationEnd(avgValues)
      } else {
        // setTimeout(() => {
        //   insert({
        //     Cultivatedland: Math.round(10 + (Math.random() * 10)),
        //     UnFertileLand: Math.round(10 + (Math.random() * 10)),
        //     OtherAreas: Math.round(10 + (Math.random() * 10)),
        //     HighQualityCrop: Math.round(10 + (Math.random() * 10)),
        //     LowQualityCrop: Math.round(10 + (Math.random() * 10)),
        //     DamageArea: Math.round(10 + (Math.random() * 10)),
        //     Temperature: Math.round(33 + (Math.random() * 10)),
        //     Humidity: Math.round(80 + (Math.random() * 10)),
        //     WindSpeed: Math.round(38 + (Math.random() * 10)),
        //     Moisture: Math.round(14 + (Math.random() * 10)),
        //     DroneHeight: Math.round(10 + (Math.random() * 10)),
        //     DroneCameraResolution: Math.round(10 + (Math.random() * 10)),
        //     customerId,
        //     inspectionId,
        //     isDone: counter > 20 ? 'true' : 'false'
        //   })
        //   setCounter(counter + 1);
        // }, 1000)
      }
    }

  }, [data, inspectionStarted]) //counter


  return (
    data && data.length > 0 ?
      <Box>
        <Box className={classes.title}>
          <Typography
            component="h5"
            variant="h5"
            color="inherit"
            gutterBottom
          >
            Feeds from Drone
        </Typography>
          {inspectionStarted && <CircularProgress className={classes.spinner} />}
        </Box>
        <TableContainer>
          <Table className={classes.table} aria-label="simple table" stickyHeader={true}>
            <TableHead>
              <TableRow>
                <TableCell align='center'>Image</TableCell>
                {rows && rows[0] && Object.keys(rows[0]).map((_key, index) => (
                  <TableCell key={`${_key}-${index}`} align={index === 0 ? 'left' : 'center'}>{_key}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableFooter>
            </TableFooter>

            <TableBody className={classes.tableBody}>
              <TableRow>
                <TableCell >Avg Values</TableCell>
                {avgValues && Object.values(avgValues).map((_value, index) => (
                  <TableCell key={`${_value}-${index}`} align={index === 0 ? 'left' : 'center'} color={'primary'}>{_value}</TableCell>
                ))}
              </TableRow>

              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell align='center'>
                    <a href='https://images.unsplash.com/photo-1437252611977-07f74518abd7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8d2hlYXR8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80' target="_blank">
                      <img className={classes.image} src="https://images.unsplash.com/photo-1437252611977-07f74518abd7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8d2hlYXR8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80" />
                    </a>
                  </TableCell>
                  {Object.values(row).map((_value, index) => (
                    <TableCell key={`${_value}-${index}`} component="th" scope="row" align={index === 0 ? 'left' : 'center'}>
                      {_value}
                    </TableCell>)
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      :
      <Box className={classes.noContentMsg}>
        <FlightTakeoffIcon fontSize="large" color="primary"/>
        <Typography variant="h6" id="tableTitle" component="span">
          Preparing Drone to gather information
          </Typography>
      </Box>
  );
}
export default DroneDataTable