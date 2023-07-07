import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
function View_result(props) {

    const [results, setResults] = useState([]);


    //初回のみ実行
    useEffect(() => {

        props.cont.get_results().then((result) => {
            console.log(result);
            setResults(result);
        });

    }, []);

    return (
        <div className="mypage">
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>address</th>
                        <th>得点</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((item, index) => {
                        return (

                            <tr>
                                <td>{index + 1}</td>
                                <td>{item[0]}</td>
                                <td>{item[1].toString() / 10 ** 18}点</td>
                            </tr>
                        );
                    })
                    }
                </tbody>
            </table>
        </div>

    );
}

export default View_result;