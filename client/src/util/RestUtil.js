import Cookies from "universal-cookie";
import { BACKEND_BASE_URL, ROOT } from "../constants/config";
import { USERS_GET_CSRF } from "../constants/endpoints";

export const StatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
}

const HttpMethodValues = Object.values(HttpMethod);

export function getAuthHeaders() {
  return {
    Authorization: 'Token ' + sessionStorage.getItem('token', '')
  };
}

export const COOKIES = new Cookies();

export async function getCsrfToken() {
  await postData(
    HttpMethod.GET,
    BACKEND_BASE_URL + USERS_GET_CSRF,
  ).then(response => {
    if (response.status === StatusCode.OK) {
      COOKIES.set('csrftoken', response.data.csrftoken);
      console.log(response.data.csrftoken);
    } else {
      
    }
  });
}

export async function postData(method=HttpMethod.GET, url="", data={}, auth=false) {
  if (!HttpMethodValues.includes(method)) {
    throw TypeError('Invalid HTTP Method!');
  }
  
  const csrftoken = COOKIES.get('csrftoken');

  console.log('Fetch from:', url);

  return fetch(url, {
    method: method,
    headers: {
      ...(auth ? getAuthHeaders() : {}),
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ROOT
    },
    ...(method === HttpMethod.GET ? {} : {body: JSON.stringify(data)})
  })
    .catch(e => {
      console.log("Something went wrong!");
      throw e;
    })
    .then(response => {
      return response.json().then(data => {
        return {data: data, status: response.status};
      });
    })
    .then(response => {
      return response;
    });
}