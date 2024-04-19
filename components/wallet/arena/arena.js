import React, { useState } from "react"

import { Grid, Typography, Button, CircularProgress, TextField, LinearProgress, linearProgressClasses, styled } from "@mui/material"


import { useWallet } from '@txnlab/use-wallet'

import algosdk from "algosdk"
import DisplayMutant from "./displayMutant"
import DisplayReward from "./displayReward"

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

export default function Camp(props) { 

  const { activeAccount, signTransactions, sendTransactions } = useWallet()

  const [ round, setRound] = useState(0)
  const [ contractRound, setContractRound ] = useState(0)

  const [ assets, setAssets] = useState([])

  const [ loadAsset, setLoadAsset] = useState("")
  const [ loadAmount, setLoadAmount] = useState("")


  const [ battleNum, setBattleNum] = useState(null)
  const [ boxes, setBoxes] = useState([])
  const [ pastBoxes, setPastBoxes ] = useState([])
  const [ currentFighter, setCurrentFighter ] = useState(null)




  const [ confirm, setConfirm] = useState("")

  const [ contract ] = useState(1278098285)
  const [ contractRewards, setContractRewards ] = useState([])
  const [ pastRewards, setPastRewards ] = useState([])
  const [ myRewards, setMyRewards ] = useState([])



  const [progress, setProgress] = useState(0)

  const [ message, setMessage] = useState("Searching for Mutants")



    React.useEffect(() => {

        const fetchData = async () => {
            if (activeAccount) {

              try {

              const token = {
                'X-API-Key': process.env.indexerKey
              }
      
              const client = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', 443)

              let status = await client.status().do();

              let contractAccount = await algosdk.getApplicationAddress(contract)

              setRound(status["last-round"])

              setBoxes([])
              setPastBoxes([])
              setCurrentFighter(null)

              setAssets([])
              setConfirm("")
              setProgress(0)

              setContractRewards([])
              setPastRewards([])
              setMyRewards([])

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
      
              let session = await response.json()

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

              session = await response.json()

              session.assets.forEach((asset) => {
                if (asset.amount == 1) {
                  accountAssets.push(asset["asset-id"])
                }
              })

              numAssets = session.assets.length
              nextToken = session["next-token"]

          }

          setProgress(20)


             
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
                  if (accountAssets.includes(asset.index) && asset.params.name.substring(0, 5)) {
                    jollys.push(asset)                  
                  }
              })

              const indexerClient = new algosdk.Indexer('', 'https://mainnet-idx.algonode.cloud', 443)

              let global = await indexerClient.lookupApplications(contract).do();

              let globalState = global.application.params["global-state"]

              let battleNum
              let round

              globalState.forEach((keyVal) => {
                  if (atob(keyVal.key) == "battleNum") {
                      battleNum = keyVal.value.uint
                  }
                  if (atob(keyVal.key) == "round") {
                    round = keyVal.value.uint
                }
              })

              setBattleNum(battleNum)
              setContractRound(round)

              setProgress(60)

              

              let boxes = await fetch('/api/getArenaMutants', {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contract: contract

                    
                }),
                
                  
                });

                const boxArray = await boxes.json()


                let stateBoxes = []
                let pastBoxes = []
                let currentFighter
                let pastRewards = []
                let nameArray
                let asset
                let battle

        
                boxArray.boxes.forEach( async (box) => {
                  nameArray = Object.values(box.name)
                  
                  if (nameArray.length == 32) {
                    let address = algosdk.encodeAddress(nameArray.slice(0,32))
                    const accountAppLocalStates = await indexerClient.lookupAccountAppLocalStates(address).do();
                    accountAppLocalStates["apps-local-states"].forEach((app) => {
                      if (app.id == contract) {
                        if (app["key-value"]) {
                          app["key-value"].forEach((keyVal) => {
                            let assetId = base64ToDecimal(keyVal.key)
                            let amount = keyVal.value.uint
                            if (address == activeAccount.address) {
                              setMyRewards(myRewards => [...myRewards, {assetId: assetId, amount: amount}])
                            }
                            setPastRewards(pastRewards => [...pastRewards, {assetId: assetId, amount: amount}])
                            
                          })
                        }
                      }
                    })
                  }
                  else {
                    nameArray = Object.values(box.name)
                    asset = byteArrayToLong(nameArray.slice(0,8))
                    battle = byteArrayToLong(nameArray.slice(9))
                    stateBoxes.push({boxName: nameArray, asset: asset, battle: battle})
                  }
                  
                  
                })


                jollys.forEach((jolly) => {
                  stateBoxes.forEach((box) => {
                    if (jolly.index == box.asset && battleNum != box.battle) {
                    pastBoxes.push(box)
                    }
                    if (jolly.index == box.asset && battleNum == box.battle) {
                      currentFighter = box
                    }
                  })
                })

                setCurrentFighter(currentFighter)
                setPastBoxes(pastBoxes)
                setBoxes(stateBoxes)


                const contractAssets = await indexerClient.lookupAccountAssets(contractAccount).do();


                let rewards = []

                contractAssets.assets.forEach((asset) => {
                  rewards.push({assetId: asset["asset-id"], amount: asset.amount})
                })

                setContractRewards(rewards)


              setProgress(100)

              if(jollys.length > 0) {
                setAssets(jollys)
              }
              else {
                setMessage("No Mutants Found")
              }
            }
            catch(error) {
              props.sendDiscordMessage(error, "Arena Fetch", activeAccount.address)
            }
          }
        }
          fetchData();

          function base64ToDecimal(encodedString) {
            // Convert base 64 encoded string to text
            var text = atob(encodedString);
            var decimalArray = [];
            
            // Run a loop on all characters of the text and convert each character to decimal
            for (var i = 0; i < text.length; i++) {
                decimalArray.push(text.charAt(i).charCodeAt(0));
            }
        
            // Join all decimals to get the final decimal for the entire string
            return byteArrayToLong(decimalArray);
        }
        
      }, [activeAccount])

      const handleChange = (event) => {

      
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name == "loadAmount") {
          setLoadAmount(value)
        }
        if (name == "loadAsset") {
        setLoadAsset(value)
        }

       
        
      }


    const longToByteArray = (long) => {
      // we want to represent the input as a 8-bytes array
      var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
  
      for ( var index = byteArray.length - 1; index > 0; index -- ) {
          var byte = long & 0xff;
          byteArray [ index ] = byte;
          long = (long - byte) / 256 ;
      }
  
      return byteArray;
  };

  const byteArrayToLong = (byteArray) => {
    var value = 0;
    for ( var i = 0; i < byteArray.length; i++) {
        value = (value * 256) + byteArray[i];
    }

    return value;
};


  let fight = async (assetId, action) => {

    let currFighter

    if (currentFighter) {
      currFighter = currentFighter

    }



    let deleteBoxes = pastBoxes

    try {
      const token = {
        'X-API-Key': process.env.indexerKey
      }

      const client = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', 443)
      const indexerClient = new algosdk.Indexer('', 'https://mainnet-idx.algonode.cloud', 443)

      let optedin = false

      let response = await indexerClient.lookupAccountAppLocalStates(activeAccount.address).do();
      response["apps-local-states"].forEach((localstate) => {
          if (localstate.id == contract) {
              optedin = true
          }
      })

      let global = await indexerClient.lookupApplications(contract).do();

      let globalState = global.application.params["global-state"]

      let battleNum

      globalState.forEach((keyVal) => {
          if (atob(keyVal.key) == "battleNum") {
              battleNum = keyVal.value.uint
          }
      })
    
      let params = await client.getTransactionParams().do()

      let txns = []
      let encodedTxns = []

      let appArgs = []

      appArgs.push(
        new Uint8Array(Buffer.from("fight"))
      )


        const accounts = []
        const foreignApps = []
          
        const foreignAssets = [assetId]

        const pk = algosdk.decodeAddress(activeAccount.address);
        const addrArray = pk.publicKey
       

        let battleInt = longToByteArray(battleNum)

        let assetInt = longToByteArray(assetId)
      
        let accountBox = new Uint8Array([...assetInt, new Uint8Array(Buffer.from(">")), ...battleInt])

      
        const boxes = [{appIndex: 0, name: accountBox}]

        if (currFighter) {
          appArgs.push(
            algosdk.encodeUint64(currFighter.battle)
          )
          foreignAssets.push(currFighter.asset)
          boxes.push({appIndex: 0, name: new Uint8Array(currFighter.boxName)})
        }

        deleteBoxes.forEach((box) => {
          appArgs.push(
            algosdk.encodeUint64(box.battle)
          )
          foreignAssets.push(box.asset)
          boxes.push({appIndex: 0, name: new Uint8Array(box.boxName)})
        })
  
        let ftxn = algosdk.makeApplicationNoOpTxn(activeAccount.address, params, contract, appArgs, accounts, foreignApps, foreignAssets, undefined, undefined, undefined, boxes);
  
        txns.unshift(ftxn)

        if (!optedin) {

          appArgs = []

          let txn = algosdk.makeApplicationOptInTxn(activeAccount.address, params, contract, appArgs, accounts, foreignApps, foreignAssets, undefined, undefined, undefined, boxes);

          txns.unshift(txn)

      }
          
        if (txns.length > 1) {
          let txgroup = algosdk.assignGroupID(txns)

        }

        txns.forEach((txn) => {
          let encoded = algosdk.encodeUnsignedTransaction(txn)
          encodedTxns.push(encoded)

        })
        setConfirm("Sign Transaction...")

        const signedTransactions = await signTransactions(encodedTxns)
        setConfirm("Sending Transaction...")
        
      const { id } = await sendTransactions(signedTransactions)

      let confirmedTxn = await algosdk.waitForConfirmation(client, id, 4);

      setConfirm("Transaction Confirmed")

      setBoxes([])
      setPastBoxes([])
      setCurrentFighter(null)


      let updatedBoxes = await fetch('/api/getArenaMutants', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contract: contract

            
        }),
        
          
        });

        const boxArray = await updatedBoxes.json()

        let stateBoxes = []
        let pastBoxes = []
        let currentFighter

        boxArray.boxes.forEach((box) => {
          let nameArray = Object.values(box.name)
          let asset = byteArrayToLong(nameArray.slice(0,8))
          let battle = byteArrayToLong(nameArray.slice(9))
          stateBoxes.push({boxName: nameArray, asset: asset, battle: battle})
          
        })

        assets.forEach((jolly) => {
          stateBoxes.forEach((box) => {
            if (jolly.index == box.asset && battleNum != box.battle) {
            pastBoxes.push({boxName: nameArray, asset: asset, battle: battle})
            }
            if (jolly.index == box.asset && battleNum == box.battle) {
              currentFighter = box
            }
          })
        })

        setCurrentFighter(currentFighter)
        setPastBoxes(pastBoxes)
        setBoxes(stateBoxes)

      

        
    }      
     
    catch (error) {
      setConfirm(String(error))
      props.sendDiscordMessage(error, "Fight")
    }

  }

  let reward = async (roundRewards) => {

    try {

    setConfirm("Sending Transaction...")


    const token = {
      'X-API-Key': process.env.indexerKey
    }

    const client = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', 443)

    let params = await client.getTransactionParams().do()

    const indexerClient = new algosdk.Indexer('', 'https://mainnet-idx.algonode.cloud', 443)

    let global = await indexerClient.lookupApplications(contract).do();

    let globalState = global.application.params["global-state"]

    let battleNum

    globalState.forEach((keyVal) => {
        if (atob(keyVal.key) == "battleNum") {
            battleNum = keyVal.value.uint
        }
    })

    let res = await fetch('/api/getCreatedAssets', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          address: "I4BY7MKHRXW2JNBMEHP5NC4GTD55W6TQW5LIYSQOWL3RKUD6MBZHYM52DM"

          
      }),
      
        
      });

      const mutants = await res.json()


    let resBoxes = await fetch('/api/getArenaMutants', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          contract: contract

          
      }),
      
        
      });

      const boxArray = await resBoxes.json()

      let battleBoxes = []
      let allBoxes = []

      boxArray.boxes.forEach((box) => {
        let nameArray = Object.values(box.name)
        
        let asset = byteArrayToLong(nameArray.slice(0, 8))
        let battle = byteArrayToLong(nameArray.slice(9))

        let name

        mutants.assets.forEach((mutant) => {
          if (mutant.index == asset) {
            name = mutant.params.name
          }
        })


        let multi

        if (name.substring(0, 5) == "Omega") {
          multi = 4
        }
        else if (name.substring(0, 9) == "Legendary") {
          multi = 3
        }
        else if (name.substring(0, 8) == "Superior") {
          multi = 2
        }
        else if (name.substring(0, 5) == "Basic") {
          multi = 1
        }
       
        if (battleNum == battle) {
          allBoxes.push({boxName: nameArray, asset: asset, name: name, battle: battle})
          for (let i = 0; i < multi; i++) {
            battleBoxes.push({boxName: nameArray, asset: asset, name: name, battle: battle})

          }
        }
      })

      let winner = Math.floor(Math.random() * battleBoxes.length)

      let winningBox = battleBoxes[winner].boxName

      let response = await fetch('/api/getNft', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nftId: battleBoxes[winner].asset
          }),
        
            
        });
    
      let session = await response.json()

      let winnerImg = "https://ipfs.algonft.tools/ipfs/" + session.assets[0].params.url.slice(7)


      const boxResponse = await indexerClient.lookupApplicationBoxByIDandName(contract, winningBox).do();

      let address = algosdk.encodeAddress(Object.values(boxResponse.value))

      let mostKills = Math.floor(Math.random() * allBoxes.length)
      let numKills = Math.ceil(((Math.random() * allBoxes.length) + 2) / 2)

      let firstKill = Math.floor(Math.random() * allBoxes.length)

      let mostBrutalKill = Math.floor(Math.random() * allBoxes.length)

      let mostFeared = Math.floor(Math.random() * allBoxes.length)

      let txns = []

      let appArgs = []
    
      appArgs.push(
        new Uint8Array(Buffer.from("reward"))
        
        
      )
    
      let accounts = [address]
      let foreignApps = []
        
      let foreignAssets = []
    
      roundRewards.forEach((reward) => {
        appArgs.push(
          algosdk.encodeUint64(reward.amount)
        )
        foreignAssets.push(Number(reward.assetId))
      })

      let accountBox = new Uint8Array(Object.values(boxResponse.value))
      
      const boxes = [{appIndex: 0, name: accountBox}]
      
      let atxn = algosdk.makeApplicationNoOpTxn("LJGQE6GXIVKS4OGW4WCP7JXYJHHK5E4DNXDCOOQMLC4I57BNQR3FTUTSYA", params, contract, appArgs, accounts, foreignApps, foreignAssets, undefined, undefined, undefined, boxes);
  
      txns.push(atxn)
      
      let encodedTxns= []

        txns.forEach((txn) => {
          let encoded = algosdk.encodeUnsignedTransaction(txn)
          encodedTxns.push(encoded)
  
        })

        
  
        const signedTransactions = await signTransactions(encodedTxns)

        setConfirm("Sending Transaction...")
        
        const { id } = await sendTransactions(signedTransactions)

        let confirmedTxn = await algosdk.waitForConfirmation(client, id, 4);

        setConfirm("Transaction Confirmed")

      sendRewardMessage(
        {
          object: battleBoxes[winner],
          address: address,
          img: winnerImg
        },
        {
          object: allBoxes[mostKills],
          numKills: numKills,
        },
        {
          object: allBoxes[firstKill]
        },
        {
          object: allBoxes[mostBrutalKill]
        },
        {
          object: allBoxes[mostFeared]
        }
        
      )
    }
    catch(error) {
      await props.sendDiscordMessage(error, "Reward", activeAccount.address)
     }


  }

  const sendRewardMessage = async (Winner, MostKills, FirstKill, MostBrutalKill, MostFeared) => {

    let embeds = []
    
    embeds.push({
      "title" : "Winner of Arena: " + Winner.object.name,
      
      "description" : "Congratulations " + Winner.address + 
      "\n Please claim your rewards from the Arena."
      
    })

    embeds.push({
      "title" : "Most Kills: " + MostKills.object.name,
      "description" : MostKills.numKills + " kills"
    })

    embeds.push({
      "title" : "First Kill: " + FirstKill.object.name,
    })

    embeds.push({
      "title" : "Most Brutal Kill: " + MostBrutalKill.object.name,
    })

    embeds.push({
      "title" : "Most Feared: " + MostFeared.object.name,
    })

    const response = await fetch(process.env.arenaWebhook, {
      method: "POST",
      body: JSON.stringify({ 
        embeds: embeds
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

  }

  const load = async () => {

    try {
      
    const token = {
        'X-API-Key': process.env.indexerKey
      }
  
      const client = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', 443)
  
      let params = await client.getTransactionParams().do()
  
      const indexerClient = new algosdk.Indexer('', 'https://mainnet-idx.algonode.cloud', 443)
  
          
      let contractAccount = await algosdk.getApplicationAddress(contract)
  
      const accountAssets = await indexerClient.lookupAccountAssets(contractAccount).do();
  
      let contractOpt = false
  
      accountAssets.assets.forEach(async (asset) => {
        if (asset["asset-id"] == loadAsset) {
          contractOpt = true
        }
        
      })

      setConfirm("Sign Transaction...")

      let txns = []

      if (!contractOpt) {
        let appArgs = []
      
        appArgs.push(
          new Uint8Array(Buffer.from("load"))
          
          
        )
      
        let accounts = []
        let foreignApps = []
          
        let foreignAssets = [Number(loadAsset)]
      
        
        let atxn = algosdk.makeApplicationNoOpTxn(activeAccount.address, params, contract, appArgs, accounts, foreignApps, foreignAssets, undefined, undefined, undefined);
    
        txns.push(atxn)
      }

  
      let stxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        activeAccount.address, 
        contractAccount, 
        undefined, 
        undefined,
        Number(loadAmount),  
        undefined, 
        Number(loadAsset), 
        params
      );
  
        txns.push(stxn)
  
      
      if (txns.length > 1) {
        let txgroup = algosdk.assignGroupID(txns)
      }
  
      let encodedTxns= []

        txns.forEach((txn) => {
          let encoded = algosdk.encodeUnsignedTransaction(txn)
          encodedTxns.push(encoded)
  
        })

        
  
        const signedTransactions = await signTransactions(encodedTxns)

        setConfirm("Sending Transaction...")
        
        const { id } = await sendTransactions(signedTransactions)

        let confirmedTxn = await algosdk.waitForConfirmation(client, id, 4);

        setConfirm("Transaction Confirmed")

        const contractAssets = await indexerClient.lookupAccountAssets(contractAccount).do();


        let rewards = []

        contractAssets.assets.forEach((asset) => {
          rewards.push({assetId: asset["asset-id"], amount: asset.amount})
        })

        setContractRewards(rewards)



   
    }
    catch(error) {
      await props.sendDiscordMessage(error, "Load", activeAccount.address)
     }
  
  
  }

  const claim = async () => {

    try {
      
    const token = {
        'X-API-Key': process.env.indexerKey
      }
  
      const client = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', 443)
  
      let params = await client.getTransactionParams().do()
  
      const indexerClient = new algosdk.Indexer('', 'https://mainnet-idx.algonode.cloud', 443)
    
      const accountAssets = await indexerClient.lookupAccountAssets(activeAccount.address).do();

      let txns = []

      myRewards.forEach((reward) => {

        let addrOpt = false
  
        accountAssets.assets.forEach(async (asset) => {
          if (asset["asset-id"] == loadAsset) {
            addrOpt = true
          }
          
        })

        if (!addrOpt) {
          let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
            activeAccount.address, 
            activeAccount.address, 
            undefined, 
            undefined,
            0,  
            undefined, 
            Number(reward.assetId), 
            params
          );

          txns.push(txn)
        }

      })
  
      

      setConfirm("Sign Transaction...")

      let appArgs = []
    
      appArgs.push(
        new Uint8Array(Buffer.from("claim"))
        
        
      )
    
      let accounts = []
      let foreignApps = []
        
      let foreignAssets = []

      myRewards.forEach((reward) => {

        foreignAssets.push(Number(reward.assetId))

      })

      const pk = algosdk.decodeAddress(activeAccount.address);
      const addrArray = pk.publicKey
      
      const boxes = [{appIndex: 0, name: addrArray}]
    
      
      let atxn = algosdk.makeApplicationNoOpTxn(activeAccount.address, params, contract, appArgs, accounts, foreignApps, foreignAssets, undefined, undefined, undefined, boxes);
  
      txns.push(atxn)


   
  
      
      if (txns.length > 1) {
        let txgroup = algosdk.assignGroupID(txns)
      }
  
      let encodedTxns= []

        txns.forEach((txn) => {
          let encoded = algosdk.encodeUnsignedTransaction(txn)
          encodedTxns.push(encoded)
  
        })

        
  
        const signedTransactions = await signTransactions(encodedTxns)

        setConfirm("Sending Transaction...")
        
        const { id } = await sendTransactions(signedTransactions)

        let confirmedTxn = await algosdk.waitForConfirmation(client, id, 4);

        setConfirm("Transaction Confirmed")

        setMyRewards([])


   
    }
    catch(error) {
      await props.sendDiscordMessage(error, "Claim", activeAccount.address)
     }
  
  
  }
        

    let roundRewards = []

    contractRewards.forEach((cReward) => {
      let amount = cReward.amount
      pastRewards.forEach((pReward) => {
        if(cReward.assetId == pReward.assetId) {
          amount = amount - pReward.amount
        }
      })
      if (amount > 0) {
        roundRewards.push({assetId: cReward.assetId, amount: amount})
      }
    })

    console.log(boxes)

 
      return (
          
        <div style={{backgroundColor: "black", height: "100%"}}>

        {myRewards.length > 0 ?
                <Grid container align="center">

                {myRewards.map((reward, index) => {
                  return (
                    <Grid item xs={6} sm={3} key={index}>
                      <DisplayReward nftId={reward.assetId} amount={reward.amount} round={round}  sendDiscordMessage={props.sendDiscordMessage}/>

                    </Grid>
                  )
                })}
                <Button variant="contained" color="secondary" 
                  style={{backgroundColor: "#ffffff", display: "flex", margin: "auto"}}
                  onClick={() => claim()}
                  >
                  Claim
                </Button>
                
                </Grid>
                :
                null
                }

          <Typography color="primary"  align="left" variant="h2" style={{fontFamily: "Deathrattle", color: "#ef8e36", padding: 5, paddingLeft: 30}}> Choose your fighter! </Typography>

          <Typography color="primary"  align="left" variant="subtitle1" style={{color: "white", padding: 5, paddingLeft: 30, maxWidth: 450}}> Who will you send to their death in the ultimate battle for glory and treasure? </Typography>

          <Typography color="primary"  align="left" variant="subtitle1" style={{padding: 5, paddingLeft: 30, maxWidth: 450}}> {confirm} </Typography>

          {activeAccount && activeAccount.address == "LJGQE6GXIVKS4OGW4WCP7JXYJHHK5E4DNXDCOOQMLC4I57BNQR3FTUTSYA" ?
          <div>
          <Grid container spacing={3} align="center" style={{padding: 20, borderRadius: 15}}>
        
         
          <Grid item xs={12} sm={12} md={12} >
          <TextField                
            onChange={handleChange}
            value={loadAsset}
            multiline
            type="number"
            label="Load Asset ID"
            name="loadAsset"
            autoComplete="false"
            InputProps={{ style: { color: "white", borderBottom: "1px solid white", marginRight: 20 } }}
            InputLabelProps={{ style: { color: "white" } }}
          
            style={{
            color: "white",
            borderRadius: 15,
            margin: "auto",
            width: "30%"
          
            }}
          />
          <TextField                
            onChange={handleChange}
            value={loadAmount}
            multiline
            type="number"
            label="Load Amount"
            name="loadAmount"
            autoComplete="false"
            InputProps={{ style: { color: "white", borderBottom: "1px solid white", marginRight: 20 } }}
            InputLabelProps={{ style: { color: "white"} }}
          
            style={{
            color: "white",
            borderRadius: 15,
            margin: "auto",
            width: "30%"
          
            }}
          />
          <Button variant="contained" color="secondary" 
            style={{backgroundColor: "#ffffff", display: "flex", margin: "auto", marginTop: 20}}
            onClick={() => load()}
            >
            Load
            </Button>
          

          </Grid>
        </Grid>

        {round - contractRound > 732000 ? 
        <Button variant="contained" color="secondary" 
          style={{backgroundColor: "#ffffff", display: "flex", margin: "auto"}}
          onClick={() => reward(roundRewards)}
          >
        Reward
        </Button>
        :
        null
        }

            </div>
          :
          null
          }

                

              <Grid container align="center">
                {roundRewards.length > 0 ?
                roundRewards.map((reward, index) => {
                  return (
                    <Grid item xs={4} sm={3} md={2} lg={2} key={index}>
                      <DisplayReward nftId={reward.assetId} amount={reward.amount} round={round}  sendDiscordMessage={props.sendDiscordMessage}/>

                    </Grid>
                  )
                })
                :
                null
                }
              </Grid>

              {round && contractRound ? 
              <div style={{padding: 40}}>
              <Typography color="primary"  align="left" variant="subtitle1" style={{color: "white", padding: 5, paddingLeft: 30}}> Time til next battle: {((732000 - (round - contractRound)) / 732000 * 4 * 7).toFixed(2)} more days </Typography>

              <BorderLinearProgress variant="determinate" value={(round - contractRound) / 732000 * 100} />
              {/* <Typography color="primary"  align="left" variant="subtitle1" style={{color: "white", padding: 5, paddingLeft: 30, maxWidth: 450}}> {((round - contractRound) / 732000 * 100).toFixed(2)} % </Typography> */}

              </div>
              :
              null
              }
              

              <Typography color="secondary"  align="left" variant="subtitle1" style={{padding: 5, paddingLeft: 30, maxWidth: 450}}> {confirm} </Typography>

    
          <Grid container>
          {assets.length > 0 ? assets.map((asset, index) => {
            let found = false
            boxes.forEach((box) => {
              if (box.asset == asset.index && box.battle == battleNum) {
                found = true
              }
            })
            if (found) {
              return (
                <Grid key={index} item xs={6} sm={4} md={3} lg={2}>
                <DisplayMutant nftId={asset.index}  round={round}  sendDiscordMessage={props.sendDiscordMessage}/>
                <Button variant="contained" color="secondary" 
                style={{backgroundColor: "#ffffff", display: "flex", margin: "auto"}}
                onClick={() => fight(asset.index, "withdrawl")}
                >
                Withdraw
                </Button>
                   
                </Grid>
              )
            }
            else {
              return (
                <Grid key={index} item xs={6} sm={4} md={3} lg={2}>
                <DisplayMutant nftId={asset.index}  round={round}  sendDiscordMessage={props.sendDiscordMessage}/>
                
                <Button variant="contained" color="secondary" 
                   style={{backgroundColor: "#ffffff", display: "flex", margin: "auto"}}
                   onClick={() => fight(asset.index, "fight")}
                   >
                   Fight
                   </Button>
                </Grid>
              )
            }
            
          })
          :
          <div style={{display: "flex"}}>
            <Typography style={{margin: 30}} color="secondary"> {message} </Typography>
            <CircularProgress variant="determinate" color="secondary" value={progress} />

          </div>
          }
         
            
         </Grid>
           
            <br />

            <Typography color="primary"  align="left" variant="h2" style={{fontFamily: "Deathrattle", color: "#ef8e36", padding: 5, paddingLeft: 30}}> Contestants </Typography>

            {boxes.length > 0 ? boxes.map((box) => {
              
              if (box.battle == battleNum) {
                return (
                  <DisplayMutant nftId={box.asset} round={round}  sendDiscordMessage={props.sendDiscordMessage} contestant={true} />

                )
              }
              
            })
            :
            null
            }


        </div>
    )
    
    
}