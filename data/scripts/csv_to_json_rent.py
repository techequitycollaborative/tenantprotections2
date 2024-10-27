import pandas as pd
df = pd.read_csv('rentcap.csv').set_index('id')
json = df.to_json(orient='index', indent=2).replace(':', ': ')

f = open('rentcap.json', 'w')
f.write(json)
f.close()