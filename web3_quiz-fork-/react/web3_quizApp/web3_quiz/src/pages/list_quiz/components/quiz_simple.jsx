import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import Modal from './Modal'
import { Link } from 'react-router-dom';
import "./quiz_simple.css";

function Time_diff(props) {
    function convertSecondsToHours(seconds) {

        const date1 = new Date(); // 1つ目のDateオブジェクト
        const date2 = new Date(seconds * 1000); // 2つ目のDateオブジェクト



        const epochTime1 = Math.floor(date1.getTime() / 1000); // 現在時刻を秒単位のエポック時間に変換
        const epochTime2 = Math.floor(date2.getTime() / 1000); // タイムリミットを秒単位のエポック時間に変換
        // console.log("/////");
        // console.log(date2,seconds);
        // console.log( epochTime1 , epochTime2,epochTime1 - epochTime2); // タイムリミットと現在時刻の差を表示
        // console.log(date1.toISOString());
        // console.log(date2.toISOString());
        // console.log("////")

        let elapsedTime = 0
        if (epochTime2 - epochTime1 > 0) {
            elapsedTime = Math.floor((epochTime2 - epochTime1)); // 二つのエポック時間の差をミリ秒単位で求める


            elapsedTime = new Date(elapsedTime * 1000);


        }
        else {
            elapsedTime = Math.floor((epochTime1 - epochTime2)); // 二つのエポック時間の差をミリ秒単位で求める

            elapsedTime = new Date(elapsedTime * 1000);
        }

        //console.log(elapsedTime);

        const labels = ["年", "ヶ月", "日", "時間", "分", "秒"];
        let date = [];
        date.push(elapsedTime.getUTCFullYear() - 1970);
        date.push(elapsedTime.getUTCMonth());
        date.push(elapsedTime.getUTCDate() - 1);
        date.push(elapsedTime.getUTCHours());
        date.push(elapsedTime.getUTCMinutes());
        date.push(elapsedTime.getUTCSeconds());
        let res = ''
        let count = 0;
        let i = 0;

        for (i = 0; i <= date.length; i++) {
            //console.log(date[i]);
            if (date[i] != 0) {
                //count =i;
                break;

            }
        }
        for (i; i < date.length; i++) {
            res += date[i].toString() + labels[i]
        }

        if (epochTime2 - epochTime1 > 0) {
            return "締め切りまで " + res;
        }
        else {
            return "締切終了";
        }




    }

    //console.log(parseInt(props.limit["_hex"]));

    return (
        <div>
            {/* {now}<br/>
            {targetDate}<br/> */}
            {convertSecondsToHours(parseInt(props.limit["_hex"]))}
        </div>
    );
}

function Simple_quiz(props) {

    const [show, setShow] = useState(false);
    useEffect(() => {
        console.log("show", show);
    }, [show]);

    const search = useLocation().search;
    return (

        <>
            {/* <Modal show={show} setShow={setShow} id={props.quiz[0].toNumber()} /> */}
            <div onClick={() => setShow(true)}>
            
                <div className="quiz_card" >
                <Link to={{ pathname: "/answer_quiz/"+props.quiz[0].toNumber(), state: { back_page: 0 }}} style={{ "color": "black", "textDecoration": "none" }}>
            

                    <div className="row quiz_card_1">
                        <div className="col-2">
                            <img src={props.quiz[4]} className="img-fluid"></img>
                        </div>
                        <div className="col-10" style={{ "textAlign": "left" }}>
                            <div className="row h-20">
                                <div className="col-sm-12 col-md-12 col-lg-12 ">{props.quiz[2]}</div>
                            </div>
                            <div className="row h-80" style={{ "whiteSpace": "pre-wrap", "fontSize": "14px", "lineHeight": "1" }}>
                                <div className="col-sm-12 col-md-12 col-lg-12 ">{props.quiz[3]}</div>
                            </div>
                            <div className="row h-20" style={{ "fontSize": "14px" }}>
                                <Time_diff limit={props.quiz[5]} />
                            </div>
                            <div className="d-flex" style={{ "fontSize": "14px", "lineHeight": "1" }}>
                                {/* <div className="col-4 ">{Date(props.item[4].toNumber() * 1000)}</div> */}

                                <div className="col-3">
                                    <div className="col">報酬</div>
                                    <div className="col" style={{ "textAlign": "center" }}>{props.quiz[6].toNumber()}Wake</div>
                                </div>
                                <div className="col-3">
                                    <div className="col">正解数</div>
                                    <div className="col" style={{ "textAlign": "center" }}>{props.quiz[7].toNumber()}</div>
                                </div>
                                <div className="col-3">
                                    <div className="col">上限</div>
                                    <div className="col" style={{ "textAlign": "center" }}>{props.quiz[8].toNumber()}</div>
                                </div>
                                <div className="col-3">
                                    <div className="col">状態</div>
                                    <div className="col" style={{ "textAlign": "center" }}>
                                        {props.quiz[9].toNumber()==0?("未回答"):props.quiz[9].toNumber()==1?("不正解"):props.quiz[9].toNumber()==2?("正解"):""}
                                        </div>
                                </div>
                                {/* <div className="col-3 ">正解数:{props.quiz[7].toNumber()}</div>
                            <div className="col-3 ">上限:{props.quiz[8].toNumber()}</div>
                            <div className="col-3 "> 状態:{props.quiz[9].toNumber()}</div> */}
                            </div>
                        </div>
                    </div>

            </Link>
                </div>

            </div>
        </>
    );
}
export default Simple_quiz;