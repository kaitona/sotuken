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

    let Contract = new Contracts_MetaMask();

    const handleOptionChange = (event) => {
        setIsNotPayingOut(event.target.value);
        console.log(isNotPayingOut);

    };

    async function get_contract() {
        setNumOfStudent(await Contract.get_num_of_students());
    }

    get_contract();

    const investment_to_quiz = async () => {
        Contract.investment_to_quiz(id, amount, isNotPayingOut, numOfStudent);
    };

    console.log(isNotPayingOut);


    return (
        <>
            <div className="row justify-content-center">
                <div className="col-10">
                    このテストのIDは{id}です
                </div>
                <div className="col-10">
                    以下に追加する報酬(Wake)の量を指定してください<br />
                    //1行のみのフォームにしたい
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
                    あなたから払いだされるWakeトークン量； {amount * numOfStudent}Wake

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
                <Button variant="primary" onClick={() => investment_to_quiz()} style={{ marginTop: "20px" }}>
                    クイズを作成
                </Button>

            </div>
        </>
    );
}

export default Investment_to_quiz;