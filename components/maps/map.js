import React, { useState } from 'react'

import { Typography, Button } from "@mui/material"


export default function Map(props) {

    

    return (
        <div style={{position: "relative"}} >
            <Button style={{position: "absolute", left: "50%", top: "40%"}}>
                <img src={"jollys/Jolly.png"} style={{width: "10vw"}} />
            </Button>
            <Button style={{position: "absolute", left: "65%", top: "50%"}}>
                <img src={"jollys/Angel.png"} style={{width: "10vw"}} />
            </Button>
            <Button style={{position: "absolute", left: "20%", top: "62%"}}>
                <img src={"jollys/Bubble.png"} style={{width: "10vw"}} />
            </Button>
            <Button style={{position: "absolute", left: "50%", top: "40%"}}>
                <img src={"jollys/Jolly.png"} style={{width: "10vw"}} />
            </Button>
            <img src={"map.png"} style={{width: "100%", height: "100%"}} />
            
           
        
        </div>
    )
}