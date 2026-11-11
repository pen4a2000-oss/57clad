import numpy as np, wave, json, subprocess
TM=json.load(open('vo/timing_full.json')); L=TM['lines']; SR=44100; DUR=TM['total']; N=int(SR*DUR)
B=np.zeros((N,2)); VO=np.zeros(N); rs=np.random.default_rng(3)
s=lambda i:L[i][0]; e=lambda i:L[i][1]
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
    if i>=N or j<=0: return
    sg=sig[:j-i]*vol
    if buf is not None: buf[i:j]+=sg; return
    B[i:j,0]+=sg*(1-max(0,pan)); B[i:j,1]+=sg*(1+min(0,pan))
def boom(d=1.2,f0=90,f1=35):
    t=tt(d); f=f1+(f0-f1)*np.exp(-t*7); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(t),0.002,d/3)
def knock(v=1.0):
    d=0.35; t=tt(d); body_=np.sin(2*np.pi*np.cumsum(140*np.exp(-t*4)+70)/SR)*env(len(t),0.001,0.06)
    wood=filt(noise(d),200,2500)*env(len(t),0.0005,0.02)
    return (body_*0.9+wood*0.8)*v
def tick(): return filt(noise(0.03),2000,8000)*env(int(0.03*SR),0.0005,0.004)
def tone(f,d,a=0.01,dec=None,h=(1,)):
    t=tt(d); return sum(np.sin(2*np.pi*f*k*t)/k for k in h)*env(len(t),a,dec)
def whoosh(d=0.5): t=tt(d); return filt(noise(d),300,3000)*np.sin(np.pi*t/d)**2*0.5
# --- drone bed (dark, dissonant)
t=np.arange(N)/SR
dr=(np.sin(2*np.pi*55*t)+0.6*np.sin(2*np.pi*58.3*t)+0.3*np.sin(2*np.pi*110*t+np.sin(2*np.pi*0.2*t))+0.15*np.sin(2*np.pi*233*t))*(0.8+0.2*np.sin(2*np.pi*0.11*t))
keys=[0,0.8,s(1),s(1)+0.6,s(5),s(6),s(15),e(15),s(16),s(17),s(18),e(18),TM['endCard'],DUR]
vals=[0.10,0.16,0.16,0.07,0.09,0.14,0.20,0.22,0.0,0.05,0.10,0.18,0.08,0.0]
dv=np.interp(t,keys,vals); B[:,0]+=dr*dv; B[:,1]+=dr*dv
hiss=filt(noise(DUR),3000,9000)[:N]*0.01; B[:,0]+=hiss; B[:,1]+=hiss
# --- hook
add(0.0,boom(2.0,160,30),1.0); add(0.0,filt(noise(1.0),100,9000)*env(int(SR),0.001,0.25),0.7)
add(0.0,sum(tone(f,1.4,0.001,0.5,(1,2)) for f in (196,208,277,294)),0.10)
for k in TM['knocks']: add(k,knock(),0.9 if k<s(6) else 1.0)
add(1.5,whoosh(0.3),0.4); add(2.6,whoosh(0.3),0.3)
# rewind glitch
add(s(1)-0.25,filt(noise(0.5),500,6000)*np.linspace(1,0,int(0.5*SR))*np.sign(np.sin(2*np.pi*30*tt(0.5))),0.25)
# landing: keys jingle, running steps, elevator
for i in range(6): add(s(1)+6.0+i*0.05,tone(rs.uniform(2500,4200),0.25,0.001,0.08),0.06)
for k in np.arange(s(1)+6.6,s(1)+8.4,0.22): add(k,knock(0.3),0.25)
add(s(1)+7.9,filt(noise(0.8),100,800)*env(int(0.8*SR),0.01,0.3),0.3); add(s(1)+8.5,boom(0.5,120,60),0.3)
# kitchen cabinet creak
d=0.8; tc=tt(d); cr=filt(((np.sin(2*np.pi*np.cumsum(30+20*tc/d)/SR))>0.95).astype(float),300,2500); add(s(2)+0.2,cr,0.5)
add(s(3),whoosh(0.5),0.4); add(s(3)+3.4,boom(1.2,90,40),0.4)
# phone: shutter, send, error
add(s(4)+0.6,filt(noise(0.08),1000,8000)*env(int(0.08*SR),0.001,0.02),0.6)
add(s(4)+1.6,tone(1200,0.12,0.005,0.05),0.12); add(s(4)+2.6,tone(330,0.25,0.005,None,(1,3)),0.12); add(s(4)+2.9,tone(262,0.3,0.005,None,(1,3)),0.12)
# clock ticks from L5 to L6+1.2
for k in np.arange(s(5),s(6)+1.2,1.0): add(k,tick(),0.5)
add(s(6),boom(1.6,70,30),0.9)
# neighbor bangs
for k in np.arange(s(7),e(7)+0.2,0.35): add(k+rs.uniform(-0.03,0.03),knock(1.0),0.8)
# heartbeat from L9 to L16, speeding
hb=s(9)
while hb<s(16)-0.2:
    rate=np.interp(hb,[s(9),s(15),s(16)],[0.9,0.55,0.4]); add(hb,boom(0.25,60,40),0.6); add(hb+0.16,boom(0.25,55,40),0.45); hb+=rate
# peephole: knocks continue on empty landing; light buzz
for k in np.arange(s(12)+1.8,e(12),0.95): add(k,knock(0.9),0.9)
add(s(12)+1.6,(np.sign(np.sin(2*np.pi*100*tt(4)))*0.3+filt(noise(4),2000,6000)*0.2)*0.15,0.4)
# your voice stinger
add(s(14),sum(tone(f,2.5,0.3,1.2,(1,2)) for f in (110,116.5,174.6)),0.18)
# chain rattle
for k in np.arange(s(15)+1.5,e(15),0.06): add(k,tone(rs.uniform(3000,6000),0.04,0.001,0.01),0.08,pan=rs.uniform(-.4,.4))
for k,_ in TM['countdown']: add(k,boom(0.4,200,80),0.5)
# silence is silence. phone buzz
for k in (s(17)-0.2,s(17)+0.4): add(k,filt(np.sign(np.sin(2*np.pi*170*tt(0.35))),50,600)*0.5,0.6)
add(s(17)+1.6,tone(1400,0.1,0.003,0.05),0.12)
# reveal stinger
add(e(18)-0.3,boom(2.5,180,30),1.2); add(e(18)-0.3,filt(noise(1.2),200,9000)*env(int(1.2*SR),0.001,0.3),0.8)
add(e(18)-0.3,sum(tone(f,2.0,0.001,0.8,(1,2)) for f in (233,247,330,349,466)),0.14)
add(TM['endCard']+0.3,boom(1.5,100,40),0.4)
# --- voice
def load(i):
    raw=subprocess.run(['ffmpeg','-v','error','-i',f'vo/l{i:02d}.wav','-f','s16le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
    return np.frombuffer(raw,'<i2').astype(float)/32768
ir=rs.standard_normal(int(0.5*SR))*np.exp(-np.arange(int(0.5*SR))/(0.08*SR)); ir/=np.sqrt((ir**2).sum())
def conv(a,ir_): n=len(a)+len(ir_); return np.fft.irfft(np.fft.rfft(a,n)*np.fft.rfft(ir_,n),n)[:len(a)]
for i in range(19):
    v=load(i); v/=np.abs(v).max()+1e-9
    if i in (7,10,14): v=filt(v,150,1300); v=v+0.5*conv(v,ir); v/=np.abs(v).max(); v*=0.8   # through the door
    add(L[i][0],v,1.0,buf=VO)
# --- duck + master
k=int(0.2*SR); en=np.convolve(np.abs(VO),np.ones(k)/k,'same'); en=np.convolve((en>0.01).astype(float),np.ones(k)/k,'same')
B/=np.abs(B).max()+1e-9; B=np.tanh(B*1.3)
mix=B*(1-0.55*en)[:,None]*0.6+np.stack([VO,VO],1)*0.9
irr=rs.standard_normal(int(1.2*SR))*np.exp(-np.arange(int(1.2*SR))/(0.25*SR)); irr/=np.sqrt((irr**2).sum())
mix[:,0]+=0.08*conv(mix[:,0],irr); mix[:,1]+=0.08*conv(mix[:,1],irr)
mix/=np.abs(mix).max()*1.02
with wave.open('r47_mix.wav','wb') as w: w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype('<i2').tobytes())
print('ok',DUR)
