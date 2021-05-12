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
    const ws = new WebSocket('ws://localhost:3625' );
    // event emmited when connected
    ws.onopen = function () {
      console.log('websocket is connected ...')
      // sending a send event to websocket server
      ws.send('connected')
    }
    // event emmited when receiving message
    ws.onmessage = function (ev) {
      // const blb    = new Blob(["Lorem ipsum sit"], {type: "text/plain"});
      // const reader = new FileReader();
      // reader.addEventListener('loadend', (e:any) => {
      //   const text = e.srcElement.result;
      //   console.log(text);
      // });
      
      // // Start reading the blob as text.
      // reader.readAsText(ev.data);
      console.log(ev.data);
      
      // let image:HTMLImageElement = document.querySelector('#images img') as HTMLImageElement;
      // image.src = ev.data;
    }

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