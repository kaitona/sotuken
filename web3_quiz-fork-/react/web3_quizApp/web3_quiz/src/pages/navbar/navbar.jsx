import {useEffect, useState} from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./navbar.css";
import {AiFillPropertySafety, AiOutlineUser} from "react-icons/ai";
import {MdOutlineQuiz} from "react-icons/md";
import {AiOutlineUnorderedList} from "react-icons/ai";
import {BrowserRouter as Router, Route, NavLink, Switch} from "react-router-dom";
import {AiFillHome, AiFillSetting, AiFillStar} from "react-icons/ai";
import {Contracts_MetaMask} from "../../contract/contracts";
import Modal_change_network from "./Modal_change_network";
<<<<<<< HEAD
=======

function Nav_menu(props) {
    const [useing_address, Set_useing_address] = useState(null);
    const [chain_id, setChain_id] = useState(null);

    useEffect(() => {
        //非同期処理をUseEffect内で行う場合は、async/awaitを使用する
        const get_variable = async () => {
            setChain_id(await props.cont.get_chain_id());
            Set_useing_address(await props.cont.get_address());
        };
        get_variable();
    }, []);
>>>>>>> 0bb4b08f2ea9c56397f664b8504b93bbcb26a452

function create_edit_button() {
    return (
        <>
<<<<<<< HEAD
            <div className="col-1"></div>
            <div className="col-3">
                <Nav.Item>
                    <Nav.Link eventKey="edit" href={"/#"}>
                        <div className="col-12">
                            <AiOutlineUser size={30} />
                        </div>
                        <div className="col-12 d-flex justify-content-center align-items-center">
                            <font size="2">テストの編集</font>
                        </div>
                    </Nav.Link>
                </Nav.Item>
=======
            <Modal_change_network chain_id={chain_id} cont={props.cont} />
            <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                <Navbar
                    fixed="bottom"
                    bg="light"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div className="row justify-content-center ">
                        <div className="col-3">
                            <Nav.Item>
                                <Nav.Link eventKey="/list_quiz" href="/list_quiz">
                                    <div className="col-12 ">
                                        <AiOutlineUnorderedList size={30} />
                                    </div>
                                    <div className="col-12 d-flex justify-content-center align-items-center">
                                        <font size="2">一覧</font>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                        </div>
                        <div className="col-1"></div>

                        <div className="col-3">
                            <Nav.Item>
                                <Nav.Link eventKey="/create_quiz" href="/create_quiz">
                                    <div className="col-12 ">
                                        <MdOutlineQuiz size={30} />
                                    </div>
                                    <div className="col-12 d-flex justify-content-center align-items-center">
                                        <font size="2">出題</font>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                        </div>
                        <div className="col-1"></div>
                        <div className="col-3">
                            <Nav.Item>
                                <Nav.Link eventKey="user_page" href={"/user_page/" + useing_address}>
                                    <div className="col-12">
                                        <AiOutlineUser size={30} />
                                    </div>
                                    <div className="col-12 d-flex justify-content-center align-items-center">
                                        <font size="2">myPage</font>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                        </div>
                    </div>
                </Navbar>
>>>>>>> 0bb4b08f2ea9c56397f664b8504b93bbcb26a452
            </div>
        </>
    );
}

<<<<<<< HEAD
function Nav_menu(props) {
    const [useing_address, Set_useing_address] = useState(null);
    const [chain_id, setChain_id] = useState(null);
    const [isTeacher, setIsTeacher] = useState(false);

    useEffect(() => {
        //非同期処理をUseEffect内で行う場合は、async/awaitを使用する
        const get_variable = async () => {
            setChain_id(await props.cont.get_chain_id());
            Set_useing_address(await props.cont.get_address());
        };

        const is_teacher = async () => {
            setIsTeacher(await props.cont.isTeacher());
        };

        is_teacher();
        get_variable();
    }, []);
    console.log(isTeacher);
    return (
        <>
            <Modal_change_network chain_id={chain_id} cont={props.cont} />
            <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                <Navbar
                    fixed="bottom"
                    bg="light"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div className="row justify-content-center ">
                        <div className="col-3">
                            <Nav.Item>
                                <Nav.Link eventKey="/list_quiz" href="/list_quiz">
                                    <div className="col-12 ">
                                        <AiOutlineUnorderedList size={30} />
                                    </div>
                                    <div className="col-12 d-flex justify-content-center align-items-center">
                                        <font size="2">一覧</font>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                        </div>
                        <div className="col-1"></div>

                        <div className="col-3">
                            <Nav.Item>
                                <Nav.Link eventKey="/create_quiz" href="/create_quiz">
                                    <div className="col-12 ">
                                        <MdOutlineQuiz size={30} />
                                    </div>
                                    <div className="col-12 d-flex justify-content-center align-items-center">
                                        <font size="2">出題</font>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                        </div>
                        <div className="col-1"></div>
                        <div className="col-3">
                            <Nav.Item>
                                <Nav.Link eventKey="user_page" href={"/user_page/" + useing_address}>
                                    <div className="col-12">
                                        <AiOutlineUser size={30} />
                                    </div>
                                    <div className="col-12 d-flex justify-content-center align-items-center">
                                        <font size="2">myPage</font>
                                    </div>
                                </Nav.Link>
                            </Nav.Item>
                        </div>
                        {isTeacher && <create_edit_button />}
                    </div>
                </Navbar>
            </div>
        </>
    );
}

=======
>>>>>>> 0bb4b08f2ea9c56397f664b8504b93bbcb26a452
export default Nav_menu;
