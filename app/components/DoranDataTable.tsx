import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useDroanStorage} from 'lib/useDroanStorage';
import Paper from '@material-ui/core/Paper';

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
  }
});

interface DroneData {
  "index": string,
  "temperature": string,
  "humidity": string,
  "wheateArea": string,
  "wasteLand": string,
  "water": string
}

function createData(index: string, temperature: string, wheateArea: string, humidity: string, wasteLand: string, water: string) {
  return { index, temperature, wheateArea, humidity, wasteLand, water };
}

const DoranDataTable = () => {
  const { data, fetch } = useDroanStorage()
  const classes = useStyles();
  const rows:any = data || [];
  useEffect(() => {
    fetch('id')
  }, [])
  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {rows && rows[0] && Object.keys(rows[0]).map((_key, index) => (
              <TableCell align={index === 0 ? 'left' : 'center'}>{_key.toUpperCase()}</TableCell>
            ))}
            <TableCell align='center'>Image</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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
      </Table>
    </TableContainer>
  );
}
export default DoranDataTable