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
                const response = await fetch('/api/getNft', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nftId: this.props.nftId })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const session = await response.json();
                let nftUrl = "";
                
                // Check if it's a special case with a hardcoded image
                if (this.props.nftId === 877451592) {
                    nftUrl = "/cursedgold.png";
                } else if(session.assets[0].params["unit-name"] === "MUSHI27") {
                    nftUrl = "https://ipfs.algonode.xyz/ipfs/QmfMC91vxxffd5yxeCsXHQHbxAvkc2casgrzEmUMKcA25V";
                } else {
                    const ipfsPrefix = 'https://ipfs.algonode.xyz/ipfs/';
                    let urlPath = session.assets[0].params.url;
    
                    // Check if the urlPath includes a domain, and strip it
                    if (urlPath.includes('ipfs.io/ipfs/')) {
                        urlPath = urlPath.split('ipfs.io/ipfs/')[1];
                    }
    
                    nftUrl = `${ipfsPrefix}${urlPath}`;
                }
    
                console.log(nftUrl); // Debugging to see the final URL
                this.setState({
                    nft: session.assets[0].params,
                    nftUrl: nftUrl,
                });
    
            }
        } catch (error) {
            console.error('Error fetching NFT details:', error);
            this.props.sendDiscordMessage(error.toString(), "Display Reward Fetch");
        }
    }
    
      
      




    render() {

    
        if (this.state.nft) {
            
                return (
                    
                        <div className="display-reward"  >
                            <img className="reward-img" src={this.state.nftUrl} /> 
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