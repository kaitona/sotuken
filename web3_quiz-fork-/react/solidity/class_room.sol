// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "@openzeppelin/contracts@4.4.1/token/ERC20/ERC20.sol";

contract class_room {
    mapping(address => bool) private teachers;
    mapping(address => bool) private students;

    address[] teacher_address_list;
    address[] student_address_list;

    constructor() {
        teachers[msg.sender] = true;
        teacher_addresslist.push(msg.sender);
    }

    modifier isTeacher() {
        require(teachers[msg.sender] == true, "Caller is not teachers");
    }

    function _isTeacher() public view returns (bool) {
        if (teachers[msg.sender] == true) {
            return true;
        } else {
            return false;
        }
    }

    function check_teacher(address _target) internal view returns (bool res) {
        res = teachers[_target];
    }

    function add_teacher(address teacher_address) public isTeacher returns (bool res) {
        if (teachers[teacher_address] == false) {
            teachers[teacher_address] = true;
            teacher_address_list.push(teacher_address);
        }
        res = true; //await　への返答
    }

    function add_student(address[] memory students_address) public isTeacher returns (bool res) {
        for (uint256 i = 0; i < students_address.length; i++) {
            if (students[students_address[i]] == false) {
                students[students_address[i]] = true;
                student_address_list.push(students_address[i]); //同一のユーザーを追加しないように
            }
        }
        res = true;
    }

    function get_student_all() public view isTeacher returns (address[] memory result) {
        result = student_address_list;
    }

    function get_teacher_all() public view isTeacher returns (address[] memory result) {
        result = teacher_address_list;
    }
}
