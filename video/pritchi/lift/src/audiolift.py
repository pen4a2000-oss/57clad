import numpy as np, wave, json, subprocess
TM=json.load(open('../lift/vo/timing.json')); SR=44100; DUR=TM['total']; N=int(SR*DUR)
B=np.zeros((N,2)); rs=np.random.default_rng(5)
L={l['id']:l for l in TM['lines']}; S=lambda k:L[k]['s']; E=lambda k:L[k]['e']; dl=lambda k,f:S(k)+(E(k)-S(k))*f
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
def add(t0,sig,vol=1.0,pan=0.0):
    i=int(t0*SR); j=min(N,i+len(sig))
    if i>=N or j<=0 or i<0: return
    sg=sig[:j-i]*vol; B[i:j,0]+=sg*(1-max(0,pan)); B[i:j,1]+=sg*(1+min(0,pan))
def pluck(f,d=1.0):
    t=tt(d); return sum(np.sin(2*np.pi*f*k*t)*np.exp(-t*(2.5+k*1.8))/k**1.2 for k in (1,2,3,4,5))*env(len(t),0.002)
def tone(f,d,a=0.005,dec=None,h=(1,)): t=tt(d); return sum(np.sin(2*np.pi*f*k*t)/k for k in h)*env(len(t),a,dec)
def thump(f0=160): t=tt(0.3); f=70+(f0-70)*np.exp(-t*25); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(t),0.001,0.07)
def swish(d=0.35): t=tt(d); return filt(noise(d),1500,9000)*np.sin(np.pi*t/d)**2
def coins(): return sum(tone(f,0.4,0.001,0.12,(1,2.7)) for f in (2200,2900,3500))
# music: C - Am - F - G, 96 bpm, plucked arpeggios + soft bass
bpm=96;beat=60/bpm;prog=[(130.8,[261.6,329.6,392.0]),(110.0,[220.0,261.6,329.6]),(87.3,[174.6,220.0,261.6]),(98.0,[196.0,246.9,293.7])]
mel=[392,440,392,329.6,293.7,329.6,392,523.3, 440,392,329.6,293.7,261.6,293.7,329.6,392]
t0=0;k=0;mus=np.zeros(N)
def madd(t,sig,v):
    i=int(t*SR);j=min(N,i+len(sig))
    if i<N: mus[i:j]+=sig[:j-i]*v
while t0<DUR:
    root,ch=prog[(k//8)%4]
    if k%2==0: madd(t0,pluck(root,1.2),0.22)
    madd(t0,pluck(ch[k%3]*(2 if k%4==3 else 1),0.6),0.11)
    if k%4==0: madd(t0+beat*0.5,pluck(mel[(k//2)%16]*2,0.5),0.06)
    t0+=beat/2;k+=1
# music dips at 'wait' (freeze) and grows at end
mv=np.interp(np.arange(N)/SR,[0,S('wait')-0.1,S('wait'),E('wait')+0.3,E('wait')+0.6,DUR-1.0,DUR],[1,1,0.15,0.15,1,1,0.6])
B[:,0]+=mus*mv; B[:,1]+=mus*mv
amb=filt(noise(DUR),250,1600)*0.045
ambv=np.interp(np.arange(N)/SR,[0,S('wait'),S('wait')+0.1,E('wait')+0.3,E('wait')+0.6,S('head'),S('head')+0.3,S('end'),S('end')+0.3,DUR],[1,1,0,0,0.6,0.6,0.2,0.2,0.6,0.6])
B[:,0]+=amb*ambv; B[:,1]+=amb*ambv*0.9
def ding(): return tone(1318.5,0.9,0.003,0.35,(1,2))*0.6+np.pad(tone(1046.5,0.9,0.003,0.35,(1,2)),(int(0.18*SR),0))[:int(0.9*SR)]*0.6
add(0.05,ding(),0.25); add(dl('tower',0.5),ding(),0.2); add(dl('calm',0.2),ding(),0.2); add(S('end'),ding(),0.25)
for k in range(3): add(dl('angry',0.35+k*0.1),filt(noise(0.15),2000,7000)*env(int(0.15*SR),0.005,0.04),0.3)
add(dl('angry',0.75),thump(120),0.4)
add(dl('eng',0.5),coins(),0.0); add(dl('eng',0.5),thump(90),0.6)
add(S('bait'),tone(523,0.6,0.01,0.25,(1,2)),0.18); add(S('bait')+0.12,tone(659,0.6,0.01,0.25,(1,2)),0.15)
for i in range(3): add(S('mirror')+i*0.25+0.5,thump(240),0.35)
add(S('wait'),thump(220),0.6); add(S('wait')+0.05,tone(660,0.9,0.01,0.4,(1,1.5)),0.15)
add(dl('calm',0.45),thump(160),0.4)
add(dl('head',0.3),tone(880,0.5,0.005,0.2,(1,2)),0.18)
for i in range(4): add(dl('lesson',0.42)+i*0.3,tone([784,880,988,1046][i],0.35,0.005,0.15),0.1)
# voice
raw=subprocess.run(['ffmpeg','-v','error','-i','../lift/vo/vo_track.wav','-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
VO=np.frombuffer(raw,'<i2').astype(float)/32768; VO=np.pad(VO,(0,max(0,N-len(VO))))[:N]
k_=int(0.2*SR); en=np.convolve(np.abs(VO),np.ones(k_)/k_,'same'); en=np.convolve((en>0.01).astype(float),np.ones(k_)/k_,'same')
B/=np.abs(B).max()+1e-9
mix=B*(1-0.45*en)[:,None]*0.5+np.stack([VO,VO],1)*0.95
mix/=np.abs(mix).max()*1.02
with wave.open('lift_mix.wav','wb') as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype('<i2').tobytes())
print('ok',DUR)
