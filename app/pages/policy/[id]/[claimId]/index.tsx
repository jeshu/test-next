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

const doranData = [
  {
    "index": 20,
    "temperature": "35.5",
    "humidity": "83.3",
    "wheateArea": 83,
    "wasteLand": 26,
    "water": 19
  },
  {
    "index": 21,
    "temperature": "35.1",
    "humidity": "81.8",
    "wheateArea": 84,
    "wasteLand": 10,
    "water": 2
  },
  {
    "index": 22,
    "temperature": "37.0",
    "humidity": "82.5",
    "wheateArea": 75,
    "wasteLand": 23,
    "water": 16
  },
  {
    "index": 23,
    "temperature": "36.8",
    "humidity": "84.3",
    "wheateArea": 90,
    "wasteLand": 15,
    "water": 20
  },
  {
    "index": 24,
    "temperature": "36.1",
    "humidity": "80.3",
    "wheateArea": 83,
    "wasteLand": 15,
    "water": 8
  },
  {
    "index": 25,
    "temperature": "36.6",
    "humidity": "82.2",
    "wheateArea": 84,
    "wasteLand": 20,
    "water": 12
  },
  {
    "index": 26,
    "temperature": "36.6",
    "humidity": "80.1",
    "wheateArea": 82,
    "wasteLand": 20,
    "water": 16
  },
  {
    "index": 27,
    "temperature": "36.7",
    "humidity": "80.6",
    "wheateArea": 71,
    "wasteLand": 21,
    "water": 5
  }
]

export default function ClaimsDetails({ id, claimId }) {
  const classes = useStyles();

  return (
    <>
      <Hero title="Brijesh Kumar" subtext={`Policy no: AX-${id}`} ctalink={{ label: 'Policy information', url: `/policy/${id}` }} ctaSecLink={{ label: 'Personal information', url: `/policy/${id}/personalinfo` }} />

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
              <DoranDataTable data={doranData} />
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