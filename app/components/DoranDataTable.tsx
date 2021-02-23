import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

interface DroneData {
  "index": string,
  "temperature": string,
  "humidity": string,
  "wheateArea": string,
  "wasteLand": string,
  "water": string
}

function createData(index:string, temperature:string, wheateArea:string, humidity:string, wasteLand:string, water:string) {
  return { index, temperature, wheateArea, humidity, wasteLand, water};
}

const DoranDataTable = ({ data }) => {
  const classes = useStyles();
  const rows = data && data.map((row:DroneData) => {
    const {index, temperature, wheateArea, humidity, wasteLand, water}  = row;
    return createData(index, temperature, wheateArea, humidity, wasteLand, water)})
  return (
    <TableContainer>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {rows && rows[0] && Object.keys(rows[0]).map((_key, index) => (
              <TableCell align={index === 0 ? 'left' : 'center'}>{_key.toUpperCase()}</TableCell>
            ))}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default DoranDataTable