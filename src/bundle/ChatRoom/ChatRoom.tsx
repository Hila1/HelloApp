import { FC, useEffect, useState, useRef } from 'react';
import './ChatRoom.css';
import useChatMessageWebsocket from '../../services/messagesSocket';
import { useHistory } from 'react-router-dom';
const moment = require('moment');
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import React from 'react';
import constants from '../../lib/constants';
import IMessage from '../../Interfaces/IMessage'


type StateType = {
    id: number,
    type: number
}

type IndexProps = RouteComponentProps<{}, {}, StateType>;

const ChatRoon: FC<IndexProps> = ({ location }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const messagesEndRef = useRef(null);
    const params = location.state;
    const userId = params ? params.user_id : -1;
    let [receivedMessage] = useChatMessageWebsocket();

    const [users, setUsers] = useState<any[]>([]);
    const [nickname, setNickname] = useState<string>();
    const [recentMessages, setRecentMessages] = useState<IMessage[]>([]);
    const [inputBoxValue, setInputBoxValue] = useState<string>("");

    useEffect(() => {
        if (!params || !params.authentication) {
            console.log("error with nickname. moving to login.");
            history.push({ pathname: '/login' });
            return;
        }
        sendUserLeftOrJoinedRoomMessage(true);//true for joined

        setNickname(params.user_name);
        getUserRecentMessages();
        getUsersData();

        return () => {
            sendUserLeftOrJoinedRoomMessage(false);//false for left
        }
    }, []);


    const getUserRecentMessages = async () => {
        let url = constants.BE_URL + "api/messages/getUserRecentMessages";
        const data = await axios.get(url);
        console.log(data.data);
        setRecentMessages(data.data);
        scrollToBottom();
    }

    const getUsersData = async () => {
        try {
            let url = constants.BE_URL + "api/users/getAllUsers";
            const obj = await axios.get(url);
            console.log(obj.data);
            setUsers(obj.data);
        } catch (error) {
            console.log(error);
        }
    }

    const sendUserLeftOrJoinedRoomMessage = async (userJoined) => {
        try {
            let currentMillis = Date.now();
            let url = constants.BE_URL + "api/messages/sendNewMessage";
            let data = {
                'msg_content': '',
                'msg_type': userJoined ? constants.USER_JOINED : constants.USER_LEFT,
                'msg_sender_id': userId,
                'msg_send_time': currentMillis
            }
            let resData = await axios.post(url, data);
            console.log(resData);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log(receivedMessage);
        if (!receivedMessage) { return; }

        let lst = [...recentMessages, receivedMessage];
        setRecentMessages(lst);
        scrollToBottom();
    }, [receivedMessage]);



    const sendMessage = () => {
        if (inputBoxValue === "") {
            return;
        }
        else {
            sendNewMessageToServer(inputBoxValue);
            setInputBoxValue("");
        }
    }

    const sendNewMessageToServer = async (textMessage) => {
        try {
            let currentMillis = Date.now();
            let url = constants.BE_URL + "api/messages/sendNewMessage";
            let data = {
                'msg_content': textMessage,
                'msg_type': constants.TEXT_MESSAGE,
                'msg_sender_id': userId,
                'msg_send_time': currentMillis
            }
            let resData = await axios.post(url, data);
            console.log(resData);
        } catch (error) {
            console.log(error);
        }
    }

    const handleInputChange = (event) => {
        setInputBoxValue(event.target.value);
    }

    const scrollToBottom = () => {
        let id = 'messagesEnd';
        let yOffset = -100;
        let element = document.getElementById(id);
        let y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
    }



    return (
        <div className="ChatRoom">
            <div className="row">
                <div className="column">
                    <h2 className="chat-room-header">{t("hello_user") + " " + nickname}</h2>
                </div>
            </div>

            <div className='messages-container'>
                {recentMessages.map((message, index) =>
                    <div key={index}
                        className={
                            (message.msg_type === constants.USER_JOINED || message.msg_type === constants.USER_LEFT) ? 'message user-joined' :
                                (message.msg_sender_id === userId) ? 'message message-send' :
                                    'message message-received'
                        }>
                        <label className={(message.msg_type === constants.USER_JOINED || message.msg_type === constants.USER_LEFT) ?
                            'user-name-label joined-labed' : 'user-name-label'}>
                            {!users ? null :
                                message.msg_sender_id === userId ? t("you") :
                                    !users.find((user) => user.user_id === message.msg_sender_id) ? null :
                                        users.find((user) => user.user_id === message.msg_sender_id).user_name
                            }
                        </label>

                        {message.msg_type === constants.USER_JOINED ? t('joined_the_conversation') :
                            message.msg_type === constants.USER_LEFT ? t('left_the_conversation') :
                                message.msg_content}
                        <label className='time-label'>{moment(message.msg_send_time).format('MM/DD/YYYY')}</label>
                    </div>
                )}
                <div id='messagesEnd' />
            </div>


            <div className='form'>
                <input value={inputBoxValue} type="text" name="name" className="input-field" onChange={handleInputChange} />

                <button className='button'
                    onClick={sendMessage}>
                    ➤
                </button>
            </div>
        </div>
    );
}

export default ChatRoon;
