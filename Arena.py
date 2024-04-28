from pyteal import *


def approval_program():

    _ascii_zero = 48
    _ascii_nine = _ascii_zero + 9
    ascii_zero = Int(_ascii_zero)
    ascii_nine = Int(_ascii_nine)

    @Subroutine(TealType.uint64)
    def ascii_to_int(arg):
        """ascii_to_int converts the integer representing a character in ascii to the actual integer it represents
        Args:
            arg: uint64 in the range 48-57 that is to be converted to an integer
        Returns:
            uint64 that is the value the ascii character passed in represents
        """
        return Seq(Assert(arg >= ascii_zero), Assert(arg <= ascii_nine), arg - ascii_zero)

    @Subroutine(TealType.uint64)
    def pow10(x) -> Expr:
        """
        Returns 10^x, useful for things like total supply of an asset
        """
        return Exp(Int(10), x)

    @Subroutine(TealType.uint64)
    def atoi(a):
        """atoi converts a byte string representing a number to the integer value it represents"""
        return If(
            Len(a) > Int(0),
            (ascii_to_int(GetByte(a, Int(0))) * pow10(Len(a) - Int(1)))
            + atoi(Substring(a, Int(1), Len(a))),
            Int(0),
        )

    @Subroutine(TealType.bytes)
    def itoa(i):
        """itoa converts an integer to the ascii byte string it represents"""
        return If(
            i == Int(0),
            Bytes("0"),
            Concat(
                If(i / Int(10) > Int(0), itoa(i / Int(10)), Bytes("")),
                int_to_ascii(i % Int(10)),
            ),
        )

    @Subroutine(TealType.bytes)
    def int_to_ascii(arg):
        """int_to_ascii converts an integer to the ascii byte that represents it"""
        return Extract(Bytes("0123456789"), arg, Int(1))
    
    # don't need any real fancy initialization
    handle_creation = Return(
        Seq(
            App.globalPut(Bytes("battleNum"), Int(1)),
            App.globalPut(Bytes("round"), Txn.first_valid()),

            Int(1)
        )
    )

    i = ScratchVar(TealType.uint64)

    
    fight = Seq(
        contents := App.box_get(Concat(Itob(Txn.assets[0]), Bytes(">"), Itob(App.globalGet(Bytes("battleNum"))))),
        If(contents.hasValue(),
           Seq(
               Assert(App.box_delete(Concat(Itob(Txn.assets[0]), Bytes(">"), Itob(App.globalGet(Bytes("battleNum")))))),
               App.box_put(Concat(Itob(Txn.assets[0]), Bytes(">"), Itob(App.globalGet(Bytes("battleNum")))), Txn.sender())
           ),
           Seq(
                App.box_put(Concat(Itob(Txn.assets[0]), Bytes(">"), Itob(App.globalGet(Bytes("battleNum")))), Txn.sender())
        )),
        For(i.store(Int(1)), i.load() < Txn.application_args.length(), i.store(i.load() + Int(1))).Do(Seq(
            Assert(App.box_delete(Concat(Itob(Txn.assets[i.load()]), Bytes(">"), Txn.application_args[i.load()])))
         )),
        Int(1)
    )

    reward = Seq(
        Assert(Txn.sender() == Addr("LJGQE6GXIVKS4OGW4WCP7JXYJHHK5E4DNXDCOOQMLC4I57BNQR3FTUTSYA")),
        Assert(Txn.first_valid() >= Add(App.globalGet(Bytes("round")), Int(732000))),
        contents := App.box_get(Txn.accounts[1]),
        If(contents.hasValue(),
           Seq(
               Assert(App.box_delete(Txn.accounts[1])),
               App.box_put(Txn.accounts[1], Txn.sender())
           ),
           Seq(
                App.box_put(Txn.accounts[1], Txn.sender())
        )),
        For(i.store(Int(0)), i.load() < Txn.assets.length(), i.store(i.load() + Int(1))).Do(Seq(
            If(App.localGet(Txn.accounts[1], Itob(Txn.assets[i.load()])),
               App.localPut(Txn.accounts[1], Itob(Txn.assets[i.load()]), Add(Btoi(Txn.application_args[Add(i.load(), Int(1))]), App.localGet(Txn.accounts[1], Itob(Txn.assets[i.load()])))),
               App.localPut(Txn.accounts[1], Itob(Txn.assets[i.load()]), Btoi(Txn.application_args[Add(i.load(), Int(1))]))
            )
         )),
        App.globalPut(Bytes("battleNum"), Add(App.globalGet(Bytes("battleNum")), Int(1))),
        App.globalPut(Bytes("round"), Txn.first_valid()),
         Int(1)
    )

    claim = Seq(
        Assert(App.box_delete(Txn.sender())),
        For(i.store(Int(0)), i.load() < Txn.assets.length(), i.store(i.load() + Int(1))).Do(Seq(
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: Txn.assets[i.load()],
                TxnField.asset_receiver: Txn.sender(),
                TxnField.asset_amount: App.localGet(Txn.sender(), Itob(Txn.assets[i.load()])),
            }),
            InnerTxnBuilder.Submit(),
            App.localDel(Txn.sender(), Itob(Txn.assets[i.load()]))
         )),
        Int(1)
    )

    load = Seq(
        App.globalPut(Bytes("round"), Txn.first_valid()),
        Assert(Txn.sender() == Addr("LJGQE6GXIVKS4OGW4WCP7JXYJHHK5E4DNXDCOOQMLC4I57BNQR3FTUTSYA")),
        For(i.store(Int(0)), i.load() < Txn.assets.length(), i.store(i.load() + Int(1))).Do(Seq(
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: Txn.assets[i.load()],
                TxnField.asset_receiver: Global.current_application_address(),
                TxnField.asset_amount: Int(0),
            }),
            InnerTxnBuilder.Submit(),
         )),
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
        [Txn.application_args[0] == Bytes("fight"), Return(fight)],
        [Txn.application_args[0] == Bytes("reward"), Return(reward)],
        [Txn.application_args[0] == Bytes("claim"), Return(claim)],
        [Txn.application_args[0] == Bytes("load"), Return(load)],


        






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
        f.write(compiled)