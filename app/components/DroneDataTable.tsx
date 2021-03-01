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
  const { data:droneData, fetch, insert } = useDroneStorage()
  const classes = useStyles();
  const [avgValues, setAvgValues] = useState(null)
  const [data, setData] = useState(null)
  useEffect(()=>{
    droneData && setData(droneData)
  }, [droneData])
  const rows: any = data && data.sort((a:any, b:any)=> (new Date(b.Timestamp) > new Date(a.Timestamp))? 1 : -1 )
    .reduce((acc: any = [], row: any) => {
      if(row.isDone == true) {
        return acc;
      }
      delete row.isDone;
      acc.push(row)
      return acc
    }, []) || [];
  useEffect(() => {
    if(data) {
      const avg = averageFieldData(rows)
      setAvgValues(avg)
    }
  }, [data])

  const [fetchCounter, setFetchCounter] = useState(0)
  useEffect(() => {
    console.log('helllo....', inspectionStarted, fetchCounter);
    
    setTimeout(() => {
      if (inspectionStarted === true) {
        fetch(customerId, inspectionId)
        setFetchCounter(fetchCounter + 1)
      } else {
        setFetchCounter(0)
      }
    }, 3000)
    if (fetchCounter === 0) {
      setData(null);
      fetch(customerId, inspectionId)
    }
  }, [inspectionStarted, fetchCounter])
  
  useEffect(() => {
    if (inspectionStarted === true) {
      const lastData = data && data.find((item: any) => item.isDone === 'true')
      console.log(data);
      
      if (lastData || data && data.length >= 45) { 
        onSimulationEnd(avgValues)
      }
    }

  }, [data, inspectionStarted])

  const rowHead = [
    'Image',
    'Timestamp',
    'CultivatedLand',
    'HighQualityCrop',
    'LowQualityCrop',
    'DamageArea',
    'OtherAreas',
    'UnFertileLand',
    'Weather',
    'WindSpeed'
  ]

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
                {rowHead && rowHead.map((_key, index) => (
                  <TableCell key={`${_key}-${index}`} align={index === 0 ? 'left' : 'center'}>{_key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              <TableRow>
                <TableCell >Avg Values</TableCell>
                {avgValues && rowHead.map((_key, index )=> (
                  index > 0 && <TableCell key={`${avgValues[_key]}-${index}`} align={index === 0 ? 'left' : 'center'} color={'primary'}>{avgValues[_key]}</TableCell>
                ))}
              </TableRow>

              {rows && rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell align='center'>
                    <a href={row.fileName} target="_blank">
                      <img className={classes.image} src={row.fileName} />
                    </a>
                  </TableCell>
                  {rowHead.map((_key, index) => (
                    index > 0 && 
                    <TableCell key={`${row[_key]}-${index}`} component="th" scope="row" align={index === 0 ? 'left' : 'center'}>
                      {row[_key] && !isNaN(row[_key]) ? parseFloat(`${row[_key]}`).toFixed(2) : row[_key]}
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