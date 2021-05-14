import axios from 'axios';
import { Cache } from 'aws-amplify';
const Base_URL=process.env.REACT_APP_API_ENDPOINT_CATEGORY

class UtilService {

  getDepartments() {
    var userToken = Cache.getItem('token');
    var nonce = Cache.getItem('nonce');
    return axios.get(Base_URL + '/departments', { headers: {"Authorization" : `Bearer ${userToken} ${nonce}`} });
  }

  getInterests() {
    var userToken = Cache.getItem('token');
    var nonce = Cache.getItem('nonce');
    return axios.get(Base_URL + '/interests', { headers: {"Authorization" : `Bearer ${userToken} ${nonce}`} });
  }

  getPositions() {
    var userToken = Cache.getItem('token');
    var nonce = Cache.getItem('nonce');
    return axios.get(Base_URL + '/roles', { headers: {"Authorization" : `Bearer ${userToken} ${nonce}`} });
}
}

export default new UtilService()
