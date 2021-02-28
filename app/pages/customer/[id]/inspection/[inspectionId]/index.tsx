import { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import DroneDataTable from 'components/DroneDataTable';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useInspectionStorage } from 'lib/useInspectionData';
import { usePolicyStorage } from 'lib/usePolicyData';
import { calculatePostHarvest, getRecommanation } from 'utils/IDVCalculator';

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
}))


export default function NewInspection({ id, inspectionId }) {
  const router = useRouter()
  const classes = useStyles();
  const [newInspectionId, setNewInspectionId] = useState(null);
  const [inspectionStarted, setInspectionStarted] = useState(false);
  const [enableCalculator, setEnableCalculator] = useState(false);
  const [claimPending, setClaimPending] = useState(true);
  const { policyData, fetch: fetchPolicy, update: updatePolicy } = usePolicyStorage();
  const { inspectionData, fetch: fetchInspectionData, insert: insertInspection, update: updateInspectionData } = useInspectionStorage();
  const [idv, setIDV] = useState(null);

  useEffect(() => {
    fetchInspectionData(inspectionId);
  }, [])

  useEffect(() => {
    if (inspectionData) {
      fetchPolicy(inspectionData.policyAssociated);
    }
  }, [inspectionData])

  useEffect(() => {
    if (policyData)
      if (policyData.claimAmount) {
        setClaimPending(false)
      }
  }, [policyData])

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
    const recomadations = getRecommanation(_avgValues);
    const idvCalcualte = calculatePostHarvest(_avgValues, policyData.IDV)
    setIDV({ recomadations, ...idvCalcualte })
  }

  useEffect(() => {
    if (idv) {
      updateInspectionData(newInspectionId, idv)
    }
  }, [idv])

  const convertToClaims = () => {
    updatePolicy(inspectionData.policyAssociated, {
      claimAmount: idv.IDV
    })
    router.push(`/customer/${id}/policy/${inspectionData.policyAssociated}`)
  }

  const renderRecomandatios = () => {
    const recomStr = idv?.recomadations || inspectionData?.recomadations || '';
    if (recomStr && !inspectionStarted) {
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
            <Button component="a" href={`mailto:?&subject=Drone%20Argo%20Insurence | Recommendations ;&body=Recommendations%0A%0A${recommendation.join('%0A%0A')}`} variant="outlined" color="secondary">Notify</Button>
          </Box>
          <Box >
            {recommendation.map(item => (
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
                {(newInspectionId && ` (${newInspectionId})`) || (inspectionId && ` (${inspectionId})`)}
              </Typography>
            </Typography>

            <>
              {policyData && policyData.IDV &&
                <Typography
                  component="h6"
                  variant="h6"
                  color="inherit"
                  gutterBottom
                >
                  Sum Assured : {policyData.IDV} Rs.
              </Typography>
              }
              <Typography
                component="h6"
                variant="h6"
                color="inherit"
                gutterBottom
              >
                IDV after Inspection : {idv ? parseFloat(`${idv.IDV}`).toFixed(2) : inspectionData && parseFloat(inspectionData.IDV).toFixed(2)} Rs.
              </Typography>
              {inspectionData?.premium &&
                <Typography
                  component="h6"
                  variant="h6"
                  color="inherit"
                  gutterBottom
                >
                  Single Premium : {inspectionData && inspectionData.premium} Rs.
              </Typography>}
            </>

            {!claimPending && policyData &&
              <>
                <Typography
                  component="h6"
                  variant="h6"
                  color="inherit"
                  gutterBottom
                >
                  Claim is settled at {policyData ? ` ${parseFloat(policyData.claimAmount).toFixed(2)} Rs.` : ''}
                </Typography>
                <Link href={`/customer/${id}/policy/${policyData.policyId}`}>
                  <Button variant="outlined" color="secondary">
                    Back to Policy
                </Button>
                </Link>
              </>
            }

            {claimPending && !inspectionStarted && !enableCalculator &&
              <Button variant="outlined" color="secondary" onClick={startInspection}>
                Start New Inspection
            </Button>}
            {claimPending && enableCalculator &&
              <>
                <Button variant="outlined" color="secondary" onClick={convertToClaims}>
                  Convert to Claim
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
            <DroneDataTable
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