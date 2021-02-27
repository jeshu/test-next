import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import { useDroanStorage } from 'lib/useDroanStorage';
import { averageFieldData } from 'utils/IDVCalculator';

const useStyles = makeStyles({
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
  }
});

const DoranDataTable = ({ customerId, inspectionId, inspectionStarted, onSimulationEnd }) => {
  const { data, fetch, insert } = useDroanStorage()
  const classes = useStyles();
  const rows: any = data && data.reduce((acc: any = [], row: any) => {
    delete row.isDone;
    acc.push(row)
    return acc
  }, []) || [];
  const [avgValues, setAvgValues] = useState(null)
  useEffect(() => {
    const avg = averageFieldData(rows)
    setAvgValues(avg)
  }, [data])
  useEffect(() => {
    fetch(customerId, inspectionId)
  }, [customerId, inspectionId]);

  const [fetchCounter, setFetchCounter] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      if (inspectionStarted === true) {
        fetch(customerId, inspectionId)
        setFetchCounter(fetchCounter + 1)
      }
    }, 10000)
  }, [inspectionStarted, fetchCounter])
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    if (!inspectionStarted && counter === 0 && (!data || data.length === 0)) {
      return
    }
    const lastData = data && data.find((item: any) => item.isDone === 'true')
    if (lastData || counter > 20) {
      onSimulationEnd(avgValues)
    } else {
      setTimeout(() => {
        insert({
          Cultivatedland: Math.round(10 + (Math.random() * 10)),
          UnFertileLand: Math.round(10 + (Math.random() * 10)),
          OtherAreas: Math.round(10 + (Math.random() * 10)),
          HighQualityCrop: Math.round(10 + (Math.random() * 10)),
          LowQualityCrop: Math.round(10 + (Math.random() * 10)),
          DamageArea: Math.round(10 + (Math.random() * 10)),
          Temperature: Math.round(10 + (Math.random() * 10)),
          Humidity: Math.round(10 + (Math.random() * 10)),
          WindSpeed: Math.round(10 + (Math.random() * 10)),
          Moisture: Math.round(10 + (Math.random() * 10)),
          DroneHeight: Math.round(10 + (Math.random() * 10)),
          DroneCameraResolution: Math.round(10 + (Math.random() * 10)),
          customerId,
          inspectionId,
          isDone: counter > 20 ? 'true' : 'false'
        })
        setCounter(counter + 1);
      }, 1000)
    }

  }, [counter, data, inspectionStarted])


  return (
    data && data.length > 0 ?
      <TableContainer>
        <Table className={classes.table} aria-label="simple table" stickyHeader={true}>
          <TableHead>
            <TableRow>
              {rows && rows[0] && Object.keys(rows[0]).map((_key, index) => (
                <TableCell align={index === 0 ? 'left' : 'center'}>{_key.toUpperCase()}</TableCell>
              ))}
              <TableCell align='center'>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {rows.map((row) => (
              <TableRow key={row.name}>
                {Object.values(row).map((_value, index) => (
                  <TableCell component="th" scope="row" align={index === 0 ? 'left' : 'center'}>
                    {_value}
                  </TableCell>)
                )}
                <TableCell align='center'>
                  <a href='https://images.unsplash.com/photo-1437252611977-07f74518abd7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8d2hlYXR8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80' target="_blank">
                    <img className={classes.image} src="https://images.unsplash.com/photo-1437252611977-07f74518abd7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8d2hlYXR8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80" />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              {avgValues && Object.values(avgValues).map((_value, index) => (
                <TableCell align={index === 0 ? 'left' : 'center'}>{_value}</TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer> :
      <Box>
        Preparing the Droan...
    </Box>
  );
}
export default DoranDataTable