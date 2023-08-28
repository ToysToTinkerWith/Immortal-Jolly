import React from "react"

import algosdk, { seedFromMnemonic } from "algosdk"

import { Typography, Button, TextField } from "@mui/material"

import MyAlgo from '@randlabs/myalgo-connect';

import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();


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

        peraWallet.reconnectSession()
        .catch((error) => {
          // You MUST handle the reject because once the user closes the modal, peraWallet.connect() promise will be rejected.
          // For the async/await syntax you MUST use try/catch
          if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
              // log the necessary errors
              console.log(error)
          }
          });


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


        if (session.assets[0].params.creator == "I4BY7MKHRXW2JNBMEHP5NC4GTD55W6TQW5LIYSQOWL3RKUD6MBZHYM52DM") {

            this.setState({
                nft: session.assets[0].params,
                nftUrl: "https://gateway.pinata.cloud/ipfs/" + session.assets[0].params.url.slice(21),
            })

        }

        else {
            this.setState({
                nft: session.assets[0].params,
                nftUrl: "https://gateway.pinata.cloud/ipfs/" + session.assets[0].params.url.slice(7),
            })
        }

        const token = {
            'X-API-Key': process.env.indexerKey
        }
  
        const client = new algosdk.Algodv2(token, 'https://mainnet-algorand.api.purestake.io/ps2', '')

        try {

        let assetbox = await client.getApplicationBoxByName(this.state.contract, algosdk.encodeUint64(this.props.nftId)).do();
        console.log(assetbox)
        var length = assetbox.value.length;

        let buffer = Buffer.from(assetbox.value);
        var result = buffer.readUIntBE(0, length);

        console.log(result)

        this.setState({
            cashRound: result
        })

        }
        catch {

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
                sel = true
            }
        })

    
        if (this.state.nft) {

            if (this.props.display == "collection") {
                return (
                    <div style={{position: "relative"}}>
                    
                    <div style={{display: "block"}} onClick={() => this.props.setNft(this.props.nftId, this.props.price)} >
                        <Typography color="secondary" style={{position: "absolute", bottom: this.props.price ? 55 : 15, left: 15}} align="left" variant="caption"> {this.state.nft.name} </Typography>
                        <img style={{width: "100%", borderRadius: 5}} src={this.state.nftUrl} />

                    </div>

                    
                    </div>
        
                )
            }
            
                return (
                    <div style={{position: "relative"}}>
                    
                    <div style={{display: "block"}} onClick={() => this.props.setNft(this.props.nftId, this.props.price)} >
                        <Typography color="secondary" style={{position: "absolute", bottom: this.props.price ? 55 : 15, left: 15}} align="left" variant="caption"> {this.state.nft.name} </Typography>
                        <img style={{width: "100%", borderRadius: 5}} src={this.state.nftUrl} />      

                    </div>

                    {sel ?
                    <Button variant="contained" style={{position: "absolute", display: "grid", top: 20, right: 20, backgroundColor: "#A1FF9F"}} onClick={() => this.removeElement()}>
                    <Typography color="primary"  align="left" variant="caption"> {this.props.reward + "/wk"} </Typography>
                    

                    <img style={{width: 40, height: "auto", borderRadius: 5}} src={"cursedgold.png"} />

                    {this.props.round && this.state.cashRound && ((this.props.round - this.state.cashRound) > 159000)?

                    <Typography color="primary"  align="center" variant="caption" style={{display: "grid"}}> Col: {Math.floor(((this.props.round - this.state.cashRound) / 159000)) * this.props.reward} </Typography>
                    :
                    null
                    }

                    {this.props.round && this.state.cashRound ?
                    <Typography color="primary"  align="center" variant="caption" style={{display: "grid"}}> Wk: {((this.props.round - this.state.cashRound) * 3.8 / 60 / 60 / 24 / 7).toFixed(2)} </Typography>
                    :
                    <Typography color="primary"  align="center" variant="caption" style={{display: "grid"}}> Stake </Typography>
                    }

                    </Button>
                    :
                    <Button variant="contained" color="secondary" style={{position: "absolute", display: "grid", top: 20, right: 20}} 
                    onClick={this.state.cashRound ? 
                        Math.floor(((this.props.round - this.state.cashRound) / 159000)) > 0 ?
                        () => this.props.setCashAssets([...this.props.cashAssets, {assetId: this.props.nftId, reward: Math.floor(((this.props.round - this.state.cashRound) / 159000)) * this.props.reward, option: "cash"}])
                        :
                        null
                        :
                        () => this.props.setCashAssets([...this.props.cashAssets, {assetId: this.props.nftId, reward: 0, option: "stake"}])
                    }
                    >
                    <Typography color="primary"  align="left" variant="caption"> {this.props.reward + "/wk"} </Typography>
                    

                    <img style={{width: 40, height: "auto", borderRadius: 5}} src={"cursedgold.png"} />

                    {this.props.round && this.state.cashRound && ((this.props.round - this.state.cashRound) > 159000)?

                    <Typography color="primary"  align="center" variant="caption" style={{display: "grid"}}> Col: {Math.floor(((this.props.round - this.state.cashRound) / 159000)) * this.props.reward} </Typography>
                    :
                    null
                    }

                    {this.props.round && this.state.cashRound ?
                    <Typography color="primary"  align="center" variant="caption" style={{display: "grid"}}> Wk: {((this.props.round - this.state.cashRound) * 3.8 / 60 / 60 / 24 / 7).toFixed(2)} </Typography>
                    : 
                    <Typography color="primary"  align="center" variant="caption" style={{display: "grid"}} > Stake </Typography>
                    }

                    </Button>
                    }

                    
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