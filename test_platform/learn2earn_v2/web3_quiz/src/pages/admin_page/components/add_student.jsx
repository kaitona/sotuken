import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
function Add_students(props) {
    const [addStudent, setAddStudent] = useState("");
    const [addStudent_list, setAddStudent_list] = useState([]);

    function add_student() {
        console.log(addStudent_list);
        props.cont.add_student(addStudent_list)
    }
    //addstudentが更新されたら実行
    useEffect(() => {

        setAddStudent_list(addStudent.split('\n'));
        console.log(addStudent_list);
    }, [addStudent]);

    return (
        <div className="mypage">
            <div className="add_student">
                追加する学生のアドレスを入力してください
                <Form.Group className="mb-3" style={{ textAlign: "left" }}>
                    <Form.Label>生徒のアドレスを入力して下さい</Form.Label>
                    <Form.Control as="textarea" rows={addStudent.split('\n').length + 3} value={addStudent} onChange={(event) => setAddStudent(event.target.value)} />
                </Form.Group>
                {addStudent_list.map((item, index) => {
                    return (
                        <div key={index}>
                            {item}
                        </div>
                    );
                })
                }
                <Button variant="primary" onClick={() => add_student()} style={{ marginTop: '20px' }}>
                    生徒をこのコントラクトに追加する
                </Button>
            </div>
        </div>

    );
}

export default Add_students;