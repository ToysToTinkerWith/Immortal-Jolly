import React, { useState, useEffect } from "react"

import Head from "next/head"

import { Grid, Typography, Button } from "@mui/material"

import Nav from "../components/nav/nav"

import Map from "../components/maps/map"
import Camp from "../components/wallet/camp"
import Shrine from "../components/wallet/shrine"
import Obelisk from "../components/wallet/obelisk"

import Arena from "../components/wallet/arena/arena"
import Collection from "../components/wallet/collection"

import { useWallet, walletconnect } from '@txnlab/use-wallet'

export default function Index(props) { 

    const { activeAccount } = useWallet()
    const [page, setPage] = useState("map")

    useEffect(() => {
        console.log('Current page:', page);

        // Update body background based on the current page
        const body = document.body;
        if (page === "map") {
            body.style.backgroundColor = "white";
            body.style.color = "black";
            body.classList.add('no-scroll');
        } else if (page === "camp") {
            body.style.backgroundColor = "white";
            body.style.color = "black";
            body.classList.remove('no-scroll');
        } else if (page === "shrine") {
            body.style.backgroundColor = "white";
            body.style.color = "black";
            body.classList.remove('no-scroll');
        }else if (page === "obelisk") {
            body.style.backgroundColor = "white";
            body.style.color = "black";
            body.classList.remove('no-scroll');
        } else if (page === "arena") {
            body.style.backgroundColor = "black";
            body.style.color = "white";
            body.classList.remove('no-scroll');
        } else {
            body.style.backgroundColor = "";
            body.style.color = "";
            body.classList.remove('no-scroll');
        }
    }, [page]);
   

        return (
            <div className="main">
                <Head>
                <title>Immortal Jolly</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="" />
                <meta name="keywords" content="" />

                
                </Head>

               <Nav activeAccount={activeAccount} page={page} setPage={setPage} />

               {page == "map" || page == "connect" ? 
               <Map setPage={setPage} activeAccount={activeAccount} />
               :
               null
               }

               {page == "camp" ? 
               <Camp sendDiscordMessage={props.sendDiscordMessage}/>
                :
                null
                }

                {page == "shrine" ? 
               <Shrine sendDiscordMessage={props.sendDiscordMessage}/>
                :
                null
                }

                {page == "obelisk" ? 
                <Obelisk sendDiscordMessage={props.sendDiscordMessage}/>
                :
                null
                }

                {page == "arena" ? 
               <Arena sendDiscordMessage={props.sendDiscordMessage}/>
                :
                null
                }

              {page == "collection" ? 
               <Collection sendDiscordMessage={props.sendDiscordMessage} />
                :
                null
                }
               
              

              {page == "market" ? 
               <Market />
               :
               null
               }

                
                
              
               
                

            </div>
        )
    
    }
