let bankId = 0
let accountNo = 0
let customerId = 0
const AllBanks = []

class Bank {
    constructor(fullName, abbriviation) {
        if(typeof(fullName)!='string'){
            console.log("")
        }
        for (const i in AllBanks) {
            if (fullName == AllBanks[i].fullName || abbriviation == AllBanks[i].abbriviation) {
                console.log("Bank already Present")
                return
            }
        }

        this.fullName = fullName
        this.abbriviation = abbriviation
        this.bankId = ++bankId
        AllBanks.push(this)
    }
}



function findBank(bankAbbriviation) {
    let isBankPresent = false
    let indexOfBankToFind = -1
    for (const i in AllBanks) {
        if (AllBanks[i].abbriviation == bankAbbriviation) {
            isBankPresent = true
            indexOfBankToFind = i
            break
        }

    }
    return [isBankPresent, indexOfBankToFind]
}

function createAccount(bankAbbriviation) {
    if(typeof(bankAbbriviation)!='string'){
        console.log("Bank abbreviation passed is not a string")
        return
    }
    let [isBankPresent, indexOfBankToFind] = findBank(bankAbbriviation)
    if (!isBankPresent) {
        console.log("Bank not Found")
        
    }
    return new Account(AllBanks[indexOfBankToFind])
}




class Account {
    constructor(bank) {
        this.accountNo = ++accountNo
        this.bank = bank
        this.balance = 1000

    }

    displayBalance(){
        console.log("Balance in",this.bank.abbriviation,"account = Rs.",this.balance)
        return
    }

    isSufficientBalance(amount){
        return (this.balance >= amount)
    }
}





class Customer {
    constructor(firstName, lastName) {
        this.firstName = firstName
        this.lastName = lastName
        this.customerId = ++customerId
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
        if(typeof(bankAbbriviation)!='string'){
            console.log("Bank abbreviation passed is not a string")
            return
        }
        let [isAccountPresent,indexOfFoundAccount] = this.findAccount(bankAbbriviation)
        if(isAccountPresent==true){
            console.log("Account already present in this bank")
            return
        }
        let newAccount = createAccount(bankAbbriviation)
        this.accounts.push(newAccount)
        this.updateTotalBalance()
        return
    }

    updateTotalBalance(){
        this.totalBalance = 0
        for(let i in this.accounts){
            this.totalBalance += this.accounts[i].balance
        }
        return
    }

    displayBalance(){
        console.log(this.firstName,this.lastName,"Bank Accounts")
        for(let i in this.accounts){
            this.accounts[i].displayBalance()
        }
        this.updateTotalBalance()
        console.log(this.firstName,this.lastName,"Total Balance = Rs.",this.totalBalance)
        return
    }

    deposit(bankAbbriviation, depositAmount){
        if(typeof(bankAbbriviation)!='string'){
            console.log("Bank Abbreviation passed is not a string")
            return
        }
        if(typeof(depositAmount)!='number'){
            console.log("Deposit Amount passed is not a number")
            return
        }

        let [isAccountPresent,indexOfFoundAccount] = this.findAccount(bankAbbriviation)

        if(isAccountPresent==false){
            console.log("You do not have an account in this bank")
            return
        }

        this.accounts[indexOfFoundAccount].balance += depositAmount
        this.updateTotalBalance()
        this.displayBalance()
    }

    withdraw(bankAbbriviation, withdrawAmount){
        if(typeof(bankAbbriviation)!='string'){
            console.log("Bank Abbreviation passed is not a string")
            return
        }
        if(typeof(withdrawAmount)!='number'){
            console.log("Deposit Amount passed is not a number")
            return
        }

        let [isAccountPresent,indexOfFoundAccount] = this.findAccount(bankAbbriviation)

        if(isAccountPresent==false){
            console.log("You do not have an account in this bank")
            return
        }

        if(!this.accounts[indexOfFoundAccount].isSufficientBalance(withdrawAmount)){
            console.log("You do not have sufficient balance")
            return -1
        }

        this.accounts[indexOfFoundAccount].balance -= withdrawAmount
        this.updateTotalBalance()
        this.displayBalance()
        return
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

        let flag = this.withdraw(debitBankAbbriviation, transferAmount)
        if(flag==-1){
            return
        }
        creditCustomer.deposit(creditBankAbbriviation, transferAmount)

        return
    }

    selfTransfer(debitBankAbbriviation, creditBankAbbriviation, transferAmount){
        this.transfer(debitBankAbbriviation, this, creditBankAbbriviation, transferAmount)
        return
    }
}

let sbi = new Bank("State Bank of India", "SBI")
let ubi = new Bank("Union Bank of India", "UBI")

// console.log(sbi)
// console.log(ubi)

let aryan = new Customer("aryan", "mahobe")
let abc = new Customer("abc", "xyz")

// console.log(aryan)
// console.log(abc)

aryan.createAccount("SBI")
aryan.createAccount("UBI")
abc.createAccount("SBI")
abc.createAccount("UBI")
// abc.createAccount("NBI")

// console.log(aryan)
// console.log(abc)

// aryan.deposit("SBI",2000)
aryan.withdraw("SBI",1400)
// aryan.selfTransfer("SBI","UBI",500)
// aryan.transfer("SBI",abc,"SBI",200)
// aryan.displayBalance()
// abc.displayBalance()

