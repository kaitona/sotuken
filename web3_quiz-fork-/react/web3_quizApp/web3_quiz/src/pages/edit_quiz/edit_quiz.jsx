import { Contracts_MetaMask } from "../../contract/contracts";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import MDEditor from "@uiw/react-md-editor";
import Answer_select from "./components/answer_select";
import Button from "react-bootstrap/Button";
import "react-datepicker/dist/react-datepicker.css";
import Wait_Modal from "../../contract/wait_Modal";

const { ethereum } = window;
const mkdStr = "";

function Create_quiz() {
    const [id, setId] = useState(useParams()["id"]);

    const [useing_address, Set_useing_address] = useState(null);
    const [title, setTitle] = useState("");
    const [explanation, setExplanation] = useState("");
    const [thumbnail_url, setThumbnail_url] = useState("");
    const [content, setContent] = useState("");
    const [answer_type, setAnswer_type] = useState(0);
    const [answer_data, setAnswer_data] = useState([]);
    const [correct, setCorrect] = useState("");
    const [reply_startline, setReply_startline] = useState(
        new Date()
            .toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
            .replace(/[/]/g, "-")
            .replace(/\s(\d):/, " 0$1:"),
    );
    const [reply_deadline, setReply_deadline] = useState(getLocalizedDateTimeString(addDays(new Date(), 0)));
    const [reward, setReward] = useState(0);

    let Contract = new Contracts_MetaMask();

    const [correct_limit, setCorrect_limit] = useState(null);
    const [state, setState] = useState("Null");
    const [now, setnow] = useState(null);
    const [show, setShow] = useState(false);

    const location = useLocation();
    const quiz = location.state.args;

    const create_quiz = async () => {
        console.log(title, explanation, thumbnail_url, content, answer_data, correct, reply_startline, reply_deadline, reward, correct_limit);

        if (correct !== "") {
            console.log(new Date(reply_startline).getTime(), new Date(reply_deadline).getTime());
            if (new Date(reply_startline).getTime() < new Date(reply_deadline).getTime()) {
                Contract.create_quiz(title, explanation, thumbnail_url, content, answer_type, answer_data, correct, reply_startline, reply_deadline, reward, correct_limit, setShow);
            } else {
                alert("回答開始日時を回答締切日時より前に設定してください");
            }
        } else {
            alert("正解を入力してください");
        }
    };
    function getLocalizedDateTimeString(now = new Date()) {
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        const formatter = new Intl.DateTimeFormat("ja-JP", {
            timeZone: "Asia/Tokyo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        const localizedDateTimeString = formatter
            .format(now)
            .replace(/\u200E|\u200F/g, "")
            .replace(/\//g, "-")
            .replace(/ /, "T");

        return localizedDateTimeString;
    }
    function addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }
    function date_format(date) {
        return date.split(" ").join("T").slice(0, date.length - 3);
    }

    //初回のみ実行
    useEffect(() => {
        // let now = new Date();
        // const diff_time = new Date(now + 100);
        // setReply_deadline(addDays(now, 5));
        console.log(id);

        setTitle(quiz[2]);
        setExplanation(quiz[3]);
        setThumbnail_url(quiz[4]);
        setContent(quiz[5]);
        setAnswer_type(quiz[6]);
        setAnswer_data(quiz[7]);
        setReply_startline(getLocalizedDateTimeString(new Date(quiz[8] * 1000)));
        setReply_deadline(getLocalizedDateTimeString(new Date(quiz[9] * 1000)));
        setReward(quiz[10]);
        setCorrect_limit(quiz[12]);
        setState(quiz[13]);
        setnow(getLocalizedDateTimeString());
        console.log(quiz)
        // console.log(now);
        // console.log(new Date().toISOString().slice(0, 16));
    }, []);
    console.log(now);
    console.log(reply_deadline);
    console.log(reply_startline);

    return (
        <div>
            <div className="row">
                <div className="col-2" />
                <div className="col-8">
                    <Form>
                        <Form.Group className="mb-3" controlId="form_titile" style={{ textAlign: "left" }}>
                            <Form.Label>タイトル</Form.Label>
                            <Form.Control type="text" placeholder="Enter Title" value={title} onChange={(event) => setTitle(event.target.value)} />
                        </Form.Group>
                    </Form>
                    <Form.Group className="mb-3" style={{ textAlign: "left" }}>
                        <Form.Label>説明</Form.Label>
                        <Form.Control as="textarea" rows={explanation.split("\n").length + 3} value={explanation} onChange={(event) => setExplanation(event.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" style={{ textAlign: "left" }}>
                        <Form.Label>サムネイル</Form.Label>
                        <Form.Control type="url" value={thumbnail_url} onChange={(event) => setThumbnail_url(event.target.value)} />
                    </Form.Group>
                    <img src={thumbnail_url} width="200" />
                    <br />

                    <Form.Group className="mb-3" data-color-mode="light" style={{ textAlign: "left" }}>
                        <Form.Label>内容</Form.Label>
                        <MDEditor height={500} value={content} onChange={setContent} />
                    </Form.Group>

                    {/*
                    <Answer_select name={"回答の追加"} variable={answer_data} variable1={correct} set={setAnswer_data} set1={setCorrect} setAnswer_type={setAnswer_type} answer_type={answer_type} />
                    */}
                    <Form.Group className="mb-3" style={{ textAlign: "left" }}>
                        <Form.Label>回答開始日時</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            //defaultValue={reply_startline}
                            value={reply_startline}
                            min={reply_startline}
                            onChange={(event) => setReply_startline(new Date(event.target.value))}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" style={{ textAlign: "left" }}>
                        <Form.Label>回答締切日時</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            //defaultValue={reply_deadline}
                            value={reply_deadline}
                            min={reply_deadline}
                            onChange={(event) => setReply_deadline(new Date(event.target.value))}
                        />
                    </Form.Group>


                    <div style={{ textAlign: "right" }}>
                        <Button variant="primary" onClick={() => create_quiz()} style={{ marginTop: "20px" }}>
                            クイズを作成
                        </Button>
                    </div>
                </div>
                <div className="col-2" />
            </div>

            <Wait_Modal showFlag={show} />
        </div>
    );





}

{/*
const { ethereum } = window;
const mkdStr = "";

function Create_quiz() {
    let Contract = new Contracts_MetaMask();
    const [id, setId] = useState(useParams()["id"]);
    const [quiz, setQuiz] = useState(null);
    console.log(id);

    useEffect(() => {
        // let now = new Date();
        // const diff_time = new Date(now + 100);
        // setReply_deadline(addDays(now, 5));
        const get_contract = async () => {
            setQuiz(await Contract.get_quiz_all_data(id));
        };
        get_contract(id);
        console.log(quiz);
        // console.log(now);
        // console.log(new Date().toISOString().slice(0, 16));
    }, []);
}
*/}

export default Create_quiz;