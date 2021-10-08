# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python38_app]
# [START gae_python3_app]
from flask import Flask, render_template, request
import requests
import json
from flask import current_app, flash, jsonify, make_response, redirect, request, url_for


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__,static_url_path="", static_folder="static")



@app.route('/')
def index():
    #"""Return a friendly HTTP greeting.
    return app.send_static_file('index.html')


@app.route("/data", methods=["GET"])
def sendLatLng():
    loc=request.args.get('loc')
    data=make_api_call(loc)

    return jsonify(data)



def make_api_call(loc):
    querystring = {"units":"imperial","timesteps":["1h","1d"],"timezone":"America/Los_Angeles","apikey":"VuUsvG3cUAngCCgRd0CmhRkWyPJPaJYF"}
    url = "https://api.tomorrow.io/v4/timelines"
    querystring["location"]=loc
    fields=[
     "temperature",
     "temperatureApparent",
     "temperatureMin",
     "temperatureMax",
     "windSpeed",
     "windDirection",
     "humidity",
     "pressureSeaLevel",
     "uvIndex",
     "weatherCode",
     "precipitationProbability",
     "precipitationType",
     "sunriseTime",
     "sunsetTime",
     "visibility",
     "moonPhase",
     "cloudCover"]

    querystring["fields"]=fields
    headers = {"Accept": "application/json"}

    response = requests.request("GET", url, headers=headers, params=querystring)

    return response.json()



if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(port=8080,debug=True)
# [END gae_python3_app]
# [END gae_python38_app]
