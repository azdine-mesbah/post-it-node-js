import DeletePost from './modules/deleteForm'
import ProfileNav from './modules/profileNav'
import LiveSearch from './modules/liveSearch'
import Chats from './modules/chats'
if($('#delete-post')[0]){new DeletePost()}
if($('#profile-nav')[0]){new ProfileNav()}
if($('#live-search')[0]){new LiveSearch()}
if($('#chat-wrapper')[0]){new Chats()}