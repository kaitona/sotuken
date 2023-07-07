// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "@openzeppelin/contracts@4.4.1/token/ERC20/ERC20.sol";

contract Wake_token is ERC20{
    struct Transaction{
        address _owner;
        address _sender;
        address _recipient;
        uint epoch_time;
        uint _value;
        string _explanation;
    }


    Transaction [] public  transactions;

    mapping (address=>uint []) public user_transactions;
    
    function add_history(address _owner,address _sender,address _recipient,uint _value,string memory _explanation)private {
        uint index=transactions.length;
        transactions.push(Transaction(_owner,_sender,_recipient,block.timestamp,_value,_explanation));

        
        //1回目は確定で重複しないため
        user_transactions[_owner].push(index);

        //2回目ownerと_senderが重複していないかを確認
        if(_owner!=_sender){
            user_transactions[_sender].push(index);
        }
        //3回目recipientが他の全てと重複していないかを確かめる
        if(_owner!=_recipient && _sender!=_recipient){
            user_transactions[_recipient].push(index);
        }

    }

    constructor () ERC20("Wake Token", "Wake") {
        _mint(address(this), 10000000*10**decimals());
        _mint(msg.sender,10000000*10**decimals());
    }
    function transfer(address _to, uint256 _value) public override   returns (bool success){
        _transfer(msg.sender, _to, _value);
        add_history(msg.sender, msg.sender,_to,_value,"transfer");
        return true;
    }
    function transfer_explanation(address _to, uint256 _value,string memory _explanation) public returns (bool success){
        _transfer(msg.sender, _to, _value);
        add_history(msg.sender, msg.sender,_to,_value,_explanation);
        return true;
    }

    function transferFrom(address sender,address recipient,uint256 amount) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = allowance(sender,recipient);
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }
        add_history(sender, msg.sender,recipient,amount,"transfer_from");
        return true;
    }
    function transferFrom_explanation(address sender,address recipient,uint256 amount,string memory _explanation) public returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = allowance(sender,recipient);
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        unchecked {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }
        add_history(sender, msg.sender,recipient,amount,_explanation);
        return true;
    }

    function approve(address _spender, uint256 _value) public override  returns (bool success){
        _approve(msg.sender, _spender, _value);
        add_history(msg.sender, _spender,address(0x00),_value,"approve");
        return true;
    }
    function approve_explanation(address _spender, uint256 _value,string memory _explanation) public returns (bool success){
        _approve(msg.sender, _spender, _value);
        add_history(msg.sender, _spender,address(0x00),_value,_explanation) ;
        return true;
    }

    //
    function get_user_history_len(address _target)public view returns(uint len){
        len= user_transactions[_target].length;
    }

    function get_user_history(address _target,uint _index)public view returns(Transaction memory transaction){
        require(_target==msg.sender);
        transaction=transactions[ user_transactions[_target][_index]];
    }


}
