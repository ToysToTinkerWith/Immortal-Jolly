import React, { useState, useEffect } from 'react'

import { Typography, Button } from "@mui/material"


  

export default function Map(props) {

    const [windowDimensions, setWindowDimensions] = useState({innerWidth: 0, innerHeight: 0});

    useEffect(() => {
        function getWindowDimensions() {
            const { innerWidth: width, innerHeight: height } = window;
            return {
              width,
              height
            };
          }
        function handleResize() {
        setWindowDimensions(getWindowDimensions());
        }
        handleResize()

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const [isCampHovered, setCampHovered] = useState(false)
    const [isArenaHovered, setArenaHovered] = useState(false)
    const [isShrineHovered, setShrineHovered] = useState(false)
    const [isObeliskHovered, setObeliskHovered] = useState(false)


    if (windowDimensions.innerHeight != 0) {
        return (
            <div style={{position: "relative", height: "100%"}} >
                <Button style={{position: "absolute", left: windowDimensions.width > 600 ? "18%" : "7%", top: windowDimensions.width > 600 ? "20%" : "31%"}} 
                onMouseEnter={() => setCampHovered(true)}
                onMouseLeave={() => setCampHovered(false)} 
                onClick={() => props.activeAccount ? props.setPage("camp") : props.setPage("connect")}>
                    {isCampHovered ? 
                    <div>
                        <img src={"righttri.svg"} style={{position: "absolute", width: 20, bottom: windowDimensions.width > 600 ? "10vw" : "15vw", left: windowDimensions.width > 600 ? "15vw" : "20vw"}} />
                        <Typography color="primary"  align="center" variant="h4" style={{position: "absolute", fontFamily: "Deathrattle", bottom: windowDimensions.width > 600 ? "12vw" : "17vw", left: windowDimensions.width > 600 ? "15vw" : "20vw", backgroundColor: "#FFFFFF", padding: 5, paddingRight: 20, paddingLeft: 20}}> Camp </Typography>
                    </div>
                    :
                    null
                    }
                <img src={"camp.png"} style={{width: windowDimensions.width > 600 ? "13vw": "20vw"}} />
                </Button>
    
                <Button style={{position: "absolute", left: windowDimensions.width > 600 ? "58%" : "65%", top: windowDimensions.width > 600 ? "23%" : "33%"}} 
                onMouseEnter={() => setArenaHovered(true)}
                onMouseLeave={() => setArenaHovered(false)}
                onClick={() => props.activeAccount ? props.setPage("arena") : props.setPage("connect")} 
                >
                    {isArenaHovered ? 
                    <div>
                        <img src={"righttri.svg"} style={{position: "absolute", width: 20, bottom: windowDimensions.width > 600 ? "10vw" : "15vw", left: windowDimensions.width > 600 ? "15vw" : "20vw"}} />
                        <Typography color="primary"  align="center" variant="h4" style={{position: "absolute", fontFamily: "Deathrattle", bottom: windowDimensions.width > 600 ? "12vw" : "17vw", left: windowDimensions.width > 600 ? "15vw" : "20vw", backgroundColor: "#FFFFFF", padding: 5, paddingRight: 20, paddingLeft: 20}}> Arena </Typography>
                    </div>
                    :
                    null
                    }
                <img src={"arena.png"} style={{width: windowDimensions.width > 600 ? "13vw" : "20vw"}} />
                </Button>
    
                <Button style={{position: "absolute", left: windowDimensions.width > 600 ?  "27%" : "20%", top: windowDimensions.width > 600 ? "44%" : "47%"}} 
                onMouseEnter={() => setShrineHovered(true)}
                onMouseLeave={() => setShrineHovered(false)}
                onClick={() => props.activeAccount ? props.setPage("shrine") : props.setPage("connect")}
                >
                    {isShrineHovered ? 
                    <div>
                        <img src={"righttri.svg"} style={{position: "absolute", width: 20, bottom: windowDimensions.width > 600 ? "10vw" : "15vw", left: windowDimensions.width > 600 ? "15vw" : "20vw"}} />
                        <Typography color="primary"  align="center" variant="h4" style={{position: "absolute", fontFamily: "Deathrattle", bottom: windowDimensions.width > 600 ? "12vw" : "17vw", left: windowDimensions.width > 600 ? "15vw" : "20vw", backgroundColor: "#FFFFFF", padding: 5, paddingRight: 20, paddingLeft: 20}}> shrine </Typography>
                    </div>
                    :
                    null
                    }
                <img src={"shrine.png"} style={{width: windowDimensions.width > 600 ? "13vw" : "20vw"}} />
                </Button>
    
                <Button style={{position: "absolute", left: windowDimensions.width > 600 ? "50%" : "54%", top: windowDimensions.width > 600 ? "60%" : "57%"}} 
                onMouseEnter={() => setObeliskHovered(true)}
                onMouseLeave={() => setObeliskHovered(false)}
                onClick={() => props.activeAccount ? props.setPage("obelisk") : props.setPage("connect")}
                >
                    {isObeliskHovered ? 
                    <div>
                        <img src={"righttri.svg"} style={{position: "absolute", width: 20, bottom: windowDimensions.width > 600 ? "10vw" : "15vw", left: windowDimensions.width > 600 ? "15vw" : "20vw"}} />
                        <Typography color="primary"  align="center" variant="h4" style={{position: "absolute", fontFamily: "Deathrattle", bottom: windowDimensions.width > 600 ? "12vw" : "17vw", left: windowDimensions.width > 600 ? "15vw" : "20vw", backgroundColor: "#FFFFFF", padding: 5, paddingRight: 20, paddingLeft: 20}}> obelisk </Typography>
                    </div>
                    :
                    null
                    }
                <img src={"obelisk.png"} style={{width: windowDimensions.width > 600 ? "13vw" : "20vw"}} />
                </Button>
    
                {windowDimensions.width > 600 ? 
                <img src={"map.jpg"} style={{width: "100%", height: "100%"}} />
                :
                <img src={"mapphone.jpg"} style={{width: "100%", height: "100%"}} />
                }
               
                
               
            
            </div>
        )
    }

    
}