from pyteal import *


def approval_program():
    
    # don't need any real fancy initialization
    handle_creation = Return(Int(1))    
    
    addAsset = Seq(
        contents := App.box_get(Itob(Txn.assets[0])),
        Assert(Not(contents.hasValue())),
        App.box_put(Itob(Txn.assets[0]), Itob(Txn.first_valid())),
        Int(1)
    )

    i = ScratchVar(TealType.uint64) 


    pullRewards = Seq(
        sender := AssetHolding.balance(Txn.sender(), Txn.assets[0]),
        Assert(sender.hasValue()),
        Assert(sender.value() == Int(1)),
        contents := App.box_get(Itob(Txn.assets[0])),
        Assert(contents.hasValue()),
        creator := AssetParam.creator(Txn.assets[0]),
        Cond(
        [creator.value() == Addr("4FPA3KPLZPKMTQ7ER3XLFCXZX46W2FD2WVFDRZULGLKNGURWDX7MYDB4HA"), i.store(Int(10))],
        [creator.value() == Addr("I4BY7MKHRXW2JNBMEHP5NC4GTD55W6TQW5LIYSQOWL3RKUD6MBZHYM52DM"), i.store(Int(5))],
        [creator.value() == Addr("AOKWUQSOVXQSEKFPMSDZ273PMERUOY4OF7CFCKCXZR3565BT6XOSWHLI3M"), i.store(Int(3))],
        [creator.value() == Addr("E25YOES4G3SBKVJ3UAUDCP5RDU7RYBB6MAF4Y3XPLGGZNS3E6XI6H6STK4"), i.store(Int(10))]
        ),
        If(Div(Minus(Txn.first_valid(), Btoi(contents.value())), Int(159000)) >= Int(1),
           Seq(
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: Txn.assets[1],
                TxnField.asset_receiver: Txn.sender(),
                TxnField.asset_amount: Mul(Div(Minus(Txn.first_valid(), Btoi(contents.value())), Int(159000)), i.load())
            }),
            InnerTxnBuilder.Submit(),
            Assert(App.box_delete(Itob(Txn.assets[0]))),
            App.box_put(Itob(Txn.assets[0]), Itob(Minus(Txn.first_valid(), Mod(Minus(Txn.first_valid(), Btoi(contents.value())), Int(159000)))))
           )),
           Int(1)
    )

    delbox = Seq(
        Assert(Txn.sender() == Addr("NSPLIQLVYV7US34UDYGYPZD7QGSHWND7AWSWPD4FTLRGW5IF2P2R3IF3EQ")),
        Assert(App.box_delete(Itob(Txn.assets[0]))),
        Int(1)
    )

    opt = Seq(
        Assert(Txn.sender() == Addr("NSPLIQLVYV7US34UDYGYPZD7QGSHWND7AWSWPD4FTLRGW5IF2P2R3IF3EQ")),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.xfer_asset: Txn.assets[0],
            TxnField.asset_receiver: Global.current_application_address(),
            TxnField.asset_amount: Int(0),
        }),
        InnerTxnBuilder.Submit(),
        Int(1)
    )


    # doesn't need anyone to opt in
    handle_optin = Return(Int(1))

    # only the creator can closeout the contract
    handle_closeout = Return(Int(1))

    # nobody can update the contract
    handle_updateapp =  Return(Txn.sender() == Global.creator_address())

    # only creator can delete the contract
    handle_deleteapp = Return(Txn.sender() == Global.creator_address())


    # handle the types of application calls
    program = Cond(
        [Txn.application_id() == Int(0), handle_creation],
        [Txn.on_completion() == OnComplete.OptIn, handle_optin],
        [Txn.on_completion() == OnComplete.CloseOut, handle_closeout],
        [Txn.on_completion() == OnComplete.UpdateApplication, handle_updateapp],
        [Txn.on_completion() == OnComplete.DeleteApplication, handle_deleteapp],
        [Txn.application_args[0] == Bytes("addAsset"), Return(addAsset)],
        [Txn.application_args[0] == Bytes("pullRewards"), Return(pullRewards)],
        [Txn.application_args[0] == Bytes("delbox"), Return(delbox)],
        [Txn.application_args[0] == Bytes("opt"), Return(opt)]






    )
    
    return program

# let clear state happen
def clear_state_program():
    program = Return(Int(1))
    return program
    


if __name__ == "__main__":
    with open("vote_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=8)
        f.write(compiled)

    with open("vote_clear_state.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=8)