import numpy as np, wave, json, subprocess, sys
ver='E2'; TM=json.load(open('../coffee2/vo/timing.json')); SR=44100; DUR=TM['total']; N=int(SR*DUR)
B=np.zeros((N,2)); VO=np.zeros(N); rs=np.random.default_rng(9)
L={l['id']:l for l in TM['lines']}
def tt(d): return np.arange(int(d*SR))/SR
def filt(sig,lo=0,hi=20000):
    F=np.fft.rfft(sig); f=np.fft.rfftfreq(len(sig),1/SR); m=np.ones_like(f)
    if hi<20000: m*=1/(1+(f/hi)**4)
    if lo>0: m*=1/(1+(lo/np.maximum(f,1))**4)
    return np.fft.irfft(F*m,len(sig))
def env(n,a=0.005,d=None):
    v=np.ones(n);ai=max(1,int(a*SR));v[:ai]=np.linspace(0,1,ai)
    if d: v*=np.exp(-np.arange(n)/(d*SR))
    return v
def noise(d): return rs.standard_normal(int(d*SR))
def add(t0,sig,vol=1.0,pan=0.0,buf=None):
    i=int(t0*SR); j=min(N,i+len(sig))
    if i>=N or j<=0 or i<0: return
    sg=sig[:j-i]*vol
    if buf is not None: buf[i:j]+=sg; return
    B[i:j,0]+=sg*(1-max(0,pan)); B[i:j,1]+=sg*(1+min(0,pan))
def tone(f,d,a=0.005,dec=None,h=(1,)):
    t=tt(d); return sum(np.sin(2*np.pi*f*k*t)/k for k in h)*env(len(t),a,dec)
def kick(): t=tt(0.4); f=45+120*np.exp(-t*30); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(t),0.001,0.12)
def hat(): return filt(noise(0.05),7000,16000)*env(int(0.05*SR),0.0005,0.012)
def clap(): return filt(noise(0.2),900,5000)*env(int(0.2*SR),0.001,0.05)
def whoosh(d=0.4): t=tt(d); return filt(noise(d),400,5000)*np.sin(np.pi*t/d)**2*0.6
def popsfx(): t=tt(0.12); return np.sin(2*np.pi*np.cumsum(500+900*t/0.12)/SR)*env(len(t),0.002,0.04)
def thud(): t=tt(0.5); f=50+150*np.exp(-t*25); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(t),0.001,0.1)+filt(noise(0.5),100,1500)[:len(t)]*env(len(t),0.001,0.05)
def ching():
    a=sum(tone(f,0.6,0.002,0.18,(1,2)) for f in (1318.5,1975.5,2637))*0.5; n=filt(noise(0.15),3000,9000)*env(int(0.15*SR),0.001,0.03)*0.4; a[:len(n)]+=n; return a
def buzz(): t=tt(0.35); return np.sign(np.sin(2*np.pi*110*t))*env(len(t),0.003)*0.4
# ---- music: 112 bpm, Am - F - C - G pluck + bass + drums
bpm=112; beat=60/bpm; bar=beat*4
prog_=[(220.0,[220,261.6,329.6]),(174.6,[174.6,220,261.6]),(130.8,[261.6,329.6,392]),(196.0,[196,246.9,293.7])]
endc=TM['endCard']
mus=np.zeros((N,2))
def madd(t0,sig,vol,pan=0):
    i=int(t0*SR);j=min(N,i+len(sig))
    if i>=N: return
    s_=sig[:j-i]*vol; mus[i:j,0]+=s_*(1-max(0,pan)); mus[i:j,1]+=s_*(1+min(0,pan))
t0=0.0;k=0
while t0<DUR:
    root,ch=prog_[(k//4)%4]; b=k%4; tb=t0
    drums_on = not ((L['rule']['s']<=tb<L['rule']['e']) or (L['twist']['s']<=tb<L['cta']['s']) or (L['loop']['s']+ (L['loop']['e']-L['loop']['s'])*0.5<=tb<L['loop']['e']))
    if drums_on:
        madd(tb,kick(),0.9); 
        if b in (1,3): madd(tb,clap(),0.35)
        for e8 in (0,0.5): madd(tb+e8*beat,hat(),0.18,pan=0.3)
    madd(tb,tone(root/2,beat*0.9,0.005,0.25,(1,2,3)),0.32)
    for n_,f in enumerate(ch): madd(tb+(n_*beat/3 if b%2 else 0),tone(f*2,0.5,0.003,0.12,(1,2)),0.08,pan=(-0.3+0.3*n_))
    t0+=beat;k+=1
mv=np.interp(np.arange(N)/SR,[0,0.05,DUR-0.6,DUR],[1,1,1,0.85]); mus*=mv[:,None]
B+=mus*0.55
# ---- sfx
def dl(k,f): return L[k]['s']+(L[k]['e']-L[k]['s'])*f
wind=filt(noise(DUR),200,1200)*0.04; B[:,0]+=wind; B[:,1]+=wind
add(0.0,thud(),0.9); add(0.0,ching(),0.5)
lp=L['loop']; add(dl('loop',0.5),boom(1.5,140,35) if 'boom' in globals() else thud(),0.9); add(dl('loop',0.5),buzz(),0.4)
for k in ('seryi1','seryi2','seryi3'): add(L[k]['s'],popsfx(),0.45)
add(dl('day1',0.7),thud(),0.8); add(dl('day1',0.7),buzz(),0.35)
add(dl('rule',0.55),popsfx(),0.5)
add(L['vote']['s']-0.1,whoosh(),0.5); add(L['vote']['s']+0.4,thud(),0.6); add(dl('vote',0.5),whoosh(),0.4); add(dl('vote',0.75),buzz(),0.45)
add(L['insight']['s']-0.1,whoosh(),0.4); add(dl('insight',0.25),popsfx(),0.5)
add(L['buy']['s']-0.1,whoosh(),0.4)
for a_ in (0.05,0.2,0.35): add(dl('buy',a_),popsfx(),0.45)
add(dl('buy',0.5),buzz(),0.4)
add(L['place']['s']-0.1,whoosh(),0.4); add(dl('place',0.45),popsfx(),0.5)
add(L['price']['s']+0.1,popsfx(),0.5); add(dl('price',0.5),ching(),0.5)

add(dl('fix',0.25),filt(noise(0.6),2000,7000)*env(int(0.6*SR),0.01,0.2),0.2); add(dl('fix',0.7),popsfx(),0.5)
add(L['rule']['s']+0.1,thud(),0.6); add(L['rule']['s']+0.15,ching(),0.25)
for i in range(10): add(L['growth']['s']+0.1+i*(L['growth']['e']-L['growth']['s'])*0.06,tone(2200+i*40,0.05,0.001,0.02),0.12)
add(dl('growth',0.4),ching(),0.6)
add(dl('twist',0.25),buzz(),0.5); add(dl('twist',0.6),thud(),0.9)
for i in range(3): add(L['cta']['s']+0.15+i*0.25,popsfx(),0.6)
add(endc,whoosh(0.5),0.6); add(endc+0.1,ching(),0.4)
# ---- voice
def load(i):
    raw=subprocess.run(['ffmpeg','-v','error','-i',f'../coffee2/vo/fast/{i}.wav','-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
    return np.frombuffer(raw,'<i2').astype(float)/32768
for l in TM['lines']:
    v=load(l['file']); v/=np.abs(v).max()+1e-9; add(l['s'],v,1.0,buf=VO)
k=int(0.2*SR); en=np.convolve(np.abs(VO),np.ones(k)/k,'same'); en=np.convolve((en>0.01).astype(float),np.ones(k)/k,'same')
B/=np.abs(B).max()+1e-9
mix=B*(1-0.5*en)[:,None]*0.55+np.stack([VO,VO],1)*0.9
mix/=np.abs(mix).max()*1.02
with wave.open('coffee2_mix.wav','wb') as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype('<i2').tobytes())
print('ok',ver,DUR)
