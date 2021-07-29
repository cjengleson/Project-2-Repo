from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

ENV = 'prod'

if ENV == 'dev':
    app.debug = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:0000@localhost/fires'
else:
    app.debug = False
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://dvhjrfztggksbc:d1ef21422f60799b1c4294baa8f2cc419726e143853f62225cf4ce0eaae196da@ec2-54-161-239-198.compute-1.amazonaws.com:5432/d18ntjsedisecs"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Fires(db.Model):
    __tablename__ = 'or_historical_fires'
    id = db.Column(db.Integer, primary_key=True)
    fire_year = db.Column(db.Integer)
    report_date = db.Column(db.DateTime, default=datetime.utcnow)
    county = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    total_acres = db.Column(db.Float)
    general_cause = db.Column(db.String(200))

    def __init__(self, fire_year, report_date, county, latitude, longitude, total_acres, general_cause):
        self.fire_year = fire_year
        self.report_date = report_date
        self.county = county
        self.latitude = latitude
        self.longitude = longitude
        self.total_acres = total_acres
        self.general_cause = general_cause


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/graphs')
def graphs():
    return render_template("graphs.html")


@app.route('/data')
def data():
    return


if __name__ == '__main__':
    app.run()
