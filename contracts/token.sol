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

function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external returns (bool success) {
 require(msg.sender == owner,'only contract owner can call function');
 for(uint256 i = 0; i<recipients.length; i++){
    require(balances[owner]>= amounts[i], 'insufficient balance to send tokens');
    _transfer(owner,recipients[i], amounts[i]);
    
    }   
    return success;
}
    

}


