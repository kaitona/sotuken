import { useState, useEffect } from "react";

import { AiOutlineArrowRight } from "react-icons/ai";
import Change_user from "./change_user";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function User_card(props) {
    const [name, SetName] = useState(props.user_name);
    const [image_url, SetImage_url] = useState(props.icons);
    const [nameError, SetNameError] = useState("");
    const [state, Setstate] = useState("");

    const update_handler = () => {
        console.log("update_handler");
        console.log(name);
        console.log(image_url);
        if (nameError == false) {
            props.cont.update_user_data(name, image_url);
        } else {
            Setstate(false);
        }
    };
    const handle_SetName = (event) => {
        const value = event.target.value;
        SetName(value);

        // 電話番号の正規表現パターン
        const phonePattern = /^\d{2}[a-zA-Z]\d{4}$/;

        // 入力値が正規表現にマッチしない場合は、エラーメッセージを設定
        if (!phonePattern.test(value)) {
            SetNameError(true);
            console.log("errr");
        } else {
            SetNameError(false);
        }
    };
    //初回のみ実行
    useEffect(() => {
        console.log("初回のみ実行");
        console.log(props.state);
        console.log(props.user_name);
        console.log(props.icons);
        Setstate(props.state);
    }, []);

    if (true) {
        return (
            <>
                <div className="user_card">
                    {/* q:左上に表示 */}

                    {/* <Button variant="primary" onClick={() => Setstate(false)} style={{ position: 'absolute', top: 0, left: 0 }}>
                        更新
                    </Button> */}
                    {/* <img
                        src={props.icons}
                        alt=""
                        style={{
                            width: `75px`,
                            height: `75px`,
                            borderRadius: '50%',
                        }}
                    /> */}
                    {/* <div className="user_name">{props.user_name}</div> */}
                    <Button variant="primary" onClick={() => props.cont.add_token_wallet()} style={{ position: "absolute", top: 0, left: 0 }}>
                        トークンをwalletに追加
                    </Button>
                    <div className="address" style={{ "margin-top": "50px" }}>
                        {props.address.slice(0, 20)}....
                    </div>

                    {/* マージンを設定 */}
                    <div className="row" style={{ marginTop: "20px" }}>
                        <div className="col token d-flex flex-column">
                            <div>保有トークン</div>
                            <div>{props.token}wake</div>
                        </div>
                        <div className="col token-result d-flex flex-column">
                            <div>現在の順位</div>
                            <div>{props.num_of_student}人中{props.rank}位</div>
                        </div>
                        <div className="col token-result d-flex flex-column">
                            <div>獲得点数</div>
                            <div>{props.result}点</div>
                        </div>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="user_card">
                    <Button variant="primary" onClick={() => Setstate(true)} style={{ position: "absolute", top: 0, left: 0 }}>
                        <>キャンセル</>
                    </Button>
                    <div style={{ "margin-top": "30px" }}>
                        <Form onSubmit={update_handler}>
                            <div className="icon_image">
                                <Form.Group className="mb-3" controlId="form_image_url" style={{ textAlign: "left" }}>
                                    <Form.Label>アイコン</Form.Label>
                                    <Form.Control type="text" placeholder="image_url" value={image_url} onChange={(event) => SetImage_url(event.target.value)} />
                                </Form.Group>
                            </div>
                            <img src={image_url} alt="" style={{ width: `75px`, height: `75px`, borderRadius: "50%" }} />

                            <div className="user_name">
                                {nameError && <p style={{ color: "red" }}>入力形式が間違っています</p>}
                                <Form.Group className="mb-3" controlId="form_name" style={{ textAlign: "left" }}>
                                    <Form.Label>User_Name 例:22P5000</Form.Label>
                                    <Form.Control type="name" placeholder="Enter Name" value={name} onChange={handle_SetName} />
                                </Form.Group>
                            </div>
                            <Button variant="primary" onClick={update_handler} style={{ marginTop: "20px" }}>
                                <>更新</>
                            </Button>
                        </Form>
                    </div>
                    <div className="address">{props.address.slice(0, 20)}</div>
                    <div className="row" style={{ marginTop: "20px" }}>
                        <div className="col token d-flex flex-column">
                            <div>保有トークン</div>
                            <div>{props.token}wake</div>
                        </div>
                        <div className="col token-result d-flex flex-column">
                            <div>授業での配点</div>
                            <div>{props.result}点</div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default User_card;
