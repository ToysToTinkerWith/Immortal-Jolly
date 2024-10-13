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

            assetBalances.balances.forEach(async (balance) => {
                if (balance.amount == 1) {
                    const url = 'https://api.nf.domains/nfd/lookup?address=' + balance.address;
            
                    try {
                        const response = await fetch(url, {
                            method: 'GET',
                            headers: {},
                        });
            
                        if (!response.ok) {  // Check if the response was successful
                            return;  // Exit the function if response is not OK
                        }
            
                        const text = await response.text();  // First get the response as text
            
                        try {
                            const data = JSON.parse(text);  // Try parsing the text as JSON
            
                            if (data && data[balance.address]) {  // Check if data is valid and contains expected key
                                this.setState({
                                    assetNFD: data[balance.address].name  // Update state with the name
                                });
                            } else {
                            }
                        } catch (error) {
                        }
                    } catch (error) {
                    }
                }
            });            

    
    
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

                return (
                    <div style={{position: "relative"}}>
                        <div className="contestants-item" >
                            <img className="contestant-img" src={this.state.nftUrl} /> 
                            <div className="contestant-text">
                                <Typography className="asset-name" color="secondary" align="center" variant="caption"> {this.state.nft.name} </Typography>     
                                <Typography color="secondary" align="center" variant="caption"> {this.state.assetNFD} </Typography>   
                            </div>
                        </div>
                    </div>
                  
                )

            }

            else {
                return (
                    <div style={{position: "relative", display: "flex", flexDirection: "column", alignItems: "center"}}>
                    
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center", margin: "0 10px"}} >
                            <img className="holder-img" style={{width: "100%", borderRadius: 25}} src={this.state.nftUrl} /> 
                            <Typography color="secondary" align="center" variant="caption" style={{margin: "10px 0"}}> {this.state.nft.name} </Typography>     
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