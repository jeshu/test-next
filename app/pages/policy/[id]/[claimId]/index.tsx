import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Hero from 'components/Hero';
import DoranDataTable from 'components/DoranDataTable';
import { makeStyles } from '@material-ui/core/styles';
import SliderImage from 'react-zoom-slider';
import azure from 'azure-storage';

const imgData = [
  {
    image: 'https://source.unsplash.com/random/400x300?wheat',
    text: 'img1'
  },
  {
    image: 'https://source.unsplash.com/random/400x300?wheat',
    text: 'img1'
  },
  {
    image: 'https://source.unsplash.com/random/400x300?wheat',
    text: 'img1'
  },
];

//react-slider__ul

const useStyles = makeStyles((theme) => ({
  sliderBase: {
    '& .react-slider__ul': {
      display: 'none',
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
  const tableService = azure.createTableService(process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING);
  const tableQuery = new azure.TableQuery().top(10)
  
  tableService.queryEntities('Field', tableQuery, null, function (error, result, response) {
    if (!error) {
      result.entries.forEach(function (field:any, index:number) {
        console.log(field, index);
      });
    }
  });

  return (
    <>
      <Hero title="Brijesh Kumar" subtext={`Policy no: AX-${id}`} ctalink={{ label: 'Summery', url: `/policy/${id}` }} />
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
                Inspect with Droan
             </Button>
            </Grid>
            <Grid item xs={12} md={6} className={classes.sliderBase}>
              <Typography
                component="h5"
                variant="h5"
                color="inherit"
                gutterBottom
              >
                Feeds from Doran
            </Typography>
              <SliderImage
                data={imgData}
                width="100%"
                showDescription={false}
                direction="right"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DoranDataTable data={doranData} />
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