import { id } from "ethers/lib/utils";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Add_students from "./components/add_student";
import Add_teacher from "./components/add_teacher";
import View_result from "./components/view_results";
function Admin_page(props) {


    const [component, setComponent] = useState("Add_students");

    const handleClick = (event) => {
        const { name } = event.target;
        console.log(name)
        setComponent(name);
        
    };
    return (
        
        <div style={{width:"70%",margin: "0 auto" }}>
            <div className="btn-group" style={{ "margin": "20px" }}>
                <button
                    type="button"
                    name="Add_students"
                    className="btn btn-primary"
                    onClick={handleClick}
                >
                    生徒を追加
                </button>

            </div>
            <div className="btn-group" style={{ "margin": "20px" }}>

                <button
                    type="button"
                    name="Add_teacher"
                    className="btn btn-primary"
                    onClick={handleClick}
                >
                    教員orTAを追加
                </button>

            </div>
            <div className="btn-group" style={{ "margin": "20px" }}>

                <button
                    type="button"
                    name="View_result"
                    className="btn btn-primary"
                    onClick={handleClick}
                >
                    生徒の成績を閲覧
                </button>

            </div>
            
            {/* name={"回答の追加"} variable={answer_data} variable1={correct} set={setAnswer_data} set1={setCorrect}/ */}
            {component === "Add_students" && <Add_students cont={props.cont}/>}
            {component === "Add_teacher" && <Add_teacher cont={props.cont}/>}
            {component === "View_result" && <View_result cont={props.cont}/>}
        </div>
    );
}


export default Admin_page;