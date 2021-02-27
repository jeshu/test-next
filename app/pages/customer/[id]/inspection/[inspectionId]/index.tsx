import { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import DoranDataTable from 'components/DoranDataTable';
import Link from 'next/link';
import {useRouter} from 'next/router';
import { useInspectionStorage } from 'lib/useInspectionData';
import { usePolicyStorage } from 'lib/usePolicyData';
import { calculatePostHarvest } from 'utils/IDVCalculator';

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


export default function NewInspection({ id, inspectionId }) {
  const router = useRouter()
  const classes = useStyles();
  const preInspectionIDV = 1500000;
  const [recommendation, setRecommendation] = useState(null);
  const [newInspectionId, setNewInspectionId] = useState(null);
  const [inspectionStarted, setInspectionStarted] = useState(false);
  const [enableCalculator, setEnableCalculator] = useState(false);
  const { policyData, fetch:Fw, update:updatePolicy } = usePolicyStorage();
  const { inspectionData, fetch:fetchInspectionData, insert:insertInspection, update:updateInspectionData } = useInspectionStorage();
  const [idv, setIDV] = useState(null);

  useEffect(() => {
    fetchInspectionData(inspectionId);
  }, [])

  const startInspection = () => {
    console.log(inspectionData.policyAssociated);
    
    insertInspection({
      IDV: 0,
      customerId: id,
      policyAssociated: inspectionData.policyAssociated
    }, (_mInspectionId) => {
      setNewInspectionId(_mInspectionId)
      setInspectionStarted(true);
    });
  };

  const onSimulationEnd = (_avgValues) => {
    setInspectionStarted(false);
    setEnableCalculator(true);
    setIDV(calculatePostHarvest(_avgValues, inspectionData.IDV))
  }

  useEffect(() => {
    if(idv) {
      updateInspectionData(newInspectionId, idv)
    }
  },[idv])

  const convertToClaims = () => {
    updatePolicy(inspectionData.policyAssociated, {
      claimAmount : idv.IDV 
    })
    router.push(`/customer/${id}`)
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
              {(newInspectionId && ` (${newInspectionId})`) || (inspectionId && ` (${inspectionId})`)}
            </Typography>
            </Typography>
             
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
                IDV after Inspection : {120000} Rs.
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
            
            {!inspectionStarted && !enableCalculator &&
              <Button variant="outlined" color="secondary" onClick={startInspection}>
                Start New Inspection
            </Button>}
            {enableCalculator && 
            <>
            <Button variant="outlined" color="secondary" onClick={convertToClaims}>
              Convet to Claim
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
          <Grid item xs={12} className={classes.sliderBase}>
            <DoranDataTable
              customerId={id}
              inspectionId={newInspectionId || inspectionId}
              inspectionStarted={inspectionStarted}
              onSimulationEnd={onSimulationEnd}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

NewInspection.getInitialProps = ({ query: { id, inspectionId } }) => {
  return { id, inspectionId };
};