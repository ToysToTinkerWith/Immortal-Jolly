import React, { useState } from "react"

import Head from "next/head"

import { Grid, Typography, Button, CircularProgress } from "@mui/material"

import Nav from "../nav/nav"

import { useWallet } from '@txnlab/use-wallet'

import algosdk from "algosdk"
import DisplayJolly from "./displayJolly"

export default function Camp(props) { 

  const { activeAccount, signTransactions, sendTransactions } = useWallet()

  const [ round, setRound] = useState(0)

  const [ assets, setAssets] = useState([])
  const [ cashAssets, setCashAssets] = useState([])

  const [ confirm, setConfirm] = useState("")

  const [ contract ] = useState(1115541498)

  const [progress, setProgress] = useState(0)

  const [tab, setTab] = useState("jollies")

  

  const [ message, setMessage] = useState("")



  



    React.useEffect(() => {

        const fetchData = async () => {
            if (activeAccount) {

              const token = {
                'X-API-Key': process.env.indexerKey
              }
      
              const client = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', 443)

              let status = await client.status().do();

              setRound(status["last-round"])

              setAssets([])
              setConfirm("")
              setProgress(0)

              if (tab == "jollies") {
                setMessage("Searching for Jollies")
              }
              else if (tab == "babies") {
                setMessage("Searching for Babies")
              }
              else if (tab == "oldgods") {
                setMessage("Searching for Old Gods")
              }


              let jollys = []

              let accountAssets = []

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

              setProgress(20)


              session.assets.forEach((asset) => {
                
                if (asset.amount == 1) {
                  accountAssets.push(asset["asset-id"])
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
              setProgress(40)


              session.assets.forEach((asset) => {
                if (asset.amount == 1) {
                  accountAssets.push(asset["asset-id"])
                }
              })

              numAssets = accountAssets.assets.length
              nextToken = accountAssets["next-token"]

          }


          if (tab == "jollies") {
            let addr1 = await fetch('/api/getCreatedAssets', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  address: "4FPA3KPLZPKMTQ7ER3XLFCXZX46W2FD2WVFDRZULGLKNGURWDX7MYDB4HA"

                  
              }),
              
                
              });

              const res1 = await addr1.json()

              setProgress(60)


              res1.assets.forEach((asset) => {
                if (accountAssets.includes(asset.index)) {
                jollys.push({asset: asset, reward: 10})
                }
            })

            let addr2 = await fetch('/api/getCreatedAssets', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  address: "I4BY7MKHRXW2JNBMEHP5NC4GTD55W6TQW5LIYSQOWL3RKUD6MBZHYM52DM"

                  
              }),
              
                
              });

              let testarr = []

              const res2 = await addr2.json()
              setProgress(80)


              res2.assets.forEach((asset) => {
                testarr.push(asset.index)
                if (accountAssets.includes(asset.index)) {
                  jollys.push({asset: asset, reward: 5})                  }
            })

            let addr3 = await fetch('/api/getCreatedAssets', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  address: "AOKWUQSOVXQSEKFPMSDZ273PMERUOY4OF7CFCKCXZR3565BT6XOSWHLI3M"

                  
              }),
              
                
              });

              const res3 = await addr3.json()

              res3.assets.forEach((asset) => {
                if (accountAssets.includes(asset.index)) {
                  jollys.push({asset: asset, reward: 3})
                }
            })

            let addr4 = await fetch('/api/getCreatedAssets', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  address: "E25YOES4G3SBKVJ3UAUDCP5RDU7RYBB6MAF4Y3XPLGGZNS3E6XI6H6STK4"

                  
              }),
              
                
              });

              const res4 = await addr4.json()

              setProgress(100)


              res4.assets.forEach((asset) => {
                if (accountAssets.includes(asset.index)) {
                  jollys.push({asset: asset, reward: 10})                  
                }
            })

            

            if(jollys.length > 0) {
              setAssets(jollys)
            }
            else {
              setMessage("No Jollys Found")
            }

          }
          else if (tab == "babies") {
            setProgress(50)


          let addr1 = await fetch('/api/getCreatedAssets', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: "XILPARLALRXJVN2UEVUW5YGCLMSBUYSFNWM6QGVJHLXWOID6CQUVZVPKCU"

                
            }),
            
              
            });

            const res1 = await addr1.json()

            console.log('created assets response: ', res1);

            res1.assets.forEach((asset) => {
              if (accountAssets.includes(asset.index)) {
              jollys.push({asset: asset, reward: 5})
              }
          })

          setProgress(100)

          

          if(jollys.length > 0) {
            setAssets(jollys)
          }
          else {
            setMessage("No Babies Found")
          }
          }

          else if (tab == "oldgods") {
            setProgress(50)


            let addr5 = await fetch('/api/getCreatedAssets', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  address: "FSIOIQLCQYITAH4WMK2SDOF5R2FSPWFIZOVAHRR3M4AR2URG6D2MHRIQOE"

                  
              }),
              
                
              });

              const res5 = await addr5.json()

              setProgress(100)


              res5.assets.forEach((asset) => {
                if (accountAssets.includes(asset.index)) {
                  jollys.push({asset: asset, reward: 10})                  
                }
            })

          setProgress(100)

          

          if(jollys.length > 0) {
            setAssets(jollys)
          }
          else {
            setMessage("No Old Gods Found")
          }
          }

        


              
          }
        }
        try {
          fetchData();
        }
        catch(error) {
          props.sendDiscordMessage(error, "Collection Fetch")
        }

      }, [activeAccount, tab])

  


    
        
        return (
          <div className="collection-body" style={{background: "white", height: "100%"}}>
          
            <div >
              <Button variant="outlined" style={{margin: 20, backgroundColor: tab == "jollies" ? "#000000" : null, color: tab == "jollies" ? "#FFFFFF" : null}} onClick={() => setTab("jollies")}> Jollies </Button>
              <Button variant="outlined" style={{margin: 20, backgroundColor: tab == "babies" ? "#000000" : null, color: tab == "babies" ? "#FFFFFF" : null}} onClick={() => setTab("babies")}> Babies </Button>
              <Button variant="outlined" style={{margin: 20, backgroundColor: tab == "oldgods" ? "#000000" : null, color: tab == "oldgods" ? "#FFFFFF" : null}} onClick={() => setTab("oldgods")}> Old Gods </Button>

            {tab == "jollies" ? 
            <div>
              <Typography color="primary"  align="left" variant="h2" style={{fontFamily: "Deathrattle",  padding: 5, paddingLeft: 30}}> Your mighty jolly-verse team! </Typography>

              <Typography color="primary"  align="left" variant="subtitle1" style={{padding: 5, paddingLeft: 30, maxWidth: 450}}> Behold the most magnificent team to grace the lands of the mighty jolly-verse! </Typography>
            </div>
            :
            null
            }
            

              {cashAssets.length > 0 ?
              
              <Button variant="contained" color="secondary" style={{position: "fixed", display: "grid", zIndex: 1, bottom: 20, right: 20, backgroundColor: "#A1FF9F", margin: 20, padding: 20}} onClick={() => cashOut()} >
                <img src={"./logo.png"} style={{width: 50, minWidth: 50}} />
                {totalRewards > 0 ?
                <div style={{display: "flex"}}>
                <Typography color="primary"  align="left" variant="h6"> collect </Typography>
              

              <img style={{width: 20, height: "auto", borderRadius: 5}} src={"cursedgold.png"} />
              

              <Typography color="primary"  align="center" variant="h6" style={{display: "grid"}}> {totalRewards} </Typography>

                </div>
                :
                null
                }
                
                

        

              {totalStake > 0 ?
              <Typography color="primary" align="left" variant="h6"> Stake: {totalStake} </Typography>
              :
              null
              }

            <Typography color="primary"  align="center" variant="caption" style={{display: "grid"}}> {confirm} </Typography>

              

              </Button>
              :
              null
              }
              
        
              <Grid container>
              {assets.length > 0 ? assets.map((asset, index) => {
                return (
                  <Grid key={index} item xs={6} sm={4} md={3} lg={2}>
                  <DisplayJolly nftId={asset.asset.index} reward={asset.reward} round={round} cashAssets={cashAssets} setCashAssets={setCashAssets} display={"collection"} />
                  </Grid>
                )
                
              })
              :
              <div style={{display: "flex"}}>
                <Typography style={{margin: 30}}> {message} </Typography>
                <CircularProgress variant="determinate" value={progress} />

              </div>
              }
             
                
             </Grid>
               
                

            </div>
          </div>
        )
    
}