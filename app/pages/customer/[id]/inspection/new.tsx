import { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import DoranDataTable from 'components/DoranDataTable';
import Link from 'next/link';
import { useInspectionStorage } from 'lib/useInspectionData';
import { makeStyles } from '@material-ui/core/styles';
import { calculatePreHarvest } from 'utils/IDVCalculator';

const useStyles = makeStyles((theme) => ({
  topShift: {
    marginTop: theme.spacing(6)
  },
  sliderBase: {
    '& .react-slider__ul': {
      display: 'none',
    }
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
    '& button': {
      marginLeft: theme.spacing(2)
    }
  },
  textfield: {
    marginLeft: theme.spacing(1)
  },
}))


export default function NewInspection({ id }) {
  const classes = useStyles();
  const preInspectionIDV = 1500000;
  const [recommendation, setRecommendation] = useState(null);
  const [inspectionId, setInspectionId] = useState('');
  const [inspectionStarted, setInspectionStarted] = useState(false);
  const [enableCalculator, setEnableCalculator] = useState(false);
  const { insert, updateIDV } = useInspectionStorage();
  const [avgValues, setAvgValues] = useState(null);
  const startInspection = () => {
    insert({
      IDV: 0,
      customerId: id
    }, (inspectionId) => {
      setInspectionId(inspectionId)
      setInspectionStarted(true);
    });
  };

  const onSimulationEnd = (_avgValues) => {
    setInspectionStarted(false);
    setEnableCalculator(true)
    setAvgValues(_avgValues)
    const idv = calculatePreHarvest(_avgValues, preInspectionIDV)
    updateIDV(inspectionId, idv)
  }
  const calculateIDV = () => {
    
  }


  const renderRecomandatios = () => {
    return (recommendation ? <Grid item xs={12} className={classes.sliderBase}>
      <Box >
        <Alert severity="info" className={classes.alert}>This is the recommendation for the farmer.
      <Button variant="outlined" color="secondary">
            Notify
      </Button>
        </Alert>
      </Box>
    </Grid> : null)
  }
  return (
    <Box>
      <Container className={classes.topShift}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              component="h2"
              variant="h4"
              color="inherit"
              gutterBottom
            >
              Inspection with Droan
              
            <Typography
              component="span"
              variant="h6"
              color="inherit"
              gutterBottom
            >
              {inspectionId && ` (${inspectionId})`}
            </Typography>
            </Typography>
            {enableCalculator && preInspectionIDV && 
            <>
              <Typography
                component="h6"
                variant="h6"
                color="inherit"
                gutterBottom
              >
                Base line IDV : {preInspectionIDV.toLocaleString()} Rs.
              </Typography> 
              <Typography
                component="h6"
                variant="h6"
                color="inherit"
                gutterBottom
              >
                IDV after Inspection : 120000 Rs.
              </Typography> 
              <Typography
                component="h6"
                variant="h6"
                color="inherit"
                gutterBottom
              >
                Single Premium : 3000 Rs. per month
              </Typography>
              </>
            }
            {!inspectionStarted && !enableCalculator &&
              <Button variant="outlined" color="secondary" onClick={startInspection}>
                Start Inspection
            </Button>}
            {enableCalculator && 
            <>
            <Button variant="outlined" color="secondary" onClick={calculateIDV}>
              Create policy
            </Button>
            <Link href={`/customer/${id}`}>
              <Button variant="outlined" color="secondary">
                Save
              </Button>
            </Link>
            </>
            }
          </Grid>
          {renderRecomandatios()}
          {(inspectionStarted || enableCalculator) && <Grid item xs={12} className={classes.sliderBase}>
            
            <DoranDataTable
              customerId={id}
              inspectionId={inspectionId}
              inspectionStarted={inspectionStarted}
              onSimulationEnd={onSimulationEnd}
            />
          </Grid>}
        </Grid>
      </Container>
    </Box>
  );
}

NewInspection.getInitialProps = ({ query: { id } }) => {
  return { id };
};