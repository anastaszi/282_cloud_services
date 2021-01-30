# 282_cloud_services
282 Cloud Services @ SJSU 

[Amplify & OKTA](https://aws.amazon.com/blogs/mobile/building-an-application-with-aws-amplify-amazon-cognito-and-an-openid-connect-identity-provider/)

[from SQL DB to Dynamo DB](https://aws.amazon.com/dms/?nc=bc&pg=pr)


## Do git the right way

**Main branch is - main**

For each feature create new branch (-b stands for that)
```
git checkout -b my_branch
```

Do the work, commit, push to the new branch

```
git add ...
git commit -m "..."
git push 
```

Checkout to main and pull last changes
```
git checkout main
git pull
```

Go back to your branch and merge with main
```
git checkout my_branch
git merge main
```
Correct conflicts if any and push them back
```
git add ...
git commit -m "..."
git push
```

Do pull request in github browser version:)




