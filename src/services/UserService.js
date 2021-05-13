import axios from 'axios';
import { Cache } from 'aws-amplify';
const Base_URL=process.env.REACT_APP_API_ENDPOINT_USERS

class UserService {

  getUsers() {
    var userToken = Cache.getItem('token');
    var nonce = Cache.getItem('nonce');
    return axios.get(Base_URL + '/users', { headers: {"Authorization" : `Bearer ${userToken} ${nonce}`} });
  }

  getMe() {
    var userToken = Cache.getItem('token');
    var nonce = Cache.getItem('nonce');
    return axios.get(Base_URL + '/me', { headers: {"Authorization" : `Bearer ${userToken} ${nonce}`} });
  }

  getInterests() {
    var userToken = Cache.getItem('token');
    var nonce = Cache.getItem('nonce');
    return axios.get(Base_URL + '/interests', { headers: {"Authorization" : `Bearer ${userToken} ${nonce}`} });
  }

  updateInterests(data) {
    var userToken = Cache.getItem('token');
    var nonce = Cache.getItem('nonce');
    return axios.put(Base_URL + '/interests/update', { interests: data}, {headers: {"Authorization" : `Bearer ${userToken} ${nonce}`}});
  }

  /*createAccount(userId, option) {
    return axios.post(Base_URL + '/me/create/' + option, {userId})
  }*/

}

export default new UserService()
