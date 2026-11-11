import numpy as np, wave
SR=44100; DUR=113.5;
def Wt(t): return t*111.2/113.2 if t<113.2 else 111.2+(t-113.2)
N=int(SR*DUR)
L=np.zeros(N); R=np.zeros(N)
rs=np.random.default_rng(7)
def tt(d): return np.arange(int(d*SR))/SR
def filt(sig,lo=0,hi=20000):
    F=np.fft.rfft(sig); f=np.fft.rfftfreq(len(sig),1/SR)
    m=np.ones_like(f)
    if hi<20000: m*=1/(1+(f/hi)**4)
    if lo>0: m*=1/(1+(lo/np.maximum(f,1))**4)
    return np.fft.irfft(F*m,len(sig))
def add(t0,sig,vol=1.0,pan=0.0):
    i=int(Wt(t0)*SR); j=min(N,i+len(sig)); 
    if i>=N: return
    s=sig[:j-i]*vol; L[i:j]+=s*(1-max(0,pan)); R[i:j]+=s*(1+min(0,pan))
def env(n,a=0.005,d=None):
    e=np.ones(n); ai=max(1,int(a*SR)); e[:ai]=np.linspace(0,1,ai)
    if d: e*=np.exp(-np.arange(n)/(d*SR))
    return e
def noise(d): return rs.standard_normal(int(d*SR))
def boom(d=1.5,f0=90,f1=30,vol=1):
    t=tt(d); f=f1+(f0-f1)*np.exp(-t*6); ph=2*np.pi*np.cumsum(f)/SR
    return (np.sin(ph)*env(len(t),0.002,d/3)+filt(noise(d),0,400)*env(len(t),0.001,0.15)*0.6)*vol
def tom(f0=140,d=0.5): t=tt(d); f=50+(f0-50)*np.exp(-t*18); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(t),0.001,0.14)
def whoosh(d=0.6):
    n=noise(d); t=tt(d); e=np.sin(np.pi*t/d)**2; return filt(n,300,3000)*e*0.5
def click(d=0.05,hi=6000): return filt(noise(d),1000,hi)*env(int(d*SR),0.0005,0.01)
def tone(f,d,a=0.01,dec=None,harm=(1,)):
    t=tt(d); s=sum(np.sin(2*np.pi*f*h*t)/h for h in harm); return s*env(len(t),a,dec)
def pluck(f,d=1.2):
    t=tt(d); s=sum(np.sin(2*np.pi*f*h*t)*np.exp(-t*(3+h*2))/h for h in (1,2,3,4)); return s*env(len(t),0.002)
# ---------------- MUSIC
# drone
t=np.arange(N)/SR
lfo=0.75+0.25*np.sin(2*np.pi*0.07*t)
drone=(np.sin(2*np.pi*73.42*t)+0.5*np.sin(2*np.pi*110*t)+0.3*np.sin(2*np.pi*146.83*t+np.sin(2*np.pi*0.3*t)))*lfo
dv=np.interp(t,[Wt(v) for v in [0,3,10,11.8,26,60,97.3,97.4,99.6,101,112,113.2,115.5]],[0.05,0.08,0.10,0.12,0.12,0.13,0.15,0,0,0.08,0.10,0.06,0.0])
L+=drone*dv; R+=drone*dv
# phrygian dominant on D3
sc=[146.83,155.56,185.0,196.0,220.0,233.08,261.63,293.66]
mel=[0,1,2,1,0,4,3,2, 1,0,2,4,5,4,3,1]
for k,tm in enumerate(np.arange(26.6,49,0.75)):
    add(tm,pluck(sc[mel[k%len(mel)]]*(2 if k%8>5 else 1)),0.11,pan=(-0.3 if k%2 else 0.3))
for k,tm in enumerate(np.arange(100,109.5,1.5)):
    add(tm,pluck(sc[[4,3,1,0,1,0,7][k%7]]),0.09)
# procession drums
for k,tm in enumerate(np.arange(26.6,49.3,0.375)):
    pat=k%8
    if pat in (0,3,4,6): add(tm,tom(130 if pat==0 else 160),0.35 if pat==0 else 0.2,pan=-0.2)
# tension pulse in tomb
for tm in np.arange(60.6,73.6,0.8): add(tm,tom(90,0.6),0.25)
# chase drums
for k,tm in enumerate(np.arange(86.8,97.3,0.25)):
    add(tm,tom(170 if k%4==0 else 130,0.3),0.35 if k%4==0 else 0.18,pan=(0.25 if k%2 else -0.25))
# riser before flash
d=1.6; n=noise(d); tr=tt(d); r=np.concatenate([filt(n[i:i+4410],200,800+5000*(i/len(n))) for i in range(0,len(n),4410)])[:len(n)]
add(8.4,r*(tr/d)**2,0.5)
# ---------------- SFX
add(0.0,boom(2.5,70,28),0.7)
add(0.2,tone(1200,2.6,0.5,None,(1,))*0.0,0)
for tm in np.arange(3.0,4.2,0.13):
    if rs.random()<0.6: add(tm+rs.random()*0.1,click(0.04,9000),0.2,pan=rs.uniform(-.5,.5))
# power-up hum + success chime
d=1.2; tp=tt(d); add(4.2,np.sin(2*np.pi*np.cumsum(60+240*tp/d)/SR)*np.interp(tp,[0,0.8,1.2],[0,1,0.6]),0.25)
for k,f in enumerate((523.25,659.25,783.99)): add(4.4+k*0.12,tone(f,0.6,0.005,0.25,(1,2)),0.12)
add(6.5,click(0.03,4000),0.7)
# malfunction: zap + crackle + alarm
tz=tt(0.9); zap=np.sign(np.sin(2*np.pi*95*tz))*0.5+filt(noise(0.9),2000,8000)*0.5; add(7.0,zap*np.sin(np.pi*tz/0.9),0.35)
add(7.0,boom(0.8,200,60),0.5)
for tm in np.arange(7.0,10.0,0.09):
    if rs.random()<0.5: add(tm,click(0.03,9000),0.22,pan=rs.uniform(-.6,.6))
for tm in np.arange(7.4,10.0,0.5): add(tm,tone(880,0.22,0.005,None,(1,3)),0.07)
for tm in np.arange(7.8,10.0,0.07):
    if rs.random()<0.5: add(tm,tone(rs.uniform(300,2400),0.05,0.002),0.05)
add(10.0,boom(3,120,30),1.0); add(10.0,filt(noise(1.5),500,12000)*env(int(1.5*SR),0.001,0.4),0.5)
# wind fall
d=2.8; w=filt(noise(d),400,2500)*np.linspace(0.2,1,int(d*SR)); add(11.8,w,0.35)
# splash
add(14.6,filt(noise(1.0),200,5000)*env(int(SR),0.002,0.25),0.9); add(14.6,boom(0.8,80,40),0.5)
# underwater
add(15.2,filt(noise(3.8),20,300)*np.sin(np.pi*tt(3.8)/3.8),0.6)
for i in range(8): add(15.4+i*0.45+rs.random()*0.2,tone(500+rs.random()*400,0.08,0.002,0.03),0.08)
add(16.8,boom(1.8,60,35),0.6)
# card whooshes
for tm in (19.0,35.0,67.6,80.4): add(tm-0.1,whoosh(0.5),0.5); add(tm+0.05,click(0.03,3000),0.4)
# jaw snap
add(25.55,click(0.06,5000),1.0); add(25.55,tom(200,0.2),0.6)
# metal clink guard
add(32.4,tone(2100,1.0,0.001,0.25,(1,2.7,5.1)),0.18); add(32.4,boom(1.0,100,50),0.35)
# eagle cry (easter egg) quiet
d=0.75; te=tt(d); fe=2600-900*te/d+60*np.sin(2*np.pi*28*te); cry=np.sin(2*np.pi*np.cumsum(fe)/SR)*np.sin(np.pi*te/d)**0.5
add(42.35,filt(cry,800,5000),0.12,pan=0.5)
add(43.55,filt(noise(0.3),300,3000)*env(int(0.3*SR),0.002,0.08),0.18,pan=0.5)  # hay thump
# beeps
for tm in np.arange(44.8,49.4,1/3):
    if int(tm*6)%2==1 or True: add(tm,np.sign(np.sin(2*np.pi*2000*tt(0.12)))*env(int(0.12*SR),0.002),0.08)
add(47.4,boom(1.2,140,45),0.6); add(47.4,whoosh(0.4),0.3)
# jump & lid slam
add(49.6,whoosh(0.7),0.4); add(51.55,boom(0.9,150,50),0.9); add(51.55,click(0.08,3000),0.8)
# footsteps
for tm in np.arange(52.0,59.6,0.5): add(tm,tom(110,0.25),0.3,pan=(0.2 if int(tm*2)%2 else -0.2))
add(59.6,boom(0.8,100,40),0.6)
# stone scrape
d=5.0; ts_=tt(d); scrape=filt(noise(d),150,1800)*(0.6+0.4*np.sign(np.sin(2*np.pi*13*ts_)))*np.sin(np.pi*ts_/d)**0.3
add(62.6,scrape,0.45)
add(65.0,boom(1.4,180,50),0.8)
# clock ticks
for tm in np.arange(61,97.4,1.0): add(tm,click(0.02,7000),0.18)
# jumpscare
add(75.6,filt(noise(0.8),100,9000)*env(int(0.8*SR),0.001,0.25),1.0); add(75.6,boom(1.5,200,40),1.0)
add(75.6,sum(tone(f,1.5,0.001,0.6,(1,2)) for f in (233,247,330,349)),0.15)
# torch whoosh + impact
add(78.6,whoosh(1.2),0.7); add(80.0,boom(0.8,160,60),0.5); add(80.0,filt(noise(0.6),1500,8000)*env(int(0.6*SR),0.001,0.15),0.4)
# slab grinding during chase
d=10.5; add(86.8,filt(noise(d),100,900)*0.5,0.35)
# heartbeat
for tm in np.arange(92.8,95.2,0.7): add(tm,tom(70,0.4),0.8); add(tm+0.18,tom(60,0.4),0.6)
# slide whoosh + BOOM
add(95.8,whoosh(1.2),0.6)
add(97.4,boom(3.5,90,25),1.3); add(97.4,filt(noise(2.5),30,600)*env(int(2.5*SR),0.001,0.8),0.9)
# night: wind + crickets
d=14; add(99.4,filt(noise(d),200,900)*np.interp(tt(d),[0,1.5,d-1,d],[0,1,1,0]),0.12)
for tm in np.arange(99.8,112,0.9):
    for k in range(3): add(tm+k*0.06,tone(4300,0.035,0.002,0.01),0.05,pan=0.6)
# bow creak
d=2.6; tc=tt(d); fc=25+25*tc/d; pulses=(np.sin(2*np.pi*np.cumsum(fc)/SR)>0.97).astype(float)
creak=filt(pulses+0.02*noise(d),300,2500)*np.interp(tc,[0,0.3,d],[0,1,1])
add(110.4,creak,0.9)
add(113.2,boom(2.5,110,30),0.9)
# ---------------- reverb + master
ir=rs.standard_normal(int(1.6*SR))*np.exp(-np.arange(int(1.6*SR))/(0.35*SR)); ir/=np.sqrt((ir**2).sum())
def conv(a): n=len(a)+len(ir); F=np.fft.rfft(a,n)*np.fft.rfft(ir,n); return np.fft.irfft(F,n)[:len(a)]
L=L+0.18*conv(L); R=R+0.18*conv(R)
st=np.stack([L,R],1); st=np.tanh(st*1.1); st/=np.abs(st).max()*1.05
with wave.open('sfx_music.wav','wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype('<i2').tobytes())
print('ok')
