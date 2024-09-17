import pandas as pd
df = pd.read_csv('moratoria.csv').set_index('geography')
json = df.to_json(orient='index', indent=2).replace(':', ': ')

f = open('moratoria.json', 'w')
f.write(json)
f.close()