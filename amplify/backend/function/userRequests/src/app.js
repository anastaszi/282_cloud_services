/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
var cors = require('cors')
var uuid = require('uuid');
const OktaJwtVerifier = require('@okta/jwt-verifier');

AWS.config.update({ region: process.env.TABLE_REGION });
const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.OKTA_CLIENT_ID,
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "requestDB282";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}


const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "uuid";
const partitionKeyType = "S";
const sortKeyName = "requestType";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/requests";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app

var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())
app.use(cors())

// verify token from Okta
app.use(function(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader) {
    res.status(401);
    return next('Unauthorized');
  }

  const match = authHeader.split(' ');

  if (!match) {
    res.status(401);
    return next('Unauthorized');
  }

  const accessToken = match[1];
  const nonce = match[2];
  return oktaJwtVerifier.verifyIdToken(accessToken, process.env.OKTA_CLIENT_ID, nonce)
    .then((jwt) => {
      req.jwt = jwt;
      res.locals.userId = jwt.claims.employeeNum;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
})

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for list objects *
 ********************************/
/*
app.get(path + hashKeyPath, function(req, res) {
  var condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let queryParams = {
    TableName: tableName,
    KeyConditions: condition
  }

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items);
    }
  });
});
*/

/********************************
 * HTTP Get user's request *
 ********************************/

app.get(path + "/me", function(req, res) {

  var condition = {}
  condition['employeeId'] = {
    ComparisonOperator: 'EQ'
  }

    try {
      condition['employeeId']['AttributeValueList'] = [ convertUrlType(res.locals.userId, "S") ];
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }

    let queryParams = {
      TableName: tableName,
      KeyConditions: condition,
      IndexName: 'employeeId-index',
    }

    dynamodb.query(queryParams, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.json({error: 'Could not load items: ' + err});
      } else {
        res.json(data.Items);
      }
    });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data) ;
      }
    }
  });
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put(path + '/:type', function(req, res) {
  let today = new Date().toISOString();
  let id = uuid.v1();
  let type = "";
  let request = "";

  if (req.body) {
    try {
      request= req.body.data;
      type = req.params['type']
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong data' + err});
    }
  }

  let employeeId = res.locals.userId;

  let putItemParams = {
    TableName: tableName,
    Item: {
      "uuid": id,
      "requestType": type,
      "employeeId": employeeId,
      "active": true,
      "granted": false,
      "details": request,
      "dateCreated": today
    }
  }
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'put call succeed!', url: req.url, data: data})
    }
  });
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function(req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'post call succeed!', url: req.url, data: data})
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, function(req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
     try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch(err) {
      res.statusCode = 500;
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, (err, data)=> {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url});
    } else {
      res.json({url: req.url, data: data});
    }
  });
});
app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
