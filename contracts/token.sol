// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";



contract AxtrumPay is ERC20 {
    mapping(address=> uint) balances;

    address owner;

    constructor() ERC20("AxtrumPay", "AXP") {
        
        owner = msg.sender;
        _mint(owner, 180000000 * 10 ** decimals());
    }

}


