import json, base64, sys
d=json.load(open(sys.argv[1])); s=d[0]['text'].strip().strip('"')
open(sys.argv[2],'wb').write(base64.b64decode(s.split(',',1)[1])); print('saved', sys.argv[2])
