(function(){
  var $=function(s,r){return (r||document).querySelector(s)};
  var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var titles={about:1,education:1,skills:1,projects:1,achievements:1,certificates:1,involvement:1,research:1,hobbies:1,resume:1,contact:1};
  var z=30, placed=0, openList=[];

  /* sound effects: synthesized with Web Audio, so there are no audio files */
  var AC=null, sfxOn=true, lastHover=null;
  try{if(localStorage.getItem('sfx')==='off')sfxOn=false}catch(e){}
  function ctx(){
    if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;try{AC=new C()}catch(e){return null}}
    if(AC.state==='suspended'&&AC.resume)AC.resume();
    return AC;
  }
  function tone(f,t0,dur,type,vol,f2){
    var a=ctx();if(!a)return;
    var o=a.createOscillator(),g=a.createGain(),t=a.currentTime+t0;
    o.type=type||'sine';o.frequency.setValueAtTime(f,t);
    if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||.12,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.03);
  }
  var SFX={
    hover:function(){tone(880,0,.06,'sine',.05)},
    click:function(){tone(520,0,.09,'triangle',.14,300)},
    open:function(){tone(523,0,.1,'triangle',.12);tone(784,.07,.15,'triangle',.12)},
    close:function(){tone(660,0,.09,'triangle',.1);tone(392,.07,.15,'triangle',.1)},
    copy:function(){tone(1046,0,.12,'sine',.12);tone(1568,.08,.18,'sine',.1)},
    toggle:function(){tone(440,0,.08,'square',.05);tone(660,.06,.1,'square',.05)}
  };
  function sfx(n){if(sfxOn&&SFX[n])SFX[n]()}
  function drawSfx(){var b=$('#sfx');b.textContent=sfxOn?'sfx on':'sfx off';b.setAttribute('aria-pressed',String(sfxOn))}
  drawSfx();
  $('#sfx').addEventListener('click',function(){
    sfxOn=!sfxOn;drawSfx();
    try{localStorage.setItem('sfx',sfxOn?'on':'off')}catch(e){}
    sfx('toggle');
  });
  document.addEventListener('pointerdown',function(){ctx()},{once:true});
  document.addEventListener('mouseover',function(e){
    var t=e.target.closest('.icon,.social a,.cert,.pshot,.pthumb,.btn,.x,.mode,.title,.filter button');
    if(!t){lastHover=null;return}
    if(t===lastHover||t.contains(e.relatedTarget))return;
    lastHover=t;sfx('hover');
  });

  /* theme */
  function applyTheme(t){document.documentElement.setAttribute('data-theme',t)}
  try{var st=localStorage.getItem('theme');if(st)applyTheme(st)}catch(e){}
  $('#theme').addEventListener('click',function(){
    var cur=document.documentElement.getAttribute('data-theme');
    if(!cur)cur=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
    var next=cur==='dark'?'light':'dark';applyTheme(next);sfx('toggle');
    try{localStorage.setItem('theme',next)}catch(e){}
  });

  /* windows */
  function front(el){z+=1;el.style.zIndex=z}
  function openWin(id){
    var el=$('#w-'+id);if(!el)return;
    el.hidden=false;
    if(openList.indexOf(id)<0)openList.push(id);
    if(!el.dataset.placed){
      var n=placed%5;placed++;
      el.style.left=Math.max(12,(innerWidth-el.offsetWidth)/2+(n-2)*34)+'px';
      el.style.top=Math.max(12,(innerHeight-el.offsetHeight)/2+(n-2)*28)+'px';
      el.dataset.placed='1';
    }
    front(el);
    try{history.replaceState(null,'','#'+id)}catch(e){}
  }
  function closeWin(id){
    var el=$('#w-'+id);if(!el)return;el.hidden=true;
    openList=openList.filter(function(x){return x!==id});
    try{history.replaceState(null,'',location.pathname)}catch(e){}
  }
  document.addEventListener('click',function(e){
    var o=e.target.closest('[data-open]');if(o){sfx('open');openWin(o.getAttribute('data-open'));return}
    var c=e.target.closest('[data-close]');if(c){sfx('close');closeWin(c.getAttribute('data-close'));return}
    var cp=e.target.closest('[data-copy]');
    var plain=e.target.closest('button,a.btn');
    if(plain&&!cp&&plain.id!=='sfx'&&plain.id!=='theme')sfx('click');
    if(cp){sfx('copy');var txt=cp.getAttribute('data-copy');
      var done=function(){cp.textContent='copied';setTimeout(function(){cp.textContent='copy'},1400)};
      try{navigator.clipboard.writeText(txt).then(done,function(){sel(cp)})}catch(err){sel(cp)}}
  });
  function sel(btn){var v=btn.parentNode.querySelector('.val');var r=document.createRange();r.selectNodeContents(v);var s=getSelection();s.removeAllRanges();s.addRange(r);btn.textContent='selected'}
  $('#home').addEventListener('click',function(){openList.slice().forEach(closeWin)});
  $$('.win').forEach(function(w){
    w.addEventListener('pointerdown',function(){front(w)});
    var h=$('header',w),sx,sy,ox,oy,drag=false;
    h.addEventListener('pointerdown',function(e){
      if(e.target.closest('.x')||!matchMedia('(min-width:721px)').matches)return;
      drag=true;sx=e.clientX;sy=e.clientY;ox=w.offsetLeft;oy=w.offsetTop;h.setPointerCapture(e.pointerId);h.style.cursor='grabbing';
    });
    h.addEventListener('pointermove',function(e){
      if(!drag)return;
      w.style.left=Math.min(Math.max(0,ox+e.clientX-sx),innerWidth-80)+'px';
      w.style.top=Math.min(Math.max(0,oy+e.clientY-sy),innerHeight-60)+'px';
    });
    var end=function(){drag=false;h.style.cursor=''};
    h.addEventListener('pointerup',end);h.addEventListener('pointercancel',end);
  });
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape')return;
    if(!$('#lightbox').hidden){$('#lightbox').hidden=true;return}
    if(openList.length){sfx('close');closeWin(openList[openList.length-1])}
  });

  /* skills */
  var skills=[['Python','Languages'],['Java','Languages'],['C++','Languages'],['JavaScript','Languages'],['HTML/CSS','Web'],['React','Web'],['Node.js','Web'],['SQL','Data'],['Pandas','Data'],['scikit-learn','Data'],['Git','Tools'],['Figma','Tools'],['VS Code','Tools']];
  var areas=['All','Languages','Web','Data','Tools'],cur='All';
  function drawSkills(){
    var f=$('#skillFilter');f.innerHTML='';
    areas.forEach(function(a){var b=document.createElement('button');b.type='button';b.textContent=a;b.setAttribute('aria-pressed',String(a===cur));b.addEventListener('click',function(){cur=a;drawSkills()});f.appendChild(b)});
    var l=$('#skillList');l.innerHTML='';
    skills.filter(function(s){return cur==='All'||s[1]===cur}).forEach(function(s){var li=document.createElement('li');li.className='chip';li.textContent=s[0];l.appendChild(li)});
  }
  drawSkills();

  /* certificates: preview images and PDFs live in assets/certs/ */
  var certs=[
    {t:'Mastering Agentic AI: From Prompt to Protocols to Production',by:'Infosys Springboard',date:'Aug 18, 2026',note:'Course completion certificate, issued Oct 15, 2026',file:'wingspan-agentic-ai',verify:'https://verify.onwingspan.com'},
    {t:'Network Automation with Red Hat Ansible Automation Platform (DO457)',by:'Red Hat',date:'Sep 5, 2026',note:'Certificate of attendance, 32 credit hours',file:'redhat-do457-ansible',verify:'https://www.credly.com/badges/a340e865-f106-42ac-9c59-04d277abf271'},
    {t:'ServiceNow Virtual Internship Program',by:'ServiceNow',date:'May 19, 2026',note:'Certificate of completion with AICTE and SmartBridge, ID SNU2020931',file:'servicenow-virtual-internship'},
    {t:'Red Hat System Administration I (RH124)',by:'Red Hat',date:'Mar 30, 2026',note:'Certificate of attendance, 40 credit hours',file:'redhat-rh124-sysadmin',verify:'https://www.credly.com/badges/53d45861-22ed-4fde-814a-c96ddb1a2ea9'},
    {t:'Data Structures and Algorithms using Python, Part 1',by:'Infosys Springboard',date:'Nov 6, 2025',note:'Course completion certificate',file:'wingspan-dsa-python',verify:'https://verify.onwingspan.com'},
    {t:'Python Programming with Red Hat (AD141)',by:'Red Hat',date:'Mar 29, 2025',note:'Certificate of attendance, 32 credit hours',file:'redhat-ad141-python',verify:'https://www.credly.com/badges/aabfb166-ef6c-4068-8365-47831a89bf4f'}
  ];
  var certBy='All',issuers=['All','Red Hat','ServiceNow','Infosys Springboard'];
  function openLb(o){
    var im=$('#lbImg');im.src=o.img;im.alt=o.alt||o.title;
    $('#lbTitle').textContent=o.title;$('#lbSub').textContent=o.sub;
    var pdf=$('#lbPdf');if(o.pdf){pdf.href=o.pdf;pdf.hidden=false}else{pdf.hidden=true}
    var v=$('#lbVerify');if(o.verify){v.href=o.verify;v.hidden=false}else{v.hidden=true}
    $('#lightbox').hidden=false;$('#lbClose').focus();
  }
  function showCert(c){
    openLb({img:'assets/certs/'+c.file+'.jpg',alt:'Certificate: '+c.t,title:c.t,sub:c.by+' \u00b7 '+c.date+' \u00b7 '+c.note,pdf:'assets/certs/'+c.file+'.pdf',verify:c.verify});
  }
  $$('.pshot').forEach(function(b){
    b.addEventListener('click',function(){
      openLb({img:b.getAttribute('data-src'),alt:$('img',b).alt,title:b.getAttribute('data-title'),sub:b.getAttribute('data-sub')});
    });
  });
  function drawCerts(){
    var f=$('#certFilter');f.innerHTML='';
    issuers.forEach(function(a){var b=document.createElement('button');b.type='button';b.textContent=a;b.setAttribute('aria-pressed',String(a===certBy));b.addEventListener('click',function(){certBy=a;drawCerts()});f.appendChild(b)});
    var g=$('#certGrid');g.innerHTML='';
    certs.filter(function(c){return certBy==='All'||c.by===certBy}).forEach(function(c){
      var b=document.createElement('button');b.type='button';b.className='cert';
      var img=document.createElement('img');img.src='assets/certs/'+c.file+'.jpg';img.alt='Certificate: '+c.t;img.loading='lazy';
      var t=document.createElement('b');t.textContent=c.t;
      var s=document.createElement('span');s.className='sub';s.textContent=c.by+' \u00b7 '+c.date;
      b.appendChild(img);b.appendChild(t);b.appendChild(s);
      b.addEventListener('click',function(){showCert(c)});
      g.appendChild(b);
    });
  }
  drawCerts();
  $('#lbClose').addEventListener('click',function(){$('#lightbox').hidden=true});
  $('#lightbox').addEventListener('click',function(e){if(e.target===this)this.hidden=true});

  /* welcome */
  $('#okay').addEventListener('click',function(){$('#welcome').hidden=true});

  /* deep link, like #research */
  function fromHash(){var h=location.hash.slice(1);if(titles[h])openWin(h)}
  addEventListener('hashchange',fromHash);fromHash();
  if(titles[location.hash.slice(1)])$('#welcome').hidden=true;
})();
