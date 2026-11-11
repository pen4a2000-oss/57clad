import numpy as np, wave, json, subprocess
TM=json.load(open('../eg2/vo/timing.json')); SR=44100; DUR=TM['total']; N=int(SR*DUR)
B=np.zeros((N,2)); VO=np.zeros(N); rs=np.random.default_rng(21)
L={l['id']:l for l in TM['lines']}; s_=lambda k:L[k]['s']; e_=lambda k:L[k]['e']
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
def boom(d=1.2,f0=110,f1=35): t=tt(d); f=f1+(f0-f1)*np.exp(-t*7); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(t),0.002,d/3)
def drum(f0=150,d=0.35): t=tt(d); f=60+(f0-60)*np.exp(-t*20); a=np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(t),0.001,0.09); n=filt(noise(d),300,3000)*env(len(t),0.001,0.02); return a+0.4*n
def whoosh(d=0.4): t=tt(d); return filt(noise(d),400,5000)*np.sin(np.pi*t/d)**2*0.6
def pluck(f,d=0.9): t=tt(d); return sum(np.sin(2*np.pi*f*k*t)*np.exp(-t*(3+k*2))/k for k in (1,2,3))*env(len(t),0.002)
def ding(): a=tone(1568,0.6,0.002,0.2,(1,2))+0.6*tone(2093,0.5,0.002,0.15)[:int(0.6*SR)] if False else tone(1568,0.6,0.002,0.2,(1,2)); return a
t=np.arange(N)/SR
dr=(np.sin(2*np.pi*73.42*t)+0.5*np.sin(2*np.pi*77.78*t)+0.35*np.sin(2*np.pi*110*t)+0.2*np.sin(2*np.pi*146.8*t+np.sin(2*np.pi*0.3*t)))*(0.8+0.2*np.sin(2*np.pi*0.13*t))
keys=[0,0.5,s_('saved'),s_('saved')+1,s_('notif'),s_('twist'),e_('twist'),TM['endCard'],DUR]
vals=[0.20,0.16,0.16,0.08,0.12,0.22,0.24,0.1,0]
dv=np.interp(t,keys,vals); B[:,0]+=dr*dv; B[:,1]+=dr*dv
# frame-drum groove (tension), pauses at 'saved' (relief) and returns at notif
scale=[146.83,155.56,185.0,196.0,220.0,233.08,261.63,293.66]
bt=0.0;k=0
while bt<TM['endCard']:
    relief=s_('saved')<=bt<s_('notif')
    if not relief:
        pat=k%8
        if pat in (0,3,6): add(bt,drum(150 if pat==0 else 190),0.35 if pat==0 else 0.22,pan=-0.2)
        if pat in (2,5): add(bt,filt(noise(0.06),2000,7000)*env(int(0.06*SR),0.001,0.015),0.1,pan=0.3)
    if k%4==0: add(bt,pluck(scale[[0,1,2,1,4,3,1,0][(k//4)%8]]*(1 if not relief else 2)),0.10 if not relief else 0.07,pan=0.25)
    bt+=0.3;k+=1
# sfx
add(0.0,boom(2.0,160,30),1.0); add(0.0,filt(noise(0.8),100,6000)*env(int(0.8*SR),0.001,0.2),0.5)
for i in range(30): add(rs.uniform(0,4),filt(noise(0.03),1500,6000)*env(int(0.03*SR),0.0005,0.01),0.08,pan=rs.uniform(-.7,.7))  # torch crackle
add(s_('recap'),whoosh(0.5),0.5); add(s_('recap')+0.05,tone(1200,0.9,0.3,0.4,(1,2))*0.5,0.12)
d=e_('recap')-s_('recap'); add(s_('recap')+d*0.5,whoosh(0.4),0.4); add(s_('recap')+d*0.8,np.sign(np.sin(2*np.pi*440*tt(0.12)))*env(int(0.12*SR),0.002)*0.3,0.3)
add(s_('rule1'),boom(1.0,120,40),0.6)
for i in range(6): add(s_('hall')+i*0.45,drum(90,0.3),0.4)
add(s_('flash'),filt(noise(0.5),800,12000)*env(int(0.5*SR),0.001,0.12),0.6); add(s_('flash'),boom(1.2,200,50),0.6)
add(s_('flash')+1.2,filt(noise(1.2),300,3000)*np.interp(tt(1.2),[0,0.2,1.2],[0,1,0]),0.35) # crowd gasp
add(s_('mask')+0.2,boom(0.8,90,40),0.5); d=e_('mask')-s_('mask'); add(s_('mask')+d*0.35,whoosh(0.4),0.5)
add(s_('mask')+d*0.4,sum(tone(f,1.6,0.05,0.6,(1,2)) for f in (293.7,370,440)),0.12)
hb=s_('ten')
while hb<e_('ay'): add(hb,boom(0.25,60,40),0.55); add(hb+0.17,boom(0.25,55,40),0.4); hb+=0.75
add(s_('ay'),sum(tone(f,3,0.4,1.5,(1,2)) for f in (110,116.5,164.8)),0.14)
add(s_('rule2')+ (e_('rule2')-s_('rule2'))*0.42,boom(1.0,120,40),0.6)
add(s_('saved')+0.25,boom(0.9,150,50),0.7); add(s_('saved')+0.3,sum(tone(f,1.5,0.01,0.6,(1,2)) for f in (293.7,370,440,587.3)),0.14)
add(s_('merit'),whoosh(0.6),0.3)
d=e_('notif')-s_('notif'); add(s_('notif')+d*0.42,ding(),0.35); add(s_('notif')+d*0.42+0.05,filt(np.sign(np.sin(2*np.pi*170*tt(0.3))),50,600)*0.5,0.5)
add(s_('twist'),boom(2.5,90,25),1.1); add(s_('twist'),sum(tone(f,2.5,0.001,1.0,(1,2)) for f in (233,247,330,349)),0.13)
add(TM['endCard'],whoosh(0.5),0.5); add(TM['endCard']+0.1,boom(1.2,100,40),0.5)
def load(i):
    raw=subprocess.run(['ffmpeg','-v','error','-i',f'../eg2/vo/fast/{i}.wav','-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
    return np.frombuffer(raw,'<i2').astype(float)/32768
ir=rs.standard_normal(int(0.4*SR))*np.exp(-np.arange(int(0.4*SR))/(0.06*SR)); ir/=np.sqrt((ir**2).sum())
def conv(a,ir_): n=len(a)+len(ir_); return np.fft.irfft(np.fft.rfft(a,n)*np.fft.rfft(ir_,n),n)[:len(a)]
for l in TM['lines']:
    v=load(l['file']); v/=np.abs(v).max()+1e-9
    if l['id'] in ('ay',): v=v+0.25*conv(v,ir); v/=np.abs(v).max()
    add(l['s'],v,1.0,buf=VO)
k=int(0.2*SR); en=np.convolve(np.abs(VO),np.ones(k)/k,'same'); en=np.convolve((en>0.01).astype(float),np.ones(k)/k,'same')
B/=np.abs(B).max()+1e-9; B=np.tanh(B*1.2)
mix=B*(1-0.5*en)[:,None]*0.58+np.stack([VO,VO],1)*0.9
mix/=np.abs(mix).max()*1.02
with wave.open('e2_mix.wav','wb') as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype('<i2').tobytes())
print('ok',DUR)
