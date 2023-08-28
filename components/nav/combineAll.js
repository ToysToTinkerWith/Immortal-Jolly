import React, { useState, useEffect } from 'react';

import { Button, Typography, Grid, Popover } from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import MenuIcon from '@mui/icons-material/Menu';

import Connect from './connect';


export default function CombineAll(props) {

    const [anchor, setAnchor] = useState(null)

    const handleClick = (event) => {
        setAnchor(event.currentTarget);
      };

    const handleClose = () => {
        setAnchor(null);
    };

    const open = Boolean(anchor);


    return (
        <div style={{float: "right", marginRight: "5%", marginTop: 30}}>
            <Button
            variant="text"
            color = {props.page == "About" ? "secondary" : "primary"}
            onClick={handleClick} 
            >
              <MenuIcon style={{color: "#000000"}} />
           
          </Button>

            <Popover
              id={"popover1"}
              open={open}
              anchorEl={anchor}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
                <List>
                <ListItem>
                <Button style={{float: "right", margin: "10%"}} disabled={!props.activeAccount} onClick={() => props.setPage("collection")}>
                  <Typography> Collection </Typography>
                </Button>
                </ListItem>
                <ListItem>
                <Button 
                    style={{float: "right", margin: "10%"}} 
                    onClick={() => window.open("https://immortaljolly.com/")}
                >
                    <Typography> Immortal Jolly </Typography>
    
                </Button>  
                </ListItem>
                <ListItem>
                <Connect activeAccount={props.activeAccount} />

                </ListItem>
                </List>
            </Popover>

        </div>
    )
}


