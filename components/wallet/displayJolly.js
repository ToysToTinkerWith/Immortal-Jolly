import React from "react"

import algosdk, { seedFromMnemonic } from "algosdk"

import { Typography, Button, TextField, Grid } from "@mui/material"

import MyAlgo from '@randlabs/myalgo-connect';


export default class DisplayJolly extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            nft: null,
            nftUrl: null,
            svg: null,
            price: "",
            message: "",
            contract: 1115541498,
            cashRound: 0
            
        };
        this.removeElement = this.removeElement.bind(this)

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
    
            if(session.assets[0].params["unit-name"].substring(0, 2) == "80") {
                if (session.assets[0].params.url[7] == "b") {
                    this.setState({
                        nft: session.assets[0].params,
                        nftUrl: "https://ipfs.algonode.xyz/ipfs/" + session.assets[0].params.url.slice(7),
                    })
                }
                else {
                    fetch("https://gateway.pinata.cloud/ipfs/" + session.assets[0].params.url.slice(7), {
                        method: 'get'
                    }).then(async (response) => {
                        let data = await response.json()
                        this.setState({
                            nft: session.assets[0].params,
                            nftUrl: "https://ipfs.algonode.xyz/ipfs/" + data.image.slice(7),
                        })

                    }).catch(function(err) {
                        // Error :(
                    });
                }
                    

            }
            else if (session.assets[0].params.url.slice(0, 21) == "https://ipfs.io/ipfs/") {
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
            this.props.sendDiscordMessage(error, "Display Jolly Fetch")
          }

        
          
      }

      


      removeElement() {

        let newAssets = []
        this.props.cashAssets.forEach((asset) => {
            if (asset.assetId != this.props.nftId) {
                newAssets.push(asset)
            }
        })

        this.props.setCashAssets(newAssets)

      }
      


    render() {

        let sel = false

        this.props.cashAssets.forEach((asset) => {
            if(asset.assetId == this.props.nftId) {
                sel = asset
            }
        })

    
        if (this.state.nft) {

            if (this.props.display == "collection") {
                return (
                    <div style={{position: "relative"}}>
                    
                    <div style={{display: "grid", borderRadius: 15}} >
                        <img style={{width: "100%", borderRadius: 50, padding: 20, paddingBottom: 10}} src={this.state.nftUrl} /> 
                        <Typography color="primary" align="center" variant="caption"> {this.state.nft.name} </Typography>     
                    </div>
        
                    </div>
        
                )
            }
            
                return (
                    <div style={{position: "relative"}}>
                    
                        <div style={{display: "grid", borderRadius: 15}}  >
                            <img style={{width: "100%", borderRadius: 50, padding: 20, paddingBottom: 10}} src={this.state.nftUrl} /> 
                            <Typography color="primary" align="center" variant="caption"> {this.state.nft.name} </Typography>     
                        </div>

                        <div style={{position: "absolute", bottom: 120, left: 40, backgroundColor: "#FFFFFF", paddingRight: 5, paddingLeft: 5, borderRadius: 5}}>
                            <Typography color="primary" align="center" variant="caption" > {this.state.cashRound ? Math.floor(((this.props.round - this.state.cashRound) / 159000)) * this.props.reward : 0} </Typography>     
                            <img style={{ width: 35, height: "auto", borderRadius: 5}} src={"cursedgold.png"} />
                        </div>


                    
                    <div>
                    

                        {this.props.round && this.state.cashRound ?
                        <Typography color="primary"  align="center" variant="caption" style={{display: "grid", margin: 10}}> Staking: {((this.props.round - this.state.cashRound) * 3.8 / 60 / 60 / 24).toFixed(2)} days </Typography>
                        : 
                        <Typography align="center" variant="caption" style={{display: "grid", margin: 10, color: "#FF3838"}} > Not Staking </Typography>
                        }

                        <Grid container align="center" spacing={0} >
                            <Grid item xs={1} sm={1}>

                            </Grid>
                            <Grid item xs={5} sm={5}>
                                {this.props.round && this.state.cashRound && Math.floor(((this.props.round - this.state.cashRound) / 159000)) * this.props.reward > 0 ?
                                <Button variant="contained" color="secondary" 
                                style={{backgroundColor: sel && sel.option == "cash" ? "#7FF07D" : "#ffffff"}}
                                onClick={() => sel && sel.option == "cash" ? 
                                    this.removeElement()
                                    :
                                    this.props.setCashAssets([...this.props.cashAssets, {assetId: this.props.nftId, reward: Math.floor(((this.props.round - this.state.cashRound) / 159000)) * this.props.reward, option: "cash"}])}
                                >
                                Claim
                                </Button>
                                :
                                <Button variant="contained" disabled color="secondary" 
                                
                                >
                                Claim
                                </Button> 
                                }
                            </Grid>
                            <Grid item xs={5} sm={5}>
                                {this.props.round && this.state.cashRound ?
                                <Button variant="contained" color="secondary" 
                                style={{backgroundColor: sel && sel.option == "unstake" ? "#7FF07D" : "#ffffff"}}
                                onClick={() => sel && sel.option == "unstake" ?
                                    this.removeElement()
                                    :
                                    this.props.setCashAssets([...this.props.cashAssets, {assetId: this.props.nftId, reward: 0, option: "unstake"}])}
                                >
                                Unstake

                                </Button>
                                :
                                <Button variant="contained" color="secondary" 
                                style={{backgroundColor: sel && sel.option == "stake" ? "#7FF07D" : "#ffffff"}}
                                onClick={() => sel && sel.option == "stake" ?
                                    this.removeElement()
                                    :
                                    this.props.setCashAssets([...this.props.cashAssets, {assetId: this.props.nftId, reward: 0, option: "stake"}])}
                                >
                                Stake

                                </Button>
                                }   
                            </Grid>
                            <Grid item xs={1} sm={1}>
                                
                            </Grid>
                        </Grid>

                        
                        

                        
                    </div>
                   

                    
                    </div>
        
                )
            
            
        }

        else {
            return (
                <div>                   
                </div>
    
            )
        }
       
        
    }
    
}