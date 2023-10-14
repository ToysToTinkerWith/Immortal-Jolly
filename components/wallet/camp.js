import React, { useState } from "react"

import Head from "next/head"

import { Grid, Typography, Button, CircularProgress } from "@mui/material"

import Nav from "../nav/nav"

import { useWallet } from '@txnlab/use-wallet'

import algosdk from "algosdk"
import DisplayJolly from "./displayJolly"
import { SetMealSharp } from "@mui/icons-material"

export default function Camp(props) { 

  const { activeAccount, signTransactions, sendTransactions } = useWallet()

  const [ round, setRound] = useState(0)

  const [ assets, setAssets] = useState([])
  const [ cashAssets, setCashAssets] = useState([])

  const [ confirm, setConfirm] = useState("")

  const [ contract ] = useState(1115541498)

  const [progress, setProgress] = useState(0)


  

  const [ message, setMessage] = useState("Loading Jollys")

  console.log(activeAccount)


    React.useEffect(() => {

        const fetchData = async () => {
            if (activeAccount) {

              try {

              const token = {
                'X-API-Key': process.env.indexerKey
              }
      
              const client = new algosdk.Algodv2(token, 'https://mainnet-algorand.api.purestake.io/ps2', '')

              let status = await client.status().do();

              setRound(status["last-round"])

              setAssets([])
              setConfirm("")
              setProgress(0)

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

              session.assets.forEach((asset) => {
                if (asset.amount == 1) {
                  accountAssets.push(asset["asset-id"])
                }
              })

              numAssets = accountAssets.assets.length
              nextToken = accountAssets["next-token"]

          }

          setProgress(20)


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

                res1.assets.forEach((asset) => {
                  if (accountAssets.includes(asset.index)) {
                  jollys.push({asset: asset, reward: 10})
                  }
              })

              setProgress(40)

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

                res2.assets.forEach((asset) => {
                  testarr.push(asset.index)
                  if (accountAssets.includes(asset.index)) {
                    jollys.push({asset: asset, reward: 5})                  
                  }
              })

              setProgress(60)

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

              setProgress(80)

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
            catch(error) {
              props.sendDiscordMessage(error, "Camp Fetch", activeAccount.address)
            }
          }
        }
          fetchData();
        
      }, [activeAccount, message])

      console.log(activeAccount)


  let cashOut = async () => {


    setConfirm("Sign Transaction...")
      
      try {

        const token = {
          'X-API-Key': process.env.indexerKey
        }

        const client = new algosdk.Algodv2(token, 'https://mainnet-algorand.api.purestake.io/ps2', '')
      
        let params = await client.getTransactionParams().do()

        let txns = []
        let encodedTxns = []

        

      cashAssets.forEach(async (asset) => {

          const appArgs = []

          if (asset.option == "cash") {
            appArgs.push(
              new Uint8Array(Buffer.from("pullRewards"))
            )
          }
          else if (asset.option == "stake") {
            appArgs.push(
              new Uint8Array(Buffer.from("addAsset"))
            )
          }
          else if (asset.option == "unstake") {
            appArgs.push(
              new Uint8Array(Buffer.from("removeAsset"))
            )
          }


          
                  
            const accounts = []
            const foreignApps = []
              
            const foreignAssets = [asset.assetId]

            if (asset.option == "cash") {
              foreignAssets.push(877451592)
            }

            let assetBox = algosdk.encodeUint64(foreignAssets[0])
          
            const boxes = [{appIndex: 0, name: assetBox}]
      
            let dtxn = algosdk.makeApplicationNoOpTxn(activeAccount.address, params, contract, appArgs, accounts, foreignApps, foreignAssets, undefined, undefined, undefined, boxes);
      
            txns.unshift(dtxn)
            

      })
      if (txns.length > 1) {
        let txgroup = algosdk.assignGroupID(txns)
  
      }

      txns.forEach((txn) => {
        let encoded = algosdk.encodeUnsignedTransaction(txn)
        encodedTxns.push(encoded)

      })

      const signedTransactions = await signTransactions(encodedTxns)
      setConfirm("Sending Transaction...")
          
        const { id } = await sendTransactions(signedTransactions)

        


        

        let confirmedTxn = await algosdk.waitForConfirmation(client, id, 4);


        setCashAssets([])
        if (message == "Updating") {
          setMessage("Loading Jollys")
        }
        else {
          setMessage("Updating")
        }
        
        

        

      
      
    }
    catch (error) {
      setConfirm(String(error))
      props.sendDiscordMessage(error, "Camp Cash Out")
    }

  }

        let totalRewards = 0
        let totalStake = 0
        let totalUnstake = 0

        cashAssets.forEach((asset) => {
          totalRewards += asset.reward
          if (asset.option == "stake") {
            totalStake++
          }
          else if (asset.option == "unstake") {
            totalUnstake++
          }
        })

        return (
          
            <div >

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
              {totalUnstake > 0 ?
              <Typography color="primary" align="left" variant="h6"> Unstake: {totalUnstake} </Typography>
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
                  <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                  <DisplayJolly nftId={asset.asset.index} reward={asset.reward} round={round} cashAssets={cashAssets} setCashAssets={setCashAssets} display={"camp"} sendDiscordMessage={props.sendDiscordMessage}/>
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
        )
    
}