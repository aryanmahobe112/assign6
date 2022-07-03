const uuid = require('uuid')
const { findBank, allBanks } = require('../data')
const Account = require('./Account')

function createAccount(bankAbbriviation) {
    if(typeof(bankAbbriviation)!='string'){
        console.log("Bank abbreviation passed is not a string")
        return
    }
    let [isBankPresent, indexOfBankToFind] = findBank(bankAbbriviation)
    if (!isBankPresent) {
        return("Bank not Found")        
    }
    return new Account(allBanks[indexOfBankToFind])
}

class Customer {
    constructor(firstName, lastName) {
        this.firstName = firstName
        this.lastName = lastName
        this.customerId = uuid.v4()
        this.totalBalance = 0
        this.accounts = []
    }

    findAccount(bankAbbriviation) {
        let isAccountPresent = false
        let indexOfFoundAccount = -1
        for (const i in this.accounts) {
            if(this.accounts[i].bank.abbriviation == bankAbbriviation){
                isAccountPresent = true
                indexOfFoundAccount = i
                break
            }
        }
        return [isAccountPresent,indexOfFoundAccount]
    }

    createAccount(bankAbbriviation) {
        let [isAccountPresent,indexOfFoundAccount] = this.findAccount(bankAbbriviation)
        if(isAccountPresent){
            return[400, "Account already present in this bank"]
        }

        let newAccount = createAccount(bankAbbriviation)
        if(typeof(newAccount)=='string'){
            return [404, newAccount]
        }

        this.accounts.push(newAccount)
        this.updateTotalBalance()
        return[201, "Account created successfully"]
    }

    updateTotalBalance(){
        this.totalBalance = 0
        for(let i in this.accounts){
            this.totalBalance += this.accounts[i].balance
        }
        return
    }

    displayBalance(){
        let balanceDetail = this.firstName + " " + this.lastName + " Bank Accounts\n"
        for(let i in this.accounts){
            balanceDetail += this.accounts[i].displayBalance()
        }
        this.updateTotalBalance()
        balanceDetail += this.firstName + " " + this.lastName + " Total Balance = Rs. " + this.totalBalance
        return balanceDetail
    }

    deposit(bankAbbriviation, depositAmount){
        let [isAccountPresent,indexOfFoundAccount] = this.findAccount(bankAbbriviation)

        if(isAccountPresent==false){
            return[404, "You do not have an account in this bank"]
        }

        this.accounts[indexOfFoundAccount].balance += depositAmount
        this.updateTotalBalance()
        this.displayBalance()
        return[200, "Deposit successful"]
    }

    withdraw(bankAbbriviation, withdrawAmount){
        let [isAccountPresent,indexOfFoundAccount] = this.findAccount(bankAbbriviation)

        if(isAccountPresent==false){
            return[404, "You do not have an account in this bank"]
        }

        if(!this.accounts[indexOfFoundAccount].isSufficientBalance(withdrawAmount)){
            return[406, "You do not have sufficient balance"]
        }

        this.accounts[indexOfFoundAccount].balance -= withdrawAmount
        this.updateTotalBalance()
        this.displayBalance()
        return [200, "Withdraw successful"]
    }

    transfer(debitBankAbbriviation, creditCustomer, creditBankAbbriviation, transferAmount){
        if(typeof(debitBankAbbriviation)!='string'){
            console.log("Debit Bank Abbreviation passed is not a string")
            return
        }
        if(!(creditCustomer instanceof Customer)){
            console.log("Credit Customer is not an instance of Customer")
            return
        }
        if(typeof(creditBankAbbriviation)!='string'){
            console.log("Credit Bank Abbreviation passed is not a string")
            return
        }
        if(typeof(transferAmount)!='number'){
            console.log("Transfer Amount passed is not a number")
            return
        }

        // let [isDebitAccountPresent, indexOfFoundDebitAccount] = this.findAccount(debitBankAbbriviation)

        // if(isDebitAccountPresent==false){
        //     console.log("Debit Account does not exist")
        //     return
        // }

        // let [isCreditAccountPresent, indexOfFoundCreditAccount] = creditCustomer.findAccount(creditBankAbbriviation)

        // if(isCreditAccountPresent==false){
        //     console.log("Credit Account does not exist")
        //     return
        // }

        // if(!this.accounts[indexOfFoundDebitAccount].isSufficientBalance(transferAmount)){
        //     console.log("You do not have sufficient balance")
        //     return
        // }

        // this.accounts[indexOfFoundDebitAccount].balance -= transferAmount
        // this.updateTotalBalance()
        // this.displayBalance()

        // creditCustomer.accounts[indexOfFoundCreditAccount].balance += transferAmount
        // creditCustomer.updateTotalBalance()
        // creditCustomer.displayBalance()

        let [statusCode, statusMessage] = this.withdraw(debitBankAbbriviation, transferAmount)
        if(statusCode==406 || statusCode==404){
            return [statusCode, statusMessage]
        }
        [statusCode, statusMessage] = creditCustomer.deposit(creditBankAbbriviation, transferAmount)
        if(statusCode==404){
            return [statusCode, statusMessage]
        }
        return [200, "Transfer duccessful"]
    }

    selfTransfer(debitBankAbbriviation, creditBankAbbriviation, transferAmount){
        return this.transfer(debitBankAbbriviation, this, creditBankAbbriviation, transferAmount)
    }
}

module.exports = Customer