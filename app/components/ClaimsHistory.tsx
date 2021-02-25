import React from 'react';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Container from '@material-ui/core/Container';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Link from 'next/link';

interface Data {
  inspectionId: string,
  inspectionDate: string,
  sumAssured: number,
}

function createData(
  inspectionId: string,
  inspectionDate: string,
  sumAssured: number,
): Data {
  return { inspectionId, sumAssured, inspectionDate };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'inspectionId', numeric: false, disablePadding: true, label: 'Inspection ID' },
  { id: 'inspectionDate', numeric: false, disablePadding: true, label: 'Inspection Date' },
  { id: 'sumAssured', numeric: true, disablePadding: true, label: 'Sum Assured' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right">
          Details
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
);

const data = [
  {
    "_id": "60351a68ad74c204749455b5",
    "sumAssured": "1,232.35",
    "inspectionDate": "Wednesday, August 6, 2014 12:07 PM",
    "inspectionId": 37839,
    "currency": "Rs"
  },
  {
    "_id": "60351a687d7337b6d7a94ad1",
    "sumAssured": "3,335.36",
    "inspectionDate": "Wednesday, January 29, 2020 2:51 PM",
    "inspectionId": 37840,
    "currency": "Rs"
  },
  {
    "_id": "60351a68754f0d4391adb0a9",
    "sumAssured": "1,589.37",
    "inspectionDate": "Saturday, February 1, 2014 6:05 AM",
    "inspectionId": 37841,
    "currency": "Rs"
  },
  {
    "_id": "60351a68bf0eb8e0324c8203",
    "sumAssured": "3,247.74",
    "inspectionDate": "Tuesday, August 7, 2018 6:25 PM",
    "inspectionId": 37842,
    "currency": "Rs"
  },
  {
    "_id": "60351a688182ba844ce1fe8f",
    "sumAssured": "3,109.47",
    "inspectionDate": "Thursday, January 21, 2021 6:02 PM",
    "inspectionId": 37843,
    "currency": "Rs"
  },
  {
    "_id": "60351a68a76cd768833c0c00",
    "sumAssured": "2,821.20",
    "inspectionDate": "Wednesday, February 4, 2015 8:04 PM",
    "inspectionId": 37844,
    "currency": "Rs"
  }
]

export default function EnhancedTable({policyId}) {
  const rows = data && data.map(row => createData(row.inspectionId, row.sumAssured, row.inspectionDate))
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('inspectionId');
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  return (
    <Paper className={classes.paper} elevation={0}>
      <Container className={classes.root}>
        <Typography variant="h4" id="tableTitle" component="h3">
          Inspection History
        </Typography>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size='medium'
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row) => {

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.inspectionId}
                    >
                      <TableCell component="th" scope="row" padding="none">
                        {row.inspectionId}
                      </TableCell>
                      <TableCell align="left">{row.sumAssured}</TableCell>
                      <TableCell align="right">{row.inspectionDate}</TableCell>
                      <TableCell align="right">
                        <Link href={`/policy/${policyId}/${row.inspectionId}`}>
                          <IconButton><ArrowForward /></IconButton>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Paper>
  );
}
