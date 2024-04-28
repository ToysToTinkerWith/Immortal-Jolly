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
                    const url = 'https://api.nf.domains/nfd/lookup?address=' + balance.address;
                    console.log("Fetching URL:", url);  // Log the URL being fetched
            
                    try {
                        const response = await fetch(url, {
                            method: 'GET',
                            headers: {},
                        });
            
                        if (!response.ok) {  // Check if the response was successful
                            console.error("Failed to fetch:", response.status, response.statusText);
                            return;  // Exit the function if response is not OK
                        }
            
                        const text = await response.text();  // First get the response as text
                        console.log("Raw response text:", text);  // Log the raw text response
            
                        try {
                            const data = JSON.parse(text);  // Try parsing the text as JSON
                            console.log("Parsed data:", data);  // Log the parsed data
            
                            if (data && data[balance.address]) {  // Check if data is valid and contains expected key
                                this.setState({
                                    assetNFD: data[balance.address].name  // Update state with the name
                                });
                            } else {
                                console.log("Data does not contain expected key:", balance.address);
                            }
                        } catch (error) {
                            console.error("Error parsing JSON:", error);  // Log parsing errors
                        }
                    } catch (error) {
                        console.error("Error fetching data:", error);  // Log fetch errors
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

                console.log(this.state.assetNFD)

                return (
                    <div style={{position: "relative"}}>
                        <div className="contestants-item" >
                            <img className="contestant-img" src={this.state.nftUrl} /> 
                            <Typography color="secondary" align="center" variant="caption" style={{padding: "5px"}}> {this.state.nft.name} </Typography>     
                            <Typography color="secondary" align="center" variant="caption" style={{padding: "5px"}}> {this.state.assetNFD} </Typography>     
                        </div>
                    </div>
                  
                )

            }

            else {
                return (
                    <div style={{position: "relative"}}>
                    
                        <div style={{display: "grid", borderRadius: 15, padding: 10}}  >
                            <img style={{width: "100%", borderRadius: 25}} src={this.state.nftUrl} /> 
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