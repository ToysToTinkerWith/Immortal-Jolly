import React from "react"

import algosdk, { seedFromMnemonic } from "algosdk"

import { Typography, Button, TextField, Grid } from "@mui/material"

import { CID } from 'multiformats/cid'


import * as mfsha2 from 'multiformats/hashes/sha2'
import * as digest from 'multiformats/hashes/digest'


export default class DisplayReward extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            nft: null,
            nftUrl: null,
        
            
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

            let nftUrl

            if (this.props.nftId == 877451592) {
                nftUrl = "/cursedgold.png"
            }
            else if (this.props.nftId == 877451592) {
                nftUrl = "/cursedgold.png"
            }
            else if(session.assets[0].params["unit-name"] == "MUSHI27") {
                nftUrl = "https://ipfs.algonode.xyz/ipfs/" + "QmfMC91vxxffd5yxeCsXHQHbxAvkc2casgrzEmUMKcA25V"

            }
            else if(session.assets[0].params.url.substring(0,13) == "template-ipfs") {

                const addr = algosdk.decodeAddress(session.assets[0].params.reserve)

                const mhdigest = digest.create(mfsha2.sha256.code, addr.publicKey)

                const cid = CID.create(1, 0x55, mhdigest)

                await fetch("https://ipfs.algonode.xyz/ipfs/" + cid.toString())
                .then(async (response) => {
                let hoomenData = await response.json()
                let ipfs = hoomenData.image.substring(7)


                nftUrl = "https://ipfs.algonode.xyz/ipfs/" + ipfs

                
                })


            }
            else {
                nftUrl = "https://ipfs.algonode.xyz/ipfs/" + session.assets[0].params.url.slice(7)
            }

            console.log(nftUrl)
    
            
            this.setState({
                nft: session.assets[0].params,
                nftUrl: nftUrl,
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
            this.props.sendDiscordMessage(error, "Display Reward Fetch")
          }

        
          
      }

      




    render() {

    
        if (this.state.nft) {
            
                return (
                    
                        <div className="display-reward" style={{borderRadius: 15}}  >
                            <img style={{borderRadius: 30, padding: 20, paddingBottom: 10}} src={this.state.nftUrl} /> 
                            <Typography color="secondary" align="center" variant="caption"> {this.props.amount > 1 ? this.props.amount : null} {this.state.nft.name} </Typography> 

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