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

const policyClaimsList = [{
  _id: '0001',
  claimId: '2315648',
  amount: '12456',
  currency: 'Rs'
},{
  _id: '0001',
  claimId: '2315648',
  amount: '12456',
  currency: 'Rs'
},{
  _id: '0001',
  claimId: '2315648',
  amount: '12456',
  currency: 'Rs'
},{
  _id: '0001',
  claimId: '2315648',
  amount: '12456',
  currency: 'Rs'
},]


export default function PolicyDetails({ id }) {

  const styles = useStyles();
  return (
    <>
      <Hero title="Brijesh Kumar" subtext={`Policy no: AX-${id}`} ctalink={{ label: 'Personal information', url: `/policy/${id}/personalinfo` }} />
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
        <ClaimsHistory data={policyClaimsList} policyId={id} />
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