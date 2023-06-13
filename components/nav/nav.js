import React from 'react'

import { Grid, Button, Typography } from "@mui/material"

import Connect from "./connect"

export default function Nav(props) {

  // Map through the providers.
  // Render account information and "connect", "set active", and "disconnect" buttons.
  // Finally, map through the `accounts` property to render a dropdown for each connected account.
  return (
    <div style={{backgroundColor: "#FFFFFD"}}>
        <Grid container>
            <Grid item xs={12} sm={4} md={2}>
                <img src={"./logo.png"} style={{width: "20%", minWidth: 50, margin: "10%"}} />
            </Grid>
            <Grid item align="right" xs={12} sm={4} md={2}>
              <Button style={{float: "right", margin: "10%"}}onClick={() => props.setPage("map")}>
                <Typography> Map </Typography>

              </Button>            
            </Grid>
            <Grid item align="right" xs={12} sm={4} md={2}>
              <Button style={{float: "right", margin: "10%"}}onClick={() => props.setPage("map")}>
                <Typography> Market </Typography>

              </Button>            
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
            <Button 
            disabled={!props.activeAccount}
            style={{float: "right", margin: "10%"}} 
            onClick={() => props.setPage("wallet")}
            >
              <Typography> Collection </Typography>

            </Button>  
          </Grid>
           
            <Grid item xs={12} sm={6} md={2}>
              <Connect activeAccount={props.activeAccount} />
            </Grid>
            
            

        </Grid>
    </div>
  )
}