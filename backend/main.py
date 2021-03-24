from flask import Flask

from utils import load_data

app = Flask(__name__)

geo_data = load_data()


#
# @app.route('/recent_sites')
# def recent_sites():
#     return site


@app.route('/lego')
def lego():
    return "1"


@app.route('/new_site')
def new_site():
    return "1"


@app.route('/counter')
def counter():
    return 8356865


@app.route('/data')
def data():
    return geo_data


if __name__ == '__main__':
    app.run(host='0.0.0.0')
