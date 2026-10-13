precision highp float;
uniform float uTime;
uniform float uAspect;
uniform float uScroll;
uniform vec2 uPointer;
varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=vUv;
  vec2 p=(uv-.5)*vec2(uAspect,1.0);
  p+=uPointer*.009;
  float curve=1.0+.46*p.x*p.x;
  vec2 room=vec2(atan(p.x*.95)*1.5,p.y*curve);
  room.y+=uScroll*.022;
  vec2 tiles=room*vec2(12.,15.);
  vec2 cell=floor(tiles);
  vec2 lines=abs(fract(tiles-.5)-.5)/max(fwidth(tiles),vec2(.0001));
  float grid=1.-min(min(lines.x,lines.y),1.);
  vec2 fine=tiles*5.;
  vec2 fineLines=abs(fract(fine-.5)-.5)/max(fwidth(fine),vec2(.0001));
  float smallGrid=1.-min(min(fineLines.x,fineLines.y),1.);
  float n=hash(cell);
  float wave=sin(room.x*3.+uTime*.09)*cos(room.y*4.-uTime*.08);
  float halo=exp(-length(p*vec2(.9,1.15)) * 2.3);
  float panels=smoothstep(.38,.95,n)*(.5+.5*sin(uTime*.17+n*9.));
  vec3 col=vec3(.004,.005,.012);
  col+=vec3(.018,.02,.042)*grid;
  col+=vec3(.007,.008,.021)*smallGrid;
  col+=mix(vec3(.025,.035,.09),vec3(.10,.035,.34),.5+.5*wave)*halo*(panels*.8+.25);
  vec2 cross=abs(fract(tiles/4.)-.5);
  float plus=(1.-smoothstep(.004,.009,cross.x))*(1.-step(.039,cross.y));
  plus+=(1.-smoothstep(.004,.009,cross.y))*(1.-step(.039,cross.x));
  col+=plus*vec3(.12,.13,.20);
  col*=.58+.42*(1.-smoothstep(.3,1.1,length(p)));
  float grain=(hash(uv*vec2(1920.,1080.)+fract(uTime))-.5)*.012;
  gl_FragColor=vec4(col+grain,1.0);
}
