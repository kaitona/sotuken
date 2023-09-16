import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { CSVLink, CSVDownload } from "react-csv";
import { Contracts_MetaMask } from "../../../contract/contracts";

function Create_csvlink(props) {
    return (
        <CSVLink variant="primary" data={props.cont}>こちらからダウンロード</CSVLink>
    );
}

function View_result(props) {

    let contract = new Contracts_MetaMask();
    const [results, setResults] = useState([]);
    const [data_for_survey, setData_for_survey] = useState(null);
    const [data, setData] = useState(null);
    const [csvdownloader, setCsvdownloader] = useState(false);

    const handle_export_csv = () => {
        console.log(data_for_survey);

        const data = [
            Object.keys(data_for_survey[0])
        ]
        for (let i = 0; i < data_for_survey.length; i++) {
            data.push([data_for_survey[i].user, Number(data_for_survey[i].create_quiz_count).toString(), (Number(data_for_survey[i].result) / (10 ** 18)).toString()]);
        }
        setData(data);
        setCsvdownloader(true);
    }

    async function get_data_for_survey() {
        setData_for_survey(await contract.get_data_for_survey());
    }

    //初回のみ実行
    useEffect(() => {
        console.log(data_for_survey);


        get_data_for_survey();
        props.cont.get_results().then((result) => {
            console.log(result);
            setResults(result);
        });
    }, []);

    return (
        <div className="mypage">
            <div class="row">
                <Button variant="primary" onClick={() => handle_export_csv()}>成績データのCSVファイルの出力</Button>
                {csvdownloader === true && <Create_csvlink cont={data} />}
            </div>
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
                                <td>{item.student}</td>
                                <td>{Number(item.result) / 10 ** 18}点</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default View_result;
