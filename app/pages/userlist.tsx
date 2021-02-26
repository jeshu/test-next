import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      minWidth: '70vw',
      maxHeight: 'calc(80vh - 64px)',
      overflow: 'auto',
    },
    inline: {
      display: 'inline',
    },
    bottemGap: {
      marginBottom: theme.spacing(4)
    }
  }),
);

const policyHolders = [{
  _id: '0989899',
  username: 'Jeshu Brij',
  policyId: 'AX-1234',
  avtar: '',
}, {
  _id: '0989899',
  username: 'Jeshu Brij',
  policyId: 'AX-1234',
  avtar: '',
}, {
  _id: '0989899',
  username: 'Jeshu Brij',
  policyId: 'AX-1234',
  avtar: '',
}, {
  _id: '0989899',
  username: 'Jeshu Brij',
  policyId: 'AX-1234',
  avtar: '',
}, {
  _id: '0989899',
  username: 'Jeshu Brij',
  policyId: 'AX-1234',
  avtar: '',
}]

const newCustomer = [
  {
    _id: '0989899',
    username: 'Jeshu Brij',
    policyId: 'AX-1234',
    avtar: '',
    status: 'inspect',
  }, {
    _id: '0989899',
    username: 'Jeshu Brij',
    policyId: 'AX-1234',
    avtar: '',
    status: 'approve',
  }, {
    _id: '0989899',
    username: 'Jeshu Brij',
    policyId: 'AX-1234',
    avtar: '',
    status: 'inspect',
  }
]

export default function AlignItemsList() {
  const classes = useStyles();
  return (<Grid container
    spacing={0}
    direction="column"
    style={{ minHeight: 'calc(100vh - 64px)', padding: '64px' }}>
      <Box className={classes.bottemGap}>
        
    <Typography variant="h4">New Customer</Typography>
    <List className={classes.root}>
      {newCustomer && newCustomer.map((item, index) =>
        <>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={item.username} src={item.avtar} />
            </ListItemAvatar>
            <ListItemText
              primary={item.username}
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {item.policyId}
                </Typography>
              }
            />
              <ListItemSecondaryAction>
                <Link href={`/policy/${item.policyId}`}>
                <Button
                    variant="body2"
                    className={classes.inline}
                    color="textSecondary"
                  >
                    {item.status.toUpperCase()}
                  </Button>
                </Link>
            <Link href={`policy/${item._id}`}>
                <IconButton edge="end" aria-label="comments">
                  <ArrowForward />
                </IconButton>
            </Link>
              </ListItemSecondaryAction>
          </ListItem>
          {((newCustomer.length -1) !== index) ? <Divider variant="inset" component="li" />:null}
        </>
      )}
    </List>
    
    </Box>
    <Box>
      <Typography variant="h4">Policyholders</Typography>
    <List className={classes.root}>
      {policyHolders && policyHolders.map((item, index) =>
        <>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={item.username} src={item.avtar} />
            </ListItemAvatar>
            <ListItemText
              primary={item.username}
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {item.policyId}
                </Typography>
              }
            />
            <Link href={`policy/${item._id}`}>
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="comments">
                  <ArrowForward />
                </IconButton>
              </ListItemSecondaryAction>
            </Link>
          </ListItem>
          {((policyHolders.length -1) !== index) ? <Divider variant="inset" component="li" />:null}
        </>
      )}
    </List>
    </Box>
  </Grid>
  );
}