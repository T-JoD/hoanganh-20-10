// ===== Van Gogh · Đêm đầy sao: trăng vàng xoáy dao sơn dầu + sóng xanh có xoáy gió (vẽ bằng code, có chuyển động nhẹ); tan thành đom đóm kiểu "búng tay" ngay trên cảnh đang chuyển động; toàn màn hình =====
var VG={rp:null,ok:0,fs:-9,mr:30,Gr:70,as:0,g:0,fa:1,sc:{},bc:{},ed:[],ts:null,rdy:0,
E:[]};
const c01=x=>Math.min(1,Math.max(0,x)),vs=x=>(x=c01(x))*x*(3-2*x),rd=Math.random,
// xanh đêm (cobalt/ultramarine) từ thẫm đến nhạt; vàng trăng từ kem đến vàng đậm (cam rất ít)
CB=[[14,28,72],[20,42,98],[28,60,128],[42,84,156],[86,126,186],[150,180,220],[214,226,236]],
MP=[[255,248,226],[255,238,176],[255,226,120],[254,208,76],[248,184,52],[236,150,34]],
vrgb=(c,j)=>'rgb('+Math.max(0,Math.min(255,Math.round(c[0]+j)))+','+Math.max(0,Math.min(255,Math.round(c[1]+j)))+','+Math.max(0,Math.min(255,Math.round(c[2]+j)))+')';
function vcv(w,h,d){const c=document.createElement('canvas');c.width=Math.ceil(w*d);c.height=Math.ceil(h*d);const x=c.getContext('2d');x.scale(d,d);return[c,x]}
// nét dao sơn: dải dẹt thon hai đầu chạy theo đường P (bl nhỏ = đầu dao tù), màu chuyển nhẹ từ đầu đến cuối, thêm vài sợi vân mảnh sáng/tối chạy dọc để ra gờ sơn
function vkr(x,P,wd,col,al,bl){const n=P.length;if(n<4)return;bl=bl||.55;const Lf=[],Rt=[],ph=rd()*6;
for(let i=0;i<n;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,u=i/(n-1),w=wd*.5*Math.pow(Math.max(0,Math.sin(Math.PI*u)),bl)*(.8+.2*Math.sin(u*8+ph)),nx=-dy/l*w,ny=dx/l*w;Lf.push([P[i][0]+nx,P[i][1]+ny]);Rt.push([P[i][0]-nx,P[i][1]-ny])}
const j=(rd()-.5)*18,gr=x.createLinearGradient(P[0][0],P[0][1],P[n-1][0],P[n-1][1]);gr.addColorStop(0,vrgb(col,j));gr.addColorStop(1,vrgb(col,j+(rd()-.5)*36));
x.globalAlpha=al;x.fillStyle=gr;x.beginPath();x.moveTo(Lf[0][0],Lf[0][1]);for(let i=1;i<n;i++)x.lineTo(Lf[i][0],Lf[i][1]);for(let i=n-1;i>=0;i--)x.lineTo(Rt[i][0],Rt[i][1]);x.closePath();x.fill();
x.lineCap='round';x.lineWidth=Math.max(.8,wd*.07);
for(const[o,d]of[[-.25,24],[.28,-20]]){x.strokeStyle=vrgb(col,j+d);x.globalAlpha=al*.45;x.beginPath();for(let i=1;i<n-1;i++){const a=P[i-1],b=P[i+1],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,w=wd*Math.pow(Math.max(0,Math.sin(Math.PI*i/(n-1))),bl)*o;x.lineTo(P[i][0]-dy/l*w,P[i][1]+dx/l*w)}x.stroke()}
x.globalAlpha=1}
// bảng màu liên tục từ sát trăng ra ngoài (kem trắng → vàng chanh → vàng cadmium → cam đất → trắng ngọc → xanh lơ nhạt → xanh lam-lục → cobalt nhạt → cobalt → ultramarine → xanh thẫm); mỗi nét lấy màu nội suy, đôi khi pha với màu lân cận như sơn trộn ướt
const CS=[[0,[246,232,190]],[.12,[232,196,118]],[.22,[210,152,66]],[.29,[180,114,46]],[.37,[214,222,214]],[.5,[140,184,212]],[.56,[84,150,180]],[.63,[60,112,176]],[.72,[36,72,150]],[.84,[24,46,108]],[1,[14,26,66]]];
function vcol3(t){t=c01(t);let i=0;while(i<CS.length-2&&t>CS[i+1][0])i++;const a=CS[i],b=CS[i+1],f=c01((t-a[0])/(b[0]-a[0])),c=[0,1,2].map(k=>a[1][k]+(b[1][k]-a[1][k])*f);
if(rd()<.3){const d=CS[Math.max(0,Math.min(CS.length-1,i+(rd()<.5?0:1)))][1];return[0,1,2].map(k=>c[k]*.65+d[k]*.35)}return c}
// màu đĩa trăng theo bán kính t∈[0,1]: kem trắng → vàng chanh → vàng cadmium → cam đất ở viền
function vdisc(t){t=c01(t);const S=[[0,[254,246,222]],[.35,[252,232,170]],[.65,[244,204,100]],[1,[222,158,62]]];let i=0;while(i<2&&t>S[i+1][0])i++;const a=S[i],b=S[i+1],f=c01((t-a[0])/(b[0]-a[0]));return[0,1,2].map(k=>a[1][k]+(b[1][k]-a[1][k])*f)}
// nét cọ sơn dầu: nền đặc hơi tối rồi nhiều sợi lông cọ song song (mỗi sợi một sắc độ, đầu/đuôi lệch nhau, cuối nét cọ khô dần và đứt sợi), bề ngang hơi lượn dọc theo nét
function vbs(x,P0,wd,col,al){const n=P0.length;if(n<4)return;const nx=[],ny=[],P=[];
for(let i=0;i<n;i++){const a=P0[Math.max(0,i-1)],b=P0[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;nx.push(-dy/l);ny.push(dx/l)}
const wb=rd()*6,wa=wd*.07;for(let i=0;i<n;i++){const d=wa*Math.sin(i/(n-1)*5+wb);P.push([P0[i][0]+nx[i]*d,P0[i][1]+ny[i]*d])}
const wob=rd()*6,hw=u=>wd*.5*Math.pow(Math.max(0,Math.sin(Math.PI*u)),.5)*(.84+.16*Math.sin(u*7+wob)),j0=(rd()-.5)*10,e=Math.round((n-1)*.8);
x.globalAlpha=al*.92;x.fillStyle=vrgb(col,j0-14);x.beginPath();
for(let i=0;i<=e;i++){const w=hw(i/(n-1))*.9;x.lineTo(P[i][0]+nx[i]*w,P[i][1]+ny[i]*w)}for(let i=e;i>=0;i--){const w=hw(i/(n-1))*.9;x.lineTo(P[i][0]-nx[i]*w,P[i][1]-ny[i]*w)}x.closePath();x.fill();
const nb=Math.max(6,Math.round(wd/2.4));x.lineCap='round';x.lineJoin='round';
for(let b=0;b<nb;b++){const o=((b+.5)/nb-.5)*1.84,t0=rd()*.14,t1=rd()<.25?.6+rd()*.24:.84+rd()*.16,jl=(rd()-.5)*(b%3==0?32:20),c=[col[0]+jl+(rd()-.5)*6,col[1]+jl+(rd()-.5)*6,col[2]+jl+(rd()-.5)*6];x.lineWidth=Math.max(1.4,wd/nb*1.5);x.strokeStyle=vrgb(c,0);
for(const[s0,s1,am]of[[t0,Math.min(t1,.74),.82+rd()*.18],[.7,t1,.56+rd()*.2]]){if(s1-s0<.06)continue;x.globalAlpha=al*am;x.beginPath();for(let i=0;i<n;i++){const u=i/(n-1);if(u<s0||u>s1)continue;const w=hw(u)*o;x.lineTo(P[i][0]+nx[i]*w,P[i][1]+ny[i]*w)}x.stroke()}}
x.globalAlpha=1}
// độ nổi của lớp sơn: lấy độ sáng làm độ cao rồi đổ sáng từ trên-trái (bỏ qua mép trong suốt để không có viền), thêm chút hạt vải canvas
const VGL=(()=>{const t=new Uint8Array(256);for(let i=0;i<256;i++)t[i]=Math.round(255*Math.pow(i/255,1.03));return t})();
function voil(c,k,sp,ag){const x=c.getContext('2d'),w=c.width,h=c.height,im=x.getImageData(0,0,w,h),d=im.data,l=new Float32Array(w*h);
for(let i=0,o=0;i<w*h;i++,o+=4)l[i]=d[o]*.3+d[o+1]*.59+d[o+2]*.11;
for(let y=1;y<h-1;y++)for(let i=y*w+1,e=y*w+w-1;i<e;i++){const o=i*4;if(!d[o+3])continue;const L=l[i],A=d[o+7]?l[i+1]:L,B=d[o+3+w*4]?l[i+w]:L,C=d[o-1]?l[i-1]:L,E=d[o+3-w*4]?l[i-w]:L,s0=(A+B-C-E)*k,s=(s0>0?.85:1.1)*Math.max(-46,Math.min(46,s0))+(sp&&s0>sp?Math.min(30,(s0-sp)*.9):0)+(rd()-.5)*6;let r=d[o]+s,g=d[o+1]+s,b=d[o+2]+s;if(ag){const L=r*.3+g*.59+b*.11;r=(L+(r-L)*.98)*1.01;g=(L+(g-L)*.98)*1.0;b=(L+(b-L)*.98)*.99;r=VGL[r<0?0:r>255?255:r|0];g=VGL[g<0?0:g>255?255:g|0];b=VGL[b<0?0:b>255?255:b|0]}d[o]=r;d[o+1]=g;d[o+2]=b}
x.putImageData(im,0,0)}
// dòng chảy quanh trăng (đơn vị: bán kính trăng): vòng quanh trăng, càng ra xa càng uốn lượn chữ S, kèm hai xoáy nhỏ; trả về hướng
function vfield(x,y){const r=Math.hypot(x,y)||1,a=Math.atan2(y,x),th=a+1.5708+vs((r-1.6)/1.4)*(.12*Math.sin(2*a+1.2*r)+.06*Math.sin(3*a-r));let vx=Math.cos(th),vy=Math.sin(th);
for(const e of VG.E){const dx=x-e[0],dy=y-e[1],d=Math.hypot(dx,dy)||1,w=Math.exp(-Math.pow(d/(e[2]*1.6),2))*3.5;vx+=w*(-dy/d*e[3]-dx/d*.35);vy+=w*(dx/d*e[3]-dy/d*.35)}
return Math.atan2(vy,vx)}
// các đường dòng cách đều nhau (kiểu Jobard–Lefer rút gọn): mỗi đường chảy mượt theo trường dòng, đường sau chỉ chen vào chỗ trống giữa các đường trước, nên nét song song và không chồng chéo
function vlines(){const ds=.13,dt=.55*ds,h=.05,G=new Map(),kk=(i,j)=>i*8192+j,
add=P=>{for(const p of P){const k=kk(Math.floor(p[0]/ds),Math.floor(p[1]/ds));let a=G.get(k);if(!a){a=[];G.set(k,a)}a.push(p)}},
free=(x,y,d)=>{const i=Math.floor(x/ds),j=Math.floor(y/ds);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const q=G.get(kk(i+a,j+b));if(q)for(const p of q)if(Math.hypot(p[0]-x,p[1]-y)<d)return false}return true},
Re=a=>2.5+.35*Math.sin(2*a+1)+.15*Math.sin(5*a),
tr=(x0,y0,sg,skip)=>{const P=[];let x=x0,y=y0,pa=vfield(x,y)+(sg<0?3.1416:0);
for(let i=0;i<190;i++){let d=vfield(x,y)+(sg<0?3.1416:0)-pa;while(d>3.1416)d-=6.2832;while(d<-3.1416)d+=6.2832;pa+=d*.5;x+=Math.cos(pa)*h;y+=Math.sin(pa)*h;
const r=Math.hypot(x,y);if(r<1.03||r>Re(Math.atan2(y,x)))break;let hit=0;for(const e of VG.E)if(Math.hypot(x-e[0],y-e[1])<e[2]*.8)hit=1;if(hit)break;
if(i>=skip&&!free(x,y,dt))break;if(sg>0&&i>25&&Math.hypot(x-x0,y-y0)<dt){P.closed=1;break}P.push([x,y])}return P},L=[];
for(const[dr,na,th,mn]of[[.85,14,.8,9],[.5,40,.88,12],[.35,72,.9,14],[.25,100,.78,16]])for(let r=1.06,j=0;r<2.6;r+=ds*dr,j++)for(let k=0;k<na;k++){const a=(k+.37*j)/na*6.2832,x=Math.cos(a)*r,y=Math.sin(a)*r;if(!free(x,y,ds*th))continue;let hit=0;for(const e of VG.E)if(Math.hypot(x-e[0],y-e[1])<e[2]*.9)hit=1;if(hit)continue;
const F=tr(x,y,1,0);add(F);const B=F.closed?[]:tr(x,y,-1,6);add(B);const P=B.reverse().concat([[x,y]],F);if(P.length>mn)L.push(P)}
return L}
// màu theo bán kính t∈[0,1] từ trong ra ngoài: kem trắng → vàng → vàng cam → kem xanh → xanh nhạt → cobalt → xanh thẫm (dải màu liền nhau giống các vòng quầng trong tranh)
function vcol2(t){const B=[[MP[0],[255,252,235]],[MP[1],[255,240,190]],[MP[3],MP[4]],[[236,232,206],[214,226,236]],[[176,206,236],[150,184,226]],[CB[4],CB[3]],[CB[3],CB[2]],[CB[1],CB[2]],[CB[0],CB[1]]],b=B[[.17,.26,.35,.45,.55,.66,.77,.88,2].findIndex(v=>t<v)];return b[rd()*b.length|0]}
// bước 1a: tính các đường dòng, dựng khung ba lớp vành (kem-vàng cam / kem-xanh nhạt / xanh nhạt-cobalt-xanh thẫm; mỗi lớp sau này xoay quanh trăng với tốc độ riêng), nền xanh thẫm ở lớp ngoài và lớp tô lót màu theo từng dải để chỗ hở giữa các nét lộ đúng màu dải
function vP(){const L=vlines(),R=L.map(P=>{let s=0;for(const p of P)s+=Math.hypot(p[0],p[1]);const cum=[0];for(let i=1;i<P.length;i++)cum.push(cum[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));return{P,cum,rm:s/P.length}}).sort((a,b)=>b.rm-a.rm),HK=[215,275,315],CK=HK.map(h=>vcv(h*2,h*2,1));VG.LH=HK;VG.T={R,CK,HK};VG.LY=[];
for(let i=0;i<14;i++){const a=rd()*6.2832,kk=.7+rd()*.7,px=315+Math.cos(a)*kk*100,py=315+Math.sin(a)*kk*100,rb=(.8+rd()*.2)*100,x=CK[2][1],gq=x.createRadialGradient(px,py,0,px,py,rb);gq.addColorStop(0,'rgba(24,42,96,.9)');gq.addColorStop(.7,'rgba(20,36,84,.6)');gq.addColorStop(1,'rgba(16,28,64,0)');x.fillStyle=gq;x.fillRect(0,0,630,630)}
{const x=CK[2][1],cq=x.createRadialGradient(315,315,150,315,315,200);cq.addColorStop(0,'#000');cq.addColorStop(1,'rgba(0,0,0,0)');x.globalCompositeOperation='destination-out';x.fillStyle=cq;x.fillRect(0,0,630,630);x.globalCompositeOperation='source-over'}
{const[c,x]=vcv(430,430,1),q=x.createRadialGradient(215,215,90,215,215,210);[[.083,'200,150,70,.95'],[.29,'176,112,52,.95'],[.46,'140,92,48,.95'],[.62,'170,180,176,.9'],[.79,'70,120,160,.85'],[.92,'34,62,120,.6'],[1,'20,34,76,0']].forEach(([p,v])=>q.addColorStop(p,'rgba('+v+')'));x.fillStyle=q;x.fillRect(0,0,430,430);VG.mu=c}}
// bước 1b: vẽ các nét dao của một lớp vành (đường nào thuộc lớp nào theo bán kính trung bình; đường ngoài vẽ trước) rồi làm nổi gờ sơn
function vPk(k){const{R,CK,HK}=VG.T,Hh=HK[k],x=CK[k][1];
for(const l of R){if((l.rm<1.75?0:l.rm<2.25?1:2)!==k)continue;const P=l.P,n=P.length,cum=l.cum,tot=cum[n-1],Ld=1+rd()*.9,af=l.rm>2.1?1-.55*vs((l.rm-2.1)/.5):1;
for(let s0=-rd()*Ld*.6;s0<tot;s0+=Ld*.85){const a0=Math.max(0,s0),a1=Math.min(tot,s0+Ld);if(a1-a0<.35)continue;const Q=[];for(let i=0;i<n;i++)if(cum[i]>=a0&&cum[i]<=a1&&(Q.length===0||i%2===0))Q.push([Hh+P[i][0]*100,Hh+P[i][1]*100]);if(Q.length<5)continue;
vbs(x,Q,23*(.92+.16*rd())*(l.rm>2.2?.9:1),vcol3((l.rm-1)/1.6+(rd()-.5)*.03),.97*af)}}
voil(CK[k][0],.75,30,1);VG.LY[k]=CK[k][0];if(k==2)VG.T=null}
// bước 2: đĩa trăng tròn: nền tô sáng cố định + 3 lớp vảy dao dài xếp vòng đồng tâm (trong, giữa, ngoài) mỗi lớp xoay chậm với tốc độ riêng, vài nhánh xoắn sáng mờ để thấy rõ chuyển động, viền sáng; cùng quầng sáng và chấm sáng trên cùng
function vC(){const M=130;let[c,x]=vcv(M*2,M*2,1),q=x.createRadialGradient(M-20,M-22,0,M,M,100);
q.addColorStop(0,'#fcf2d6');q.addColorStop(.3,'#f6dea0');q.addColorStop(.7,'#e8be64');q.addColorStop(1,'#c88c3c');x.fillStyle=q;x.beginPath();x.arc(M,M,97,0,6.2832);x.fill();VG.mc0=c;
const DC=[0,1,2].map(()=>{const d=vcv(M*2,M*2,1);d[1].beginPath();d[1].arc(M,M,98,0,6.2832);d[1].clip();return d}),DS=[.14,.09,.055];
for(let r=94;r>8;r-=9){const li=r>66?2:r>36?1:0,x2=DC[li][1],t=r/98,len=Math.max(22,r*.72),n=Math.max(5,Math.round(6.2832*r/(len*.8))),o=rd()*6.2832;
for(let i=0;i<n;i++){const a=o+i/n*6.2832+(rd()-.5)*.1,px=M+Math.cos(a)*r,py=M+Math.sin(a)*r,ang=a+1.5708+.28-.18*t+(rd()-.5)*.12,L=len*(.9+rd()*.25),P=[],col=vdisc(t+(rd()-.5)*.14);
for(let k=0;k<13;k++){const u=k/12-.5,cu=-L*L/(8*Math.max(r,8))*(1-4*u*u)*1.1;P.push([px+Math.cos(ang)*u*L-Math.sin(ang)*cu,py+Math.sin(ang)*u*L+Math.cos(ang)*cu])}
vbs(x2,P,16+rd()*5,col,.97)}}
VG.DK=DC.map((d,i)=>{voil(d[0],.65,28,1);return{c:d[0],w:DS[i]}});
[c,x]=vcv(M*2,M*2,1);for(let arm=0;arm<2;arm++){const P=[];for(let k=0;k<=24;k++){const f=k/24,r=6+f*88,a=arm*3.1416-f*3.6;P.push([M+Math.cos(a)*r,M+Math.sin(a)*r])}vkr(x,P,7,[255,246,214],.32,.6)}VG.DA=c;
[c,x]=vcv(M*2,M*2,1);x.save();x.beginPath();x.arc(M,M,97,0,6.2832);x.clip();q=x.createRadialGradient(M-18,M-20,0,M-18,M-20,60);q.addColorStop(0,'rgba(255,248,224,.22)');q.addColorStop(1,'rgba(255,248,224,0)');x.fillStyle=q;x.fillRect(0,0,M*2,M*2);x.restore();
q=x.createRadialGradient(M-18,M-20,56,M-18,M-20,122);q.addColorStop(0,'rgba(214,132,30,0)');q.addColorStop(1,'rgba(214,132,30,.32)');x.save();x.beginPath();x.arc(M,M,97,0,6.2832);x.clip();x.fillStyle=q;x.fillRect(0,0,M*2,M*2);x.restore();
x.strokeStyle='rgba(240,226,176,.4)';x.lineWidth=3;x.beginPath();x.arc(M,M,96,0,6.2832);x.stroke();
q=x.createRadialGradient(M,M,97,M,M,124);q.addColorStop(0,'rgba(70,34,8,.32)');q.addColorStop(1,'rgba(70,34,8,0)');x.fillStyle=q;x.beginPath();x.arc(M,M,124,0,6.2832);x.arc(M,M,97,0,6.2832,true);x.fill();VG.mc1=c;
const Gr=240;[c,q]=vcv(Gr*2,Gr*2,1);const gq=q.createRadialGradient(Gr,Gr,90,Gr,Gr,Gr);
gq.addColorStop(0,'rgba(252,226,160,.82)');gq.addColorStop(.16,'rgba(248,210,124,.5)');gq.addColorStop(.32,'rgba(242,200,120,.18)');gq.addColorStop(.62,'rgba(236,200,130,.05)');gq.addColorStop(1,'rgba(236,200,130,0)');q.fillStyle=gq;q.fillRect(0,0,Gr*2,Gr*2);VG.mg=c;
const Bb=170;[c,q]=vcv(Bb*2,Bb*2,1);const bq=q.createRadialGradient(Bb,Bb,100,Bb,Bb,Bb);bq.addColorStop(0,'rgba(252,236,184,.4)');bq.addColorStop(1,'rgba(250,232,176,0)');q.fillStyle=bq;q.fillRect(0,0,Bb*2,Bb*2);VG.mb=c;
// lớp phủ tối rìa rất nhẹ đứng yên phía trên sơn đang xoay, cho mảng sơn hòa vào nền đêm (không còn vết nứt hay mảng ố)
{const U=310,[c,x]=vcv(U*2,U*2,1),q=x.createRadialGradient(U,U,160,U,U,U);q.addColorStop(0,'rgba(10,6,2,0)');q.addColorStop(.6,'rgba(10,6,2,.08)');q.addColorStop(1,'rgba(10,6,2,.34)');x.fillStyle=q;x.fillRect(0,0,U*2,U*2);VG.mv=c}
}
function vstep(){const f=VG.ts&&VG.ts.shift();if(f){f();if(VG.ts.length)setTimeout(vstep,40);else VG.rdy=1}}
function vall(){if(!VG.ts)VG.ts=[vP,()=>vPk(0),()=>vPk(1),()=>vPk(2),vC];while(VG.ts.length)VG.ts.shift()();VG.rdy=1}
function skyInit(){const mr=Math.max(24,Math.min(W,H)*.07);VG.mr=mr;VG.Gr=mr*2.4;
if(!VG.ts&&!VG.rdy){VG.ts=[vP,()=>vPk(0),()=>vPk(1),()=>vPk(2),vC];setTimeout(vstep,250)}
// tính năng ẩn: sau khi thư đã rơi xuống, chạm vào mặt trăng để quay lại từ đầu (không có chữ hướng dẫn)
if(!VG.ok){VG.ok=1;cv.addEventListener('click',e=>{if(go===null||!LS||lopen||VG.rp)return;if(Math.hypot(e.clientX-W*.7,e.clientY-H*.2)<Math.max(VG.mr*1.7,46))replay()})}}
// mặt trăng sống: quầng sáng thở; bốn lớp vành sơn quanh trăng xoay chậm cùng chiều, càng gần trăng càng nhanh nên các dải trượt qua nhau như dòng chảy; ba lớp vảy trong đĩa trăng cũng xoay chậm với tốc độ khác nhau; khi bấm trăng quầng sáng bừng lên một nhịp
function moon(a){if(!VG.rdy)vall();const m=VG.mr,s=m/100,t=now()*SP,ap=vs(a),sc=.65+.35*ap,pu=VG.rp?Math.exp(-(now()-VG.rp.t0)*2.2):0,Gr=VG.Gr*(1+.2*pu),k=sc*.95*(1+.008*Math.sin(t*.6));
g.save();g.translate(W*.7,H*.2);
g.globalCompositeOperation='lighter';g.globalAlpha=Math.min(1,ap*(.8+.1*Math.sin(t*1.2)+.6*pu));g.drawImage(VG.mg,-Gr,-Gr,Gr*2,Gr*2);g.globalCompositeOperation='source-over';
g.save();g.rotate((1-ap)*1.6);g.scale(k,k);g.globalAlpha=ap*.9;g.drawImage(VG.mu,-215*s,-215*s,430*s,430*s);g.globalAlpha=ap*.97;
for(let i=2;i>=0;i--){const h=VG.LH[i];g.save();g.rotate([.1,.06,.035][i]*t);g.drawImage(VG.LY[i],-h*s,-h*s,h*2*s,h*2*s);g.restore()}
g.restore();
g.globalCompositeOperation='lighter';g.globalAlpha=ap*(.6+.6*pu);g.drawImage(VG.mb,-170*s,-170*s,340*s,340*s);g.globalCompositeOperation='source-over';
g.globalAlpha=ap;g.drawImage(VG.mc0,-130*s,-130*s,260*s,260*s);
for(let i=2;i>=0;i--){const d=VG.DK[i];g.save();g.rotate(d.w*t);g.drawImage(d.c,-130*s,-130*s,260*s,260*s);g.restore()}
g.save();g.rotate(.09*t);g.globalAlpha=ap*.9;g.drawImage(VG.DA,-130*s,-130*s,260*s,260*s);g.restore();
g.globalAlpha=ap;g.drawImage(VG.mc1,-130*s,-130*s,260*s,260*s);
g.save();g.scale(sc*.95,sc*.95);g.drawImage(VG.mv,-310*s,-310*s,620*s,620*s);g.restore();
g.restore();g.globalAlpha=1}
// quầng sáng đom đóm có màu của điểm gốc (gom theo màu để vẽ nhanh); trả về khoá màu
function vsp(r,g_,b){const k=(r>>5<<6)|(g_>>5<<3)|(b>>5);if(!VG.sc[k]){const[c,x]=vcv(32,32,1),R=(r>>5<<5)+16,G=(g_>>5<<5)+16,B=(b>>5<<5)+16,q=x.createRadialGradient(16,16,0,16,16,16);q.addColorStop(0,'#fff');q.addColorStop(.16,'rgb('+R+','+G+','+B+')');q.addColorStop(.45,'rgba('+R+','+G+','+B+',.3)');q.addColorStop(1,'rgba('+R+','+G+','+B+',0)');x.fillStyle=q;x.fillRect(0,0,32,32);VG.sc[k]=c;VG.bc[k]='rgb('+R+','+G+','+B+')'}return k}
// quay lại kiểu "búng tay": cảnh vẫn tiếp tục chuyển động như bình thường; một làn sóng quét từ góc dưới trái lên góc trên phải, mỗi ô ảnh mờ dần (lớp đen mềm phủ lên cảnh sống) và bong ra thành đom đóm có quầng sáng cùng bụi sáng nhỏ, đều mang màu của điểm gốc
function replay(){lshow(false);
const gs=Math.max(5,Math.round(Math.sqrt(W*H/16000))),cw=Math.ceil(W/gs),ch=Math.ceil(H/gs),u0=Math.hypot(W,H)/1000,[sm,mx]=vcv(cw,ch,1),th=-.5,wx=Math.cos(th),wy=Math.sin(th),pj=(x,y)=>x*wx+y*wy,ps=[pj(0,0),pj(W,0),pj(0,H),pj(W,H)],p0=Math.min(...ps),pl=Math.max(...ps)-p0,Tm=new Float32Array(cw*ch),qa=new Float32Array(cw*ch),lc=[];let dt=null,q0=9,q1=-9;
try{mx.imageSmoothingQuality='high';mx.drawImage(cv,0,0,cw,ch);dt=mx.getImageData(0,0,cw,ch).data}catch(_){}
for(let j=0;j<ch;j++)for(let i=0;i<cw;i++){const k=j*cw+i,x=(i+.5)*gs,y=(j+.5)*gs,q=c01((pj(x,y)-p0)/pl);qa[k]=q;
const o=k*4,r=dt?dt[o]:120,gg=dt?dt[o+1]:200,b=dt?dt[o+2]:255,m=Math.max(r,gg,b);if(m<34)continue;q0=Math.min(q0,q);q1=Math.max(q1,q);
const f=Math.min(2.4,Math.max(1,160/m));lc.push({x,y,m,ci:k,k:vsp(Math.min(255,r*f),Math.min(255,gg*f),Math.min(255,b*f))})}
const qr=Math.max(.05,q1-q0);
for(let j=0;j<ch;j++)for(let i=0;i<cw;i++){const k=j*cw+i,x=(i+.5)*gs,y=(j+.5)*gs,nz=Math.sin(x*.011+y*.007)*.5+Math.sin(x*.023-y*.017+1.7)*.3+Math.sin(y*.031+x*.005+4.1)*.2;Tm[k]=.3+4.4*(.82*c01((qa[k]-q0)/qr)+.12*(nz*.5+.5)+.06*rd())}
const gl=[],bk={},pg=Math.min(1,2400/Math.max(1,lc.filter(c=>c.m>=90).length));
for(const c of lc){const T=Tm[c.ci];if(c.m>=90&&rd()<pg)gl.push({x:c.x+(rd()-.5)*gs,y:c.y+(rd()-.5)*gs,k:c.k,ts:T+.05+rd()*.3,sv:.75+rd()*.5,p:rd()*6.28,w:.6+rd()*1.4,r:gs*(1.2+rd()*1.4),dd:0});
for(let s=c.m>=190?2:1;s>0;s--)(bk[c.k]=bk[c.k]||[]).push({x:c.x+(rd()-.5)*gs,y:c.y+(rd()-.5)*gs,ts:T+rd()*.4,sv:.75+rd()*.5,p:rd()*6.28,w:.6+rd()*1.4,s:gs*(.22+rd()*.2),dd:0})}
VG.tm=Tm;VG.md=mx.createImageData(cw,ch);VG.mcv=sm;VG.mx=mx;VG.cn=cw*ch;VG.fl=gl;VG.bk=bk;VG.u0=u0;VG.ct=wx;VG.st=wy;VG.tl=0;VG.rp={t0:now(),ph:0}}
// một hạt: gió thổi chung một hướng lên trên-phải tăng dần, thêm dòng xoáy mượt và chút lung lay riêng; trả về tuổi, -1 nếu chưa bong ra, -2 nếu đã ra khỏi khung
function vmv(f,tp,dt){const a=tp-f.ts;if(a<0)return -1;
const u0=VG.u0,k=6.283/(260*u0),s=u0*(14+250*vs(a/3.2))*f.sv,C=u0*45*vs(a/1.2),a1=k*f.x+.9*tp,a2=k*f.y-.7*tp,b1=2.3*k*f.x-.6*tp,b2=2.3*k*f.y+.8*tp;
f.x+=(VG.ct*s-C*Math.sin(a1)*Math.sin(a2)-.4*C*Math.sin(b1)*Math.sin(b2)+Math.sin(tp*f.w+f.p)*6*u0)*dt;
f.y+=(VG.st*s-C*Math.cos(a1)*Math.cos(a2)-.4*C*Math.cos(b1)*Math.cos(b2)+Math.cos(tp*f.w*1.3+f.p)*6*u0)*dt;
if(f.x<-80||f.x>W+80||f.y<-80||f.y>H+80){f.dd=1;return -2}return a}
// vẽ đàn: đom đóm có quầng sáng (chói lên rồi dịu) và bụi sáng nhỏ gom theo màu; trả về số hạt còn lại
function vfl(tp,dt){g.globalCompositeOperation='lighter';let n=0;
for(const f of VG.fl){if(f.dd)continue;const a=vmv(f,tp,dt);if(a===-1){n++;continue}if(a<0)continue;n++;const e=Math.exp(-a*3),z=f.r*(1+.6*e);g.globalAlpha=c01(vs(a/.5)*(.6+.4*Math.sin(tp*f.w*2+f.p))*(1+.5*e));g.drawImage(VG.sc[f.k],f.x-z/2,f.y-z/2,z,z)}
g.globalAlpha=.8;
for(const k in VG.bk){g.fillStyle=VG.bc[k];for(const f of VG.bk[k]){if(f.dd)continue;const a=vmv(f,tp,dt);if(a===-1){n++;continue}if(a<0)continue;n++;const z=f.s*(1+.5*Math.exp(-a*3))*Math.min(1,.25+a*2.5)*(.85+.15*Math.sin(tp*f.w*2+f.p));g.fillRect(f.x-z/2,f.y-z/2,z,z)}}
g.globalCompositeOperation='source-over';g.globalAlpha=1;return n}
// pha 1: cảnh sống mờ dần theo làn sóng (lớp đen mềm), đom đóm bong ra; pha 2: đom đóm xanh từ ngoài bay về tụ thành trái tim (đàn cũ vẫn đang bay ra phía trên)
function over(){const r=VG.rp;if(!r)return;const tp=now()-r.t0,dt=Math.min(.05,Math.max(0,tp-VG.tl));VG.tl=tp;
if(!r.ph){g.globalCompositeOperation='source-over';g.globalAlpha=1;
const d=VG.md.data,Tm=VG.tm;for(let i=0;i<VG.cn;i++)d[i*4+3]=vs((tp-Tm[i])/.9)*255;VG.mx.putImageData(VG.md,0,0);g.imageSmoothingEnabled=true;g.drawImage(VG.mcv,0,0,W,H);
vfl(tp,dt);
try{au.volume=Math.max(0,1-tp/5.9)}catch(_){}
if(tp>=5.9){reset();try{au.volume=1}catch(_){}$('#hint').style.visibility='hidden';VG.mcv=VG.mx=VG.md=VG.tm=null;
const L=Math.hypot(W,H);for(const q of P){const a=rd()*6.2832,ca=Math.cos(a),sa=Math.sin(a),t=1/Math.max(Math.abs(ca)/(W/2+60),Math.abs(sa)/(Math.max(cy,H-cy)+60))*(1+rd()*.25);q.sx=cx+ca*t;q.sy=cy+sa*t;q.d=rd()*.4;q.cv=(rd()-.5)*L*.35;q.al=0}
VG.as=1;VG.g=0;VG.fa=0;r.ph=1;r.t1=now()}
return}
const gg=c01((now()-r.t1)/4);VG.g=gg;VG.fa=vs((gg-.1)/.6);
if(VG.fl&&(!vfl(tp,dt)||tp>11)){VG.fl=null;VG.bk=null}
if(gg>.92)$('#hint').style.visibility='visible';
if(gg>=1&&!r.d){r.d=1;VG.as=0;VG.fa=1;for(const q of P)q.al=null;cv.style.cursor='pointer'}
if(r.d&&!VG.fl)VG.rp=null}
// hạt trái tim bay từ ngoài khung vào theo đường cong, mỗi hạt một nhịp riêng
function vas(q){const e=vs((VG.g-q.d)/.6),tx=q.x,ty=q.y,dx=q.sx-tx,dy=q.sy-ty,l=Math.hypot(dx,dy)||1,c=Math.sin(3.1416*e)*q.cv*(1-e);q.x=tx+dx*(1-e)-dy/l*c;q.y=ty+dy*(1-e)+dx/l*c;q.al=.25+.75*e}
// toàn màn hình khi chạm trái tim; giữ nguyên đàn đom đóm khi khung hình đổi cỡ
function goFull(){VG.fs=now();const e=document.documentElement,f=e.requestFullscreen||e.webkitRequestFullscreen;if(f&&!document.fullscreenElement&&!document.webkitFullscreenElement)try{const p=f.call(e);p&&p.catch&&p.catch(()=>{})}catch(_){}}
function rsz(){const f=F,p=P,w=W,h=H,z=now()-VG.fs<2.5&&go!==null;init();if(z){F=f;P=p;const a=W/w,b=H/h;for(const q of f.concat(p)){q.x*=a;q.y*=b}}}

// ================= CẤU HÌNH: SỬA Ở ĐÂY =================
// Nội dung bức thư: người nhận, người gửi, và từng đoạn lời chúc
const LETTER={to:'Kim Khánh Linh',from:'Người gửi',body:['Chúc mừng ngày Phụ nữ Việt Nam 20/10!','Chúc bạn luôn rạng rỡ như ánh trăng, dịu dàng như những chùm linh lan, và mỗi ngày đều có thật nhiều niềm vui.','Mong những điều bạn ước sẽ nở hoa đúng lúc, và bạn luôn được yêu thương như bạn xứng đáng.']};
// Giây thứ mấy trong nhac.m4a thì hết đoạn thoại và bắt đầu hát
const SING=10;
// =======================================================
const $=s=>document.querySelector(s),cv=$('#c'),g=cv.getContext('2d'),au=$('#au'),R=Math.random,now=()=>performance.now()/1000,cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,SP=RM?.35:1,BLUE='82,182,255',TUN=4.5; // SING: giây bắt đầu hát
let W,H,D,cx,cy,u,SC=1,go=null,aOK=false,sw=[],F=[],P=[],pulse=0,ptr={x:-999,y:-999},tt;
const ok=i=>i.naturalWidth>0;
const IN=$('#in'),IJ=$('#ij'); // ảnh Nick và Judy đã nhúng sẵn trong file
const S=Array.from({length:70},()=>({a:R()*6.3,o:R()}));
const SPR=(()=>{const s=document.createElement('canvas');s.width=s.height=64;const x=s.getContext('2d'),r=x.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'#fff');r.addColorStop(.13,`rgb(${BLUE})`);r.addColorStop(.42,`rgba(${BLUE},.25)`);r.addColorStop(1,`rgba(${BLUE},0)`);x.fillStyle=r;x.fillRect(0,0,64,64);return s})();
const mkf=o=>Object.assign({x:0,y:0,a:R()*6.3,v:(.2+R()*.45)*SP,r:18+R()*22,p:R()*6.3,w:.6+R()*1.6,f:.3+R()*.8,kx:0,ky:0},o);
const hx=t=>16*Math.sin(t)**3,hy=t=>13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t),X=(x,k)=>cx+x*k*u,Y=(y,k)=>cy-(y*k+3)*u;
const HPOLY=Array.from({length:200},(_,i)=>{const t=i/200*6.2832;return[hx(t),hy(t)]});
const inHeart=(x,y)=>{let c=false;for(let i=0,j=199;i<200;j=i++){const a=HPOLY[i],b=HPOLY[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}return c};
const HL=(()=>{let a=0;const L=[0];for(let i=1;i<=200;i++){const p=HPOLY[i%200],q=HPOLY[i-1];a+=Math.hypot(p[0]-q[0],p[1]-q[1]);L.push(a)}return L})();
const hOut=()=>{const s=R()*HL[200];let i=1;while(i<200&&HL[i]<s)i++;const f=(s-HL[i-1])/(HL[i]-HL[i-1]||1),p=HPOLY[i%200],q=HPOLY[i-1];return[q[0]+(p[0]-q[0])*f,q[1]+(p[1]-q[1])*f]};
function init(){
W=innerWidth;H=innerHeight;D=Math.min(devicePixelRatio||1,innerWidth<600?1.5:2);cv.width=W*D;cv.height=H*D;g.setTransform(D,0,0,D,0,0);
cx=W/2;cy=H*.45;u=Math.min(Math.min(W,H)*.19,150)/16;$('#hint').style.top=cy+u*17+18+'px';
F=Array.from({length:Math.max(40,Math.min(100,W*H/16000|0))},()=>mkf({x:R()*W,y:R()*H}));
P=Array.from({length:1100},(_,i)=>{const o=i%4==0,t=R()*6.2832;let x,y;if(o){[x,y]=hOut()}else{do{x=(R()*2-1)*16;y=-17+R()*29}while(!inHeart(x,y))}return mkf({ux:x,uy:y,k:1,o,r:o?12+R()*12:9+R()*8,am:.5+R()*1.6,ox:0,oy:0,fr:0,keep:R()<.4})});
if(go!==null)P.forEach(q=>{q.fr=1;q.x=R()*W;q.y=R()*H});build();skyInit()}
function mov(f,t){
f.a+=Math.sin(t*f.w+f.p)*.03;
if(f.v0)f.v+=(f.v0-f.v)*.005;
f.x+=Math.cos(f.a)*f.v+f.kx;f.y+=Math.sin(f.a)*f.v+f.ky;f.kx*=.94;f.ky*=.94;
if(f.x<-40)f.x=W+40;else if(f.x>W+40)f.x=-40;if(f.y<-40)f.y=H+40;else if(f.y>H+40)f.y=-40}
function dr(f,t,m){const w=.5+.5*Math.sin(t*f.f*3+f.p);g.globalAlpha=(.25+.75*w*w)*m;g.drawImage(SPR,f.x-f.r/2,f.y-f.r/2,f.r,f.r)}
function hp(q,t,b,sc){
const k=q.k*sc,x=X(q.ux,k)+Math.cos(t*q.w+q.p)*q.am*u/3,y=Y(q.uy,k)+Math.sin(t*q.w*1.3+q.p)*q.am*u/3;
const dx=x-ptr.x,dy=y-ptr.y,d=Math.hypot(dx,dy)||1,tx=d<80?dx/d*(80-d)*.8:0,ty=d<80?dy/d*(80-d)*.8:0;
q.ox+=(tx-q.ox)*.12;q.oy+=(ty-q.oy)*.12;q.x=x+q.ox;q.y=y+q.oy;if(VG.as)vas(q);
const s=q.r*(.9+.4*b);g.globalAlpha=(.25+.55*(.5+.5*Math.sin(t*q.w*2.2+q.p*3)))*(q.o?1:.85)*(q.al==null?1:q.al);g.drawImage(SPR,q.x-s/2,q.y-s/2,s,s)}
function world(fn,a){g.save();g.translate(cx,H*.62);g.scale(SC,SC);g.translate(-cx,-H*.62);fn(a);g.restore()}
function moon0(a){
const mx=W*.7,my=H*.2,r=Math.max(24,Math.min(W,H)*.07),gr=g.createRadialGradient(mx,my,r*.7,mx,my,r*6);
gr.addColorStop(0,'rgba(190,220,255,.38)');gr.addColorStop(1,'rgba(190,220,255,0)');
g.globalAlpha=a;g.fillStyle=gr;g.fillRect(mx-r*6,my-r*6,r*12,r*12);
g.fillStyle='#eef5ff';g.beginPath();g.arc(mx,my,r,0,6.2832);g.fill();
g.fillStyle='rgba(140,170,210,.35)';[[-.3,-.2,.22],[.35,.15,.16],[-.05,.45,.12]].forEach(([i,j,s])=>{g.beginPath();g.arc(mx+i*r,my+j*r,s*r,0,6.2832);g.fill()})}
const RJ=.768,GAP=.47; // đo từ ảnh tham chiếu: Judy cao 76,8% Nick, khoảng cách tâm hai ảnh = 0,47 chiều cao Nick
function pic(im,x,y,h){if(!ok(im))return;const w=h*im.naturalWidth/im.naturalHeight;g.save();g.shadowColor='rgba(110,185,255,.5)';g.shadowBlur=18;g.drawImage(im,x-w/2,y-h,w,h);g.restore()}
function duo(a){
const h=Math.min(H*.5,W*.85,640),by=H*.88,d=h*GAP+(SC-1)*W*.44;
g.globalAlpha=a;pic(IN,cx-d/2,by,h);pic(IJ,cx+d/2,by,h*RJ)}
function trans(k,e){
const Dg=Math.hypot(W,H);g.globalCompositeOperation='lighter';
for(let i=0;i<140;i++){const q=S[i%70],ph=(k*.5+q.o+i*.007)%1,r=(1-ph)**1.6*Dg*.6,a=q.a+ph*2.6*(i%2?1:-1),z=14+26*(1-ph);g.globalAlpha=e*Math.sin(Math.PI*ph)*.95;g.drawImage(SPR,cx+Math.cos(a)*r-z/2,cy+Math.sin(a)*r*.8-z/2,z,z)}
g.globalAlpha=e*.5*(1+.3*Math.sin(k*9));g.drawImage(SPR,cx-u*30,cy-u*30,u*60,u*60)}
const SPD=.62,LC=2.2,RW=.3,TX=(1+LC)/(2*SPD),TEND=7.3; // đàn đom đóm cuốn liên tục từ góc dưới trái lên góc trên phải: SPD là tốc độ, LC là độ dài đàn
function mkSweep(){const u0=Math.hypot(W,H)/1000,n=Math.round(Math.min(12000,Math.max(4500,W*H/45)));
sw=Array.from({length:n},()=>{const r=R(),z=(r<.04?150+R()*150:r<.26?60+R()*70:16+R()*R()*54)*u0,a=r<.04?.22:r<.26?.4:.95;
return{s0:-R()*LC,c:-.1+R()*1.2,v:SPD*(.78+R()*.44),z,a,w:.6+R()*1.6,p:R()*6.3,f:.3+R()*.8,A:.03+R()*.08,k:4+R()*4}})}
function sweep(t,k){
const tau=k-SING;if(!sw.length)mkSweep();
const s1=SPD*tau,L=LC,q=RW/L;
g.globalCompositeOperation='source-over';g.globalAlpha=1;g.save();g.transform(W,-H,W,H,-.5*W,.5*H);const gr=g.createLinearGradient(s1-L,0,s1,0);
gr.addColorStop(0,'rgba(22,70,150,0)');gr.addColorStop(q,'rgba(22,70,150,.985)');gr.addColorStop(1-q,'rgba(22,70,150,.985)');gr.addColorStop(1,'rgba(22,70,150,0)');
g.fillStyle=gr;g.fillRect(s1-L,-.3,L,1.6);g.restore();
g.globalCompositeOperation='lighter';
for(const p of sw){
let s=p.s0+p.v*tau;if(s<-.4||s>1.4)continue;
s+=.012*Math.sin(t*p.w+p.p);
const c=p.c+p.A*Math.sin(p.k*s-t*2.2+p.p)+.008*Math.cos(t*p.w*1.3+p.p),x=W*(s+c-.5),y=H*(.5-s+c),h=p.z/2;
if(x<-h||x>W+h||y<-h||y>H+h)continue;
g.globalAlpha=p.a*(.55+.45*(.5+.5*Math.sin(t*p.f*3+p.p)));g.drawImage(SPR,x-h,y-h,p.z,p.z)}}
// ===== Cảnh hoa linh lan: mọc lên khi lớp sáng đang tan =====
const FSTART=3.7;
let GP=[],GL=[],GR=[],BK=[],gOff=0;
const rng=s=>()=>(s=(s*1664525+1013904223)>>>0)/4294967296,sm=x=>(x=cl(x))*x*(3-2*x),eo=x=>1-(1-cl(x))**3,eb=x=>1+2.7*(cl(x)-1)**3+1.7*(cl(x)-1)**2;
const mkc=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'));return c};
const BELL=mkc(160,180,x=>{
const b=new Path2D();b.moveTo(80,30);b.bezierCurveTo(96,30,118,46,120,82);b.bezierCurveTo(121,104,126,120,134,130);b.quadraticCurveTo(122,130,108,122);b.quadraticCurveTo(96,136,80,134);b.quadraticCurveTo(64,136,52,122);b.quadraticCurveTo(38,130,26,130);b.bezierCurveTo(34,120,39,104,40,82);b.bezierCurveTo(42,46,64,30,80,30);b.closePath();
let q=x.createRadialGradient(66,60,4,80,80,70);q.addColorStop(0,'#fff');q.addColorStop(.6,'#eef4ff');q.addColorStop(1,'#bfd3ea');
x.shadowColor='rgba(170,215,255,.85)';x.shadowBlur=20;x.fillStyle=q;x.fill(b);x.shadowBlur=0;
x.save();x.clip(b);
q=x.createLinearGradient(0,100,0,134);q.addColorStop(0,'rgba(90,120,170,0)');q.addColorStop(1,'rgba(90,120,170,.5)');x.fillStyle=q;x.fillRect(20,100,120,40);
q=x.createLinearGradient(0,30,0,56);q.addColorStop(0,'rgba(170,215,170,.75)');q.addColorStop(1,'rgba(170,215,170,0)');x.fillStyle=q;x.fillRect(50,28,60,30);
x.strokeStyle='rgba(110,140,185,.38)';x.lineWidth=1.4;x.beginPath();x.moveTo(80,36);x.quadraticCurveTo(84,80,108,122);x.moveTo(80,36);x.quadraticCurveTo(76,80,52,122);x.moveTo(80,36);x.lineTo(80,132);x.stroke();
q=x.createRadialGradient(62,58,0,62,58,26);q.addColorStop(0,'rgba(255,255,255,.95)');q.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=q;x.fillRect(30,30,60,60);
x.restore();x.strokeStyle='rgba(140,170,210,.55)';x.lineWidth=1.2;x.stroke(b);
x.fillStyle='#a9d9b0';x.beginPath();x.moveTo(73,35);x.quadraticCurveTo(80,22,87,35);x.quadraticCurveTo(80,39,73,35);x.fill()});
const BUD=mkc(80,110,x=>{const q=x.createRadialGradient(34,48,2,40,58,34);q.addColorStop(0,'#fbfff6');q.addColorStop(.55,'#d9eed2');q.addColorStop(1,'#92c99c');
x.shadowColor='rgba(180,235,210,.75)';x.shadowBlur=12;x.fillStyle=q;x.beginPath();x.moveTo(40,22);x.bezierCurveTo(62,26,66,62,56,84);x.quadraticCurveTo(40,98,24,84);x.bezierCurveTo(14,62,18,26,40,22);x.fill();x.shadowBlur=0;
x.strokeStyle='rgba(120,180,130,.55)';x.lineWidth=1.2;x.beginPath();x.moveTo(40,24);x.quadraticCurveTo(46,60,40,92);x.stroke();x.fillStyle='#8cc79a';x.beginPath();x.ellipse(40,24,6,4,0,0,6.3);x.fill()});
const LEAF=mkc(320,660,x=>{
const B=[110,640],C=[118,330],T=[236,26],N=60,M=t=>{const u=1-t;return[u*u*B[0]+2*u*t*C[0]+t*t*T[0],u*u*B[1]+2*u*t*C[1]+t*t*T[1]]};
const D=t=>{const u=1-t,dx=2*u*(C[0]-B[0])+2*t*(T[0]-C[0]),dy=2*u*(C[1]-B[1])+2*t*(T[1]-C[1]),l=Math.hypot(dx,dy);return[-dy/l,dx/l]};
const w=t=>96*2.8*Math.pow(t,.6)*Math.pow(1-t,.95)*(1+.03*Math.sin(t*20));
const edge=(s,f=1,a=0,b=1)=>{const o=[];for(let i=0;i<=N;i++){const t=a+(b-a)*i/N,m=M(t),n=D(t),k=s*w(t)*f;o.push([m[0]+n[0]*k,m[1]+n[1]*k])}return o};
const R_=edge(1),L_=edge(-1),p=new Path2D(),tr=(e,m)=>e.forEach((a,i)=>i?m.lineTo(a[0],a[1]):m.moveTo(a[0],a[1]));
tr(R_,p);for(let i=N;i>=0;i--)p.lineTo(L_[i][0],L_[i][1]);p.closePath();
let q=x.createLinearGradient(B[0],B[1],T[0],T[1]);q.addColorStop(0,'#06231c');q.addColorStop(.3,'#0b3f2e');q.addColorStop(.7,'#17714a');q.addColorStop(1,'#4fae7a');x.fillStyle=q;x.fill(p);
x.save();x.clip(p);
q=x.createLinearGradient(40,0,200,0);q.addColorStop(0,'rgba(0,18,12,.25)');q.addColorStop(.5,'rgba(0,0,0,0)');q.addColorStop(1,'rgba(170,235,225,.14)');x.fillStyle=q;x.fillRect(0,0,320,660);
x.lineWidth=1.3;for(const s of[-1,1])for(let k=1;k<=5;k++){x.strokeStyle='rgba(175,238,200,'+(.2-k*.02)+')';x.beginPath();tr(edge(s,k/6,.04,.97),x);x.stroke()}
for(let i=0;i<N;i++){const a=M(i/N),b=M((i+1)/N);x.strokeStyle='rgba(205,246,218,.55)';x.lineWidth=5*(1-i/N)+1;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()}
q=x.createRadialGradient(B[0],B[1],4,B[0],B[1],90);q.addColorStop(0,'rgba(215,240,200,.55)');q.addColorStop(1,'rgba(215,240,200,0)');x.fillStyle=q;x.fillRect(0,540,320,120);
x.restore();x.lineJoin='round';x.lineWidth=2;x.strokeStyle='rgba(175,230,255,.32)';x.beginPath();tr(R_,x);x.stroke();x.strokeStyle='rgba(0,25,18,.4)';x.beginPath();tr(L_,x);x.stroke()});
const spt=(p,t,sw)=>{const u=1-t,L=p.lean,h=p.h;return[p.x+3*u*u*t*L*.02+3*u*t*t*L*.45+t*t*t*L+sw*t*t*h*.07,p.y-(3*u*u*t*h*.6+3*u*t*t*h*1.04+t*t*t*h*(1-p.drop))]};
function leaf(l,t,gt,w0){const k=eo((gt-l.d-.2)/2.8);if(k<=0)return;const s=l.len/614;g.save();g.translate(l.x,l.y);g.rotate(l.a*(.4+.6*sm(k))+w0*.025+.02*Math.sin(t*.7+l.ph));g.scale(l.dn*s*l.wid*Math.min(1,.3+k),s*k);g.drawImage(LEAF,-110,-640);g.restore()}
function build(){
const r=rng(11),u1=Math.min(W,H),gy=H*.975,sp=u1*.075;GP=[];GL=[];
const bu0=Math.min(W,H)*(W<H?.072:.05),t0=W<H?.15:.4,mk=(x,h,lean,dl)=>{
const p={x,y:gy,h,lean,dir:lean<0?-1:1,drop:.1+r()*.08,dl,ph:r()*6.3,ds:3.6+r()*1.4,b:[]};
let L=0,pp=spt(p,t0,0);for(let i=1;i<=24;i++){const q=spt(p,t0+(.86-t0)*i/24,0);L+=Math.hypot(q[0]-pp[0],q[1]-pp[1]);pp=q}
const n=Math.max(6,Math.round(L/(bu0*.8)));
for(let i=0;i<n;i++){const q=n>1?i/(n-1):0;p.b.push({t:t0+(.86-t0)*q+(r()-.5)*.012,f:1-.38*q,pl:(i%2?1.25:.75)+(r()-.5)*.2,z:i%2,tilt:(r()-.5)*.5,sp:r(),bud:0})}
for(let j=0;j<4;j++){const q=j/3;p.b.push({t:.885+.11*q,f:.8-.48*q,pl:.55+(r()-.5)*.1,z:j%2,tilt:(r()-.5)*.8,sp:r(),bud:1})}
GP.push(p)};
for(let i=0;i<7;i++){const o=i-3;mk(cx+o*sp+(r()-.5)*sp*.4,H*(W<H?.52+.08*r():.52+.24*r())*(1-.05*Math.abs(o)),(o||(r()<.5?1:-1))*u1*(W<H?.5:1)*(.12+.1*r()),.12*Math.abs(o)+r()*.3)}
if(W<H)for(let i=0;i<4;i++){const o=(i<2?-1:1)*(.9+.9*(i%2)+r()*.3);mk(cx+o*sp,H*(.28+.06*r()),(o<0?-1:1)*u1*.5*(.12+.1*r()),.5+r()*.5)}
const Lb=W<H?Math.min(H*.34,W*.8):H*.4,lv=(o,len,a,dn,d,f)=>GL.push({x:cx+o*sp,y:gy+H*.004,len,a,dn,d,f,wid:1.05+r()*.15,ph:r()*6.3});
lv(-2.1,Lb*.95,-.32,-1,0,0);lv(-.7,Lb*1.12,-.1,-1,.25,0);lv(.7,Lb*1.12,.1,1,.15,0);lv(2.1,Lb*.95,.34,1,.35,0);lv(-1.2,Lb*.62,-.55,-1,.55,1);lv(1.3,Lb*.58,.5,1,.65,1);
GR=Array.from({length:Math.round(W/5)},()=>({x:R()*W,l:H*(.025+.07*r()),w:1.5+r()*2.5,bd:(r()-.5)*H*.05,p:r()*6.3,d:r()*1.5,c:['#04140f','#06201a','#0a2e22','#071a14'][r()*4|0]}));
BK=Array.from({length:10},()=>({x:r(),y:.3+.6*r(),r:u1*(.05+.1*r()),p:r()*6.3}));lgeom()}
function garden(t,gt){
if(gt<=0||!GP.length)return;
const bu=Math.min(W,H)*(W<H?.072:.05),sk=[],w0=Math.sin(t*.9)*.7+Math.sin(t*1.7)*.3;g.lineCap='round';g.globalCompositeOperation='lighter';
g.globalAlpha=.17*sm(gt/3);g.drawImage(SPR,cx-W*.46,H*.3,W*.92,H*.8);
for(const b of BK){g.globalAlpha=.07*sm(gt/3)*(.6+.4*Math.sin(t*.4+b.p));g.drawImage(SPR,b.x*W+Math.sin(t*.1+b.p)*30-b.r,b.y*H-b.r,b.r*2,b.r*2)}
g.globalCompositeOperation='source-over';g.globalAlpha=1;
for(const l of GL)if(!l.f)leaf(l,t,gt,w0);
for(const p of GP){
const pt=gt-p.dl;if(pt<=0)continue;
const sw=(Math.sin(t*.9+p.ph)*.7+Math.sin(t*1.7+p.ph*2)*.3)*sm(pt/2.5),gs=sm((pt-.3)/p.ds),N=26;
for(let i=0;i<N;i++){const t0=gs*i/N,t1=gs*(i+1)/N,a=spt(p,t0,sw),b=spt(p,t1,sw);
g.strokeStyle=`rgb(${18+t0*120|0},${86+t0*110|0},${60+t0*90|0})`;g.lineWidth=Math.max(.8,bu*.22*(1-.82*t0));g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}
for(const b of p.b){const q=cl((gs-b.t)/.12);if(q<=0)continue;
const s0=spt(p,b.t,sw),bw=bu*b.f,pl=bw*.6*b.pl,d=p.dir,e=eo(q),ex=s0[0]+d*pl*(b.z?.9:.25)*e,ey=s0[1]+pl*.85*e;
g.strokeStyle='rgba(168,222,180,.95)';g.lineWidth=Math.max(1,bw*.045);g.beginPath();g.moveTo(s0[0],s0[1]);g.quadraticCurveTo(s0[0]+d*pl*.55*e,s0[1]+pl*.1,ex,ey);g.stroke();
const k=bw/108*eb(q);g.save();g.translate(ex,ey);g.rotate(b.tilt+sw*.12+Math.sin(t*1.3+b.sp*6.3)*.07-d*1.2*(1-q));g.scale(k,k);g.globalAlpha=cl(q*2);g.drawImage(b.bud?BUD:BELL,b.bud?-40:-80,b.bud?-22:-30);g.restore();
if(q>=1&&!b.bud){const w=Math.sin(t*1.6+b.sp*40);if(w>.93)sk.push([ex-bw*.1,ey+bw*.5,(w-.93)/.07,bw])}}}
for(const l of GL)if(l.f)leaf(l,t,gt,w0);
g.globalCompositeOperation='lighter';for(const s of sk){g.globalAlpha=s[2];g.drawImage(SPR,s[0]-s[3]*.35,s[1]-s[3]*.35,s[3]*.7,s[3]*.7)}
g.globalAlpha=.1*sm(gt/3);g.drawImage(SPR,-W*.1,H*.8,W*1.2,H*.3);
g.globalCompositeOperation='source-over';g.globalAlpha=1;
const sh=g.createLinearGradient(0,H*.82,0,H);sh.addColorStop(0,'rgba(2,6,14,0)');sh.addColorStop(1,'rgba(2,6,14,.9)');g.fillStyle=sh;g.fillRect(0,H*.82,W,H*.18);
for(const b of GR){const k=eo((gt-b.d)/1.8);if(k<=0)continue;const bd=b.bd+Math.sin(t*.9+b.p)*b.l*.12*k,tx=b.x+bd*k,ty=H-b.l*k;
g.fillStyle=b.c;g.beginPath();g.moveTo(b.x-b.w,H+2);g.quadraticCurveTo(b.x+bd*.35,H-b.l*k*.55,tx,ty);g.quadraticCurveTo(b.x+bd*.35+b.w,H-b.l*k*.5,b.x+b.w,H+2);g.fill()}}
// ===== Bức thư: đom đóm tụ lại, thành thư, rơi xuống gốc hoa =====
// ĐỔI NỘI DUNG THƯ Ở ĐÂY
const LSTART=8.6,TG=4.6,TF=1.2,TFALL=5.6; // giây: bắt đầu tụ (tính từ lúc hoa mọc), thời gian tụ, hiện giấy, thời gian rơi
let lOff=0,LP=[],SD=[],PF=null,FT=null,lw=100,lh=70,fx=0,fy=0,tx=0,ty=0,slideD=0,lopen=false,lsh=false,LS=false;
const rrect=(x,a,b,w,h,r)=>{x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()};
const hpath=(x,cx,cy,s)=>{x.beginPath();for(let i=0;i<=60;i++){const t=i/60*6.2832,px=cx+16*Math.sin(t)**3*s,py=cy-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*s;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath()};
const seal=(x,cx,cy,s)=>{x.save();x.shadowColor='rgba(120,200,255,.9)';x.shadowBlur=16;hpath(x,cx,cy,s);const q=x.createRadialGradient(cx-s*4,cy-s*6,1,cx,cy,s*18);q.addColorStop(0,'#e4f6ff');q.addColorStop(.5,'#6cc0ff');q.addColorStop(1,'#2f86e0');x.fillStyle=q;x.fill();x.restore()};
const PAPER=mkc(360,260,x=>{
rrect(x,40,30,280,200,10);x.shadowColor='rgba(150,210,255,.85)';x.shadowBlur=26;let q=x.createLinearGradient(40,30,320,230);q.addColorStop(0,'#fcf7ea');q.addColorStop(1,'#e3d6b8');x.fillStyle=q;x.fill();x.shadowBlur=0;
x.save();rrect(x,40,30,280,200,10);x.clip();q=x.createRadialGradient(90,60,0,90,60,220);q.addColorStop(0,'rgba(190,225,255,.35)');q.addColorStop(1,'rgba(190,225,255,0)');x.fillStyle=q;x.fillRect(40,30,280,200);
x.strokeStyle='rgba(120,135,170,.5)';x.lineWidth=5;x.lineCap='round';[[78,.9],[104,1],[130,.95],[156,.7],[182,.4]].forEach(([y,l])=>{x.beginPath();x.moveTo(72,y);x.lineTo(72+190*l,y);x.stroke()});
x.restore();rrect(x,52,42,256,176,6);x.strokeStyle='rgba(150,125,80,.35)';x.lineWidth=1.5;x.stroke();seal(x,262,196,1.5)});
const PDK=mkc(360,260,x=>{x.drawImage(PAPER,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(6,14,34,.62)';x.fillRect(0,0,360,260)});
// quỹ đạo rơi: nhẹ nhàng, chỉ lượn nhẹ một đến hai nhịp
function mkFall(){const N=240,P=new Float32Array(N+1),PH=new Float32Array(N+1);let a=0;
for(let i=0;i<=N;i++){const u=i/N;PH[i]=6.2832*1.3*u;a+=sm(u/.18)*(1-sm((u-.8)/.2))+.03;P[i]=a}
for(let i=0;i<=N;i++)P[i]/=a;FT={N,P,PH}}
const lt2=(A,u)=>{const f=u*FT.N,i=Math.min(FT.N-1,f|0),w=f-i;return A[i]*(1-w)+A[i+1]*w};
function fallAt(u){const P=lt2(FT.P,u),ph=lt2(FT.PH,u),en=sm(u/.3)*Math.pow(1-sm((u-.72)/.28),.9);
return[fx+(tx-fx)*(.5*sm(u)+.5*P)+.22*lw*en*Math.sin(ph),fy+(ty-fy)*P,.17*en*Math.cos(ph+.3)-.12*sm(u),1-.05*en*(.5+.5*Math.sin(ph*.5+.8))]}
function lgeom(){lw=Math.min(W,H)*(W<H?.3:.2);lh=lw*200/280;fx=W<H?cx:cx-W*.14;fy=H*.22;tx=cx+(W<H?0:W*.02);ty=H*.905-lh*.5;LP=[];SD=[];PF=null;mkFall();slideD=Math.sign(Math.cos(FT.PH[FT.N]+.3))*lw*.04;if(lsh)lshow(true)}
function lshow(on){if(VG.rp&&on)return;lsh=on;const b=$('#lb'),h=$('#lh');if(on){const bw=Math.max(lw*1.4,70),bh=Math.max(lh*1.6,70);b.style.cssText=`display:block;left:${tx-bw/2}px;top:${ty-bh/2}px;width:${bw}px;height:${bh}px`;h.style.cssText=`left:${tx}px;top:${ty-bh/2-34}px;visibility:visible`}else{b.style.display='none';h.style.visibility='hidden'}}
function fillCard(){$('#ct').textContent='Gửi '+LETTER.to+',';$('#cb').innerHTML=LETTER.body.map((s,i)=>`<p style="--i:${i}">${s}</p>`).join('');$('#cs').textContent=LETTER.from;$('#card').style.setProperty('--n',LETTER.body.length)}
function openCard(){if(lopen||!lsh)return;lopen=true;lshow(false);const c=$('#card'),cw=Math.min(W*.86,460);c.style.display='block';c.style.setProperty('--dx',tx-W/2+'px');c.style.setProperty('--dy',ty-H/2+'px');c.style.setProperty('--s',Math.max(.08,lw/cw));void c.offsetWidth;c.classList.add('on');$('#bd').classList.add('on')}
function closeCard(){if(!lopen)return;$('#card').classList.remove('on');$('#bd').classList.remove('on');setTimeout(()=>{$('#card').style.display='none';lopen=false;if(LS)lshow(true)},950)}
function hideCard(){lopen=false;$('#card').classList.remove('on');$('#card').style.display='none';$('#bd').classList.remove('on')}
// đàn đom đóm: 240 con vẽ viền, 520 con lấp đầy hình chữ nhật
function mkLP(){
const r=rng(5),u0=Math.hypot(W,H)/1000,ar=200/280,P=[];
for(let i=0;i<300;i++){const s=i/300*4,f=s%1,q=s|0;P.push(q==0?[-.5+f,-ar/2,1]:q==1?[.5,-ar/2+f*ar,1]:q==2?[.5-f,ar/2,1]:[-.5,ar/2-f*ar,1])}
for(let i=0;i<1500;i++)P.push([(r()-.5)*.94,(r()-.5)*ar*.94,0]);
LP=P.map(([x,y,e])=>{const sx=R()*W,sy=R()*H,ex=fx+x*lw,ey=fy+y*lw,dx=ex-sx,dy=ey-sy,d=Math.hypot(dx,dy)||1;
return{sx,sy,tx:ex,ty:ey,nx:-dy/d,ny:dx/d,am:(r()-.5)*d*.5,d:e?r()*1.2:.6+r()*1.2,du:1.4+r()*.8,z:(e?11+r()*r()*16:8+r()*r()*14)*u0*(e?1.2:1),e,f:.3+r()*.8,p:r()*6.3}})}
function letter(t,gt){
const lt=gt-LSTART-lOff;
if(lt<0){if(lsh)lshow(false);LS=false;if(LP.length)LP=[];SD=[];PF=null;return}
if(!LP.length)mkLP();
const T1=TG+TF,fu=cl((lt-T1)/TFALL),tl=lt-T1-TFALL,k=lw/280,u0=Math.hypot(W,H)/1000;
LS=fu>=1;if(LS&&!lsh&&!lopen)lshow(true);
g.globalCompositeOperation='lighter';
if(lt<T1+.8){const fo=lt<TG+.4?1:cl(1-(lt-TG-.4)/(TF+.2));
for(const p of LP){if(lt<p.d)continue;const u=eo((lt-p.d)/p.du),s=Math.sin(Math.PI*u),j=u>.92?1.2:0,x=p.sx+(p.tx-p.sx)*u+p.nx*s*p.am+Math.sin(t*3+p.p)*j,y=p.sy+(p.ty-p.sy)*u+p.ny*s*p.am+Math.cos(t*3+p.p)*j;
g.globalAlpha=Math.min(1,u*2+.15)*(.5+.5*Math.sin(t*p.f*3+p.p))*fo*(p.e?1:.85);g.drawImage(SPR,x-p.z/2,y-p.z/2,p.z,p.z)}
const fl=Math.max(0,1-Math.abs(lt-TG-.5)/.6);if(fl>0){g.globalAlpha=fl*.7;g.drawImage(SPR,fx-lw*1.4,fy-lw*1.4,lw*2.8,lw*2.8)}}
const ft=cl((lt-TG)/TF);
if(ft>0&&!lopen){
let x=fx,y=fy,rot=0,sx=1;
if(fu>0)[x,y,rot,sx]=fallAt(fu);
if(tl>0){x+=slideD*(1-Math.exp(-4*tl));rot+=.05*Math.exp(-3.2*tl)*Math.sin(9*tl)}
const al=sm(ft);
if(fu>0&&fu<1&&SD.length<150&&(!SD.length||t-SD[SD.length-1].t0>.035))for(let i=0;i<2;i++)SD.push({x:x+(R()-.5)*lw*.7,y:y+(R()-.2)*lh*.5,t0:t,vx:(R()-.5)*lw*.35,vy:lw*(.04+R()*.16),z:(8+R()*10)*u0});
for(const s of SD){const a=t-s.t0;if(a>1.8)continue;g.globalAlpha=Math.pow(1-a/1.8,1.5)*.85;g.drawImage(SPR,s.x+s.vx*a-s.z/2,s.y+s.vy*a+lw*.12*a*a-s.z/2,s.z,s.z)}
if(SD.length>40&&t-SD[0].t0>1.8)SD=SD.filter(s=>t-s.t0<1.8);
g.globalAlpha=(LS?.3+.1*Math.sin(t*2.2):.2)*al;g.drawImage(SPR,x-lw*1.15,y-lw*1.15,lw*2.3,lw*2.3);
g.globalCompositeOperation='source-over';g.save();g.translate(x,y);g.rotate(rot);const sc=.94+.06*al;g.scale(sx*sc,sc);
g.globalAlpha=al;g.drawImage(PAPER,-180*k,-130*k,360*k,260*k);const sh=(1-sx)/.3*.55;if(sh>.01){g.globalAlpha=al*sh;g.drawImage(PDK,-180*k,-130*k,360*k,260*k)}g.restore();
g.globalCompositeOperation='lighter';
if(tl>0){if(!PF)PF={x,y:y+lh*.3,l:Array.from({length:28},()=>({vx:(R()-.5)*lw*2.4,vy:-(R()*lw*.9+lw*.15),z:(8+R()*12)*u0}))};
if(tl<1.5){for(const p of PF.l){g.globalAlpha=Math.pow(1-tl/1.5,1.5);g.drawImage(SPR,PF.x+p.vx*tl-p.z/2,PF.y+p.vy*tl+lw*1.2*tl*tl-p.z/2,p.z,p.z)}g.globalAlpha=.5*Math.exp(-tl*2.2);g.drawImage(SPR,PF.x-lw*1.2,PF.y-lw*.9,lw*2.4,lw*1.8)}}
if(LS)for(let i=0;i<5;i++){const a=t*(.7+i*.11)+i*1.26,r2=lw*(.68+.1*(i%2)),z=(12+i*2)*u0;g.globalAlpha=.5+.4*Math.sin(t*2+i);g.drawImage(SPR,x+Math.cos(a)*r2-z/2,y+Math.sin(a)*r2*.7-z/2,z,z)}}
g.globalCompositeOperation='source-over';g.globalAlpha=1}
function seek(s){if(go===null){go=now()-s;aOK=true;au.currentTime=s;au.play().catch(()=>{aOK=false});$('#hint').style.visibility='hidden';init()}else{au.currentTime=s;go=now()-s}sw=[];gOff=0;lOff=0;LP=[];SD=[];PF=null;hideCard()}
function frame(ms){
const t=ms/1000;let k=-1;
if(go!==null){k=now()-go;if(aOK&&!au.paused&&Math.abs(k-au.currentTime)>.15){go=now()-au.currentTime;k=au.currentTime}}
const on=k>=0,e=on?Math.sin(Math.PI*cl(k/TUN)):0;
g.globalCompositeOperation='source-over';g.globalAlpha=1;g.fillStyle='#000';g.fillRect(0,0,W,H);
const p=t%1.4/1.4,b=Math.exp(-((p-.08)**2)/.0016)+.6*Math.exp(-((p-.3)**2)/.004);
pulse*=.94;const sc=1+.06*b+.22*pulse;
const wa=on?cl((k-.8)/2):0,da=on?cl((SING+TX+.15-k)/.3):1,dm=on?1-.62*cl(k/2):1,hg=on?cl(1-k*1.5):1,z=1+2.4*(1-cl(k/TUN))**3;
SC=z;
if(wa>0)world(moon,wa);if(on)garden(t,k-SING-FSTART-gOff);
g.globalCompositeOperation='lighter';
if(hg>0){g.globalAlpha=(.16+.1*b)*hg*VG.fa;g.drawImage(SPR,cx-u*24,cy-u*24,u*48,u*48)}
for(const f of F){mov(f,t);dr(f,t,dm*VG.fa)}
for(const q of P){if(q.fr){const kv=q.keep?1:cl(1-(k-2.5)/2.5);if(kv>0){mov(q,t);dr(q,t,dm*kv)}}else hp(q,t,b,sc)}
g.globalCompositeOperation='source-over';
if(on)letter(t,k-SING-FSTART-gOff);
if(wa*da>0)world(duo,wa*da);
if(on&&k<TUN+.2)trans(k,e);
if(on&&k>=SING&&k<SING+TEND)sweep(t,k);
over(t);requestAnimationFrame(frame)}
let tm;function say(s){const el=$('#toast');el.textContent=s;el.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>el.classList.remove('on'),4200)}
function reset(){go=null;sw=[];gOff=0;lOff=0;LP=[];SD=[];PF=null;hideCard();lshow(false);au.pause();au.currentTime=0;init();$('#hint').style.visibility='visible'}
addEventListener('pointermove',e=>{ptr={x:e.clientX,y:e.clientY}});
addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')ptr={x:-999,y:-999}});
addEventListener('pointerdown',e=>{ptr={x:e.clientX,y:e.clientY}});
cv.addEventListener('click',e=>{
if(go!==null||VG.rp||e.target.closest('button')||Math.hypot(e.clientX-cx,e.clientY-cy)>u*17)return;
go=now();aOK=true;cv.style.cursor='default';goFull();au.currentTime=0;au.play().catch(()=>{aOK=false;say('Không thấy nhac.m4a cạnh file này, cảnh vẫn chạy nhưng không có tiếng')});
pulse=1;$('#hint').style.visibility='hidden';
for(const q of P){q.fr=1;q.v0=q.v;q.v*=4;const a=Math.atan2(q.y-cy,q.x-cx)+(R()-.5),m=4+R()*10;q.kx=Math.cos(a)*m;q.ky=Math.sin(a)*m}
for(const f of F){const a=Math.atan2(f.y-cy,f.x-cx),d=Math.hypot(f.x-cx,f.y-cy)||1,m=10*Math.exp(-d/(u*30));f.kx+=Math.cos(a)*m;f.ky+=Math.sin(a)*m}});
const lbn=document.createElement('button');lbn.textContent='Xem cảnh thư';lbn.onclick=()=>seek(SING+FSTART+LSTART-.3);$('#ui').append(lbn);
const hb=document.createElement('button');hb.textContent='Xem cảnh hoa';hb.onclick=()=>seek(SING+FSTART-.3);$('#ui').append(hb);
const jb=document.createElement('button');jb.textContent='Xem đoạn chuyển cảnh';jb.onclick=()=>seek(SING-2);$('#ui').append(jb);
const rb=document.createElement('button');rb.textContent='Chơi lại';rb.onclick=reset;$('#ui').append(rb);const tg=document.createElement('button');tg.className='tg';tg.textContent='≡';tg.setAttribute('aria-label','Menu xem thử');tg.onclick=()=>$('#ui').classList.toggle('open');$('#ui').append(tg);
addEventListener('resize',rsz);
if(!/dev|hoa|thu/.test(location.hash))$('#ui').style.display='none';
fillCard();$('#cx').onclick=closeCard;$('#bd').onclick=closeCard;$('#lb').onclick=openCard;addEventListener('keydown',e=>{if(e.key==='Escape')closeCard()});
init();requestAnimationFrame(frame);if(/thu/.test(location.hash))seek(SING+FSTART+LSTART-.3);else if(/hoa/.test(location.hash))seek(SING+FSTART+8);
