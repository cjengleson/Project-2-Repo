# converting our csv file to a sqlite file

import sqlite3
import csv

conn = sqlite3.connect('fires.sqlite')
cur = conn.cursor()

cur.execute('DROP TABLE IF EXISTS fires')
cur.execute('''
CREATE TABLE "fires"(
    "id" SERIAL PRIMARY KEY,
	"fire_year" INT,
	"report_date" DATE,
	"county" VARCHAR,
	"latitude" DEC,
	"longitude" DEC,
	"total_acres" DEC,
	"general_cause" VARCHAR
)
''')

fname = input('Enter the fires csv file name: ')
if len(fname) < 1:
    fname = "Resources/or_df.csv"

with open(fname) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        print(row)
        id = row[0]
        fire_year = row[1]
        report_date = row[2]
        county = row[3]
        latitude = row[4]
        longitude = row[5]
        total_acres = row[6]
        general_cause = row[7]
        cur.execute('''INSERT INTO fires(id,fire_year,report_date,county,latitude,longitude,total_acres,general_cause)
            VALUES (?,?,?,?,?,?,?,?)''', (id, fire_year, report_date, county, latitude, longitude, total_acres, general_cause))
        conn.commit()
