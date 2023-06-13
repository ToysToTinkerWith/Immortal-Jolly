import React, { useState } from "react"

import Head from "next/head"

import { Grid, Typography, Button } from "@mui/material"

import Nav from "../components/nav/nav"

import Map from "../components/maps/map"

import WalletAssets from "../components/wallet/walletAssets"

import { useWallet, walletconnect } from '@txnlab/use-wallet'

import algosdk from "algosdk"

export default function Index() { 

    const { activeAccount } = useWallet()
    const [page, setPage] = useState("map")
    const [ accountSheps, setAccountSheps ] = useState([])


    React.useEffect(() => {
        console.log(activeAccount)

        const fetchData = async () => {
            if (activeAccount) {

              let creatorResponse = await fetch('/api/getCreatedAssets', {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    address: "SHEPWD4POJMJ65XPSGUCJ4GI2SGDJNDX2C2IXI24EK5KXTOV5T237ULUCU"

                    
                }),
                
                  
                });

                const sheps = await creatorResponse.json()

                console.log(sheps)

                let shepNfts = []

                sheps.assets.forEach((asset) => {
                  shepNfts.push(asset.index)
                  
              })


              setAccountSheps([])



                let response = await fetch('/api/getAssets', {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        address: activeAccount.address

                        
                    }),
                    
                      
                  });
          
                  const session = await response.json()

                  session.assets.forEach((asset) => {
                    
                    if (shepNfts.includes(asset["asset-id"]) && asset.amount == 1) {
                      setAccountSheps([...accountSheps, asset["asset-id"]])
                    }
                })

                  let numAssets = session.assets.length
                  let nextToken = session["next-token"]
    
                while (numAssets == 1000) {

                  response = await fetch('/api/getAssets', {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        address: activeAccount.address,
                        nextToken: nextToken
                        
                        
                    }),
                    
                      
                  });  

                  const session = await response.json()

                  session.assets.forEach((asset) => {
                    if (shepNfts.includes(asset["asset-id"]) && asset.amount == 1) {
                      accountSheps.push([...accountSheps, asset["asset-id"]])
                    }
                  })
  
                  numAssets = accountAssets.assets.length
                  nextToken = accountAssets["next-token"]
  
              }
    
            }
          }
          fetchData();

      }, [activeAccount])


    console.log(activeAccount)
   

        return (
            <div >
                <Head>
                <title>Immortal Jolly</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="" />
                <meta name="keywords" content="" />

                
                </Head>

               <Nav activeAccount={activeAccount} page={page} setPage={setPage} />

               {page == "wallet" ? 
               <WalletAssets />
                :
                null
                }
               
               {page == "map" ? 
               <Map />
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