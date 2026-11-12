import json
tm=json.load(open('../par/vo/timing.json'));w=json.load(open('../par/vo/words.json'))
words=[{'text':x['text'],'start':x['start'],'end':x['end']} for x in w['words'] if x['type']=='word']
s=open('par_tpl.html').read().replace('__LIB__',open('par_lib.js').read()).replace('__TIMING__',json.dumps(tm)).replace('__WORDS__',json.dumps(words,ensure_ascii=False))
open('par.html','w').write(s);print(tm['total'])
