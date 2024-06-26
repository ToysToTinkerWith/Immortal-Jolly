
import React, { useEffect } from "react";

import { useRouter } from 'next/router'

import PropTypes from "prop-types";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme";

import "../style.css"


import { reconnectProviders, WalletProvider, PROVIDER_ID, pera, myalgo, defly, exodus, algosigner, walletconnect  } from '@txnlab/use-wallet'

import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";
import { DeflyWalletConnect } from "@blockshake/defly-connect";


const walletProviders = {
  [PROVIDER_ID.PERA]: pera.init({
    algosdkStatic: algosdk,
    clientStatic: PeraWalletConnect,
  }),
  [PROVIDER_ID.DEFLY]: defly.init({
    algosdkStatic: algosdk,
    clientStatic: DeflyWalletConnect,
  }),

};

export default function MyApp(props) {
  const { Component, pageProps } = props;

  const router = useRouter()
  React.useEffect(() => {
    reconnectProviders(walletProviders)
  }, [])

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const sendDiscordMessage = async (error, location, address) => {

       
    const response = await fetch(process.env.jollyWebhook, {
      method: "POST",
      body: JSON.stringify({ 
        embeds: [{
          title: String(address) + " " + String(location),
          description: String(error)
        }]
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

  }


  return (
    
    
    <React.Fragment>
      <WalletProvider value={walletProviders}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <Component {...pageProps} sendDiscordMessage={sendDiscordMessage}/>
      </ThemeProvider>
      </WalletProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
