import { FC, useEffect, useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import logo from '../../Assets/logo.png';
import { useHistory } from 'react-router-dom';
import constants from '../../lib/constants';
import IUser from '../../Interfaces/IUser';
import '../../instances/i18next.js';

const Login: FC = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser>();
    const [userName, setUserName] = useState<string>('');
    const history = useHistory();

    const { i18n } = useTranslation();
    document.body.dir = i18n.dir();

    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(1),
            width: 173,
        },
    }));

    const classes = useStyles();

    useEffect(() => {
        getUsersData();
    }, []);

    const handleChange = (event: any) => {
        let user = users.find(element => element.user_name === event.target.value);
        setUserName(user.user_name);
        setSelectedUser(user);
    };

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


    const login = async () => {
        if (!selectedUser) { return; }
        let obj = {
            'user_name': selectedUser.user_name,
            'user_id': selectedUser.user_id,
            'authentication': true
        };
        let path = '/chatRoom'
        history.push({
            pathname: path,
            state: obj
        });
    }

    return (
        <div className="Login">
            <button onClick={() =>
                i18n.language === "en"
                    ? i18n.changeLanguage("he")
                    : i18n.changeLanguage("en")}>
                🌍
            </button>
            <img src={logo} className="logo" alt=""></img>
            <h5 className="header">{t("login_header")}</h5>
            <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">{t("user")}</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={userName}
                    onChange={handleChange}
                >
                    {users.map((user, index) =>
                        <MenuItem key={index} className="lane-name" value={user.user_name}>{user.user_name}</MenuItem>
                    )}
                </Select>
            </FormControl>

            <button className="login-btn" onClick={login}>{t("login")}</button>
        </div>
    );
}

export default Login;
