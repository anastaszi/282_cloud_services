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
///...requests/:type/:status'
// status = ALL | OPEN | CLOSED
  getRequestsByTypeAndStatus(type, status) {
    var userToken = Cache.getItem('token');
    var nonce = Cache.getItem('nonce');
    return axios.get(Base_URL + '/admin/requests/' + type + '/' + status, { headers: {"Authorization" : `Bearer ${userToken} ${nonce}`} });
  }

  updateRequestStatus(type, status, uuid, details, employeeId) {
    var userToken = Cache.getItem('token');
    var nonce = Cache.getItem('nonce');
    if (type === 'limit')
      return axios.put(Base_URL + '/admin/requests/updatelimit', {details: details, uuid: uuid, employeeId: employeeId, status: status}, { headers: {"Authorization" : `Bearer ${userToken} ${nonce}`} });
    return axios.put(Base_URL + '/admin/requests/updatecustom', {uuid: uuid, status: status}, { headers: {"Authorization" : `Bearer ${userToken} ${nonce}`} });
  }

  /*createAccount(userId, option) {
    return axios.post(Base_URL + '/me/create/' + option, {userId})
  }*/

}

export default new AdminService()
