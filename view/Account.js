const uuid = require('uuid')

class Account {
    constructor(bank) {
        this.accountNo = uuid.v4()
        this.bank = bank
        this.balance = 1000
    }

    displayBalance(){
        return("Balance in "+this.bank.abbriviation+" account = Rs. "+this.balance+"\n")
    }

    isSufficientBalance(amount){
        return(this.balance >= amount)
    }
}

module.exports = Account