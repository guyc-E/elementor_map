import geoip2.database
import csv

# /home/ec2-user/code/elementor_map/backend/geolite2
reader_city = geoip2.database.Reader('./geolite2/GeoLite2-City.mmdb')
reader_country = geoip2.database.Reader('./geolite2/GeoLite2-Country.mmdb')

'''
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Mount Everest",
                "type": "Highest point on Earth's surface ○ 8,848m (29,029ft)",
                "location": "Peak located in the Mahalangur Himal sub-range of the Himalayas on the border of Nepal and China.",
                "facts": "An expedition in 1924 resulted in one of the greatest mysteries on Everest to this day: George Mallory and Andrew Irvine made a final summit attempt on 8 June but never returned, sparking debate as to whether or not they were the first to reach the top. They had been spotted high on the mountain that day but disappeared in the clouds, never to be seen again, until Mallory's body was found in 1999 at 8,155 m (26,755 ft) on the north face. Officially, the peak was first reached by Sir Edmund Hillary of New Zealand and Sherpa of Nepal Tenzing Norgay in 1953.",
                "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Everest_kalapatthar.jpg",
                "imageCaption": "Mount Everest from Kalapatthar",
                "imageCopyright": "Image by Pavel Novack under CC BY-SA2.5",
                "imageCopyrightUrl": "https://creativecommons.org/licenses/by-sa/2.5",
                "source": "Wikipedia Mount Everest article",
                "sourceUrl": "https://en.wikipedia.org/wiki/Mount_Everest",
                "sourceCopyright": "CC BY-SA 3.0",
                "sourceCopyrightUrl": "https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    86.925061,
                    27.988271
                ]
            }
        }
    ]
}
'''


def row_to_feature(row):
    city_res = reader_city.city(row['track_ip'])
    lat = city_res.location.latitude
    lon = city_res.location.longitude
    country = city_res.country.name
    iso_code = city_res.country.iso_code

    res = {
        'type': 'Feature',
        'properties': {
            'name': row['track_domain'].replace('http://', '').replace('https://', ''),
            'country': country,
            'iso_code': iso_code
        },
        'geometry': {
            'type': 'Point',
            'coordinates': [lat, lon]
        }
    }
    return res


def load_data():
    fp = './data.csv'
    with open(fp, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        rows = list(reader)

    features = [row_to_feature(row) for row in rows]
    res = {'type': 'FeatureCollection',
           'features': features}
    return res
