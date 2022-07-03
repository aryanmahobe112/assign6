const uuid = require('uuid')

class Bank {
    constructor(fullName, abbriviation) {
        this.fullName = fullName
        this.abbriviation = abbriviation
        this.bankId = uuid.v4()
    }
}

module.exports = Bank