let allBanks = []
let allCustomers = []

function findBank(bankAbbriviation) {
    let isBankPresent = false
    let indexOfBankToFind = -1
    for (const i in allBanks) {
        if (allBanks[i].abbriviation == bankAbbriviation) {
            isBankPresent = true
            indexOfBankToFind = i
            break
        }
    }
    return [isBankPresent, indexOfBankToFind]
}

function findCustomer(firstName, lastName) {
    let isBankPresent = false
    let indexOfBankToFind = -1
    for (const i in allBanks) {
        if (allCustomers[i].firstName == firstName && allCustomers[i].lastName == lastName) {
            isBankPresent = true
            indexOfBankToFind = i
            break
        }
    }
    return [isBankPresent, indexOfBankToFind]
}

module.exports = { allBanks, allCustomers, findBank, findCustomer }