import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet'

import { Button, Typography, Modal } from '@mui/material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';


export default function Connect(props) {
  const { providers, activeAccount } = useWallet()

  const [open, setOpen] = useState(false)

  React.useEffect(() => {
    if (props.open) {
      setOpen(true);
    }
    
})

  // Map through the providers.
  // Render account information and "connect", "set active", and "disconnect" buttons.
  // Finally, map through the `accounts` property to render a dropdown for each connected account.
  return (
    <div>
    {props.activeAccount ?
      <Button
      variant="text"
      style={{position: "relative", float: "right", margin: 10}}
      onClick={() => [setOpen(!open), props.setPage("map")]} 
      >
        <Typography > Connected </Typography>
    </Button>
      :
      <Button
        variant="text"
        style={{position: "relative", float: "right", margin: 10}}

        onClick={() => [setOpen(!open), props.setPage("map")]}
        >
          <Typography > Connect Wallet </Typography>
      </Button>
      }
    <Modal
    open={open}
    onClose={() => [setOpen(false), props.setPage("map")]}
    onClick={() => [setOpen(false), props.setPage("map")]}
    style={{position: "absolute", top: "0", right: "0"}}
    >
    <div>
      
      
  <div style={{position: "absolute", zIndex: 6, backgroundColor: "white", right: 0, border: "1px solid black", borderRadius: 15}}>
  {providers?.map((provider) => (
    <div key={'provider-' + provider.metadata.id} style={{margin: 30}}>
      <Typography >
        <img width={30} height={30} style={{margin: 10, color: "#FAFAFA", borderRadius: 15}} alt="" src={provider.metadata.icon} />
        {provider.metadata.name} {provider.isActive && '[active]'}
      </Typography>
      <div style={{padding: 20}}>
        <hr />
        <Button  variant="outlined" style={{borderRadius: 15, margin: 10}} onClick={provider.connect} disabled={provider.isConnected}>
          Connect
        </Button>
        <Button style={{margin: 10}} onClick={provider.disconnect} disabled={!provider.isConnected}>
          Disconnect
        </Button>
        <Button
        style={{margin: 10}}
          onClick={provider.setActiveProvider}
          disabled={!provider.isConnected || provider.isActive}
        >
          Set Active
        </Button>
        <div>
          {provider.isActive && provider.accounts.length && activeAccount && (
            <div
              value={activeAccount?.address}
              onChange={(e) => provider.setActiveAccount(e.target.value)}
            >
              <Button onClick={() => navigator.clipboard.writeText(activeAccount.address)}>
            <ContentCopyIcon color="primary" />
            </Button>
                  {activeAccount.address.substring(0,10)}
            </div>
          )}
        </div>
      </div>
    </div>
  ))}
</div>

  </div>
   
  </Modal>
  </div>
    
  )
}