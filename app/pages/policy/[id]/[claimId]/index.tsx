import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Hero from 'components/Hero';
import Sync from '@material-ui/icons/Sync';
import Link from 'next/link'


const personalinfo = {
  email: 'ashish@gmail.com',
  name: 'Ashish',
  gender: 'Mail',
  mobile: '9933258741',
  age: '34',
  location: 'Rajasthan',
  experience: '5 years',
  typeOfCrop: 'Wheat (Rabi)',
  address: '',
  avtar: ''
}
export default function ClaimsDetails({ id, claimId }) {
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
            <Typography
              component="h5"
              variant="h4"
              color="inherit"
              gutterBottom
            >
              Live stram / Gallery, Zoom
            </Typography>
            <ul>
              <li> input wiht value</li>
              <li> save CTA  add to inspect history</li>
              <li> save Cancel  add to inspect history</li>
              <li> Recommendation/Insights</li>
              <li> Notify user CTA</li>
            </ul>

          </Grid>
        </Container>
      </Box>
    </>
  );
}

ClaimsDetails.getInitialProps = ({ query: { id, claimId } }) => {
  return { id, claimId };
};