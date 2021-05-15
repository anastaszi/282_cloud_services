/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_REQUESTDB282_ARN
	STORAGE_REQUESTDB282_NAME
	STORAGE_USERCHATTER_ARN
	STORAGE_USERCHATTER_NAME
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
var cors = require('cors')
const OktaJwtVerifier = require('@okta/jwt-verifier');

AWS.config.update({ region: process.env.TABLE_REGION });
const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.OKTA_CLIENT_ID,
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  assertClaims: {
    employeeGroup: 'admin'
  }
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

let requestTableName = "requestDB282";
let userTableName = "userChatter";
if(process.env.ENV && process.env.ENV !== "NONE") {
  requestTableName = requestTableName + '-' + process.env.ENV;
  userTableName = userTableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyRequestName = "uuid";
const partitionKeyRequestType = "S";
const sortKeyRequestName = "requestType";
const sortKeyRequestType = "S";
const hasSortRequestKey = sortKeyRequestName !== "";
const path = "/admin";
const UNAUTH = 'UNAUTH';
const hashKeyRequestPath = '/:' + partitionKeyRequestName;
const sortKeyRequestPath = hasSortRequestKey ? '/:' + sortKeyRequestName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


// verify token from Okta
app.use(function(req, res, next) {
  const authHeader = req.headers.authorization || '';
    if (!authHeader) {
        res.status(401);
        return next('Unauthorized');
    }

  const match = authHeader.split(' ');

  if (match.length != 3) {
    res.status(401);
    return next('Wrong JWT token format');
  }

  const accessToken = match[1];
  const nonce = match[2];
  return oktaJwtVerifier.verifyIdToken(accessToken, process.env.OKTA_CLIENT_ID, nonce)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
})


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
 * HTTP Get  user info *
 ********************************/
app.get(path + '/user' + '/:employeeId', function(req, res) {

   var condition = {}
   condition['employeeId'] = {
     ComparisonOperator: 'EQ'
   }

   try {
     condition['employeeId']['AttributeValueList'] = [ convertUrlType(req.params['employeeId'], "S") ];
   } catch(err) {
     res.statusCode = 500;
     res.json({error: 'Wrong column type ' + err});
   }

   let queryParams = {
     TableName: userTableName,
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

app.get(path + '/requests/:type/:status', function(req, res) {
   let type = "";
   let status = "";

   try {
     type = req.params['type'];
     status = req.params['status'];
   } catch(err) {
     res.statusCode = 500;
     res.json({error: 'Wrong type ' + err});
   }

   let filterExpressionString = "#t = :t";
   let expressions = {
     ":t": type
   }
   let names = {
     "#t": "requestType"
   }

   if (status !== "all") {
     let booleanStatus = (status === 'open');
     filterExpressionString = filterExpressionString + " AND #s = :s";
     expressions[":s"] = booleanStatus;
     names["#s"] = "active";
   }

   let queryParams = {
     TableName: requestTableName,
     FilterExpression: filterExpressionString,
     ExpressionAttributeValues: expressions,
     ExpressionAttributeNames: names,
   }
   console.log(queryParams)

   dynamodb.scan(queryParams, (err, data) => {
     if (err) {
       res.statusCode = 500;
       res.json({error: 'Could not load items: ' + err});
     } else {
       console.log(data)
       res.json(data.Items);
     }
   });
});

/********************************
 * HTTP Put method to update request status *
 ********************************/

 app.put(path + '/requests/updatelimit', function(req, res) {
   let limit;
   let uuid;
   let granted;
   let employeeId;

   if (req.body) {
     try {
       limit = convertUrlType(req.body.details, "N");
       uuid = req.body.uuid;
       granted = (req.body.status === 'approve');
       employeeId = req.body.employeeId;
     } catch(err) {
       res.statusCode = 500;
       res.json({error: 'Wrong interests:)' + err});
     }
   }

   let updateStatusParams = {
     TableName: requestTableName,
     Key: {"uuid": uuid, "requestType": "limit"},
     UpdateExpression: "set active = :a, granted = :g",
     ExpressionAttributeValues:{
       ":a": false,
       ":g": granted
     },
     ReturnValues:"UPDATED_NEW"
   }

   console.log(updateStatusParams)

   let updateLimitParams = {
     TableName: userTableName,
     Key: {"employeeId": employeeId},
     UpdateExpression: "set participantsLimit = :l",
     ExpressionAttributeValues:{
       ":l": limit
     },
     ReturnValues:"UPDATED_NEW"
   }

   console.log(updateLimitParams)
   dynamodb.update(updateStatusParams, (err, data) => {
     if (err) {
       res.statusCode = 500;
       res.json({error: 'Could not load items: ' + err});
     } else {
       if (granted) {
         console.log("Will update limit")
         dynamodb.update(updateLimitParams, (err, data) => {
          if (err) {
            res.statusCode = 500;
            res.json({error: 'Could not load items: ' + err});
          } else {
            res.json({error: err, url: req.url, body: req.body});
          }
        });
      } else {
        res.json({error: err, url: req.url, body: req.body});
      }
     }
   });
 });

 app.put(path + '/requests/updatecustom', function(req, res) {
   let uuid;
   let granted;

   if (req.body) {
     try {
       uuid = req.body.uuid;
       granted = (req.body.status === 'approve');
     } catch(err) {
       res.statusCode = 500;
       res.json({error: 'Wrong interests:)' + err});
     }
   }

   let updateStatusParams = {
     TableName: requestTableName,
     Key: {"uuid": uuid, "requestType": "custom"},
     UpdateExpression: "set active = :a, granted = :g",
     ExpressionAttributeValues:{
       ":a": false,
       ":g": granted
     },
     ReturnValues:"UPDATED_NEW"
   }

   console.log(updateStatusParams)

   dynamodb.update(updateStatusParams, (err, data) => {
     if (err) {
       res.statusCode = 500;
       res.json({error: 'Could not load items: ' + err});
     } else {
        res.json({error: err, url: req.url, body: req.body});
      }
   });
 });


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
/*****************************************
 * HTTP Get method for get single object *
 *****************************************/
/*
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
*/

/************************************
* HTTP put method for insert object *
*************************************/
/*
app.put(path, function(req, res) {

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
      res.json({success: 'put call succeed!', url: req.url, data: data})
    }
  });
});
*/
/************************************
* HTTP post method for insert object *
*************************************/
/*
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
*/
/**************************************
* HTTP remove method to delete object *
***************************************/
/*
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

*/


app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
