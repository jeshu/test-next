import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Hero from 'components/Hero';
import DoranDataTable from 'components/DoranDataTable';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  sliderBase: {
    '& .react-slider__ul': {
      display: 'none',
    }
  },
  alert: {
    display: 'flex',
    alignItems:'center',
    '& button':{
      marginLeft:theme.spacing(2)
    }
  }
}))

export default function ClaimsDetails({ id, claimId }) {
  const classes = useStyles();

  return (
    <>
      <Hero title="Brijesh Kumar" subtext={`User Id: ${id}`} ctalink={{ label: 'Policy information', url: `/policy/${id}` }} ctaSecLink={{ label: 'Personal information', url: `/policy/${id}/personalinfo` }} />

      <Box>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                component="h2"
                variant="h4"
                color="inherit"
                gutterBottom
              >
                Inspection Id: {claimId}
              </Typography>
              <Button variant="outlined" color="secondary">
                Start Inspection
             </Button>
            </Grid>
            <Grid item xs={12} className={classes.sliderBase}>
              <Box >
                <Alert severity="info" className={classes.alert}>This is the recommendation for the farmer.
                <Button variant="outlined" color="secondary">
                    Notify
                </Button>
                </Alert>
              </Box>
            </Grid>
            <Grid item xs={12} className={classes.sliderBase}>
              <Typography
                component="h5"
                variant="h5"
                color="inherit"
                gutterBottom
              >
                Feeds from Doran
            </Typography>
              <DoranDataTable />
            </Grid>
            <Grid item xs={12} md={6}> 
              Recomadations...
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

ClaimsDetails.getInitialProps = ({ query: { id, claimId } }) => {
  return { id, claimId };
};