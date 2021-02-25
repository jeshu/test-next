import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';
import Hero from 'components/Hero';
import ClaimsHistory from 'components/ClaimsHistory';


const policyData = [{
  label: 'Farm area',
  unit: 'acres',
  value: '5',
}, {
  label: 'Expected yield',
  unit: 'Qntl/acre',
  value: '20',
}, {
  label: 'Expected market price',
  unit: 'Rs/Kg',
  value: '15',
}, {
  label: 'Premium rate',
  unit: '%',
  value: '2',
}, {
  label: 'Sum Insured',
  unit: 'Rs',
  value: '10500',
}, {
  label: 'Premium',
  unit: 'Rs',
  value: '2100',
}, {
  label: 'Coverage Period',
  unit: 'months',
  value: '6',
}, {
  label: 'Policy commencement date',
  value: '1st Jan 2020',
},]

const policyClaimsList = [
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


export default function PolicyDetails({ id }) {

  const styles = useStyles();
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
                Policy Details
            </Typography>
            </Grid>
            {policyData && policyData.map(item => (
              <Grid item md={4} xs={6}>
                <Typography
                  component="p"
                  variant="inherit"
                  color="inherit"
                  gutterBottom
                >
                  {item.label}
                </Typography>
                <Typography
                  component="p"
                  variant="h6"
                  color="inherit"
                  gutterBottom
                >
                  {item.value} {item.unit}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box>
        <ClaimsHistory policyId={id} />
      </Box>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  gridBg: {
    backgroundColor: 'rgba(30, 136, 229, 0.1)'
  }
}))

PolicyDetails.getInitialProps = ({ query: { id } }) => {
  return { id };
};