import { useState } from "react";
import Button from 'react-bootstrap/Button';
import { ImCross } from 'react-icons/im';
import Answer_area1 from "./answer_form1";
import Answer_area2 from "./answer_form2";

function Answer_select(props) {
    const [component, setComponent] = useState("Component1");

    const handleClick = (event) => {
        const { name } = event.target;
        setComponent(name);
        if (name === "Answer_area1") {
            props.setAnswer_type(0);
        }
        else if (name === "Answer_area2") {
            props.setAnswer_type(1);
        }
    };

    if (true) {
        return (
            <div>
                <div className="btn-group" style={{ "margin": "20px" }}>
                    <button
                        type="button"
                        name="Answer_area1"
                        className="btn btn-primary"
                        onClick={handleClick}
                    >
                        択一形式
                    </button>

                </div>
                <div className="btn-group" style={{ "margin": "20px" }}>

                    <button
                        type="button"
                        name="Answer_area2"
                        className="btn btn-primary"
                        onClick={handleClick}
                    >
                        入力形式
                    </button>

                </div>
                
                {/* name={"回答の追加"} variable={answer_data} variable1={correct} set={setAnswer_data} set1={setCorrect}/ */}
                {component === "Answer_area1" && <Answer_area1 name={"択一形式"} variable={props.variable} variable1={props.variable1} set={props.set} set1={props.set1} />}
                {component === "Answer_area2" && <Answer_area2 name={"入力形式"} variable={props.variable} variable1={props.variable1} set={props.set} set1={props.set1} />}
            </div>
        );
    }
}
export default Answer_select;