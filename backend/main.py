from flask import Flask

from result_to_geo import get_data, result_to_geo

app = Flask(__name__)


@app.route('/recent_sites')
def recent_sites():
    return site


@app.route('/lego')
def lego():
    return "1"


@app.route('/new_site')
def new_site():
    return "1"


@app.route('/counter')
def counter():
    return '8,356,865'


# @app.route('/data')
# def data():
#     data = get_data()
#     geo_data = result_to_geo(data)
#     return geo_data


if __name__ == '__main__':
    app.run()

site = dict(domain='shahar', country='usa', lat='lat', long='long')
