import { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Hero from 'components/Hero';
import PersonalInfo from 'components/PersonalInfo';
import React from 'react';
import Box from '@material-ui/core/Box';
import ClaimsHistory from 'components/ClaimsHistory';
import { useCustomerStorage } from 'lib/useCustomerData';

export default function CustomerDetails({ id }) {
  const { userData, fetch } = useCustomerStorage();
  const [personalinfo, setPersonalInfo] = useState(null);
  useEffect(() => { fetch(id) }, [])
  useEffect(() => {
    console.log(userData);
    setPersonalInfo(userData)
  }, [userData])


  return (
    <>
      <Hero 
        title={personalinfo?.name} 
        subtext={`User Id: ${personalinfo?.userId ?? ''}`} 
        ctalink={{ label: 'Policy information', url: `/policy/${id}` }} 
        ctaSecLink={{ label: 'Request Inspection', url: `/customer/${id}/inspection/new` }} 
      />
      <PersonalInfo {...personalinfo} />
      <Box>
        <ClaimsHistory policyId={id} />
      </Box>
    </>
  );
  return null;
}

CustomerDetails.getInitialProps = ({ query: { id } }) => {
  return { id };
};