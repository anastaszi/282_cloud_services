import axios from 'axios';
import { Cache } from 'aws-amplify';
const Base_URL=process.env.REACT_APP_API_ENDPOINT_ADMIN

class AdminService {

  getUsers() {
    var userToken = Cache.getItem('token');
    return axios.get(Base_URL + '/users', { headers: {"Authorization" : `Bearer ${userToken}`} });
  }

  getUserInfo(userId) {
    var userToken = Cache.getItem('token');
    var nonce = Cache.getItem('nonce');
    return axios.get(Base_URL + '/admin/user/' + userId, { headers: {"Authorization" : `Bearer ${userToken} ${nonce}`} });
  }

  /*createAccount(userId, option) {
    return axios.post(Base_URL + '/me/create/' + option, {userId})
  }*/

}

export default new AdminService()
