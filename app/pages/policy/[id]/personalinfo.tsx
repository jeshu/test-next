import Container from '@material-ui/core/Container';

import Hero from 'components/Hero';
import PersonalInfo from 'components/PersonalInfo';
// import { useStreamQuery, Stream } from 'lib/graphql/stream.graphql';
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
  // const { data, loading } = useStreamQuery({
  //   variables: { streamId: id },
  // });

  // if (!loading && data && data.stream) {
  return (
    <>
      <Hero title="Brijesh Kumar" subtext={`Policy no: AX-${id}`} ctalink={{ label: 'Summery', url: `/policy/${id}` }} />
      <PersonalInfo {...personalinfo} />
    </>
  );
  return null;
}

PolicyEdit.getInitialProps = ({ query: { id } }) => {
  return { id };
};