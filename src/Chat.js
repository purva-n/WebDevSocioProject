import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import {db, storage} from './firebase'
import firebase from 'firebase'
import './ImageUpload/ImageUpload.css'
import { ChatEngine, getOrCreateChat } from 'react-chat-engine'
import { useLocation } from 'react-router-dom'

const Chat = ({route}) => {
	const [user_name, setUsername] = useState('')
    const {state} = useLocation();
    console.log(state)
    const username = state.username;
    const password = state.password;
	function createDirectChat(creds) {
		getOrCreateChat(
			creds,
			{ is_direct_chat: true, usernames: [user_name] },
			() => setUsername('')
		)
	}

	function renderChatForm(creds) {
		return (
			<div>
				<input 
					placeholder='Search' 
					value={user_name} 
					onChange={(e) => setUsername(e.target.value)} 
				/>
				<button onClick={() => createDirectChat(creds)}>
					Search
				</button>
			</div>
		)
	}

    return (
		<ChatEngine
			height='100vh'
			userName={username}
			userSecret={password}
			projectID='85ba85d9-00c0-4755-9a3a-1e428aeaacc6'
			renderNewChatForm={(creds) => renderChatForm(creds)}
		/>
	)
}

export default Chat;