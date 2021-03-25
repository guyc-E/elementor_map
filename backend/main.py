import random
import time

from flask import Flask
from flask_cors import CORS

from utils import load_data

app = Flask(__name__)
CORS(app)

geo_data = load_data()
total_site = 8357473


#
# @app.route('/recent_sites')
# def recent_sites():
#     return site


@app.route('/lego')
def lego():
    return "1"


@app.route('/new_site')
def new_site():
    return str(round(time.time()) % 2)


@app.route('/counter')
def counter():
    global total_site
    total_site = total_site + random.randint(0, 10)
    return {'total_site': total_site}


top_countires_data = [('United States', 4952631),
                      ('Germany', 1245937),
                      ('United Kingdom', 714450),
                      ('France', 623616),
                      ('Netherlands', 573801),
                      ('Singapore', 385251),
                      ('Cyprus', 377999),
                      ('Poland', 341323),
                      ('Italy', 302292)]


@app.route('/top_countries')
def top_countries():
    return {'data': [{'name': x[0], 'sites': x[1]} for x in top_countires_data]
            }


@app.route('/data')
def data():
    return geo_data


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
