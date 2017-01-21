import requests
import random
import datetime
import os
from bson.objectid import ObjectId

userId = '5883c6e9a6f5a909b9dcf6e8'
randArr = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
today = datetime.datetime.now()

goal = { 'name': 'Gym', 
         'frequency': 5,
         'history': [],
         'costPerFail': 3,
         'userId': ObjectId(userId) }

baseUrl = 'http://localhost:3000/'
if os.environ['NODE_ENV'] != 'development':
    baseUrl = 'http://bmback.us-east-2.elasticbeanstalk.com/'
createRoute = 'api/goals/'
updateRoute = 'api/goals/fake/'

r = requests.post(baseUrl + createRoute, data = goal)
goalId = r.json()['goal']['_id']
for i in range(364):
    if random.choice(randArr):
        u = requests.post(baseUrl + updateRoute + goalId, data = {'date':today + datetime.timedelta(days=i)})

    

