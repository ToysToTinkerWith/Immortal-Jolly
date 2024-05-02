import React, { useState, useEffect } from 'react';

import { Button, Typography, Modal, Popover } from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import MenuIcon from '@mui/icons-material/Menu';

import Connect from './connect';


export default function CombineAll(props) {

    const [open, setOpen] = useState(false)

    return (
        <div style={{float: "right", margin: 20}}>
            <Button
            variant="text"
            color = {props.page == "About" ? "secondary" : "primary"}
            onClick={() => setOpen(!open)} 
            >
              <MenuIcon style={{color: "#000000"}} />
           
          </Button>


          {props.open ? 
            <Connect activeAccount={props.activeAccount} page={props.page} setPage={props.setPage} open={props.open}/>
            :
            open ? 
            <Modal
              open={open}
              onClose={() => [setOpen(false), props.setPage("map")]}
              style={{}}
              >
          <List style={{position: "absolute", zIndex: 6, backgroundColor: "white", right: 0, borderRadius: 15, border: "1px solid black"}}>
          <ListItem>
          <Button style={{float: "right", margin: "10%"}} disabled={!props.activeAccount} onClick={() => [props.setPage("collection"), setOpen(false)]}>
            <Typography align="center"> Collection </Typography>
          </Button>
          </ListItem>
          <ListItem>
          <Button 
              style={{float: "right", margin: "10%"}} 
              onClick={() => [window.open("https://immortaljolly.com/"), setOpen(false)]}
          >
              <Typography> Immortal Jolly </Typography>

          </Button>  
          </ListItem>
          <ListItem>
          <Connect activeAccount={props.activeAccount} page={props.page} setPage={props.setPage} open={props.open} setOpen={setOpen} />

          </ListItem>
          </List>
          </Modal>
          :
          null
          }

            
                

        </div>
    )
}


