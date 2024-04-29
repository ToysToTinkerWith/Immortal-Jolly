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
    const isMobile = this.state.width < 600;
    return (
      <div style={{ backgroundColor: "#FFFFFD" }}>
        <Grid container alignItems="center" justifyContent="space-between" style={{ padding: '0 20px' }}>
          <Grid item xs={isMobile ? 4 : 2}>
            <Button onClick={() => this.props.setPage("map")}>
              <img src={"./logo.png"} alt="logo" style={{ width: isMobile ? '150px' : '300px' }} />
            </Button>
          </Grid>
          
          {!isMobile && (
            <div style={{ display: 'flex', justifyContent: 'center', marginLeft: "150px" }}>
              <Button disabled={!this.props.activeAccount} onClick={() => this.props.setPage("collection")}>
                <Typography> Collection </Typography>
              </Button>
              <Button onClick={() => window.open("https://immortaljolly.com/")}>
                <Typography> Immortal Jolly </Typography>
              </Button>
              <Connect activeAccount={this.props.activeAccount} page={this.props.page} open={this.props.page === "connect"} setPage={this.props.setPage} />
            </div>
            
          )}
            <div style={{ display: 'flex', justifyContent: 'end' }}>
            {isMobile ? (
              <CombineAll activeAccount={this.props.activeAccount} setPage={this.props.setPage} open={this.props.page === "connect"} page={this.props.page} />
            ) : (
              <>
              </>
            )}
            </div>
          
        </Grid>
      </div>
    );
  }
  
  
}