// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./class_room.sol";

contract Quiz_Dapp is class_room {
    address Token_address = 0x60e4999c31f497c02b784E9B138dC000d30d2068;
    TokenInterface token = TokenInterface(Token_address);

    struct User {
        string user_id;
        string img_url;
        uint result;
    }

    mapping(address => User) private users;

    constructor() {}

    struct Quiz {
        uint quiz_id; //対象となるリクエストのid
        address owner; //出題者
        string title;
        string explanation;
        string thumbnail_url;
        string content;
        uint answer_type; //0,選択しき/1,記述
        string answer_data;
        bytes32 answer_hash; //回答をハッシュ化したものを格納
        uint create_time_epoch;
        uint256 start_time_epoch;
        uint time_limit_epoch;
        uint reward;
        uint respondent_count;
        uint respondent_limit;
        mapping(address => uint) respondents_map; //0が未回答,1が不正解,2が正解
        mapping(address => uint) respondents_state;
        Answer[] answers;
        mapping(address => bytes32) students_answer_hashs;
    }
    struct Answer {
        address respondent;
        uint answer_time;
        uint reward;
        bool result;
    }

    Quiz[] private quizs;

    event Set_approve(bool isSuccess, uint allowance, address owner, address spender);

    function set_approve(address spender, uint amount)
        public
        returns (
            bool isSuccess,
            uint allowance,
            address owner
        )
    {
        owner = msg.sender;
        isSuccess = token.approve(spender, amount);
        allowance = token.allowance(msg.sender, spender);
        emit Set_approve(isSuccess, allowance, owner, spender);
    }

    event Create_quiz(address indexed _sender, uint indexed id);

    function create_quiz(
        string memory _title,
        string memory _explanation,
        string memory _thumbnail_url,
        string memory _content,
        uint _answer_type,
        string memory _answer_data,
        string memory _answer,
        uint _startline_after_epoch,
        uint _timelimit_after_epoch,
        uint _reward,
        uint _respondent_limit
    ) public returns (uint id) {
        require(token.allowance(msg.sender, address(this)) >= _reward * _respondent_limit, "Not enough token approve fees");
        token.transferFrom_explanation(msg.sender, address(this), _reward * _respondent_limit, "create_quiz");
        id = quizs.length;
        quizs.push();
        bytes32 answer_hash = keccak256(abi.encodePacked(_answer));
        // quizs.push(Quiz(id,msg.sender,_title,_thumbnail_url,_content,_choices,answer_hash,answer_hash,block.timestamp,_reward,_respondent_limit,Answer(msg.sender,block.timestamp,0)));
        quizs[id].owner = msg.sender;
        quizs[id].title = _title;
        quizs[id].explanation = _explanation;
        quizs[id].thumbnail_url = _thumbnail_url;
        quizs[id].content = _content;
        quizs[id].answer_type = _answer_type;
        quizs[id].answer_data = _answer_data;
        quizs[id].answer_hash = answer_hash;
        quizs[id].create_time_epoch = block.timestamp;
        quizs[id].start_time_epoch = _startline_after_epoch;
        quizs[id].time_limit_epoch = _timelimit_after_epoch;
        quizs[id].reward = _reward;
        quizs[id].respondent_count = 0;
        quizs[id].respondent_limit = _respondent_limit;
        emit Create_quiz(msg.sender, id);
        return id;
    }

    event Edit_quiz(address indexed _sender, uint indexed id);

    function edit_quiz(
        uint id,
        address owner,
        string memory _title,
        string memory _explanation,
        string memory _thumbnail_url,
        string memory _content,
        uint _startline_after_epoch,
        uint _timelimit_after_epoch
    ) public returns (uint quiz_id) {
        // quizs.push(Quiz(id,msg.sender,_title,_thumbnail_url,_content,_choices,answer_hash,answer_hash,block.timestamp,_reward,_respondent_limit,Answer(msg.sender,block.timestamp,0)));
        quizs[id].owner = owner;
        quizs[id].title = _title;
        quizs[id].explanation = _explanation;
        quizs[id].thumbnail_url = _thumbnail_url;
        quizs[id].content = _content;
        quizs[id].start_time_epoch = _startline_after_epoch;
        quizs[id].time_limit_epoch = _timelimit_after_epoch;
        emit Edit_quiz(msg.sender, id);
        return id;
    }

    event Set_spender_approve(address spender, uint amount);

    function set_spender_approve(address spender, uint amount) public returns (bool isSuccess) {
        isSuccess = token.approve(spender, amount);
        emit Set_spender_approve(spender, amount);
    }

    function show_allowance(address spender)
        public
        view
        returns (
            uint amount,
            address owner,
            address thisAddress
        )
    {
        owner = msg.sender;
        amount = token.allowance(owner, spender);
        thisAddress = address(this);
    }

    function sum_of_investment(uint amount, uint numOfStudent) public view returns (uint sum, uint allowance) {
        sum = amount * numOfStudent;
        allowance = token.allowance(msg.sender, address(this));
    }

    event Investment_to_quiz(address indexed _sender, uint indexed id);

    function investment_to_quiz(
        uint id,
        uint amount,
        bool isNotPayingOut,
        uint numOfStudent
    ) public returns (uint quiz_id) {
        require(token.allowance(msg.sender, address(this)) >= amount * numOfStudent, "Not enough token approve fees");
        token.transferFrom_explanation(msg.sender, address(this), amount * numOfStudent, "investment_to_quiz");

        quizs[id].reward += amount;

        emit Investment_to_quiz(msg.sender, id);
        return id;
    }

    function get_quiz_all_data(uint _quiz_id)
        public
        view
        returns (
            uint id,
            address owner,
            string memory title,
            string memory explanation,
            string memory thumbnail_url,
            string memory content,
            uint _answer_type,
            string memory answer_data,
            uint start_time_epoch,
            uint time_limit_epoch,
            uint reward,
            uint respondent_count,
            uint respondent_limit,
            uint state
        )
    {
        id = _quiz_id;
        owner = quizs[_quiz_id].owner;
        title = quizs[_quiz_id].title;
        explanation = quizs[_quiz_id].explanation;
        thumbnail_url = quizs[_quiz_id].thumbnail_url;
        content = quizs[_quiz_id].content;
        _answer_type = quizs[id].answer_type;
        answer_data = quizs[_quiz_id].answer_data;
        start_time_epoch = quizs[_quiz_id].start_time_epoch;
        time_limit_epoch = quizs[_quiz_id].time_limit_epoch;
        reward = quizs[_quiz_id].reward;
        respondent_count = quizs[_quiz_id].respondent_count;
        respondent_limit = quizs[_quiz_id].respondent_limit;
        state = quizs[_quiz_id].respondents_map[msg.sender];
    }

    function get_quiz(uint _quiz_id)
        public
        view
        returns (
            uint id,
            address owner,
            string memory title,
            string memory explanation,
            string memory thumbnail_url,
            string memory content,
            string memory answer_data,
            uint create_time_epoch,
            uint start_time_epoch,
            uint time_limit_epoch,
            uint reward,
            uint respondent_count,
            uint respondent_limit
        )
    {
        id = _quiz_id;
        owner = quizs[_quiz_id].owner;
        title = quizs[_quiz_id].title;
        explanation = quizs[_quiz_id].explanation;
        thumbnail_url = quizs[_quiz_id].thumbnail_url;
        content = quizs[_quiz_id].content;
        answer_data = quizs[_quiz_id].answer_data;
        time_limit_epoch = quizs[_quiz_id].time_limit_epoch;
        create_time_epoch = quizs[_quiz_id].create_time_epoch;
        start_time_epoch = quizs[_quiz_id].start_time_epoch;
        reward = quizs[_quiz_id].reward;
        respondent_count = quizs[_quiz_id].respondent_count;
        respondent_limit = quizs[_quiz_id].respondent_limit;
    }

    function get_student_answer_hash(address _sender, uint _quiz_id) public view returns (bytes32){
        bytes32 answer_hash = quizs[_quiz_id].student_answer_hashs[_sender];
        return answer_hash;
    }

    function get_quiz_answer_type(uint _quiz_id) public view returns (uint answer_type) {
        answer_type = quizs[_quiz_id].answer_type;
    }

    function get_quiz_simple(uint _quiz_id)
        public
        view
        returns (
            uint id,
            address owner,
            string memory title,
            string memory explanation,
            string memory thumbnail_url,
            uint start_time_epoch,
            uint time_limit_epoch,
            uint reward,
            uint respondent_count,
            uint respondent_limit,
            uint state
        )
    {
        id = _quiz_id;
        owner = quizs[_quiz_id].owner;
        title = quizs[_quiz_id].title;
        explanation = quizs[_quiz_id].explanation;
        thumbnail_url = quizs[_quiz_id].thumbnail_url;
        start_time_epoch = quizs[_quiz_id].start_time_epoch;
        time_limit_epoch = quizs[_quiz_id].time_limit_epoch;
        reward = quizs[_quiz_id].reward;
        respondent_count = quizs[_quiz_id].respondent_count;
        respondent_limit = quizs[_quiz_id].respondent_limit;
        state = quizs[_quiz_id].respondents_map[msg.sender];
    }

    event Save_answer(address indexed _sender, uint indexed quiz_id, uint indexed answer_id );

    function save_answer(uint  _quiz_id, string memory _answer) public returns (uint answer_id){
        require(quizs[_quiz_id].time_limit_epoch >= block.timestamp, "end quiz");
        bytes32 answer_hash = keccak256(abi.encodePacked(_answer));

        if(quizs[_quiz_id].respondents_map[msg.sender] == 0){
            quizs[_quiz_id].respondent_count += 1;
        }

        quizs[_quiz_id].students_answer_hashs[msg.sender] = answer_hash;
        answer_id = quizs[_quiz_id].answers.length;
        quizs[_quiz_id].respondents_state[msg.sender] = answer_id;
        quizs[_quiz_id].answers.push();
        quizs[_quiz_id].answers[answer_id].respondent = msg.sender;
        quizs[_quiz_id].answers[answer_id].answer_time = block.timestamp;
        
        emit Save_answer(msg.sender, _quiz_id, answer_id);
    }

    event Post_answer(address indexed _sender, uint indexed quiz_id, uint indexed answer_id);

    function post_answer(uint _quiz_id, string memory _answer) public returns (uint answer_id, uint reward) {
        require(quizs[_quiz_id].respondent_count < quizs[_quiz_id].respondent_limit, "You have reached the maximum number of responses");
        //require(quizs[_quiz_id].respondents_map[msg.sender]==0,"already answered");
        require(quizs[_quiz_id].time_limit_epoch >= block.timestamp, "end quiz");
        bytes32 answer_hash = keccak256(abi.encodePacked(_answer));
        bool result;
        if (answer_hash == quizs[_quiz_id].answer_hash) {
            if (check_teacher(quizs[_quiz_id].owner) == true && quizs[_quiz_id].respondents_map[msg.sender] == 0) {
                //教員から出された問題であれば結果に反映　&& 初回の回答であれば
                reward = quizs[_quiz_id].reward;
                quizs[_quiz_id].respondent_count += 1;
                users[msg.sender].result += reward;
                token.transfer_explanation(msg.sender, reward, "correct answer");
            } else if (check_teacher(quizs[_quiz_id].owner) == true && quizs[_quiz_id].respondents_map[msg.sender] == 1) {
                //教員から出された問題であれば結果に反映　&& 間違った回答をした後であれば
                token.transfer_explanation(msg.sender, 0, "correct answer");
            }
            result = true;
            quizs[_quiz_id].respondents_map[msg.sender] = 2;
        } else {
            reward = 0;
            token.transfer_explanation(msg.sender, 0, "Incorrect answer");
            result = false;
            quizs[_quiz_id].respondents_map[msg.sender] = 1;
        }

        answer_id = quizs[_quiz_id].answers.length;
        quizs[_quiz_id].respondents_state[msg.sender] = answer_id;
        quizs[_quiz_id].answers.push();
        quizs[_quiz_id].answers[answer_id].respondent = msg.sender;
        quizs[_quiz_id].answers[answer_id].answer_time = block.timestamp;
        quizs[_quiz_id].answers[answer_id].reward = reward;
        quizs[_quiz_id].answers[answer_id].result = result;

        emit Post_answer(msg.sender, _quiz_id, answer_id);
    }

    function post_answer_view(uint _quiz_id, string memory _answer) public view returns (bool result) {
        bytes32 answer_hash = keccak256(abi.encodePacked(_answer));
        result = false;
        if (answer_hash == quizs[_quiz_id].answer_hash) {
            result = true;
        }
    }

    function get_quiz_respondent(uint _quiz_id, uint answer_id)
        public
        view
        returns (
            address respondent,
            uint answer_time,
            uint reward,
            bool result
        )
    {
        respondent = quizs[_quiz_id].answers[answer_id].respondent;
        answer_time = quizs[_quiz_id].answers[answer_id].answer_time;
        reward = quizs[_quiz_id].answers[answer_id].reward;
        result = quizs[_quiz_id].answers[answer_id].result;
    }

    function get_quiz_length() public view returns (uint length) {
        length = quizs.length;
    }

    function set_user_name(string memory _user_name) public returns (bool) {
        users[msg.sender].user_id = _user_name;
        return true;
    }

    function set_user_img(string memory _user_img) public returns (bool) {
        users[msg.sender].img_url = _user_img;
        return true;
    }

    function get_user(address _target)
        public
        view
        returns (
            string memory student_id,
            string memory img_url,
            uint result,
            bool state
        )
    {
        if (_target == msg.sender) {
            student_id = users[_target].user_id;
            img_url = users[_target].img_url;
            result = users[_target].result;
            if (bytes(users[_target].user_id).length == 0) {
                //文字列が空であれば
                state = false;
            } else {
                state = true;
            }
        }
    }

    function get_num_of_students() public view returns (uint256 num_of_students) {
        num_of_students = student_address_list.length;
        return num_of_students;
    }

    struct Result {
        address student;
        uint result;
    }

    function get_student_results() public view isTeacher returns (Result[] memory) {
        address[] memory students = get_student_all();
        Result[] memory results = new Result[](students.length);
        for (uint i = 0; i < students.length; i++) {
            results[i].student = students[i];
            results[i].result = users[students[i]].result;
        }
        return results;
    }

    function update_result(address _target, uint point) public {
        users[_target].result = point;
    }

    function get_rank() public view returns (uint rank) {
        uint user_result = users[msg.sender].result;

        Result[] memory student_results = get_student_results();

        uint[] memory ranking = new uint[](student_results.length);

        //sort
        for (uint i = ranking.length; i >= 0; i--) {
            ranking[i] = student_results[i].result;
        }
        ranking = bubbleSort(ranking);

        //順位を取得
        for (uint i = ranking.length; i >= 0; i--) {
            if (ranking[i] == user_result) {
                rank = i;
            }
        }
    }

    function bubbleSort(uint[] memory arr) public pure returns (uint[] memory) {
        uint n = arr.length;
        for (uint i = 0; i < n - 1; i++) {
            for (uint j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    uint temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }

    function get_respondentCount_and_respondentLimit(uint _quiz_id) public view returns (uint respondentCount, uint respondentLimit) {
        respondentCount = quizs[_quiz_id].respondent_count;
        respondentLimit = quizs[_quiz_id].respondent_limit;
    }
}

interface TokenInterface {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address _owner) external view returns (uint256 balance);

    function transfer(address _to, uint256 _value) external returns (bool success);

    function transfer_explanation(
        address _to,
        uint256 _value,
        string memory _explanation
    ) external returns (bool success);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success);

    function transferFrom_explanation(
        address sender,
        address recipient,
        uint256 amount,
        string memory _explanation
    ) external returns (bool);

    function approve(address _spender, uint256 _value) external returns (bool success);

    function approve_explanation(
        address _spender,
        uint256 _value,
        string memory _explanation
    ) external returns (bool success);

    function allowance(address _owner, address _spender) external view returns (uint256 remaining);
}
