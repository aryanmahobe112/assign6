const express = require("express")
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const { allBanks, allCustomers, findBank, findCustomer } = require('./data')
const Bank = require('./view/Bank')
const Account = require('./view/Account')
const Customer = require('./view/Customer')

app.post('/createBank', (req,resp) => {
    let { fullName, abbriviation } = req.body

    if(typeof(fullName)!='string'){
        resp.status(406).send("Full name passed is not a string")
        return
    }
    if(typeof(abbriviation)!='string'){
        resp.status(406).send("Abbreviation passed is not a string")
        return
    }

    for (let i in allBanks) {
        if (fullName == allBanks[i].fullName || abbriviation == allBanks[i].abbriviation) {
            resp.status(406).send("Bank already Present")
            return
        }
    }

    allBanks.push(new Bank(fullName, abbriviation))
    resp.status(201).send("Bank created successfully")
    return
})

app.post('/createCustomer', (req,resp) => {
    let { firstName, lastName } = req.body

    if(typeof(firstName)!='string'){
        resp.status(406).send("First name passed is not a string")
        return
    }
    if(typeof(lastName)!='string'){
        resp.status(406).send("Last name passed is not a string")
        return
    }
    
    allCustomers.push(new Customer(firstName, lastName))
    resp.status(201).send("Customer created succesfully")
    return
})

app.post('/createAccount', (req,resp) => {
    let { firstName, lastName, bankAbbriviation } = req.body

    if(typeof(firstName)!='string'){
        resp.status(406).send("First name passed is not a string")
        return
    }
    if(typeof(lastName)!='string'){
        resp.status(406).send("Last name passed is not a string")
        return
    }
    if(typeof(bankAbbriviation)!='string'){
        resp.status(406).send("Bank abbreviation passed is not a string")
        return
    }

    let [isCustomerPresent, indexOfCustomerToFind] = findCustomer(firstName, lastName)
    if (!isCustomerPresent) {
        resp.status(404).send("Customer not Found")
        return
    }

    let [statusCode, statusMessage] = allCustomers[indexOfCustomerToFind].createAccount(bankAbbriviation)
    resp.status(statusCode).send(statusMessage)
    return
})

app.get('/displayBalance', (req,resp) => {
    let { firstName, lastName } = req.body

    if(typeof(firstName)!='string'){
        resp.status(406).send("First name passed is not a string")
        return
    }
    if(typeof(lastName)!='string'){
        resp.status(406).send("Last name passed is not a string")
        return
    }

    let [isCustomerPresent, indexOfCustomerToFind] = findCustomer(firstName, lastName)
    if (!isCustomerPresent) {
        resp.status(404).send("Customer not Found")
        return
    }

    resp.send(allCustomers[indexOfCustomerToFind].displayBalance())
})

app.post('/deposit', (req,resp) => {
    let { firstName, lastName, bankAbbriviation, depositAmount } = req.body

    if(typeof(firstName)!='string'){
        resp.status(406).send("First name passed is not a string")
        return
    }
    if(typeof(lastName)!='string'){
        resp.status(406).send("Last name passed is not a string")
        return
    }
    if(typeof(bankAbbriviation)!='string'){
        resp.status(406).send("Bank Abbreviation passed is not a string")
        return
    }
    if(typeof(depositAmount)!='number'){
        resp.status(406).send("Deposit Amount passed is not a number")
        return
    }

    let [isCustomerPresent, indexOfCustomerToFind] = findCustomer(firstName, lastName)
    if (!isCustomerPresent) {
        resp.status(404).send("Customer not Found")
        return
    }

    let [statusCode, statusMessage] = allCustomers[indexOfCustomerToFind].deposit(bankAbbriviation, depositAmount)
    resp.status(statusCode).send(statusMessage)
    return
})

app.post('/withdraw', (req,resp) => {
    let { firstName, lastName, bankAbbriviation, withdrawAmount } = req.body

    if(typeof(firstName)!='string'){
        resp.status(406).send("First name passed is not a string")
        return
    }
    if(typeof(lastName)!='string'){
        resp.status(406).send("Last name passed is not a string")
        return
    }
    if(typeof(bankAbbriviation)!='string'){
        resp.status(406).send("Bank Abbreviation passed is not a string")
        return
    }
    if(typeof(withdrawAmount)!='number'){
        resp.status(406).send("Withdraw Amount passed is not a number")
        return
    }

    let [isCustomerPresent, indexOfCustomerToFind] = findCustomer(firstName, lastName)
    if (!isCustomerPresent) {
        resp.status(404).send("Customer not Found")
        return
    }

    let [statusCode, statusMessage] = allCustomers[indexOfCustomerToFind].withdraw(bankAbbriviation, withdrawAmount)
    resp.status(statusCode).send(statusMessage)
    return
})

app.post('/transfer', (req,resp) => {
    let { debitCustomerFirstName, debitCustomerLastName, debitCustomerBankAbbriviation, 
            creditCustomerFirstName, creditCustomerLastName, creditCustomerBankAbbriviation, transferAmount } = req.body
    
    if(typeof(debitCustomerFirstName)!='string'){
        resp.status(406).send("Debit Customer First Name passed is not a string")
        return
    }
    if(typeof(debitCustomerLastName)!='string'){
        resp.status(406).send("Debit Customer Last Name passed is not a string")
        return
    }
    if(typeof(debitCustomerBankAbbriviation)!='string'){
        resp.status(406).send("Debit Customer Bank Abbriviation passed is not a string")
        return
    }
    if(typeof(creditCustomerFirstName)!='string'){
        resp.status(406).send("Credit Customer First Name passed is not a string")
        return
    }
    if(typeof(creditCustomerLastName)!='string'){
        resp.status(406).send("Credit Customer Last Name passed is not a string")
        return
    }
    if(typeof(creditCustomerBankAbbriviation)!='string'){
        resp.status(406).send("Credit Customer Bank Abbriviation passed is not a string")
        return
    }
    if(typeof(transferAmount)!='number'){
        resp.status(406).send("Transfer Amount passed is not a number")
        return
    }

    let [isDebitCustomerPresent, indexOfDebitCustomerToFind] = findCustomer(debitCustomerFirstName, debitCustomerLastName)
    if(!isDebitCustomerPresent){
        resp.status(404).send("Debit Customer not found")
        return
    }

    let [isCreditCustomerPresent, indexOfCreditCustomerToFind] = findCustomer(creditCustomerFirstName, creditCustomerLastName)
    if(!isCreditCustomerPresent){
        resp.status(404).send("Credit Customer not found")
        return
    }

    let [statusCode, statusMessage] = allCustomers[indexOfDebitCustomerToFind].transfer(debitCustomerBankAbbriviation, allCustomers[indexOfCreditCustomerToFind], creditCustomerBankAbbriviation, transferAmount)
    resp.status(statusCode).send(statusMessage)
    return
})

app.post('/selfTransfer', (req,resp) => {
    let { firstName, lastName, debitBankAbbriviation, creditBankAbbriviation, transferAmount } = req.body

    if(typeof(firstName)!='string'){
        resp.status(406).send("First Name passed is not a string")
        return
    }
    if(typeof(lastName)!='string'){
        resp.status(406).send("Last Name passed is not a string")
        return
    }
    if(typeof(debitBankAbbriviation)!='string'){
        resp.status(406).send("Debit Bank Abbriviation passed is not a string")
        return
    }
    if(typeof(creditBankAbbriviation)!='string'){
        resp.status(406).send("Credit Bank Abbriviation passed is not a string")
        return
    }
    if(typeof(transferAmount)!='number'){
        resp.status(406).send("Transfer Amount passed is not a number")
        return
    }

    let [isCustomerPresent, indexOfCustomerToFind] = findCustomer(firstName, lastName)
    if (!isCustomerPresent) {
        resp.status(404).send("Customer not Found")
        return
    }

    let [statusCode, statusMessage] = allCustomers[indexOfCustomerToFind].selfTransfer(debitBankAbbriviation, creditBankAbbriviation, transferAmount)
    resp.status(statusCode).send(statusMessage)
    return
})

app.listen(9000, () => {
    console.log("Server running at 9000")
})