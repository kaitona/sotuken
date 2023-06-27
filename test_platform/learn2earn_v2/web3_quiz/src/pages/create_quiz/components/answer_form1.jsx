import Button from 'react-bootstrap/Button';
import { useState,useEffect } from 'react';
import { ImCross } from 'react-icons/im';
function Answer_area1(props) {
    const [content, setContent] = useState("");

    //初回のみ実行
    useEffect(() => {
        props.set([]);
    }, []);
    function add_answer() {
        console.log(props.variable.indexOf(content));
        if (props.variable.indexOf(content) === -1) {
            props.set([...props.variable, content]);
            console.log(content);

            console.log("add_answer");
        }
        setContent("");
    }
    function del_answer(cont) {
        for (let i = 0; i < props.variable.length; i++) {
            console.log(props.variable[i]);
        }
        props.set(
            props.variable.filter((ans_, index) => (ans_ !== cont))
        )
    }
    return (
        //<Textarea name={"タイトル"} variable={title} set={setTitle}/>
        <>
            <p className="text-left"><font size="5">{props.name}</font> </p>
            <div className="row">
                <div className="col-10">
                    <textarea id="textarea" className="form-control" value={content}
                        rows={content.split('\n').length}
                        aria-describedby="basic-addon1"
                        onChange={(event) => setContent(event.target.value)} />

                </div>
                <div className="col-2">
                    <Button variant="primary" type="submit" onClick={() => { add_answer(); }}>
                        追加
                    </Button>
                </div>
            </div>

            <table className="table">

                <tbody>

                    {props.variable.map((cont) => {
                        let check_box;
                        if (props.variable1 === cont) {
                            check_box = <input className="form-check-input" type="checkbox" value={cont} id="flexCheckChecked" onChange={() => { props.set1(cont) }} checked />;
                        }
                        else {
                            check_box = <input className="form-check-input" type="checkbox" value={cont} id="flexCheckChecked" onChange={() => { props.set1(cont) }} />
                        }
                        return (
                            <tr key={cont}>
                                <th scope="col">{check_box}</th>

                                <th scope="col" className='left'>{cont}</th>
                                <th scope="col">
                                    <Button variant="primary btn-sm " type="submit" onClick={() => { del_answer(cont); }} >
                                        <ImCross />
                                    </Button>
                                </th>

                            </tr>
                        );
                    })}
                </tbody>
            </table>



        </>
    );
}
export default Answer_area1;