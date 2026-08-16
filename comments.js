/* Комментарии к блокам методики. Хранение: localStorage браузера. */
(function(){
  var KEY='method-comments-v1';
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY))||[]; }catch(e){ return []; } }
  function save(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
  function esc(s){ var d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
  function fmtDate(ts){ var d=new Date(ts); return d.toLocaleDateString('ru-RU')+' '+d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}); }

  var css=document.createElement('style');
  css.textContent=[
    '#cpanel{position:fixed;top:0;right:0;width:320px;height:100vh;background:#f6f4ee;border-left:2px solid #d9d6cf;z-index:60;display:flex;flex-direction:column;font-family:inherit;transform:translateX(100%);transition:transform .25s;box-shadow:-4px 0 18px rgba(0,0,0,.08)}',
    '#cpanel.open{transform:translateX(0)}',
    '#ctoggle{position:fixed;bottom:24px;right:24px;z-index:61;background:#1a1a1a;color:#fff;border:none;border-radius:24px;padding:11px 18px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25)}',
    '#ctoggle b{background:#b07d00;border-radius:10px;padding:1px 7px;margin-left:6px;font-size:12px}',
    '.chead{padding:14px 16px 10px;border-bottom:1.5px solid #ddd}',
    '.chead h3{margin:0 0 10px;font-size:15px}',
    '.cauthors{display:flex;gap:6px;margin-bottom:10px}',
    '.apill{flex:1;text-align:center;padding:6px 0;border-radius:8px;border:1.5px solid #ccc;background:#fff;font-size:13px;font-weight:700;cursor:pointer;color:#777}',
    '.apill.on-gleb{background:#b07d00;border-color:#b07d00;color:#fff}',
    '.apill.on-ivan{background:#3d6b52;border-color:#3d6b52;color:#fff}',
    '#ctarget{font-size:12px;color:#666;margin-bottom:6px}',
    '#ctarget b{background:#e8e5de;border-radius:5px;padding:2px 7px;color:#6b6659}',
    '#ctext{width:100%;box-sizing:border-box;min-height:64px;border:1.5px solid #ccc;border-radius:8px;padding:8px;font-size:13px;font-family:inherit;resize:vertical}',
    '#cpub{width:100%;margin-top:8px;padding:9px;border:none;border-radius:8px;background:#1a1a1a;color:#fff;font-size:13.5px;font-weight:700;cursor:pointer}',
    '#cpub:disabled{background:#bbb;cursor:default}',
    '#clist{flex:1;overflow-y:auto;padding:10px 14px}',
    '.citem{background:#fff;border:1px solid #e2dfd8;border-radius:10px;padding:9px 11px;margin-bottom:9px;font-size:13px}',
    '.citem .cref{cursor:pointer;background:#e8e5de;border-radius:5px;padding:1px 7px;font-size:11px;font-weight:700;color:#6b6659}',
    '.citem .cref:hover{background:#b07d00;color:#fff}',
    '.cwho{font-weight:700;font-size:12px;margin-left:6px}',
    '.cwho.gleb{color:#b07d00}.cwho.ivan{color:#3d6b52}',
    '.cdate{font-size:10.5px;color:#aaa;float:right}',
    '.cbody{margin-top:5px;line-height:1.45;white-space:pre-wrap}',
    '.cdel{float:right;border:none;background:none;color:#c66;cursor:pointer;font-size:12px;padding:0 2px}',
    '.cfoot{padding:10px 14px;border-top:1.5px solid #ddd;display:flex;gap:6px}',
    '.cfoot button{flex:1;padding:7px 0;font-size:12px;border:1.5px solid #bbb;background:#fff;border-radius:8px;cursor:pointer}',
    '#cimpbox{display:none;padding:0 14px 10px}',
    '#cimpbox textarea{width:100%;box-sizing:border-box;min-height:56px;font-size:11px;border:1.5px solid #ccc;border-radius:8px;padding:6px}',
    '#cimpbox button{margin-top:5px;padding:6px 12px;font-size:12px;border:none;border-radius:7px;background:#3d6b52;color:#fff;cursor:pointer}',
    '.blk-cbtn{margin-left:8px;background:#fff;border:1.5px solid #d9d6cf;border-radius:6px;font-size:11px;padding:1px 8px;cursor:pointer;color:#8a6d1f;vertical-align:middle}',
    '.blk-cbtn:hover{background:#b07d00;border-color:#b07d00;color:#fff}',
    '.blk-cnt{background:#3d6b52;color:#fff;border-radius:9px;font-size:10.5px;padding:1px 6px;margin-left:5px;vertical-align:middle}',
    '#ctoastc{position:fixed;bottom:78px;right:24px;background:#1a1a1a;color:#fff;font-size:12.5px;border-radius:8px;padding:8px 14px;opacity:0;transition:opacity .25s;pointer-events:none;z-index:62}',
    '@media(max-width:760px){#cpanel{width:100%}}'
  ].join('\n');
  document.head.appendChild(css);

  var panel=document.createElement('div');
  panel.id='cpanel';
  panel.innerHTML=
    '<div class="chead"><h3>Комментарии</h3>'+
    '<div class="cauthors"><button class="apill" id="a-gleb">Глеб</button><button class="apill" id="a-ivan">Иван</button></div>'+
    '<div id="ctarget">Блок: <b id="ctref">не выбран</b> <span style="color:#999">(нажми «+» у блока)</span></div>'+
    '<textarea id="ctext" placeholder="Текст комментария…"></textarea>'+
    '<button id="cpub" disabled>Опубликовать</button></div>'+
    '<div id="clist"></div>'+
    '<div id="cimpbox"><textarea id="cimparea" placeholder="Вставь сюда экспортированный пакет…"></textarea><button id="cimpgo">Загрузить</button></div>'+
    '<div class="cfoot"><button id="cexp">Экспорт</button><button id="cimp">Импорт</button><button id="cchat">Текстом</button></div>';
  document.body.appendChild(panel);

  var toggle=document.createElement('button');
  toggle.id='ctoggle';
  document.body.appendChild(toggle);
  var toast=document.createElement('div');
  toast.id='ctoastc';
  document.body.appendChild(toast);
  function say(m){ toast.textContent=m; toast.style.opacity=1; setTimeout(function(){toast.style.opacity=0;},1600); }

  var author=localStorage.getItem('method-author')||'gleb';
  var target=null;
  function paintAuthor(){
    var g=document.getElementById('a-gleb'), i=document.getElementById('a-ivan');
    g.className='apill'+(author==='gleb'?' on-gleb':''); i.className='apill'+(author==='ivan'?' on-ivan':'');
  }
  document.getElementById('a-gleb').onclick=function(){author='gleb';localStorage.setItem('method-author','gleb');paintAuthor();};
  document.getElementById('a-ivan').onclick=function(){author='ivan';localStorage.setItem('method-author','ivan');paintAuthor();};
  paintAuthor();

  function scrollToRef(ref){
    var h=document.querySelector('h2.blk[data-ref="'+ref+'"]');
    if(h){ h.scrollIntoView({behavior:'smooth',block:'center'}); }
  }
  function render(){
    var list=load().sort(function(a,b){ return a.ref===b.ref ? a.ts-b.ts : (a.ref<b.ref?-1:1); });
    var box=document.getElementById('clist');
    box.innerHTML = list.length? '' : '<div style="color:#999;font-size:12.5px;padding:8px 2px">Пока пусто. Нажми «+» рядом с заголовком блока.</div>';
    list.forEach(function(c){
      var d=document.createElement('div'); d.className='citem';
      d.innerHTML='<button class="cdel" title="Удалить">×</button>'+
        '<span class="cref">'+esc(c.ref)+'</span><span class="cwho '+(c.author==='ivan'?'ivan':'gleb')+'">'+(c.author==='ivan'?'Иван':'Глеб')+'</span>'+
        '<span class="cdate">'+fmtDate(c.ts)+'</span><div class="cbody">'+esc(c.text)+'</div>';
      d.querySelector('.cref').onclick=function(){ scrollToRef(c.ref); };
      d.querySelector('.cdel').onclick=function(){ if(confirm('Удалить комментарий?')){ save(load().filter(function(x){return x.id!==c.id;})); render(); badges(); } };
      box.appendChild(d);
    });
    var n=list.length;
    toggle.innerHTML='Комментарии'+(n?' <b>'+n+'</b>':'');
  }
  function badges(){
    var counts={}; load().forEach(function(c){ counts[c.ref]=(counts[c.ref]||0)+1; });
    document.querySelectorAll('h2.blk').forEach(function(h){
      var old=h.querySelector('.blk-cnt'); if(old) old.remove();
      var n=counts[h.getAttribute('data-ref')];
      if(n){ var b=document.createElement('span'); b.className='blk-cnt'; b.textContent='💬 '+n; h.appendChild(b); }
    });
  }
  function setTarget(ref){
    target=ref; document.getElementById('ctref').textContent=ref;
    document.getElementById('cpub').disabled=false;
    panel.classList.add('open');
    document.getElementById('ctext').focus();
  }
  document.getElementById('cpub').onclick=function(){
    var t=document.getElementById('ctext').value.trim();
    if(!t||!target) return;
    var list=load();
    list.push({id:Date.now()+'-'+Math.random().toString(36).slice(2,7), ref:target, author:author, text:t, ts:Date.now()});
    save(list);
    document.getElementById('ctext').value='';
    render(); badges(); say('Комментарий добавлен: '+target);
  };
  toggle.onclick=function(){ panel.classList.toggle('open'); };

  document.getElementById('cexp').onclick=function(){
    var data=JSON.stringify(load());
    (navigator.clipboard?navigator.clipboard.writeText(data):Promise.reject()).then(
      function(){ say('Пакет скопирован — перешли его собеседнику'); },
      function(){ prompt('Скопируй вручную:', data); });
  };
  document.getElementById('cimp').onclick=function(){
    var b=document.getElementById('cimpbox');
    b.style.display = b.style.display==='block' ? 'none' : 'block';
  };
  document.getElementById('cimpgo').onclick=function(){
    try{
      var inc=JSON.parse(document.getElementById('cimparea').value);
      if(!Array.isArray(inc)) throw 0;
      var list=load(), ids={}; list.forEach(function(c){ids[c.id]=1;});
      var added=0;
      inc.forEach(function(c){ if(c&&c.id&&c.ref&&c.text&&!ids[c.id]){ list.push(c); added++; } });
      save(list); render(); badges();
      document.getElementById('cimparea').value=''; document.getElementById('cimpbox').style.display='none';
      say('Импортировано новых: '+added);
    }catch(e){ say('Не удалось разобрать пакет'); }
  };
  document.getElementById('cchat').onclick=function(){
    var txt=load().sort(function(a,b){return a.ref<b.ref?-1:1;}).map(function(c){
      return c.ref+' ['+(c.author==='ivan'?'Иван':'Глеб')+']: '+c.text;
    }).join('\n');
    (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(
      function(){ say('Скопировано текстом — можно вставить в чат'); },
      function(){ prompt('Скопируй вручную:', txt); });
  };

  document.querySelectorAll('h2.blk').forEach(function(h){
    var btn=document.createElement('button');
    btn.className='blk-cbtn'; btn.textContent='+ комм.'; btn.title='Прокомментировать блок';
    btn.onclick=function(e){ e.stopPropagation(); setTarget(h.getAttribute('data-ref')); };
    h.appendChild(btn);
  });

  render(); badges();
})();
