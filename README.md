# BlockBank

This is a Blockchain powered website which have a NextJS powered frontend and a Solidity and Hardhat combo at the backend helping us to run the solidity code, and help us interact in a user-friendly manner from NextJS frontend.

## Installation

run the script :

```bash
npm install
```

## Executing Program

Open two terminals in your VS code.

In the first terminal type:

```bash
npx hardhat node
```

In the second terminal, type:

```bash
npx hardhat run --network localhost scripts/deploy.js
```

and after it finishes execution type:

```bash
npm run dev
```

After this, the project will be running on your localhost.
Typically at [http://localhost:3000]

## Description

Here msg.sender every where signify the address of the person that invoked these functions.

**getBalance Method**

This is a basic function to return the current balance of a particular user.

```solidity
function getBalance() public view returns (uint256) {
    if (balanceOf[msg.sender] != 0) {
        return balanceOf[msg.sender];
    }
    return 0;
}
```

**deposit Method**

This method adds amount to our address. It checks if depositAmount in valid or not and if found valid add amount to our address.

```solidity
function deposit(uint _depositAmount) public payable {
    require(_depositAmount > 0, "Amount must be greater than 0");

    uint256 previousBalance = balanceOf[msg.sender];
    uint256 newBalance = previousBalance + _depositAmount;

    require(newBalance >= previousBalance, "Overflow detected");

    balanceOf[msg.sender] = newBalance;

    emit Deposit(msg.sender, _depositAmount);
}
```

**withdraw Method**

This method withdraws amount from a persons address. It checks if amount is greater than zero and if sufficient balance is present or not. Then if both conditions pass it debits the amount.

```solidity
function withdraw(uint256 _withdrawAmount) public {
    require(_withdrawAmount > 0, "Amount must be greater than 0");
    require(
        balanceOf[msg.sender] >= _withdrawAmount,
        "Insufficient balance"
    );

    uint256 previousBalance = balanceOf[msg.sender];
    balanceOf[msg.sender] -= _withdrawAmount;

    emit Withdraw(msg.sender, _withdrawAmount);
    assert(balanceOf[msg.sender] == previousBalance - _withdrawAmount);
}
```

**transfer function**

This method withdraws amount from a persons address. It checks if amount is greater than zero and if sufficient balance is present or not. Then if both conditions pass it debits the amount from invokers address and add the same amount to provided address.

```solidity
function transfer(address payable recipient, uint256 amount) public {
    require(amount > 0, "Amount must be greater than 0");
    require(balanceOf[msg.sender] >= amount, "Insufficient balance");

    balanceOf[msg.sender] -= amount;
    balanceOf[recipient] += amount;

    emit Transfer(msg.sender, recipient, amount);
}
```

All Methods emit corresponding events on completion and error message if conditions fail.

## Authors

- [@Sain-Biswas](https://github.com/Sain-Biswas)

## License

This contract is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License (refer to the SPDX license identifier at the top of the contract).
