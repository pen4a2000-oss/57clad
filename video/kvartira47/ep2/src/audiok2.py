import numpy as np, wave, json, subprocess
TM=json.load(open('../k2/vo/timing.json')); SR=44100; DUR=TM['total']; N=int(SR*DUR); ids=TM['ids']
B=np.zeros((N,2)); VO=np.zeros(N); rs=np.random.default_rng(31)
s_=lambda k:TM['lines'][ids.index(k)][0]; e_=lambda k:TM['lines'][ids.index(k)][1]
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
def tone(f,d,a=0.005,dec=None,h=(1,)): t=tt(d); return sum(np.sin(2*np.pi*f*k*t)/k for k in h)*env(len(t),a,dec)
def boom(d=1.2,f0=110,f1=35): t=tt(d); f=f1+(f0-f1)*np.exp(-t*7); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(t),0.002,d/3)
def tick(): return filt(noise(0.03),2000,8000)*env(int(0.03*SR),0.0005,0.004)
t=np.arange(N)/SR
dr=(np.sin(2*np.pi*55*t)+0.6*np.sin(2*np.pi*58.3*t)+0.3*np.sin(2*np.pi*110*t+np.sin(2*np.pi*0.2*t)))*(0.8+0.2*np.sin(2*np.pi*0.11*t))
keys=[0,0.6,s_('recap'),s_('off'),e_('off'),s_('voice2'),s_('fiftynine'),e_('fiftynine'),s_('sixty'),s_('light'),s_('smile'),e_('smile'),TM['endCard'],DUR]
vals=[0.2,0.15,0.08,0.06,0.16,0.2,0.24,0.0,0.0,0.05,0.1,0.2,0.08,0]
dv=np.interp(t,keys,vals); B[:,0]+=dr*dv; B[:,1]+=dr*dv
# hook: fast counting ticks + hit
add(0.0,boom(1.6,150,30),1.0)
for i in range(1,int(s_('recap')*14)): add(i/14,tick(),0.35)
# phone send blips
for i in range(3): add(s_('recap')+0.8+i*0.9,tone(1200,0.1,0.003,0.04),0.15)
# brushing then power-off
for i in range(int((e_('off')-s_('off'))*0.6*6)): add(s_('off')+i/6,filt(noise(0.12),2000,7000)*env(int(0.12*SR),0.01,0.04),0.08)
d=e_('off')-s_('off'); add(s_('off')+d*0.62,boom(0.8,90,30),0.8); add(s_('off')+d*0.62,np.sign(np.sin(2*np.pi*50*tt(0.3)))*np.linspace(0.3,0,int(0.3*SR)),0.4)
# counting ticks for each count key + heartbeat
for kt,v in TM['countKeys']:
    if v>0: add(kt,tick(),0.5)
hb=s_('count1')
while hb<s_('sixty')-0.3:
    rate=np.interp(hb,[s_('count1'),s_('voice2'),s_('fiftynine')],[1.0,0.7,0.45]); add(hb,boom(0.25,60,40),0.5); add(hb+0.16,boom(0.25,55,40),0.38); hb+=rate
# flashlight click
add(s_('mirror')+0.1,filt(noise(0.03),1500,6000)*env(int(0.03*SR),0.0005,0.008),0.6)
# tap water
add(s_('tap')+1.4,filt(noise(e_('tap')-s_('tap')+1.2),800,6000)*0.35,0.4,pan=0.4)
# glass on table
d=e_('glass')-s_('glass'); add(s_('glass')+d*0.62,tone(2600,0.5,0.001,0.12,(1,2.4,4.1)),0.25,pan=0.3); add(s_('glass')+d*0.62,boom(0.3,180,80),0.3)
add(s_('rule'),boom(1.0,120,40),0.5)
# door handle creak
d=e_('door')-s_('door'); dd=d*0.45; tc=tt(dd); cr=filt(((np.sin(2*np.pi*np.cumsum(25+25*tc/dd)/SR))>0.95).astype(float),300,2500); add(s_('door')+d*0.55,cr,0.6)
# phone vibrate
add(s_('msg')+1.0,filt(np.sign(np.sin(2*np.pi*170*tt(0.5))),50,600)*0.5,0.6)
# sixty stinger after silence
add(s_('sixty'),sum(tone(f,2.0,0.002,0.8,(1,2)) for f in (110,116.5,174.6)),0.18)
add(s_('light'),boom(0.6,200,80),0.4)
d=e_('smile')-s_('smile'); add(s_('smile')+d*0.55,boom(2.0,160,30),1.0); add(s_('smile')+d*0.55,sum(tone(f,1.8,0.001,0.7,(1,2)) for f in (233,247,330,349)),0.13)
add(TM['endCard']+0.1,boom(1.2,100,40),0.5)
def load(i):
    raw=subprocess.run(['ffmpeg','-v','error','-i',f'../k2/vo/trim/{i}.wav','-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
    return np.frombuffer(raw,'<i2').astype(float)/32768
ir=rs.standard_normal(int(0.5*SR))*np.exp(-np.arange(int(0.5*SR))/(0.08*SR)); ir/=np.sqrt((ir**2).sum())
def conv(a,ir_): n=len(a)+len(ir_); return np.fft.irfft(np.fft.rfft(a,n)*np.fft.rfft(ir_,n),n)[:len(a)]
VOL=np.zeros(N);VOR=np.zeros(N)
for i,(s,e) in enumerate(TM['lines']):
    v=load(ids[i]); v/=np.abs(v).max()+1e-9; pan=0
    if ids[i]=='echo': v=filt(v,200,3000); v=v+0.6*conv(v,ir); v/=np.abs(v).max(); pan=-0.6  # the other voice
    if ids[i]=='sixty': v=filt(v,150,1300); v=v+0.5*conv(v,ir); v/=np.abs(v).max()          # behind the door
    a=int(s*SR); b=min(N,a+len(v)); VOL[a:b]+=v[:b-a]*(1-max(0,pan)); VOR[a:b]+=v[:b-a]*(1+min(0,pan))
VO=(VOL+VOR)/2
k=int(0.2*SR); en=np.convolve(np.abs(VO),np.ones(k)/k,'same'); en=np.convolve((en>0.01).astype(float),np.ones(k)/k,'same')
B/=np.abs(B).max()+1e-9; B=np.tanh(B*1.3)
mix=B*(1-0.55*en)[:,None]*0.6+np.stack([VOL,VOR],1)*0.9
mix/=np.abs(mix).max()*1.02
with wave.open('k2_mix.wav','wb') as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype('<i2').tobytes())
print('ok',DUR)
