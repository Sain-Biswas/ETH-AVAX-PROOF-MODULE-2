// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    mapping(address => uint256) public balanceOf;

    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);
    event Transfer(address sender, address reciever, uint amount);

    function getBalance() public view returns (uint256) {
        if (balanceOf[msg.sender] != 0) {
            return balanceOf[msg.sender];
        }
        return 0;
    }

    function deposit(uint _depositAmount) public payable {
        require(_depositAmount > 0, "Amount must be greater than 0");

        uint256 previousBalance = balanceOf[msg.sender];
        uint256 newBalance = previousBalance + _depositAmount;

        require(newBalance >= previousBalance, "Overflow detected");

        balanceOf[msg.sender] = newBalance;

        emit Deposit(msg.sender, _depositAmount);
    }

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

    function transfer(address payable recipient, uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;

        emit Transfer(msg.sender, recipient, amount);
    }
}
