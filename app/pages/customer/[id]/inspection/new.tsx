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
import { calculatePreHarvest, getRecommanation, getBaseIDV , PREMIUM_RATE} from 'utils/IDVCalculator';

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
  recommendation: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:'space-between',
    marginBottom:theme.spacing(3)
  },
  edittable: {
    padding: theme.spacing(0.25,1),
    '&:focus' :{
      backgroundColor:'rgba(0,0,0,0.1)',
      outline :'none'
    }
  }
}))


export default function NewInspection({ id }) {
  const router = useRouter()
  const classes = useStyles();
  const [inspectionId, setInspectionId] = useState('');
  const [baseIDV, setBaseIDV] = useState('');
  const [inspectionStarted, setInspectionStarted] = useState(false);
  const [enableCalculator, setEnableCalculator] = useState(false);
  const { insert:addPolicy } = usePolicyStorage();
  const { insert, update:updateInspectionData } = useInspectionStorage();
  const { userData: customerData, update:updateCustomerData, fetch:fetchCustomerData } = useCustomerStorage();
  const [idv, setIDV] = useState(null);

  useEffect(() => {
    fetchCustomerData(id);
  }, [])
  useEffect(() =>{
    if(customerData) {
      setBaseIDV(getBaseIDV(customerData));
    }
  }, [customerData])

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
    const idvCalcualte =  calculatePreHarvest(_avgValues, baseIDV, (parseFloat(customerData.premiumRate) || PREMIUM_RATE))
    const recomadations = getRecommanation(_avgValues);
    setIDV({recomadations, ...idvCalcualte})
    updateInspectionData(inspectionId, {recomadations, ...idvCalcualte})
  }
  const calculateIDV = () => {
    const {farmArea, expectedYeild, expectedMarketPrice, coveragePeriod} = customerData;
    console.log(customerData)
    addPolicy({
      customerId: id,
      baseIDV,
      farmArea, expectedYeild, expectedMarketPrice, coveragePeriod, ...idv
    }, (policyId) =>{
      updateInspectionData(inspectionId, {policyAssociated:policyId, ...idv})
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
          <Box className={classes.recommendation}>
            <Typography
                component="h6"
                variant="h5"
                color="inherit"
                gutterBottom
              >
                Recommendation(s) based on Inspection
              </Typography> 
              <Button variant="outlined" color="secondary">Notify</Button>
          </Box>
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
            {baseIDV && idv && 
            <>
            
              <Typography
                component="h6"
                variant="h6"
                color="inherit"
                gutterBottom
              >
                Base line IDV : {baseIDV} Rs.
              </Typography> 
              <Typography
                component="h6"
                variant="h6"
                color="inherit"
                gutterBottom
                >
                IDV after Inspection : 
                <Typography
                  variant="inherit"
                  color="inherit"
                  contentEditable
                  className={classes.edittable}
                  onBlur={(e)=>{
                    if(!isNaN(parseFloat(e.target.innerHTML))) {
                      const newIDV = {...idv, IDV:e.target.innerHTML}
                      newIDV.premium = newIDV.IDV * (parseFloat(customerData.premiumRate) || PREMIUM_RATE)/100
                      setIDV(newIDV)
                    }
                  }}
                  >
                  {parseFloat(`${idv.IDV}`).toFixed(2)}
                </Typography>
                 Rs.
              </Typography> 
              <Typography
                component="h6"
                variant="h6"
                color="inherit"
                gutterBottom
                >
                Single Premium :{parseFloat(`${idv.premium}`).toFixed(2)} Rs.
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
              <Button variant="outlined" color="secondary" style={{marginLeft:'1rem'}} onClick={()=>{
                updateInspectionData(inspectionId, idv)
              }}>
                Save
              </Button>
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