import pandas as pd
df = pd.read_csv('eligibility.csv', dtype={'min_units': 'Int32', 'landlord_occupancy_exemption_units': 'Int32'}).set_index('geography')
json = df.to_json(orient='index', indent=2).replace(':', ': ')

f = open('eligibility.json', 'w')
f.write(json)
f.close()