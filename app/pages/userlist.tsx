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
  }, 
]

export default function AlignItemsList() {
  const classes = useStyles();
  const policyHoldersCount = policyHolders.length;
  return (<Grid container
    spacing={0}
    direction="column"
    style={{ minHeight: 'calc(100vh - 64px)', padding:'64px' }}>
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
            <Divider variant="inset" component="li" />
          </>
        )}
      </List>
  </Grid>
  );
}