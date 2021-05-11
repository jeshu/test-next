import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import { themeDark, themeLight } from "lib/theme";
import { useEffect, useState } from "react";
import { AuthProvider } from 'lib/useAuth';
import { DroneStorageProvider } from 'lib/useDroneStorage';
import { PolicyStorageProvider } from 'lib/usePolicyData';
import { CustomerStorageProvider } from 'lib/useCustomerData';
import { InspectionStorageProvider } from 'lib/useInspectionData';
import Header from 'components/Header';

export default function MyApp(props) {
  const { Component, pageProps } = props;

  const [darkState, setDarkState] = useState(false);
  const handleThemeChange = () => {
    setDarkState(!darkState);
  };

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    console.log(props);
    
  }, []);

  return (
    <ThemeProvider theme={darkState ? themeDark : themeLight}>
      <CssBaseline />
      <CustomerStorageProvider>
        <InspectionStorageProvider>
          <DroneStorageProvider>
            <PolicyStorageProvider>
              <AuthProvider>
                {props.router.route !== '/' && <Header darkState={darkState} handleThemeChange={handleThemeChange} />}
                <Component {...pageProps} />
              </AuthProvider>
            </PolicyStorageProvider>
          </DroneStorageProvider>
        </InspectionStorageProvider>
      </CustomerStorageProvider>
    </ThemeProvider>
  );
}