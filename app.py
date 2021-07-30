from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify

################################################
# DATABASE SETUP
################################################
engine = create_engine("sqlite:///fires.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)
# save reference to the table
Fires = Base.classes.fires

################################################
# FLASK SETUP
################################################
app = Flask(__name__)


################################################
# FLASK ROUTES
################################################
@app.route('/')
def index():
    return render_template("index.html")


@app.route('/graphs.html')
def graphs():
    return render_template("graphs.html")


@app.route('/choropleth.html')
def data():
    return render_template("choropleth.html")


@app.route('/json')
def json():
    session = Session(engine)

    results = session.query(Fires.id, Fires.fire_year, Fires.report_date, Fires.county,
                            Fires.latitude, Fires.longitude, Fires.total_acres, Fires.general_cause).all()
    session.close()

    all_fires = []
    for id, fire_year, report_date, county, latitude, longitude, total_acres, general_cause in results:
        fires_dict = {}
        fires_dict["id"] = id
        fires_dict["report_date"] = report_date
        fires_dict["county"] = county
        fires_dict["latitude"] = latitude
        fires_dict["longitude"] = longitude
        fires_dict["total_acres"] = total_acres
        fires_dict["general_cause"] = general_cause
        all_fires.append(fires_dict)

    return jsonify(all_fires)


if __name__ == '__main__':
    app.run(debug=True)
