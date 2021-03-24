import random

from flask import Flask

from utils import load_data

app = Flask(__name__)

geo_data = load_data()
total_site = 8356865


#
# @app.route('/recent_sites')
# def recent_sites():
#     return site


@app.route('/lego')
def lego():
    return "1"


@app.route('/new_site')
def new_site():
    return str(random.randint(0, 1))


@app.route('/counter')
def counter():
    global total_site
    total_site = total_site + random.randint(0, 10)
    return str(total_site)


@app.route('/top_countries')
def top_countries():
    return {'data': [
        {'name': 'england', 'sites': 10},
        {'name': 'Israel', 'sites': 100}
    ]
    }


@app.route('/data')
def data():
    return geo_data


if __name__ == '__main__':
    app.run(host='0.0.0.0')
