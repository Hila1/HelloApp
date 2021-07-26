import React from 'react';
import constants from '../lib/constants';
const io = require('socket.io-client');
let socket: any;
const initIO = () => {
	if (!socket) {
		socket = io.connect(constants.BE_URL);
	}
};

const getIO = () => {
	return socket;
};

const unsubscribeIO = () => {
	console.log("im in unsubscribeIO");
	socket.removeAllListeners();
}

export { initIO, getIO, unsubscribeIO };
