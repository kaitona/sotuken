import React from "react";
import "./wait_Modal.css"
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
const Wait_Modal = (props) => {
    console.log(props.showFlag);
    return (
        <>
            {props.showFlag ? ( // showFlagがtrueだったらModalを表示する
                <div id="overlay">
                    <div id="modalContent">
                        <div className="spinner-box">
                            <div className="pulse-container">
                                <div className="pulse-bubble pulse-bubble-1"></div>
                                <div className="pulse-bubble pulse-bubble-2"></div>
                                <div className="pulse-bubble pulse-bubble-3"></div>

                            </div>

                        </div>
                        <div >
                            <p id="content">
                                {/* <font size="5" color="#3f3f3f">結果を確認したい場合は、待機して下さい</font> */}
                               
                                {props.content ?<font size="5" color="#3f3f3f">{props.content}</font>: <font size="5" color="#3f3f3f">書き込みを実行中です。</font> }
                                <br/>
                                <font size="5" color="#3f3f3f">待機せずに別のページに遷移しても問題ありません。</font>
                                <br/>
                                <Link to="/list_quiz">
                                    <Button variant="primary"  style={{ marginTop: '20px' }}>
                                        トップページに戻る
                                    </Button>
                                </Link>
                                
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <></>// showFlagがfalseの場合はModalは表示しない
            )}
        </>
    );
};

export default Wait_Modal;
