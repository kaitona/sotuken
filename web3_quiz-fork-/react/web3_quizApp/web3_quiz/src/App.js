import { useEffect, useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav_menu from "./pages/navbar/navbar";
import Login from "./contract/login";
import User_page from "./pages/user_page/user_page";
import Create_quiz from "./pages/create_quiz/create_quiz";
import List_quiz from "./pages/list_quiz/list_quiz_top";
import Answer_quiz from "./pages/answer_quiz/answer_quiz";
import Admin_page from "./pages/admin_page/admin";
import Edit_list from "./pages/edit_list/edit_list_top";
import Edit_quiz from "./pages/edit_quiz/edit_quiz";
import Investment_page from "./pages/investment_page/investment_page";
import { Contracts_MetaMask } from "./contract/contracts";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    const cont = new Contracts_MetaMask();
    const is_teacher = cont.isTeacher();

    const homeUrl = process.env.PUBLIC_URL;
    console.log(homeUrl);

    return (
        <div className="App">
            <body>
                <div>
                    <BrowserRouter basename={homeUrl}>
                        <Routes>
                            <Route path={"/login"} element={<Login url={"login"} cont={cont} />} />
                        </Routes>
                        <Routes>
                            <Route path={"/user_page/:address"} element={<User_page url={"user_page"} cont={cont} />} />
                        </Routes>
                        <Routes>
                            <Route path={"/create_quiz"} element={<Create_quiz url={"create_quiz"} cont={cont} />} />
                        </Routes>
                        <Routes>
                            <Route path={"/list_quiz"} element={<List_quiz url={"list_quiz"} cont={cont} />} />
                        </Routes>
                        <Routes>
                            <Route path={"/answer_quiz/:id"} element={<Answer_quiz url={"answer_quiz"} cont={cont} />} />
                            quiz_comp
                        </Routes>
                        <Routes>
                            {/* <Route path={'/answer_quiz/:id'} element={<Answer_quiz url={'answer_quiz'} />} cont={cont} /> */}
                            <Route path={"/admin"} element={<Admin_page url={"admin"} cont={cont} />} />
                            {/*<Route path={"/admin"} element={ is_teacher ? <Admin_page url={"admin"} cont={cont} /> : <Navigate replace to="/list_quiz" />}/>*/}
                            quiz_comp
                        </Routes>
                        <Routes>
                            <Route path={"/edit_list"} element={<Edit_list url={"edit_list"} cont={cont} />} />
                        </Routes>
                        <Routes>
                            <Route path={"/edit_quiz/:id"} element={<Edit_quiz url={"edit_quiz"} cont={cont} />} />
                            quiz_comp
                        </Routes>
                        <Routes>
                            <Route path={"/investment_page/:id"} element={<Investment_page url={"investment_page"} cont={cont} />} />
                            quiz_comp
                        </Routes>
                    </BrowserRouter>
                </div>
                <div>
                    <Nav_menu cont={cont} home={homeUrl} />
                </div>
            </body>
        </div>
    );
}

export default App;
