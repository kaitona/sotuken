import { useState } from "react";

import {AiOutlineArrowRight} from "react-icons/ai";
function Convert_time(props) {
    function convertSeconds2ToHours(seconds) {

        const date = new Date(seconds*1000); // 1つ目のDateオブジェクト
       
        return(
            date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        )
    }
    return (
            <>
            {convertSeconds2ToHours(parseInt(props.seconds["_hex"]))}
            </>
    );
}

function Simple_history(props) {

    return (
        // <Link to={"/answer_quiz/"+props.quiz[0].toNumber()} style={{ color: '#000' ,textDecoration: 'none'}}>

        //q:文字を左寄せにした
        //a:style={{textAlign: "left"}}
        <div className="transaction_card" style={{"min-height": "100px" }} >
            
            <div className="row" style={{ margin: "0", padding: "0" }}>
                
                <div className="transfer row">
                    <div className="col-5 left" style={{ padding: "0",margin:"0", "text-align": "center"}}>
                        <div>
                            from
                        </div>
                        <div>
                            {props.history[0].slice(0, 12)}
                        </div>
                        <div>
                            recipient
                        </div>
                        <div>
                            {props.history[2].slice(0, 12)}
                        </div>
                    </div>
                    
                    <div className="col-2 center" style={{ padding: "0" }}>
                        <AiOutlineArrowRight/>
                    </div>
                    <div className="col-5 right" style={{ padding: "0" }}>
                        <div>
                            to
                        </div>
                        <div>
                            {props.history[1].slice(0, 12)}
                        </div>
                        <div>
                            {props.history[4] / 10 ** 18}Wake
                        </div>
                    </div>


                </div>


                <div className="transfer_time" style={{ padding: "0","padding-top":"10px",margin:"0", textAlign: "left"}}>
                    <Convert_time seconds={ props.history[3]}/>
                </div>
                <div className="reason" style={{ padding: "0","padding-top":"10px",margin:"0", textAlign: "left"}}>
                {props.history[5]}<br />
                </div>
            </div>
        </div>
        // </Link>
    );
}
export default Simple_history;