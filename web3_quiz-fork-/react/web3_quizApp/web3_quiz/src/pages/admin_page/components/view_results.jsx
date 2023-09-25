import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { CSVLink, CSVDownload } from "react-csv";
import { Contracts_MetaMask } from "../../../contract/contracts";

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1し、2桁にパディング
    const day = String(now.getDate()).padStart(2, '0'); // 日を2桁にパディング
    const hours = String(now.getHours()).padStart(2, '0'); // 時を2桁にパディング
    const minutes = String(now.getMinutes()).padStart(2, '0'); // 分を2桁にパディング
    const seconds = String(now.getSeconds()).padStart(2, '0'); // 秒を2桁にパディング

    const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
    return formattedDateTime;
}

function Create_csvlink(props) {
    return (
        <div>
            <div><CSVLink filename={`students_data_${getCurrentDateTime()}.csv`} variant="primary" data={props.cont[0]}>こちらから学生の成績データをダウンロード</CSVLink></div>
            <div><CSVLink filename={`quizs_data_${getCurrentDateTime()}.csv`} variant="primary" data={props.cont[1]}>こちらから小テストの統計データをダウンロード</CSVLink></div>
        </div>
    );

}

function View_result(props) {

    let contract = new Contracts_MetaMask();
    const [results, setResults] = useState([]);
    const [data_for_survey_users, setData_for_survey_users] = useState(null);
    const [data_for_survey_quizs, setData_for_survey_quizs] = useState(null);
    const [usersData, setUsersData] = useState(null);
    const [quizsData, setQuizsData] = useState(null);
    const [csvdownloader, setCsvdownloader] = useState(false);

    const handle_export_csv = () => {
        console.log(data_for_survey_users);

        const users_data = [
            Object.keys(data_for_survey_users[0])
        ]
        for (let i = 0; i < data_for_survey_users.length; i++) {
            users_data.push([data_for_survey_users[i].user, Number(data_for_survey_users[i].create_quiz_count).toString(), (Number(data_for_survey_users[i].result) / (10 ** 18)).toString()]);
        }

        const quizs_data = [
            Object.keys(data_for_survey_quizs[0])
        ]
        for (let i = 0; i < data_for_survey_quizs.length; i++) {
            quizs_data.push([(Number(data_for_survey_quizs[i].reward) / (10 ** 18)).toString(), (Number(data_for_survey_quizs[i].respondent_count)).toString()]);
        }

        setUsersData(users_data);
        setQuizsData(quizs_data);
        setCsvdownloader(true);
    }

    async function get_data_for_survey() {
        setData_for_survey_users(await contract.get_data_for_survey_users());
        setData_for_survey_quizs(await contract.get_data_for_survey_quizs());
    }

    //初回のみ実行
    useEffect(() => {

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
                {csvdownloader === true && <Create_csvlink cont={[usersData, quizsData]} />}
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
