import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Link from 'next/link';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import { useInspectionStorage } from 'lib/useInspectionData';

const useStyles = makeStyles((theme: Theme) => ({

  root: {
    width: '100%',
    padding: theme.spacing(3)
  },
  paper: {
    width: '100%',
    margin: theme.spacing(8, 0),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },

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
}));

const InspectionTable = ({ customerId, policyId, inspectionStarted, onSimulationEnd }) => {
  const { list, fetchAll, insert } = useInspectionStorage()
  const classes = useStyles();
  const rows: any = list && list.reduce((acc:any, item:any) => {
    const data = {
      inspectionId: item.inspectionId,
      timeStamp: item.Timestamp,
      IDV: item.IDV,
      policy: item.policyAssociated
    }
    acc.push(data)
    return acc;
  }, []) || [];

  useEffect(() => {
    fetchAll(customerId, policyId)
  }, [customerId, policyId]);


  return (
    list && list.length > 0 ?
      <Paper className={classes.paper} elevation={0}>
        <Container className={classes.root}>
          <Typography variant="h4" id="tableTitle" component="h3">
            Inspection History
        </Typography>
          <TableContainer>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {rows && rows[0] && Object.keys(rows[0]).map((_key, index) => (
                    <TableCell align={index === 0 ? 'left' : 'center'}>{_key.toUpperCase()}</TableCell>
                  ))}
                  <TableCell align='center'>Details</TableCell>
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
                    <TableCell align="right">
                      <Link href={`/policy/${policyId}/${row.inspectionId}`}>
                        <IconButton><ArrowForward /></IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>

                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Paper>
      :
      <Box>
        Data not available
    </Box>
  );
}
export default InspectionTable