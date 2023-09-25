import { useState } from "react";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import { Contracts_MetaMask } from "../../contract/contracts";

function Investment_to_quiz() {
    const location = useLocation();

    const [id, setId] = useState(location.state.args[0]);
    const [amount, setAmount] = useState(0);
    const [isNotPayingOut, setIsNotPayingOut] = useState("true");
    const [numOfStudent, setNumOfStudent] = useState(0);
    const [answer, setAnswer] = useState("");
    const [isteacher, setisteacher] = useState(null);
    const [isNotAddingReward, setIsNotAddingReward] = useState("true");

    let Contract = new Contracts_MetaMask();

    const handleOptionChange = (event) => {
        setIsNotPayingOut(event.target.value);
        console.log(isNotPayingOut);

    };

    const adding_reward = (event) => {
        setIsNotAddingReward(event.target.value);
        console.log(isNotAddingReward);

    };

    async function get_contract() {
        setNumOfStudent(await Contract.get_num_of_students());
    }

    async function is_teacher() {
        setisteacher(await Contract.isTeacher());
    }

    get_contract();
    is_teacher();

    const convertFullWidthNumbersToHalf = (() => {
        // 全角数字と半角数字の差分を計算
        const diff = "０".charCodeAt(0) - "0".charCodeAt(0);

        // 置換関数を返す
        return text => text.replace(
            /[０-９]/g
            , m => String.fromCharCode(m.charCodeAt(0) - diff)
        );
    })();

    const investment_to_quiz = async () => {
        if ((answer == "" && isNotPayingOut == "false") == false) {
            Contract.investment_to_quiz(id, amount, convertFullWidthNumbersToHalf(answer), isNotPayingOut, numOfStudent, isNotAddingReward);
        } else {
            alert("答えを入力してください");
        }
    };

    console.log(isNotPayingOut);


    if (isteacher) {
        return (
            <div className="col">
                <div className="row justify-content-center">
                    <div className="col-10">
                        このテストのIDは{id}です
                    </div>
                    <div className="col-10">
                        以下に追加する報酬(Wake)の量を指定してください<br />
                        <input
                            type="text"
                            className="form-control"
                            value={amount}
                            onChange={(event) => {
                                setAmount(event.target.value);
                            }}
                        />
                        正答した生徒一人ひとりに与えられるWakeトークン量： {amount}Wake
                        <br />
                        あなたから払いだされるWakeトークン量： {amount * numOfStudent}Wake

                    </div>
                    <div className="col-10" style={{ marginTop: "20px" }}>
                        以下に確定した答えを入力してください
                        <input
                            type="text"
                            className="form-control"
                            value={answer}
                            onChange={(event) => {
                                setAnswer(event.target.value);
                            }}
                        />

                    </div>
                    <br />
                    以下は、解答を確定して報酬の払い出しを行うか行わないかの選択です。
                    <div className="col-10">
                        <label>
                            <input
                                type="radio"
                                value="true"
                                onChange={handleOptionChange}
                                checked={isNotPayingOut === "true"}
                            />
                            まだ報酬の払い出しを行わない
                        </label>
                        <br />
                        <label>
                            <input
                                type="radio"
                                value="false"
                                onChange={handleOptionChange}
                                checked={isNotPayingOut === "false"}
                            />
                            解答を確定して報酬を払い出す
                        </label>
                    </div>
                    <br />
                    この問題は発表されましたか？発表されていれば発表者に二倍のトークンを支払います
                    <div className="col-10">
                        <label>
                            <input
                                type="radio"
                                value="true"
                                onChange={adding_reward}
                                checked={isNotAddingReward === "true"}
                            />
                            発表されていない
                        </label>
                        <br />
                        <label>
                            <input
                                type="radio"
                                value="false"
                                onChange={adding_reward}
                                checked={isNotAddingReward === "false"}
                            />発表されている
                        </label>
                    </div>

                    <Button className="col-10" variant="primary" onClick={() => investment_to_quiz()} style={{ marginTop: "20px" }}>
                        報酬の追加、報酬の払い出しを実行
                    </Button>

                </div>
            </div>
        );
    } else {
        return (<></>);
    }
}

export default Investment_to_quiz;