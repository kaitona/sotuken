// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./class_room.sol";

contract Quiz_Dapp is class_room {
    address Token_address=0x3872813914A06BB13D44f5a8b610F64735DdA048;
    TokenInterface token =  TokenInterface(Token_address);
    constructor() {
        
    }

    struct User{
        string user_id;
        string img_url;
        uint result;
    }

    mapping (address=>User) private users;


    struct Quiz{
        uint quiz_id;//対象となるリクエストのid
        address owner;//出題者
        string title;
        string explanation;
        string thumbnail_url;
        string content;
        uint answer_type;//0,選択しき/1,記述
        string answer_data;
        bytes32 answer_hash;//回答をハッシュ化したものを格納
        uint create_time_epoch;
        uint time_limit_epoch;
        uint reward;
        uint respondent_count;
        uint respondent_limit;
        mapping  (address=>uint)respondents_map;//0が未回答,1が不正解,2が正解
        mapping (address=>uint)respondents_state;
        Answer[] answers;
    }
    struct Answer{
        address respondent;
        uint answer_time;
        uint reward;
        bool result;
    }
    
    Quiz[] private  quizs;

    event Create_quiz(address indexed _sender,uint indexed id);
    function create_quiz(string memory _title,string memory _explanation,string memory _thumbnail_url,string memory _content,uint _answer_type,string memory _answer_data,string  memory _answer,uint _timelimit_after_epoch,uint _reward,uint _respondent_limit) public returns (uint id){
        require(token.allowance(msg.sender,address(this)) >= _reward * _respondent_limit,"Not enough token approve fees");
        token.transferFrom_explanation(msg.sender, address(this), _reward * _respondent_limit*10**token.decimals(),"create_quiz");
        id = quizs.length;
        quizs.push();
        bytes32 answer_hash=keccak256(abi.encodePacked(_answer));
        // quizs.push(Quiz(id,msg.sender,_title,_thumbnail_url,_content,_choices,answer_hash,answer_hash,block.timestamp,_reward,_respondent_limit,Answer(msg.sender,block.timestamp,0)));
        quizs[id].owner=msg.sender;
        quizs[id].title=_title;
        quizs[id].explanation=_explanation;
        quizs[id].thumbnail_url=_thumbnail_url;
        quizs[id].content=_content;
        quizs[id].answer_type=_answer_type;
        quizs[id].answer_data=_answer_data;
        quizs[id].answer_hash=answer_hash;
        quizs[id].create_time_epoch=block.timestamp;
        quizs[id].time_limit_epoch=_timelimit_after_epoch;
        quizs[id].reward=_reward;
        quizs[id].respondent_count=0;
        quizs[id].respondent_limit=_respondent_limit;
        emit Create_quiz(msg.sender, id);
        return id;
    }

    function get_quiz(uint _quiz_id)public view returns(uint id,address owner,string memory title,string memory explanation,string memory thumbnail_url,string memory content,string memory answer_data,uint create_time_epoch,uint time_limit_epoch,uint reward,uint respondent_count,uint respondent_limit){
        id=_quiz_id;
        owner=quizs[_quiz_id].owner;
        title=quizs[_quiz_id].title;
        explanation=quizs[_quiz_id].explanation;
        thumbnail_url=quizs[_quiz_id].thumbnail_url;
        content=quizs[_quiz_id].content;
        answer_data=quizs[_quiz_id].answer_data;
        time_limit_epoch=quizs[_quiz_id].time_limit_epoch;
        create_time_epoch=quizs[_quiz_id].create_time_epoch;
        reward=quizs[_quiz_id].reward;
        respondent_count=quizs[_quiz_id].respondent_count;
        respondent_limit=quizs[_quiz_id].respondent_limit;
    }
    function get_quiz_answer_type(uint _quiz_id)public view returns (uint answer_type){
        answer_type=quizs[_quiz_id].answer_type;
    }
    function get_quiz_simple(uint _quiz_id)public view returns(uint id,address owner,string memory title,string memory explanation,string memory thumbnail_url,uint time_limit_epoch,uint reward,uint respondent_count,uint respondent_limit,uint state){
        id=_quiz_id;
        owner=quizs[_quiz_id].owner;
        title=quizs[_quiz_id].title;
        explanation=quizs[_quiz_id].explanation;
        thumbnail_url=quizs[_quiz_id].thumbnail_url;
        time_limit_epoch=quizs[_quiz_id].time_limit_epoch;
        reward=quizs[_quiz_id].reward;
        respondent_count=quizs[_quiz_id].respondent_count;
        respondent_limit=quizs[_quiz_id].respondent_limit;
        state=quizs[_quiz_id].respondents_map[msg.sender];
    }


    event Post_answer(address indexed _sender,uint indexed quiz_id,uint indexed answer_id);
    function post_answer(uint _quiz_id,string memory _answer)public returns(uint answer_id,uint reward){
        require(quizs[_quiz_id].respondent_count<quizs[_quiz_id].respondent_limit,"You have reached the maximum number of responses");
        require(quizs[_quiz_id].respondents_map[msg.sender]==0,"already answered");
        require(quizs[_quiz_id].time_limit_epoch>=block.timestamp,"end quiz");
        bytes32 answer_hash=keccak256(abi.encodePacked(_answer));
        bool result;
        if(answer_hash==quizs[_quiz_id].answer_hash){
            reward =quizs[_quiz_id].reward;
            quizs[_quiz_id].respondent_count+=1;
            token.transfer_explanation(msg.sender, reward*10**token.decimals(),"correct answer");
            if(check_teacher(quizs[_quiz_id].owner)==true){//教員から出された問題であれば結果に反映
                users[msg.sender].result+=reward*10**token.decimals();
            }
            result=true;
            quizs[_quiz_id].respondents_map[msg.sender]=2;
        }
        else{
            reward=0;
            token.transfer_explanation(msg.sender, 0,"Incorrect answer");
            result=false;
            quizs[_quiz_id].respondents_map[msg.sender]=1;
        }
        
        answer_id=quizs[_quiz_id].answers.length;
        quizs[_quiz_id].respondents_state[msg.sender]=answer_id;
        quizs[_quiz_id].answers.push();
        quizs[_quiz_id].answers[answer_id].respondent=msg.sender;
        quizs[_quiz_id].answers[answer_id].answer_time=block.timestamp;
        quizs[_quiz_id].answers[answer_id].reward=reward;
        quizs[_quiz_id].answers[answer_id].result=result;


        emit Post_answer(msg.sender,_quiz_id,answer_id);
    }

    function get_quiz_respondent(uint _quiz_id,uint answer_id)public view returns(address respondent,uint answer_time,uint reward,bool result){
        respondent=quizs[_quiz_id].answers[answer_id].respondent;
        answer_time=quizs[_quiz_id].answers[answer_id].answer_time;
        reward=quizs[_quiz_id].answers[answer_id].reward;
        result=quizs[_quiz_id].answers[answer_id].result;
    }

    function get_quiz_length()public view returns (uint length){
        length=quizs.length;
    }

    function set_user_name(string memory _user_name) public returns (bool){
        users[msg.sender].user_id=_user_name;
        return true;
    }
    function set_user_img(string memory _user_img) public returns (bool){
        users[msg.sender].img_url=_user_img;
        return true;
    }
    function get_user(address _target)public view returns (string memory student_id,string memory img_url,uint result,bool state){
        if(_target==msg.sender){
            student_id=users[_target].user_id;
            img_url=users[_target].img_url;
            result=users[_target].result;
            if(bytes(users[_target].user_id).length==0){//文字列が空であれば
                state=false;
            }
            else{
                state=true;
            }
        }
    }

    struct Result{
        address student;
        uint result;
    }
    function get_student_results()public view isTeacher() returns (Result [] memory){
        address [] memory students=get_student_all();
        Result [] memory results=new Result [](students.length);
        for (uint i =0 ;i< students.length ;i++){
            results[i].student=students[i];
            results[i].result=users[students[i]].result;
        }
        return results;
    }
    
}
interface TokenInterface {
    function name() external view returns (string memory );
    function symbol() external view returns (string memory);
    function decimals() external  view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address _owner) external  view returns (uint256 balance);
    function transfer(address _to, uint256 _value) external  returns (bool success);
    function transfer_explanation(address _to, uint256 _value,string memory _explanation) external  returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) external  returns (bool success);
    function transferFrom_explanation(address sender,address recipient,uint256 amount,string memory _explanation)external  returns (bool);
    function approve(address _spender, uint256 _value) external returns (bool success);
    function approve_explanation(address _spender, uint256 _value,string memory _explanation) external returns (bool success);
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);
}