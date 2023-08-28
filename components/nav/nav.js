import React from 'react'

import { Grid, Button, Typography } from "@mui/material"

import Connect from "./connect"
import CombineAll from "./combineAll"


export default class Nav extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        width: 1000,
        height: 1000
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }


  componentDidMount() {
  this.updateWindowDimensions();
  window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
  window.removeEventListener('resize', this.updateWindowDimensions);
  }

  // Map through the providers.
  // Render account information and "connect", "set active", and "disconnect" buttons.
  // Finally, map through the `accounts` property to render a dropdown for each connected account.
  render() {
    console.log(this.state)
    return (


      <div style={{backgroundColor: "#FFFFFD"}}>
          <Grid container>
              <Grid item xs={3} sm={3} md={3}>
                <Button style={{float: "right", margin: "5%"}}onClick={() => this.props.setPage("map")}>
                  <img src={"./logo.png"} style={{width: "20%", minWidth: 50, margin: "10%"}} />
                </Button>
              </Grid>
              {this.state.width < 600 ?
                <Grid item align="right" xs={9} sm={3} md={3}>
                  <CombineAll activeAccount={this.props.activeAccount} setPage={this.props.setPage} />
                </Grid>
                :
              <>
              
              <Grid item align="right" xs={12} sm={3} md={3}>
                <br />
                <Button style={{float: "right", margin: "15%"}} disabled={!this.props.activeAccount} onClick={() => this.props.setPage("collection")}>
                  <Typography> Collection </Typography>
                </Button>            
              </Grid>
              
  
              <Grid item xs={12} sm={3} md={3}>
                <br />
              <Button 
              style={{float: "right", margin: "15%"}} 
              onClick={() => window.open("https://immortaljolly.com/")}
              >
                <Typography> Immortal Jolly </Typography>
  
              </Button>  
            </Grid>
             
              <Grid item xs={12} sm={3} md={3}>
                <br />
                <Connect activeAccount={this.props.activeAccount} />
              </Grid>
              </>
              }
              
  
          </Grid>
      </div>
    )
  }
  
}