import { id } from "ethers/lib/utils";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Add_students from "./components/add_student";
import Add_teacher from "./components/add_teacher";
import View_result from "./components/view_results";
//import { CSVLink, CSVDownload } from "react-csv";
function Admin_page(props) {
    const [component, setComponent] = useState("Add_students");
    const [isteacher, setisteacher] = useState(null);
    /*
    const [students, setStudents] = useState(null);
    const [answer_hashs, setAnswer_hashs] = useState(null);
    const [quiz_data, setQuiz_data] = useState(null);
    const [csvdownloader, setCsvdownloader] = useState(false);
    const quiz_id = 10;
    

    const handle_export_csv = () => {
        let quiz_data = []
        for (let i = 0; i < students.length; i++) {
            quiz_data.push([students[i].toString(), (answer_hashs[students[i]]).toString()]);
        }
        setQuiz_data(quiz_data);
        setCsvdownloader(true);
    }

    function Create_csvlink(props) {
        return (
            <div>
                <div><CSVLink filename={`quiz_answers${props.cont[1]}.csv`} variant="primary" data={props.cont[0]}>こちらから学生の成績データをダウンロード</CSVLink></div>
            </div>
        );

    }
    */

    const handleClick = (event) => {
        const { name } = event.target;
        console.log(name);
        setComponent(name);
    };

    useEffect(() => {
        async function is_teacher() {
            setisteacher(await props.cont.isTeacher());
        }
        /*
        async function get_student_list() {
            setStudents(await props.cont.get_student_list());
        }
        */

        is_teacher();
        //get_student_list();
    }, []);

    /*
    useEffect(() => {
        async function answer_hashs() {
            setAnswer_hashs(await props.cont.get_students_answer_hash_list(students, quiz_id));
        }
        answer_hashs();
    }, [students]);
    */

    //console.log(students);
    //console.log(answer_hashs);
    if (isteacher) {
        return (
            <div style={{ width: "70%", margin: "0 auto" }}>
                <div className="btn-group" style={{ margin: "20px" }}>
                    <button type="button" name="Add_students" className="btn btn-primary" onClick={handleClick}>
                        生徒を追加
                    </button>
                </div>
                <div className="btn-group" style={{ margin: "20px" }}>
                    <button type="button" name="Add_teacher" className="btn btn-primary" onClick={handleClick}>
                        教員orTAを追加
                    </button>
                </div>
                <div className="btn-group" style={{ margin: "20px" }}>
                    <button type="button" name="View_result" className="btn btn-primary" onClick={handleClick}>
                        生徒の成績を閲覧
                    </button>
                </div>

                {/* name={"回答の追加"} variable={answer_data} variable1={correct} set={setAnswer_data} set1={setCorrect}/ */}
                {component === "Add_students" && <Add_students cont={props.cont} />}
                {component === "Add_teacher" && <Add_teacher cont={props.cont} />}
                {component === "View_result" && <View_result cont={props.cont} />}
                {/*
                {answer_hashs ? <Button variant="primary" onClick={() => handle_export_csv()}>quiz_id[{quiz_id}]のCSVファイルの出力</Button> : ""}
                {csvdownloader === true && <Create_csvlink cont={[quiz_data, quiz_id]} />}
                */}
            </div>
        );
    } else {
        return (<></>);
    }
}

export default Admin_page;
