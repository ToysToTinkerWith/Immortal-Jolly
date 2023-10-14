import React, { useState } from 'react'

import { Typography, Button } from "@mui/material"



export default function Map(props) {

    const [isHovered, setHovered] = useState(false)


    return (
        <div style={{position: "relative"}} >
            <Button style={{position: "absolute", left: "20%", top: "30%"}} 
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)} 
            onClick={() => props.activeAccount ? props.setPage("camp") : props.setPage("connect")}>
                {isHovered ? 
                <div>
                    <img src={"righttri.svg"} style={{position: "absolute", width: 20, bottom: "10vw", left: "15vw",}} />
                    <Typography color="primary"  align="center" variant="h4" style={{position: "absolute", fontFamily: "Deathrattle", bottom: "12vw", left: "15vw", backgroundColor: "#FFFFFF", padding: 5, paddingRight: 20, paddingLeft: 20}}> Camp </Typography>
                </div>
                :
                null
                }
            <img src={"camp.png"} style={{width: "15vw"}} />
            </Button>
           
            <img src={"map.png"} style={{width: "100%", height: "100%"}} />
            
           
        
        </div>
    )
}