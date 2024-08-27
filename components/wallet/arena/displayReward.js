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

                console.log(session.assets[0])
                
                // Check if it's a special case with a hardcoded image
                if (this.props.nftId === 877451592) {
                    nftUrl = "/cursedgold.png";
                } 
                 
                else if(session.assets[0].params.url == "template-ipfs://{ipfscid:1:raw:reserve:sha2-256}") {
                    const addr = algosdk.decodeAddress(session.assets[0].params.reserve)

                    const mhdigest = digest.create(mfsha2.sha256.code, addr.publicKey)

                    const ocid = CID.create(1, 0x55, mhdigest)

                    console.log(ocid.toString())


                    fetch("https://gateway.pinata.cloud/ipfs/" + ocid.toString(), {
                        method: 'get'
                    }).then(async (response) => {
                        let data = await response.json()
                        
                            this.setState({
                                nft: session.assets[0].params,
                                nftUrl: "https://ipfs.algonode.xyz/ipfs/" + data.image.slice(7) + "",
                            })
                        

                    }).catch(function(err) {
                        // Error :(
                    });
                    

                  

                }
                else if(session.assets[0].params.url == "template-ipfs://{ipfscid:0:dag-pb:reserve:sha2-256}") {
                    const addr = algosdk.decodeAddress(session.assets[0].params.reserve)

                    const mhdigest = digest.create(mfsha2.sha256.code, addr.publicKey)

                    const ocid = CID.create(0, 0x70, mhdigest)

                    console.log(ocid.toString())

                    if (ocid.toString() == "bafkreifewahcgqc6u5r6cqsmwmwcyk7socld7r3fgzqg3vhlhn2soljdwq") {

                    fetch("https://gateway.pinata.cloud/ipfs/" + ocid.toString(), {
                        method: 'get'
                    }).then(async (response) => {
                        let data = await response.json()
                        
                            this.setState({
                                nft: session.assets[0].params,
                                nftUrl: "https://ipfs.algonode.xyz/ipfs/" + data.image.slice(7) + "",
                            })
                        

                    }).catch(function(err) {
                        // Error :(
                    });
                    }

                    else {
                        console.log("https://ipfs.algonode.xyz/ipfs/" + ocid.toString())
                        nftUrl = "https://ipfs.algonode.xyz/ipfs/" + ocid.toString()
                    }

                }
                else {
                    const ipfsPrefix = 'https://ipfs.algonode.xyz/ipfs/';
                    let urlPath = session.assets[0].params.url;
    
                    // Check if the urlPath includes a domain, and strip it
                    if (urlPath.includes('ipfs.io/ipfs/')) {
                        urlPath = urlPath.split('ipfs.io/ipfs/')[1];
                    }

                    if (urlPath.includes('ipfs://')) {
                        urlPath = urlPath.split('ipfs://')[1];
                    }
    
                    nftUrl = `${ipfsPrefix}${urlPath}`;
                }
    
                this.setState({
                    nft: session.assets[0].params,
                    nftUrl: nftUrl,
                });
    
            }
        } catch (error) {
            this.props.sendDiscordMessage(error.toString(), "Display Reward Fetch");
        }
    }
    
      
      




    render() {

    
        if (this.state.nft) {
            
                return (
                    
                        <div className="display-reward"  >
                            <img className="reward-img" src={this.state.nftUrl} /> 
                            <Typography color="secondary" align="center" variant="caption" style={{margin: "10px 0"}}> {this.props.amount > 1 ? this.props.amount : null} {this.state.nft.name} </Typography> 

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