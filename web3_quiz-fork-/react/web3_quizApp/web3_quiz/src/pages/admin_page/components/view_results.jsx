import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
//import { createObjectCsvWriter } from 'csv-writer';
import { Contracts_MetaMask } from "../../../contract/contracts";
function View_result(props) {

    let contract = new Contracts_MetaMask();
    const [results, setResults] = useState([]);
    const [data_for_survey, setData_for_survey] = useState(null);

    const handle_export_csv = () => {
        console.log(data_for_survey);
        {/*
        const data = data_for_survey;

        const csvHeader = [
            { id: 'address', title: 'Address' },
            { id: 'create_quiz_count', title: 'Create Quiz Count' },
            { id: 'result', title: 'Result' },
        ];

        // CSVファイルの内容を生成
        const csvWriter = createObjectCsvWriter({
            path: 'exported_data.csv', // ファイル名
            header: csvHeader,
        });

        // データをCSVに書き込む
        csvWriter.writeRecords(data)
            .then(() => {
                console.log('CSV exported successfully!');
            })
            .catch((error) => {
                console.error('Error exporting CSV: ', error);
            });

        const downloadLink = document.createElement('a');
        downloadLink.href = 'exported_data.csv'; // 保存したファイルのパス
        downloadLink.download = 'exported_data.csv'; // ダウンロード時のファイル名
        downloadLink.click();
        */}

    }

    //初回のみ実行
    useEffect(() => {
        async function get_data_for_survey() {
            setData_for_survey(await contract.get_data_for_survey());
        }
        get_data_for_survey();
        props.cont.get_results().then((result) => {
            console.log(result);
            setResults(result);
        });
    }, []);

    return (
        <div className="mypage">
            <Button variant="primary" onClick={() => handle_export_csv()}>成績データのCSVファイルの出力</Button>
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
