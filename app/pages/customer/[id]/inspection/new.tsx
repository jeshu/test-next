import { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import DroneDataTable from 'components/DroneDataTable';
import Link from 'next/link';
import {useRouter} from 'next/router';
import { useInspectionStorage } from 'lib/useInspectionData';
import { useCustomerStorage } from 'lib/useCustomerData';
import { usePolicyStorage } from 'lib/usePolicyData';
import { makeStyles } from '@material-ui/core/styles';
import { calculatePreHarvest, getRecommanation } from 'utils/IDVCalculator';

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
  const router = useRouter()
  const classes = useStyles();
  const preInspectionIDV = 1500000;
  const [inspectionId, setInspectionId] = useState('');
  const [inspectionStarted, setInspectionStarted] = useState(false);
  const [enableCalculator, setEnableCalculator] = useState(false);
  const { insert:addPolicy } = usePolicyStorage();
  const { insert, update:updateInspectionData } = useInspectionStorage();
  const { userData: customerData, update:updateCustomerData, fetch:fetchCustomerData } = useCustomerStorage();
  const [idv, setIDV] = useState(null);

  useEffect(() => {
    fetchCustomerData(id);
  }, [])

  const startInspection = () => {
    insert({
      IDV: 0,
      customerId: id,
    }, (inspectionId) => {
      setInspectionId(inspectionId)
      setInspectionStarted(true);
    });
  };

  const onSimulationEnd = (_avgValues) => {
    setInspectionStarted(false);
    setEnableCalculator(true)
    const idvCalcualte =  calculatePreHarvest(_avgValues, preInspectionIDV)
    const recomadations = getRecommanation(_avgValues);
    updateInspectionData(inspectionId, {recomadations, ...idvCalcualte})
    setIDV({recomadations, ...idvCalcualte})
  }
  const calculateIDV = () => {
    const {farmArea, expectedYeild, expectedMarketPrice, coveragePeriod} = customerData;
    console.log(customerData)
    addPolicy({
      customerId: id,
      farmArea, expectedYeild, expectedMarketPrice, coveragePeriod, ...idv
    }, (policyId) =>{
      updateInspectionData(inspectionId, {policyAssociated:policyId})
      updateCustomerData(id, {policyAssociated:policyId})
      router.push(`/customer/${id}/policy/${policyId}`)
    })
  }


  const renderRecomandatios = () => {
    const recomStr = idv?.recomadations;
    if(recomStr) {
      const recommendation = recomStr.split("##");
      return (
        <Grid item xs={12} className={classes.sliderBase}>
            <Typography
                component="h6"
                variant="h6"
                color="inherit"
                gutterBottom
              >
                Recommendation(s) based on Inspection
              </Typography> 
              <Button variant="outlined" color="secondary">Notify</Button>
          <Box >
            {recommendation.map(item=>(

              <Alert severity="info" className={classes.alert}>
                {item}
              </Alert>
            )
            )}
          </Box>
        </Grid>
      )
    } 
    return null;
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
              Inspection with Drone
            <Typography
              component="span"
              variant="h6"
              color="inherit"
              gutterBottom
            >
              {inspectionId && ` (${inspectionId})`}
            </Typography>
            </Typography>
            {idv && 
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
                IDV after Inspection : {idv.IDV} Rs.
              </Typography> 
              <Typography
                component="h6"
                variant="h6"
                color="inherit"
                gutterBottom
              >
                Single Premium : {idv.premium} Rs.
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
            
            <DroneDataTable
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