import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
function Add_teacher(props) {

    const [addteacher, setAddTeacher] = useState("");
    const [teachers, setTeachers] = useState([]);

    function add_teacher() {
        props.cont.add_teacher(addteacher)
    }
    useEffect(() => {
        props.cont.get_teachers().then((result) => {
            console.log(result);
            setTeachers(result);
        });
    }, []);


    return (
        <>
            <div className="mypage">
                <div className="add_student">
                   
                    <Form>
                        <Form.Group className="mb-3" controlId="form_titile" style={{ textAlign: "left" }}>
                            <Form.Label> 追加する教員orTAのアドレスを入力してください(1人ずつ)</Form.Label>
                            <Form.Control type="text" value={addteacher} onChange={(event) => setAddTeacher(event.target.value)} />
                        </Form.Group>
                    </Form>

                    <Button variant="primary" onClick={() => add_teacher()} style={{ marginTop: '20px' }}>
                        教員orTAをこのコントラクトに追加する
                    </Button>
                </div>
            </div>
            <div>
                <h5>教員orTAの一覧</h5>
                {teachers.map((item, index) => {
                    return (
                        <div key={index}>
                            {item}

                        </div>
                    );
                })
                }


            </div>
        </>

    );
}

export default Add_teacher;