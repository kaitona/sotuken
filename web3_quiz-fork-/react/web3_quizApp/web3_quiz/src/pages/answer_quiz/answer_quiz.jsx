import { Contracts_MetaMask } from "../../contract/contracts";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import MDEditor, { selectWord } from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Wait_Modal from "../../contract/wait_Modal";
import { ConstructorFragment } from "ethers/lib/utils";
function Show_correct(props){
    if(props.cont == true){
        return (
            <a>答えは{props.answer}</a>
        );
    }else{
        return <></>;
    }
}
function Answer_type1(props) {
    return (
        <>
            <a>
                <br />
                選択式
            </a>
            <table className="table">
                <tbody>
                    {props.quiz[6].split(",").map((cont) => {
                        let check_box;
                        if (props.answer == cont) {
                            check_box = (
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={cont}
                                    id="flexCheckChecked"
                                    onChange={() => {
                                        props.setAnswer(cont);
                                    }}
                                    checked
                                />
                            );
                        } else {
                            check_box = (
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={cont}
                                    id="flexCheckChecked"
                                    onChange={() => {
                                        props.setAnswer(cont);
                                    }}
                                />
                            );
                        }
                        return (
                            <tr key={cont}>
                                <th scope="col">{check_box}</th>

                                <th scope="col" className="left">
                                    {cont}
                                </th>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}

function Answer_type2(props) {
    const answer_data = props.quiz[6].split(",");
    const pattern = answer_data[0];
    const example = answer_data[1];
    const [error_collect, SetError_Collect] = useState(true);
    useEffect(() => {
        console.log(props.quiz);
        console.log(pattern);
        console.log(example);
    }, []);

    //正規表現のエラー表示
    const handle_Test_pattern = (event, target_set) => {
        const value = event.target.value;

        console.log(pattern);
        // 入力値が正規表現にマッチしない場合は、エラーメッセージを設定
        if (!new RegExp(pattern).test(value)) {
            target_set(true);
            console.log("errr");
        } else {
            target_set(false);
        }
    };

    return (
        <>
            <a>入力形式</a>

            <div className="row">
                <div className="col-10">
                    正解を入力
                    <br />
                    <p>例:{example}</p>
                    {/* 1行のみのフォームにしたい */}
                    <input
                        type="text"
                        className="form-control"
                        value={props.answer}
                        onChange={(event) => {
                            handle_Test_pattern(event, SetError_Collect);
                            props.setAnswer(event.target.value);
                        }}
                    />
                    {error_collect ? "エラー" : "OK"}
                </div>
            </div>
        </>
    );
}

function Answer_quiz(props) {
    const [answer, setAnswer] = useState();
    const [now, setnow] = useState(null);
    const [show, setShow] = useState(false);
    const [content, setContent] = useState("");
    const [is_correct_show, setIs_correct_show] = useState(false);
    let clean_up;

    let Contract = new Contracts_MetaMask();
    const id = useParams()["id"];
    console.log(id);
    console.log("解答の最大数とこれまでに回答した人数");
    async function getCorrectLimitAndCorrectCount(id) {
        return (await Contract.get_respondentCount_and_respondentLimit(id));
    }

    console.log(getCorrectLimitAndCorrectCount(id));

    const [quiz, setQuiz] = useState(null);
    const [simple_quiz, setSimple_quiz] = useState(null);

    const get_quiz = async () => {
        setQuiz(await Contract.get_quiz(id));
        setSimple_quiz(await Contract.get_quiz_simple(id));
    };

    const convertFullWidthNumbersToHalf = (()=>{
        // 全角数字と半角数字の差分を計算
        const diff = "０".charCodeAt(0) - "0".charCodeAt(0);

            // 置換関数を返す
        return text => text.replace(
                    /[０-９]/g
                    ,m=>String.fromCharCode( m.charCodeAt(0) - diff )
        ); 
    })();

    const create_answer = async () => {
        if (quiz[15] == true){
            setIs_correct_show(true);
            return;
        }
        if (parseInt(quiz[8]).toString() <= now) {
            const res = Contract.create_answer(id, convertFullWidthNumbersToHalf(answer), setShow, setContent);
        } else {
            alert("まだ回答開始時間になっていません");
        }
    };

    

    useEffect(() => {
        get_quiz();
        setnow(Math.floor(new Date().getTime() / 1000));
    }, []);

    if (quiz && simple_quiz) {
        // console.log(quiz)
        // console.log(simple_quiz)
        return (
            <>
                <h3 style={{ margin: "50px" }}>{Number(simple_quiz["state"]) == 0 ? "初回の回答です。正解するとトークンがもらえます" : Number(simple_quiz["state"]) == 1 ? "初回の回答で間違えています。正解してもトークンはもらえません" : Number(simple_quiz["state"]) == 2 ? "正解しています" : ""}</h3>
                <div className="container" style={{ "text-align": "left", "margin-bottom": "50px" }}>
                    <h2>{quiz[2]}</h2>
                    <br />
                    <a style={{ "white-space": "pre-wrap", "font-size": "14px", "line-height": "1" }}>
                        <br />
                        {quiz[3]}
                    </a>
                    <br />
                    <br />
                    <a>出題者:{quiz[1]}</a>
                    <br />
                    <br />

                    <div data-color-mode="light" className="left" style={{ "text-align": "left" }}>
                        <MDEditor.Markdown source={quiz[5]} />
                    </div>

                    {(() => {
                        if (Number(quiz[13]) == 0) {
                            return <Answer_type1 quiz={quiz} answer={answer} setAnswer={setAnswer} />;
                        }
                    })()}
                    {(() => {
                        if (Number(quiz[13]) == 1) {
                            return <Answer_type2 quiz={quiz} answer={answer} setAnswer={setAnswer} />;
                        }
                    })()}

                    <div class="d-flex justify-content-end">
                        <Button variant="primary" onClick={create_answer}>
                            回答
                        </Button>
                    </div>
                    {Number(quiz[13])}<br />
                    <Show_correct cont={is_correct_show} answer={quiz[14]}/>
                </div>
                <Wait_Modal showFlag={show} content={content} />
            </>
        );
    } else {
        <></>;
    }
}
export default Answer_quiz;
