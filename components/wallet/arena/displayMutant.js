import React from "react"

import algosdk, { seedFromMnemonic } from "algosdk"

import { Typography, Button, TextField, Grid } from "@mui/material"

import MyAlgo from '@randlabs/myalgo-connect';


export default class DisplayMutant extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            nft: null,
            nftUrl: null,
            svg: null,
            price: "",
            message: "",
            contract: 1115541498,
            cashRound: 0,
            assetNFD: null
            
        };

    }

    async componentDidMount() {

        
        try {

        if (this.props.nftId) {
            let response = await fetch('/api/getNft', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nftId: this.props.nftId
                  }),
                
                    
                });
            
            let session = await response.json()

            console.log(session)

            

    
            if (session.assets[0].params.url.slice(0, 21) == "https://ipfs.io/ipfs/") {
                this.setState({
                    nft: session.assets[0].params,
                    nftUrl: "https://ipfs.algonode.xyz/ipfs/" + session.assets[0].params.url.slice(21),
                })
            }
            else {
                this.setState({
                    nft: session.assets[0].params,
                    nftUrl: "https://ipfs.algonode.xyz/ipfs/" + session.assets[0].params.url.slice(7),
                })
        
            }

            const indexerClient = new algosdk.Indexer('', 'https://mainnet-idx.algonode.cloud', 443)

            const assetBalances = await indexerClient.lookupAssetBalances(this.props.nftId).do();

            console.log(assetBalances)

            assetBalances.balances.forEach(async (balance) => {
                if (balance.amount == 1) {
                    const response = await fetch('https://api.nf.domains/nfd/lookup?address=' + balance.address, {
                        method: 'GET',
                        headers: {},
                    });
                    const data = await response.json();
                    console.log(data)
                    this.setState({
                        assetNFD: data[String(balance.address)].name
                    })
                }
            })

    
    
            const token = {
                'X-API-Key': process.env.indexerKey
            }
      
            const client = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', 443)

            try {
                let assetbox = await client.getApplicationBoxByName(this.state.contract, algosdk.encodeUint64(this.props.nftId)).do();
                var length = assetbox.value.length;
        
                let buffer = Buffer.from(assetbox.value);
                var result = buffer.readUIntBE(0, length);
        
        
                this.setState({
                    cashRound: result
                })

            }
            catch {

            }
    
      
    
           
    
        }
        }
        catch (error) {
            this.props.sendDiscordMessage(error, "Display Mutant Fetch")
          }

        
          
      }

      




    render() {

    
        if (this.state.nft) {

            if (this.props.contestant) {

                console.log(this.state.assetNFD)

                return (
                    <div style={{position: "relative"}}>
                    
                        <div style={{display: "grid", borderRadius: 15, padding: 10}}  >
                            <img style={{width: "100%", borderRadius: 50, padding: 20, paddingBottom: 10}} src={this.state.nftUrl} /> 
                            <Typography color="secondary" align="center" variant="caption"> {this.state.nft.name} </Typography>     
                            <Typography color="secondary" align="center" variant="caption"> {this.state.assetNFD} </Typography>     

                        </div>

                    
                   
                   

                    
                    </div>
        
                )

            }

            else {
                return (
                    <div style={{position: "relative"}}>
                    
                        <div style={{display: "grid", borderRadius: 15, padding: 10}}  >
                            <img style={{width: "100%", borderRadius: 50, padding: 20, paddingBottom: 10}} src={this.state.nftUrl} /> 
                            <Typography color="secondary" align="center" variant="caption"> {this.state.nft.name} </Typography>     
                        </div>

                    
                   
                   

                    
                    </div>
        
                )
            }
            
                
            
            
        }

        else {
            return (
                <div>                   
                </div>
    
            )
        }
       
        
    }
    
}