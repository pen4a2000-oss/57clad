import json
tm=json.load(open('../lift/vo/timing.json'));w=json.load(open('../lift/vo/words.json'))
words=[{'text':x['text'],'start':x['start'],'end':x['end']} for x in w['words'] if x['type']=='word']
s=open('lift_tpl.html').read().replace('__LIB__',open('par2_lib.js').read()).replace('__TIMING__',json.dumps(tm)).replace('__WORDS__',json.dumps(words,ensure_ascii=False))
open('lift.html','w').write(s);print(tm['total'])
