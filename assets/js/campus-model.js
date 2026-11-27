// Positions follow the 14 numbered destinations in the published campus plan.
// This is an architectural illustration, not a surveyed building model.
export const locations = [
 {id:1,key:'entrance',x:-9,z:-20,category:'life',ka:'მთავარი შესასვლელი',en:'Main entrance',introKa:'შენი ახალი გზა აქ იწყება.',introEn:'Every new chapter begins somewhere.',kaText:'კამპუსის მთავარი შესასვლელიდან აკადემიურ სივრცეს, ბიბლიოთეკასა და ცენტრალურ პლაზას აღმოაჩენ. აირჩიე მიმართულება და დაიწყე საკუთარი მარშრუტი.',enText:'Begin at the main entrance, with the academic quarter, library, and central plaza ahead of you. Choose a direction. Make the campus your own.',link:'/admissions.html',ctaKa:'დაგეგმე შემდეგი ნაბიჯი',ctaEn:'Plan your next step'},
 {id:2,key:'library',x:-23,z:-13,category:'learning',ka:'ბიბლიოთეკა',en:'Library',introKa:'შემდეგი დიდი იდეა ერთი გვერდით იწყება.',introEn:'The next big idea starts with a page.',kaText:'სივრცე ყურადღებისთვის, ახალი კითხვებისთვის და დამოუკიდებელი აღმოჩენებისთვის. ბიბლიოთეკა აკადემიური უბნის ჩრდილო-დასავლეთით მდებარეობს.',enText:'A space for focus, new questions, and discoveries of your own. Find the library on the northwest side of the academic quarter.',link:'/programs.html',ctaKa:'აღმოაჩინე პროგრამები',ctaEn:'Discover the programs'},
 {id:3,key:'academic',x:-17,z:-9,category:'learning',ka:'აკადემიური სივრცე',en:'Academic quarter',introKa:'ცოდნა, რომელიც შენს ხელში ფორმას იღებს.',introEn:'Ideas become something you can build.',kaText:'ტექნოლოგიები, სამართალი, მედია და ახალი პროფესიული ინტერესები — აქ იწყება საუბარი იმაზე, რისი შექმნა შეგიძლია. გაეცანი სკოლებს და იპოვე შენი მიმართულება.',enText:'Technology, law, media, and new professional interests meet here. Explore the schools and discover what you want to create.',link:'/schools.html',ctaKa:'აირჩიე შენი სკოლა',ctaEn:'Find your school'},
 {id:4,key:'plaza',x:-3,z:-12,category:'life',ka:'პლაზა',en:'Central plaza',introKa:'განსხვავებული გზების შეხვედრის ადგილი.',introEn:'Where different paths meet.',kaText:'კამპუსის შუაგული: სივრცე შეხვედრებისთვის, საუბრებისთვის და იდეებისთვის, რომლებიც აუდიტორიის გარეთ იბადება. აქედან შენი შემდეგი მიმართულება ყოველთვის ახლოსაა.',enText:'The heart of campus. A place to meet, talk, and discover the ideas that happen outside the lecture hall. Your next destination is never far away.',link:'/about.html#campus',ctaKa:'გაიცანი სტუდენტური ცხოვრება',ctaEn:'Explore campus life'},
 {id:5,key:'art',x:7,z:-14,category:'learning',ka:'art-სტუდია',en:'Art studio',introKa:'მიეცი იდეას საკუთარი ფორმა.',introEn:'Give your ideas a form of their own.',kaText:'შემოქმედებითი სივრცე ვიზუალური აზროვნებისთვის, ექსპერიმენტისთვის და საკუთარი ხელწერის საპოვნელად. მედიიდან დიზაინამდე — აღმოაჩინე ახალი პერსპექტივა.',enText:'A creative space for visual thinking, experimentation, and finding your own signature. From media to design, discover a new perspective.',link:'/sgm.html',ctaKa:'გაიცანი მედიის სკოლა',ctaEn:'Explore the Media School'},
 {id:6,key:'parking',x:17,z:-15,category:'life',ka:'საპარკინგე სივრცე',en:'Parking',introKa:'მოდი შენი გზით.',introEn:'Arrive your way.',kaText:'საპარკინგე ზონა კამპუსის ჩრდილო-აღმოსავლეთ ნაწილშია, art-სტუდიისა და საერთო საცხოვრებლის მიმართულებით. რუკაზე მოიძიე შენთვის საჭირო შენობა.',enText:'The parking area sits on the northeast side of campus, near the art studio and the route to the residence. Use the map to find your destination.',link:'/contact.html',ctaKa:'დაგვიკავშირდი',ctaEn:'Contact us'},
 {id:7,key:'fitness',x:-39,z:-6,category:'sport',ka:'ფიტნეს სივრცე',en:'Fitness space',introKa:'ენერგია შენი შემდეგი მიზნისთვის.',introEn:'Find your momentum.',kaText:'სწავლასა და მოძრაობას საერთო რიტმი აქვს. კამპუსის დასავლეთ მხარეს მდებარე ფიტნეს სივრცე აქტიური დღის ნაწილია.',enText:'Learning and movement share a rhythm. On the west side of campus, the fitness space is part of an active day.',link:'/about.html#campus',ctaKa:'ცხოვრება კამპუსში',ctaEn:'Life on campus'},
 {id:8,key:'business',x:-3,z:0,category:'learning',ka:'ბიზნეს სკოლა',en:'Business School',introKa:'ხედვა, რომელსაც მოქმედებად აქცევ.',introEn:'Turn your perspective into a plan.',kaText:'სტრატეგია, მარკეტინგი და ფინანსური აზროვნება — იდეის განვითარებისთვის ყველა მხარის დანახვა გჭირდება. ბიზნეს სკოლა პლაზის სამხრეთით მდებარეობს.',enText:'Strategy, marketing, and financial thinking. Develop the perspective to move an idea forward. Find the Business School just south of the plaza.',link:'/sgb.html',ctaKa:'გაიცანი ბიზნეს სკოლა',ctaEn:'Explore the Business School'},
 {id:9,key:'humanities',x:6,z:-2,category:'learning',ka:'ჰუმანიტარული სკოლა',en:'Humanities School',introKa:'გაიგე მეტი ადამიანზე. და საკუთარ თავზე.',introEn:'Understand people. Discover yourself.',kaText:'ისტორია, ენა და ფილოსოფია ახალ კუთხეს აძლევს სამყაროს ხედვას. ბიზნეს სკოლასა და საცხოვრებელ სივრცეს შორის იპოვი ადგილს დიდი კითხვებისთვის.',enText:'History, language, and philosophy open new ways of seeing the world. Between the Business School and residence, find a place for bigger questions.',link:'/sgh.html',ctaKa:'გაიცანი ჰუმანიტარული სკოლა',ctaEn:'Explore the Humanities School'},
 {id:10,key:'residence',x:21,z:-3,category:'life',ka:'საერთო საცხოვრებელი',en:'Student residence',introKa:'კამპუსი შენი ყოველდღიურობა ხდება.',introEn:'Make campus part of your everyday.',kaText:'სივრცე, სადაც საუნივერსიტეტო დღე აუდიტორიის შემდეგაც გრძელდება. საერთო საცხოვრებელი აღმოსავლეთ ნაწილშია, სასწავლო და დასასვენებელ ზონებთან ახლოს.',enText:'A place where university life continues after the lecture ends. The residence is on the east side, close to the learning and leisure areas.',link:'/contact.html',ctaKa:'იკითხე საცხოვრებლის შესახებ',ctaEn:'Ask about residence'},
 {id:11,key:'park',x:-34,z:5,category:'life',ka:'პარკი',en:'Campus park',introKa:'სივრცე, რომ აზრს ახალი სუნთქვა მისცე.',introEn:'A little space. A fresh perspective.',kaText:'დასავლეთის მწვანე სივრცე აკადემიურ უბანსა და სპორტულ ზონას აერთიანებს. შეანელე ნაბიჯი, შეხვდი მეგობრებს და მოემზადე ახალი იდეისთვის.',enText:'The green west side connects the academic quarter with the sports area. Slow down, meet friends, and make room for a new idea.',link:'/about.html#campus',ctaKa:'აღმოაჩინე კამპუსი',ctaEn:'Discover campus life'},
 {id:12,key:'research',x:-16,z:12,category:'learning',ka:'კვლევითი ცენტრი',en:'Research center',introKa:'კარგი კითხვა ყველაფერს ცვლის.',introEn:'A better question changes everything.',kaText:'იდეიდან ექსპერიმენტამდე — გამოიკვლიე ტექნოლოგიების, ციფრული კულტურისა და მდგრადობის მიმართულებები. კვლევითი ცენტრი კამპუსის სამხრეთ ნაწილშია.',enText:'From an idea to an experiment, explore technology, digital culture, and sustainability. The research center anchors the south side of campus.',link:'/research.html',ctaKa:'გაეცანი კვლევის მიმართულებებს',ctaEn:'Explore research'},
 {id:13,key:'courts',x:-5,z:10,category:'sport',ka:'კორტები',en:'Sports courts',introKa:'შენი შემდეგი გამოწვევა მოედანზეა.',introEn:'Your next challenge is on court.',kaText:'კორტები კვლევით ცენტრსა და სტადიონს შორის მდებარეობს — ადგილი მოძრაობისთვის, გუნდური ენერგიისთვის და ახალი პირადი მიზნებისთვის.',enText:'Between the research center and stadium, the courts bring movement, team spirit, and a new personal challenge to your day.',link:'/about.html#campus',ctaKa:'აღმოაჩინე სტუდენტური ცხოვრება',ctaEn:'Discover student life'},
 {id:14,key:'stadium',x:7,z:11,category:'sport',ka:'ფეხბურთის სტადიონი',en:'Football stadium',introKa:'ერთი მოედანი. საერთო მიზანი.',introEn:'One pitch. A shared ambition.',kaText:'კამპუსის სამხრეთ-აღმოსავლეთით ფეხბურთის მოედანი და სარბენი ბილიკი ერთიანდება. აქ შენი სკოლის ფერები საერთო გუნდურ ენერგიად იქცევა.',enText:'In the southeast, the football pitch and running track come together. Here, your school colors become a shared team spirit.',link:'/about.html#campus',ctaKa:'გაიცანი კამპუსის ცხოვრება',ctaEn:'Meet campus life'}
];
export const colors={land:'#e3eadb',grass:'#d0ddbd',path:'#f9f8ee',road:'#c8cbbf',roof:'#f4f0e7',wall:'#cfcbc2',wine:'#782b40',ink:'#293b32',selected:'#b67a3d'};
export function project([x,y,z],camera,width,height){
 const dx=x-camera.x,dz=z-camera.z,c=Math.cos(camera.yaw),s=Math.sin(camera.yaw);
 const rx=dx*c-dz*s,depth=dx*s+dz*c;
 const scale=Math.min(width/112,height/76)*camera.zoom;
 return [width/2+rx*scale,height*.53+(depth*Math.sin(camera.pitch)-y*Math.cos(camera.pitch))*scale,depth*Math.cos(camera.pitch)+y*Math.sin(camera.pitch)];
}
export function scene(){
 const polygons=[];
 const poly=(points,color,layer=1,id=0)=>polygons.push({points,color,layer,id});
 const flat=(points,color,y=.05,layer=1)=>poly(points.map(([x,z])=>[x,y,z]),color,layer);
 const rect=(x,z,w,d,color,y=.06,layer=1)=>flat([[x-w/2,z-d/2],[x+w/2,z-d/2],[x+w/2,z+d/2],[x-w/2,z+d/2]],color,y,layer);
 const oval=(x,z,rx,rz,color,y=.05,layer=1,n=48)=>flat(Array.from({length:n},(_,i)=>[x+rx*Math.cos(i/n*Math.PI*2),z+rz*Math.sin(i/n*Math.PI*2)]),color,y,layer);
 const strip=(points,width,color,y=.1,layer=2)=>{for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),nx=-dz/len*width/2,nz=dx/len*width/2;flat([[a[0]+nx,a[1]+nz],[b[0]+nx,b[1]+nz],[b[0]-nx,b[1]-nz],[a[0]-nx,a[1]-nz]],color,y,layer);}};
 const box=(x,z,w,d,h,id=0,roof=colors.roof)=>{
  const a=[x-w/2,.2,z-d/2],b=[x+w/2,.2,z-d/2],c=[x+w/2,.2,z+d/2],v=[x-w/2,.2,z+d/2],up=p=>[p[0],h,p[2]];
  poly([a,b,up(b),up(a)],'#d5cfc3',5,id);poly([b,c,up(c),up(b)],'#b9bbad',5,id);poly([c,v,up(v),up(c)],'#c9c7bb',5,id);poly([v,a,up(a),up(v)],'#e4dfd2',5,id);poly([up(a),up(b),up(c),up(v)],roof,5,id);
  // Thin burgundy clerestory band gives buildings a consistent campus identity.
  if(h>2){poly([[x-w/2,h-.8,z+d/2+.01],[x+w/2,h-.8,z+d/2+.01],[x+w/2,h-.45,z+d/2+.01],[x-w/2,h-.45,z+d/2+.01]],'#773f48',5,id);}
 };
 const tree=(x,z,size=1)=>{box(x,z,.22,.22,1.1);const bottom=Array.from({length:7},(_,i)=>[x+size*Math.cos(i/7*6.283),.8,z+size*Math.sin(i/7*6.283)]);for(let i=0;i<7;i++)poly([bottom[i],bottom[(i+1)%7],[x,3.1*size,z]],i%2?'#6e8a67':'#8da17a',5);};
 // The tilted landscape plinth follows the reference's enclosing campus boundary.
 const boundary=[[-47,22],[-45,-7],[-31,-23],[-11,-25],[24,-23],[32,-17],[38,19],[22,25],[-15,28]];
 flat(boundary,'#b7c1aa',-.9,0);flat(boundary,colors.land,0,1);
 // Perimeter avenue, curved inner walk and academic ring.
 const ring=Array.from({length:57},(_,i)=>{const a=i/56*Math.PI*2;return[-12+29*Math.cos(a),-1+22*Math.sin(a)];});
 strip(ring,2.4,colors.path,.07,2);
 strip([[-48,24],[-25,25],[0,23],[22,24],[39,20]],2.2,colors.road,.08,2);
 strip([[-33,-24],[-9,-24],[19,-23],[31,-20]],2.4,colors.road,.08,2);
 strip([[-44,-9],[-44,21]],1.5,colors.road,.08,2);
 const inner=Array.from({length:49},(_,i)=>{const a=i/48*Math.PI*2;return[-14+18*Math.cos(a),-7+14*Math.sin(a)];});strip(inner,1.1,colors.path,.09,2);
 strip([[-9,-24],[-8,-16],[-4,-12],[-5,0],[-5,18],[-5,24]],2.1,colors.path,.12,3);
 strip([[-41,-8],[-25,-8],[-7,-9],[11,-9],[23,-9],[29,18]],1.6,colors.path,.12,3);
 strip([[-36,17],[-19,12],[0,13],[17,13],[31,17]],1.4,colors.path,.12,3);
 // West park, branching paths and landscaped lawns.
 oval(-31,8,10,12,'#cad9b7',.09,2);
 strip([[-40,12],[-33,9],[-24,17]],.7,colors.path,.15,3);strip([[-38,18],[-33,9],[-31,-1]],.7,colors.path,.15,3);
 strip([[-39,4],[-33,9],[-23,4]],.7,colors.path,.15,3);
 // Entrance gate, library and horseshoe academic cluster.
 box(-11,-21,1.2,2.4,2.8,1,colors.wine);box(-6.6,-21,1.2,2.4,2.8,1,colors.wine);
 box(-9,-21,5.6,.9,3.3,1,colors.wine);
 box(-25,-14,7,3,4.7,2);box(-23,-11,3,4,4.7,2);box(-28,-12,2,5,4.1,2);
 box(-20,-8,4,10,5.8,3);box(-14,-11,8,3,5.8,3);box(-14,-3,8,3,5.8,3);box(-9,-7,2,5,3.7,3);
 // Plaza concentric pavement with a central fountain.
 oval(-3,-12,5.5,5,colors.path,.17,3);oval(-3,-12,3,2.7,'#c6d1bf',.19,3);oval(-3,-12,1.4,1.3,'#7faaa3',.22,3);box(-3,-12,.5,.5,1.5,4,'#e6dcc6');
 box(7,-15,5,3.5,3.3,5);box(10,-13,2,5,2.7,5);
 // Parking rows, including low profile cars.
 rect(20,-17,12,7,'#c2c8bc',.14,3);
 for(let i=0;i<7;i++){rect(15.5+i*1.5,-17,.09,5,'#f9f9f1',.16,3);box(16+i*1.5,-18.6,.7,1.3,.65,6,i%3===0?'#732d40':'#efeee4');}
 box(-39,-7,4,6,2.5,7);rect(-39,-3,4,3,'#c6c69f',.16,3);
 // Business and humanities stay at their plan locations.
 box(-3,0,5.7,4,4.2,8);box(-3,3,3.2,2,3.4,8);
 box(6,-2,5.8,3.8,4.5,9);box(9.5,-2,1.7,5,3.5,9);
 // Three residence wings to the east.
 for(let i=0;i<3;i++)box(22+i*.5,-7+i*5,6,2.4,6.4,10);
 box(25,-2,2,12,4.5,10);
 box(-18,13,7,3.2,4.3,12);box(-14,10,3,5.5,3.5,12);
 // Courts, with paint lines drawn as geometry.
 for(let z=9;z<=14;z+=5){rect(-5,z,5,4,'#b1c4b2',.16,3);strip([[-7.3,z-1.8],[-2.7,z-1.8],[-2.7,z+1.8],[-7.3,z+1.8],[-7.3,z-1.8]],.09,'#f5f7ea',.2,4);strip([[-5,z-1.8],[-5,z+1.8]],.07,'#f5f7ea',.21,4);}
 // Stadium, track and football markings.
 oval(9,12,11,7.1,'#b9ae94',.13,3);oval(9,12,9.7,5.8,'#b8c995',.15,3);
 rect(9,12,13.5,8.2,'#a9be8b',.18,3);
 strip([[2.4,8],[15.6,8],[15.6,16],[2.4,16],[2.4,8]],.12,'#f4f4de',.22,4);strip([[9,8],[9,16]],.1,'#f4f4de',.23,4);
 const center=Array.from({length:33},(_,i)=>[9+1.7*Math.cos(i/32*6.283),12+1.7*Math.sin(i/32*6.283)]);strip(center,.1,'#f4f4de',.23,4);
 strip([[2.4,10],[4.4,10],[4.4,14],[2.4,14]],.1,'#f4f4de',.23,4);strip([[15.6,10],[13.6,10],[13.6,14],[15.6,14]],.1,'#f4f4de',.23,4);
 box(9,5.3,10,1.1,1.5,14);box(9,18.7,10,1.1,1.5,14);
 // Deterministic trees: no animation loop or random layout between visits.
 for(let i=0;i<30;i++){const a=i*2.39996,r=3+(i%6)*1.1;const x=-32+Math.cos(a)*r,z=8+Math.sin(a)*r*1.25;if(Math.abs(x+33)>1.2&&Math.abs(z-9)>1)tree(x,z,.55+(i%3)*.1);}
 for(let i=0;i<17;i++){tree(-36+i*3.8,22+(i%2)*.8,.65);if(i<12)tree(-31+i*4.6,-22+(i%2)*.7,.6);}
 for(const [x,z] of [[-28,-5],[-26,1],[-24,4],[0,-17],[2,-7],[13,-7],[17,2],[28,9],[28,15],[-20,18]])tree(x,z,.75);
 return polygons;
}
export function projectedScene(model,camera,w,h,selected=0){
 return model.map(p=>{const points=p.points.map(v=>project(v,camera,w,h));return {points,color:p.id===selected&&selected? (p.color===colors.roof?'#e9bd79':p.color==='#773f48'?'#782b40':'#bd9b70'):p.color,depth:points.reduce((sum,p)=>sum+p[2],0)/points.length,layer:p.layer,id:p.id};}).sort((a,b)=>a.layer-b.layer||a.depth-b.depth);
}
export function posterSvg(){
 const camera={x:-5,z:0,yaw:-.2,pitch:.68,zoom:1.05};
 return `<svg class="campus-poster" viewBox="0 0 1000 620" role="img" aria-label="SAGIT campus"><rect width="1000" height="620" fill="#f0f2e9"/>${projectedScene(scene(),camera,1000,620).map(p=>`<polygon points="${p.points.map(v=>v.slice(0,2).map(n=>n.toFixed(1)).join(',')).join(' ')}" fill="${p.color}" stroke="${p.layer===5?'#747f6b35':p.color}" stroke-width=".5"/>`).join('')}</svg>`;
}
