import Container from '@material-ui/core/Container';

import Hero from 'components/Hero';
import PersonalInfo from 'components/PersonalInfo';
import React from 'react';
import Box from '@material-ui/core/Box';
import ClaimsHistory from 'components/ClaimsHistory';

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
export default function PolicyEdit({ id }) {
  
  return (
    <>
      <Hero title="Brijesh Kumar" subtext={`Policy no: AX-${id}`} ctalink={{ label: 'Policy information', url: `/policy/${id}` }} ctaSecLink={{ label: 'Personal information', url: `/policy/${id}/personalinfo` }}/>
      <PersonalInfo {...personalinfo} />

      <Box>
        <ClaimsHistory  policyId={id} />
      </Box>
    </>
  );
  return null;
}

PolicyEdit.getInitialProps = ({ query: { id } }) => {
  return { id };
};