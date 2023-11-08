import { Contracts_MetaMask } from "../../contract/contracts";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import Answer_select from "./components/answer_select";
import Button from "react-bootstrap/Button";
import "react-datepicker/dist/react-datepicker.css";
import Wait_Modal from "../../contract/wait_Modal";

const { ethereum } = window;
const mkdStr = "";

function Create_quiz() {
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
    const [reply_deadline, setReply_deadline] = useState(getLocalizedDateTimeString(addDays(new Date(), 1)));
    const [reward, setReward] = useState(0);

    let Contract = new Contracts_MetaMask();

    const [correct_limit, setCorrect_limit] = useState(null);
    const [state, setState] = useState("Null");
    const [now, setnow] = useState(null);
    const [show, setShow] = useState(false);

    const convertFullWidthNumbersToHalf = (() => {
        // 全角数字と半角数字の差分を計算
        const diff = "０".charCodeAt(0) - "0".charCodeAt(0);

        // 置換関数を返す
        return text => text.replace(
            /[０-９]/g
            , m => String.fromCharCode(m.charCodeAt(0) - diff)
        );
    })();

    const create_quiz = async () => {
        //console.log(title, explanation, thumbnail_url, content, answer_data, correct, reply_startline, reply_deadline, reward, correct_limit);

        if (correct !== "") {
            console.log(new Date(reply_startline).getTime(), new Date(reply_deadline).getTime());
            Contract.create_quiz(title, explanation, thumbnail_url, content, answer_type, answer_data, convertFullWidthNumbersToHalf(correct), reply_startline, reply_deadline, reward, correct_limit, setShow);
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

    //初回のみ実行
    useEffect(() => {
        // let now = new Date();
        // const diff_time = new Date(now + 100);
        // setReply_deadline(addDays(now, 5));
        async function get_contract() {
            setCorrect_limit((await Contract.get_num_of_students()) + 30);
        }
        get_contract();
        setnow(getLocalizedDateTimeString());
        // console.log(now);
        // console.log(new Date().toISOString().slice(0, 16));
    }, []);
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

                    {/*<Form.Group className="mb-3" style={{ textAlign: "left" }}>
                        <Form.Label>選択肢(正解の回答にチェックを入れてください)</Form.Label><br />
                        <Answer_area1 name={"回答の追加"} variable={answer_data} variable1={correct} set={setAnswer_data} set1={setCorrect}/>
                    </Form.Group> */}
                    <Answer_select name={"回答の追加"} variable={answer_data} variable1={correct} set={setAnswer_data} set1={setCorrect} setAnswer_type={setAnswer_type} answer_type={answer_type} />

                    <Form.Group className="mb-3" style={{ textAlign: "left" }}>
                        <Form.Label>回答開始日時</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            defaultValue={now}
                            //value={reply_deadline}
                            min={now}
                            onChange={(event) => setReply_startline(new Date(event.target.value))}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" style={{ textAlign: "left" }}>
                        <Form.Label>回答締切日時</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            defaultValue={reply_deadline}
                            //value={reply_deadline}
                            min={now}
                            onChange={(event) => setReply_deadline(new Date(event.target.value))}
                        />
                    </Form.Group>
                    {/*
                    <div className="row">

                        <Form.Group className="mb-3 col-4" style={{ textAlign: "left" }}>
                            <Form.Label>報酬</Form.Label>
                            <Form.Control type="number" min={1} step={1} value={reward} onChange={(event) => setReward(parseInt(event.target.value))} />
                        </Form.Group>
                        <div className="col-1" />

                        <Form.Group className="mb-3 col-4" style={{ textAlign: "left" }}>
                            <Form.Label>正解の上限</Form.Label>
                            <Form.Control type="number" min={1} step={1} value={correct_limit} onChange={(event) => setCorrect_limit(parseInt(event.target.value))} />
                        </Form.Group>
                    </div>
                    */}

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

export default Create_quiz;