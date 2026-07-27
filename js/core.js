// ═══════ CORE: Navigation + Init ═══════
const PAGE_TITLES = {
  overview:'🏠 总览',sentiment:'🛡️ 舆情监控',community:'📅 社群运营',communitydata:'👥 社群数据',
  star:'⭐ 精选正面',acquisition:'🔗 社群引流',activities:'🎯 小程序活动',
  products:'📦 产品库',hotspot:'📡 热点捕捉',copy:'✍️ 文案创作',prompt:'🎨 配图Prompt',
  inspiration:'📚 素材灵感库',ailearn:'💡 AI前沿案例',portfolio:'🖼️ 作品集'
};

document.querySelectorAll('.nav-item').forEach(function(item){
  item.addEventListener('click',function(){
    var page=item.dataset.page;
    document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active')});
    document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active')});
    item.classList.add('active');
    document.getElementById('page-'+page).classList.add('active');
    document.getElementById('pageTitle').textContent=PAGE_TITLES[page];
    if(page==='community')setTimeout(renderSchedule,50);
    if(page==='star')renderStarPage();
    if(page==='hotspot')renderHotspot();
    if(page==='products')loadProducts();
    if(page==='copy'){initCopyDay();loadCopyConfig();applyCopyConfig();loadCopyHotspots();}
    if(page==='acquisition')renderAcquisition();
  });
});

var now=new Date();
document.getElementById('currentDate').textContent=now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日 '+['日','一','二','三','四','五','六'][now.getDay()]+'曜日';

function toast(msg){var el=document.createElement('div');el.className='toast';el.textContent=msg;document.body.appendChild(el);setTimeout(function(){el.remove()},2000);}

// ═══════ INIT ═══════
renderSchedule();
renderWeeklyReports();
loadSentimentData();
renderStarPage();
renderMemberDay();
renderAcquisition();
setInterval(function(){loadSentimentData();},30*60*1000);
loadCopyConfig();
applyCopyConfig();
document.getElementById('noteModal').addEventListener('click',function(e){if(e.target===this)closeNoteModal();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeNoteModal();});
