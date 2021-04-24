import axios from 'axios';
import { Cache } from 'aws-amplify';
const Base_URL=process.env.REACT_APP_API_ENDPOINT

class MessageService {

  getMessages() {
    var userToken = Cache.getItem('token');
    return axios.get(Base_URL + '/messages', { headers: {"Authorization" : `Bearer ${userToken}`} });
  }

  /*createAccount(userId, option) {
    return axios.post(Base_URL + '/me/create/' + option, {userId})
  }*/

}

export default new MessageService()
