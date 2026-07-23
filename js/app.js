// ═══════ VARIABLES & DATA ═══════
var productData=null;
var sentimentFilter='all';
var currentNoteDate=null;

var CopyConfig={priceMode:'unified',delivery:'free30',deliveryCustomVal:'',linkMeituan:true,linkEleme:true,linkMini:true,direction:'auto'};

var FESTIVAL_DATA={"2026":{"01-01":"元旦","02-12":"春节","04-05":"清明","05-01":"劳动节","06-25":"端午","09-15":"中秋","10-01":"国庆","12-25":"圣诞"}};

var MEMBER_DATA={"2026-07-15":{prev:"07-08",orders:73,sales:2360,stores:51,prevOrders:81,prevSales:2600,prevStores:53,couponUseRate:42.5,prevCouponUseRate:41.2,members:4,deliveryOrders:42,prevDeliveryOrders:46,customerPrice:32.3,prevCustomerPrice:32.1,conclusion:"7月15日会员日受下雨影响订单↓10%，但客单价和券核销率微增。外卖占比57%与上期持平。动销门店51家较上期53家略降。"},"2026-07-08":{prev:"07-01",orders:81,sales:2600,stores:53,prevOrders:76,prevSales:2420,prevStores:52,couponUseRate:41.2,prevCouponUseRate:40.5,members:6,deliveryOrders:46,prevDeliveryOrders:43,customerPrice:32.1,prevCustomerPrice:31.8,conclusion:"7月8日会员日订单↑6.6%，销售额↑7.4%。券核销率连续上升。新增会员6人，外卖56.8%。"},"2026-07-01":{prev:"06-24",orders:76,sales:2420,stores:52,prevOrders:72,prevSales:2290,prevStores:51,couponUseRate:40.5,prevCouponUseRate:39.8,members:5,deliveryOrders:43,prevDeliveryOrders:40,customerPrice:31.8,prevCustomerPrice:31.8,conclusion:"7月1日会员日订单↑5.6%。客单价持平。券核销率突破40%。动销门店稳定。"}};

// ═══════ SCHEDULE DATA ═══════
// Structure: {YYYY-MM: {days: {DD: {小程序,市场,品宣,朋友圈,节日,备注}}}}
var SCHEDULE_DATA={};

// July 2026 schedule
SCHEDULE_DATA["2026-07"]={days:{}};
var july=[];
july[1]={小程序:"会员日88折",市场:"外卖双平台推新",品宣:"芒果肠粉清凉上新",朋友圈:"✅ 周三会员日",节日:"",备注:""};
july[4]={小程序:"周末自选3盒套餐",市场:"下午茶场景",品宣:"海盐青柠杯回归",朋友圈:"✅ 周末套餐",节日:"",备注:"周末活动"};
july[8]={小程序:"会员日88折",市场:"限时满减",品宣:"芒果肠粉持续推",朋友圈:"✅ 周三会员日",节日:"",备注:""};
july[11]={小程序:"周末自选3盒套餐",市场:"周日家庭装",品宣:"超大杯系列海报",朋友圈:"✅ 周末囤货",节日:"",备注:""};
july[15]={小程序:"会员日88折",市场:"拼团拼单",品宣:"海盐青柠杯",朋友圈:"✅ 周三会员日",节日:"",备注:""};
july[18]={小程序:"周末自选3盒套餐",市场:"夜宵场景",品宣:"冰镇果切",朋友圈:"✅ 周末",节日:"",备注:""};
july[22]={小程序:"会员日88折",市场:"外卖双平台特价",品宣:"新品尝鲜",朋友圈:"✅ 周三会员日",节日:"",备注:""};
july[25]={小程序:"月末宠粉9.9专场",市场:"月末冲量",品宣:"月末宠粉周",朋友圈:"✅ 宠粉福利",节日:"",备注:"月末宠粉周"};
july[28]={小程序:"月末宠粉9.9专场",市场:"囤货场景",品宣:"超大杯测评",朋友圈:"✅ 月末福利",节日:"",备注:""};
july.forEach(function(e,i){if(e)SCHEDULE_DATA["2026-07"].days[String(i).padStart(2,'0')]=e});

// ═══════ SCHEDULE RENDER ═══════
function renderSchedule(){
  var sel=document.getElementById('scheduleYearSelect');
  var nav=document.getElementById('scheduleMonthNav');
  var content=document.getElementById('scheduleContent');
  if(!sel||!nav||!content)return;
  
  var now=new Date();
  var year=parseInt(sel.value)||now.getFullYear();
  
  // Build month buttons
  var months=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  var h='';
  for(var m=0;m<12;m++){
    var key=year+'-'+String(m+1).padStart(2,'0');
    var hasData=SCHEDULE_DATA[key]||false;
    var isActive=(year===now.getFullYear()&&m===now.getMonth());
    h+='<button class="btn '+(isActive?'btn-primary':'btn-ghost')+'" onclick="renderMonthSchedule('+year+','+(m+1)+')" style="font-size:11px;padding:4px 8px;'+(hasData?'':'opacity:0.4')+'">'+months[m]+'</button>';
  }
  nav.innerHTML=h;
  
  // Render current month
  var mon=now.getMonth()+1;
  renderMonthSchedule(year,mon);
}

function renderMonthSchedule(year,month){
  var key=year+'-'+String(month).padStart(2,'0');
  var data=SCHEDULE_DATA[key]||null;
  var content=document.getElementById('scheduleContent');
  
  // Update month buttons
  var btns=document.querySelectorAll('#scheduleMonthNav button');
  btns.forEach(function(b,i){
    b.classList.remove('btn-primary','btn-ghost');
    b.classList.add((i+1===month)?'btn-primary':'btn-ghost');
  });
  
  if(!data||!data.days){
    content.innerHTML='<div style="text-align:center;padding:40px;color:var(--text-dim);font-size:13px">本月暂无排期数据</div>';
    return;
  }
  
  var now=new Date();
  var todayKey=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
  
  // Get first day of month
  var firstDay=new Date(year,month-1,1).getDay();
  var daysInMonth=new Date(year,month,0).getDate();
  
  // Load overrides
  var overrides={};
  try{overrides=JSON.parse(localStorage.getItem('qg_schedule_overrides')||'{}');}catch(e){}
  
  var html='<div class="schedule-grid">';
  
  // Day headers
  var dayNames=['日','一','二','三','四','五','六'];
  for(var d=0;d<7;d++){
    html+='<div style="text-align:center;font-size:11px;font-weight:700;color:var(--text-muted);padding:4px 0">'+dayNames[d]+'</div>';
  }
  
  // Empty cells before first day
  for(var i=0;i<firstDay;i++)html+='<div style="background:var(--bg);border-radius:var(--radius-sm);min-height:80px"></div>';
  
  // Day cells
  for(var day=1;day<=daysInMonth;day++){
    var dd=String(day).padStart(2,'0');
    var dateKey=key+'-'+dd;
    var isToday=(dateKey===todayKey);
    var isWeekend=(new Date(year,month-1,day).getDay()===0||new Date(year,month-1,day).getDay()===6);
    
    // Check override
    var entry=(overrides[dateKey]||data.days[dd]||null);
    
    var cls='schedule-day';
    if(isWeekend)cls+=' weekend';
    if(isToday)cls+=' today';
    
    html+='<div class="'+cls+'" onclick="openScheduleCell(\''+dateKey+'\')">';
    html+='<div class="day-num" style="'+(isToday?'color:var(--brand);font-weight:800':'')+'">'+day+'</div>';
    
    if(entry){
      if(entry['小程序'])html+='<div class="entry entry-bar-program">'+entry['小程序']+'</div>';
      if(entry['市场'])html+='<div class="entry entry-bar-market">'+entry['市场']+'</div>';
      if(entry['品宣'])html+='<div class="entry entry-bar-brand">'+entry['品宣']+'</div>';
      if(entry['朋友圈'])html+='<div class="entry entry-bar-wechat">'+entry['朋友圈']+'</div>';
      if(entry['节日'])html+='<div class="entry entry-bar-festival">'+entry['节日']+'</div>';
      if(entry['备注'])html+='<div class="entry entry-bar-note">'+entry['备注']+'</div>';
    }
    
    html+='</div>';
  }
  
  html+='</div>';
  content.innerHTML=html;
  
  // Also update overview mini schedule
  updateOverviewSchedule(key,data.days,overrides);
}

function updateOverviewSchedule(key,days,overrides){
  var el=document.getElementById('overviewSchedule');
  if(!el)return;
  var now=new Date();
  var today=new Date();
  var weekStart=new Date(today);
  weekStart.setDate(today.getDate()-today.getDay());
  var weekEnd=new Date(weekStart);
  weekEnd.setDate(weekStart.getDate()+6);
  
  var html='';
  for(var d=new Date(weekStart);d<=weekEnd;d.setDate(d.getDate()+1)){
    var dd=String(d.getDate()).padStart(2,'0');
    var mm=String(d.getMonth()+1).padStart(2,'0');
    var yyyy=d.getFullYear();
    var dateKey=yyyy+'-'+mm+'-'+dd;
    var entry=overrides[dateKey]||days[dd]||null;
    var dayName=['日','一','二','三','四','五','六'][d.getDay()];
    var isToday=(dateKey===now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'));
    
    html+='<div style="padding:4px 0;'+(isToday?'background:var(--brand-light);border-radius:4px;padding:4px 6px':'')+'"><span style="font-weight:700;font-size:11px">'+mm+'/'+dd+'</span> <span style="font-size:10px;color:var(--text-dim)">'+dayName+'</span>';
    if(entry){
      if(entry['小程序'])html+=' <span style="font-size:10px;color:#e65100">'+entry['小程序']+'</span>';
      if(entry['市场'])html+=' <span style="font-size:10px;color:#1565c0">'+entry['市场']+'</span>';
    }else{
      html+=' <span style="font-size:10px;color:var(--text-dim)">—</span>';
    }
    html+='</div>';
  }
  el.innerHTML=html;
}

function openScheduleCell(dateKey){
  currentNoteDate=dateKey;
  var key=dateKey.substring(0,7);
  var dd=dateKey.substring(8);
  var data=SCHEDULE_DATA[key];
  var defaults=data&&data.days?data.days[dd]:{};
  
  var overrides={};
  try{overrides=JSON.parse(localStorage.getItem('qg_schedule_overrides')||'{}');}catch(e){}
  var entry=overrides[dateKey]||defaults||{};
  
  document.getElementById('editProgram').value=entry['小程序']||'';
  document.getElementById('editMarket').value=entry['市场']||'';
  document.getElementById('editBrand').value=entry['品宣']||'';
  document.getElementById('editWechat').value=entry['朋友圈']||'';
  document.getElementById('editFestival').value=entry['节日']||'';
  document.getElementById('editNote').value=entry['备注']||'';
  document.getElementById('noteModalTitle').textContent='📝 '+dateKey;
  document.getElementById('btnDeleteNote').style.display=overrides[dateKey]?'':'none';
  document.getElementById('noteModal').classList.add('show');
}

function closeNoteModal(){
  document.getElementById('noteModal').classList.remove('show');
  currentNoteDate=null;
}

function saveScheduleCell(){
  if(!currentNoteDate)return;
  var overrides={};
  try{overrides=JSON.parse(localStorage.getItem('qg_schedule_overrides')||'{}');}catch(e){}
  
  overrides[currentNoteDate]={
    '小程序':document.getElementById('editProgram').value,
    '市场':document.getElementById('editMarket').value,
    '品宣':document.getElementById('editBrand').value,
    '朋友圈':document.getElementById('editWechat').value,
    '节日':document.getElementById('editFestival').value,
    '备注':document.getElementById('editNote').value
  };
  
  localStorage.setItem('qg_schedule_overrides',JSON.stringify(overrides));
  document.getElementById('noteModal').classList.remove('show');
  
  // Rerender
  var parts=currentNoteDate.split('-');
  renderMonthSchedule(parseInt(parts[0]),parseInt(parts[1]));
  toast('✅ 已保存 '+currentNoteDate);
  currentNoteDate=null;
}

function clearDateOverrides(dateKey){
  if(!confirm('清除 '+dateKey+' 的自定义内容？将恢复默认排期。'))return;
  var overrides={};
  try{overrides=JSON.parse(localStorage.getItem('qg_schedule_overrides')||'{}');}catch(e){}
  delete overrides[dateKey];
  localStorage.setItem('qg_schedule_overrides',JSON.stringify(overrides));
  document.getElementById('noteModal').classList.remove('show');
  var parts=dateKey.split('-');
  renderMonthSchedule(parseInt(parts[0]),parseInt(parts[1]));
  toast('🗑 已清除自定义');
  currentNoteDate=null;
}

function exportScheduleToExcel(){
  var all={};
  try{all=JSON.parse(localStorage.getItem('qg_schedule_overrides')||'{}');}catch(e){}
  
  // Merge with defaults
  var rows=[];
  for(var k in SCHEDULE_DATA){
    var days=SCHEDULE_DATA[k].days;
    for(var dd in days){
      var dateKey=k+'-'+dd;
      var e=all[dateKey]||days[dd];
      rows.push([dateKey,e['小程序']||'',e['市场']||'',e['品宣']||'',e['朋友圈']||'',e['节日']||'',e['备注']||'']);
    }
  }
  
  var csv='日期,小程序,市场/外卖,品宣,朋友圈,节日/节气,备注\n';
  rows.sort(function(a,b){return a[0].localeCompare(b[0])});
  rows.forEach(function(r){csv+=r.map(function(c){return '"'+c.replace(/"/g,'""')+'"';}).join(',')+'\n';});
  
  var blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='社群排期_'+new Date().toISOString().slice(0,10)+'.csv';
  a.click();
  toast('📥 已导出CSV');
}

// ═══════ OVERVIEW INIT ═══════
function initOverview(){
  updateOverviewSentimentData();
  renderSchedule();
  document.getElementById('overviewAlerts').innerHTML='<div style="padding:4px 0">✅ 舆情数据已接入</div><div style="padding:4px 0">🟡 作品集模块待建</div>';
}

function updateOverviewSentimentData(){
  fetch('sentiment_summary.json?v='+Date.now()).then(function(r){return r.json()}).then(function(d){
    if(d&&d.today){
      updateOverviewSentiment(d);
      updateSentimentBadge(d);
    }
  }).catch(function(){});
}


// ═══════ HISTORICAL SENTIMENT DATE SWITCHING ═══════
var historyCache={};
var historicalItems=[];
var historicalFilter='all';

function populateSentimentDates(){
  var sel=document.getElementById('sentimentDateSelect');
  var currentVal=sel?sel.value:'today';
  fetch('master_data_7d.json?v='+Date.now()).then(function(r){return r.json()}).then(function(d){
    var dates=Object.keys(d).sort().reverse();
    if(!sel)return;
    sel.innerHTML='<option value="today">📅 最新数据</option>';
    dates.forEach(function(dk){
      var y=dk.substring(0,4), m=dk.substring(4,6), dd=dk.substring(6,8);
      sel.innerHTML+='<option value="'+dk+'">'+y+'/'+m+'/'+dd+'</option>';
    });
    // Restore previously selected value (don't trigger onchange)
    if(currentVal!=='today' && sel.querySelector('option[value="'+currentVal+'"]')){
      sel.value=currentVal;
    }
  }).catch(function(){});
}

function switchSentimentDate(dateKey){
  if(dateKey==='today'){
    // Reset to today mode
    historicalItems=[];
    historicalFilter='all';
    // Show today data from sentiment_summary
    historicalItems=[];
    historicalFilter='all';
    sentimentFilter='all';
    if(sentimentCache)renderSentimentItems(sentimentCache);
    // Reset filter buttons
    ['all','pos','neg'].forEach(function(f){
      var btn=document.getElementById('sentFilter'+f.charAt(0).toUpperCase()+f.slice(1));
      if(btn){btn.classList.remove('btn-primary','btn-ghost');btn.classList.add(f==='all'?'btn-primary':'btn-ghost');}
    });
    var label=document.getElementById('sentimentItemDateLabel');if(label)label.textContent='舆情明细';
  }else{
    // Load historical data - reset filter buttons
    historicalFilter='all';
    ['all','pos','neg'].forEach(function(f){
      var btn=document.getElementById('sentFilter'+f.charAt(0).toUpperCase()+f.slice(1));
      if(btn){btn.classList.remove('btn-primary','btn-ghost');btn.classList.add(f==='all'?'btn-primary':'btn-ghost');}
    });
    loadHistoricalItems(dateKey);
  }
}

function loadHistoricalItems(dateKey){
  var list=document.getElementById('sentimentItemsList');
  list.innerHTML='<div style="text-align:center;padding:20px;color:var(--text-dim)">加载中...</div>';
  
  // Check cache
  if(historyCache[dateKey]){
    historicalItems=historyCache[dateKey];
    renderHistorical(dateKey);
    return;
  }
  
  fetch('master_data_7d.json?v='+Date.now()).then(function(r){return r.json()}).then(function(d){
    var dayData=d[dateKey];
    if(!dayData||!dayData.data){
      list.innerHTML='<div style="text-align:center;padding:20px;color:var(--text-dim)">该日期无数据</div>';
      return;
    }
    // Map master_data fields to display format
    var items=dayData.data.map(function(item){
      return {
        date: dateKey.substring(0,4)+'-'+dateKey.substring(4,6)+'-'+dateKey.substring(6,8),
        title: item.t||'(无标题)',
        platform: item.p||'未知',
        author: item.n||item.u||'',
        url: item.url||'',
        category: item.c||'',
        summary: (item._ocr||'').substring(0,100),
        sentiment: item.c||'neu',
      };
    });
    historicalItems=items;
    historyCache[dateKey]=items;
    renderHistorical(dateKey);
  }).catch(function(){
    list.innerHTML='<div style="text-align:center;padding:20px;color:var(--text-dim)">加载失败</div>';
  });
}

function renderHistorical(dateKey){
  var y=dateKey.substring(0,4), m=dateKey.substring(4,6), dd=dateKey.substring(6,8);
  // Sync filter button state
  ['all','pos','neg'].forEach(function(f){
    var btn=document.getElementById('sentFilter'+f.charAt(0).toUpperCase()+f.slice(1));
    if(btn){btn.classList.remove('btn-primary','btn-ghost');btn.classList.add(historicalFilter===f?'btn-primary':'btn-ghost');}
  });
  document.querySelector('#page-sentiment .card-header .card-title').innerHTML='📋 '+y+'/'+m+'/'+dd+' 舆情明细（<span id="sentimentItemCount">'+historicalItems.length+'</span>条）';var label=document.getElementById('sentimentItemDateLabel');if(label)label.textContent=y+'/'+m+'/'+dd+' 舆情明细';
  document.getElementById('sentimentItemTime').textContent='历史数据 · '+y+'-'+m+'-'+dd;
  
  var items=historicalItems;
  if(historicalFilter==='pos')items=items.filter(function(i){return i.sentiment==='pos'});
  else if(historicalFilter==='neg')items=items.filter(function(i){return i.sentiment==='neg'});
  
  document.getElementById('sentimentItemCount').textContent=items.length;
  var list=document.getElementById('sentimentItemsList');
  if(items.length===0){
    list.innerHTML='<div style="text-align:center;padding:20px;color:var(--text-dim)">暂无明细数据</div>';
    return;
  }
  
  // Override filter for historical: show all, allow starring
  var html='';
  items.forEach(function(item){
    html+='<div style="padding:6px 0;border-bottom:1px solid var(--border);display:flex;gap:8px;align-items:flex-start">'+
      '<span style="font-size:16px;flex-shrink:0">📌</span>'+
      '<div style="flex:1;min-width:0">'+
        '<div style="font-weight:600;color:var(--text)">'+item.title+'</div>'+
        '<div style="font-size:11px;color:var(--text-dim)">'+item.platform+' · '+item.author+' · '+(item.category||'')+'</div>'+
      '</div>'+
      (item.url?'<a href="'+item.url+'" target="_blank" style="font-size:11px;color:var(--brand);flex-shrink:0;text-decoration:none">原帖 ↗</a>':'')+
      '<span onclick="quickStar(this)" data-date="'+item.date+'" data-title="'+item.title.replace(/"/g,'&quot;')+'" data-platform="'+item.platform+'" data-author="'+(item.author||'')+'" data-url="'+(item.url||'')+'" class="star-btn'+(isStarred(item.date,item.title)?' active':'')+'" title="收藏/取消">⭐</span>'+
    '</div>';
  });
  list.innerHTML=html;
}

function filterSentimentItems(filter){
  if(historicalItems.length>0){
    // Historical mode
    historicalFilter=filter;
    ['all','pos','neg'].forEach(function(f){
      var btn=document.getElementById('sentFilter'+f.charAt(0).toUpperCase()+f.slice(1));
      if(btn){btn.classList.remove('btn-primary','btn-ghost');btn.classList.add(filter===f?'btn-primary':'btn-ghost');}
    });
    renderHistorical(document.getElementById('sentimentDateSelect').value);
  }else{
    // Today mode
    sentimentFilter=filter;
    ['all','pos','neg'].forEach(function(f){
      var btn=document.getElementById('sentFilter'+f.charAt(0).toUpperCase()+f.slice(1));
      if(btn){btn.classList.remove('btn-primary','btn-ghost');btn.classList.add(filter===f?'btn-primary':'btn-ghost');}
    });
    if(sentimentCache)renderSentimentItems(sentimentCache);
  }
}

// Populate dates on sentiment page load
var origLoadSentiment=loadSentimentData;
loadSentimentData=function(){
  origLoadSentiment();
  populateSentimentDates();
};

// ═══════ PAGE INIT ═══════
// Run on load
(function init(){
  var now=new Date();
  document.getElementById('currentDate').textContent=now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日 '+['日','一','二','三','四','五','六'][now.getDay()]+'曜日';
  
  // Populate year select
  var sel=document.getElementById('scheduleYearSelect');
  if(sel){sel.innerHTML='';for(var y=2026;y<=now.getFullYear();y++)sel.innerHTML+='<option value="'+y+'"'+(y===now.getFullYear()?' selected':'')+'>'+y+'年</option>';}
  
  loadSentimentData();
  renderWeeklyReports();
  renderStarPage();
  renderAcquisition();
  renderMemberDay();
  initOverview();
  setInterval(function(){loadSentimentData();},30*60*1000);
})();

const PAGE_TITLES={overview:'🏠 总览',sentiment:'🛡️ 舆情监控',community:'📅 社群运营',communitydata:'👥 社群数据',star:'⭐ 精选正面',acquisition:'🔗 社群引流',activities:'🎯 小程序活动',products:'📦 产品库',hotspot:'📡 热点捕捉',copy:'✍️ 文案创作',prompt:'🎨 配图Prompt',inspiration:'📚 素材灵感库',ailearn:'💡 AI前沿案例',portfolio:'🖼️ 作品集'};
document.querySelectorAll('.nav-item').forEach(function(item){item.addEventListener('click',function(){var page=item.dataset.page;document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active')});document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active')});item.classList.add('active');document.getElementById('page-'+page).classList.add('active');document.getElementById('pageTitle').textContent=PAGE_TITLES[page];if(page==='community')setTimeout(renderSchedule,50);if(page==='star')renderStarPage();if(page==='hotspot')renderHotspot();if(page==='products')loadProducts();if(page==='copy'){initCopyDay();loadCopyConfig();applyCopyConfig();loadCopyHotspots();}if(page==='acquisition')renderAcquisition();});});
var now=new Date();document.getElementById('currentDate').textContent=now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日 '+['日','一','二','三','四','五','六'][now.getDay()]+'曜日';
function toast(msg){var el=document.createElement('div');el.className='toast';el.textContent=msg;document.body.appendChild(el);setTimeout(function(){el.remove()},2000);}


// ═══════ SENTIMENT ═══════
var sentimentCache=null;
function loadSentimentData(){
  fetch('sentiment_summary.json?v='+Date.now()).then(function(r){return r.json()}).then(function(data){
    sentimentCache=data;renderSentimentKPIs(data);renderSentimentTrend(data);renderSentimentNegList(data);renderSentimentItems(data);updateOverviewSentiment(data);updateSentimentBadge(data);
  }).catch(function(){});
}
function refreshSentimentLive(){
  toast('🔄 正在刷新数据...');
  loadSentimentData();
  setTimeout(function(){if(sentimentCache)toast('✅ 已更新 ('+sentimentCache.today.total+'条)');},1000);
}
function renderSentimentKPIs(data){var t=data.today;var h='<div class="kpi accent-green"><div class="kpi-label">📊 今日舆情总量</div><div class="kpi-value">'+t.total+'<span class="kpi-change flat">条</span></div><div class="kpi-sub">'+data.latest_date+'</div></div>'+'<div class="kpi accent-teal"><div class="kpi-label">😊 正面</div><div class="kpi-value">'+t.pos+'<span class="kpi-change up">'+(t.pos_pct||0).toFixed(0)+'%</span></div><div class="kpi-sub">口碑健康</div></div>'+'<div class="kpi '+(t.neg>0?'accent-red':'accent-green')+'"><div class="kpi-label">⚠️ 负面</div><div class="kpi-value">'+t.neg+'<span class="kpi-change '+(t.neg>0?'down':'flat')+'">'+(t.neg>0?'需关注':'✅')+'</span></div><div class="kpi-sub">近7天累计 '+data.last_7d.neg+' 条</div></div>'+'<div class="kpi accent-blue"><div class="kpi-label">📊 7天总量</div><div class="kpi-value">'+data.last_7d.total+'<span class="kpi-change flat">条</span></div><div class="kpi-sub">'+data.daily_trend[0].date+' ~ '+data.daily_trend[data.daily_trend.length-1].date+'</div></div>';document.getElementById('sentimentKPI').innerHTML=h;document.getElementById('sentimentMeta').textContent='数据源: master_data.json ('+data.date_range+')';}
function renderSentimentTrend(data){var trend=data.daily_trend;var ctx=document.getElementById('sentimentTrendChart');if(!ctx)return;new Chart(ctx,{type:'line',data:{labels:trend.map(function(d){return d.date.slice(5)}),datasets:[{label:'总量',data:trend.map(function(d){return d.total}),borderColor:'#2d8a4e',backgroundColor:'rgba(45,138,78,.1)',borderWidth:2,pointRadius:3,fill:true,tension:.3},{label:'正面',data:trend.map(function(d){return d.pos}),borderColor:'#4caf50',borderWidth:1.5,pointRadius:2,tension:.3,borderDash:[3,2]},{label:'负面',data:trend.map(function(d){return d.neg}),borderColor:'#e53935',borderWidth:1.5,pointRadius:3,pointBackgroundColor:'#e53935',tension:.3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{usePointStyle:true,boxWidth:6,font:{size:10}}}},scales:{x:{ticks:{font:{size:10}},grid:{display:false}},y:{beginAtZero:true,ticks:{font:{size:10}},grid:{color:'#e8ece8'}}}}});}
var sentimentFilter='all';
function filterSentimentItems(filter){sentimentFilter=filter;['all','pos','neg'].forEach(function(f){var btn=document.getElementById('sentFilter'+f.charAt(0).toUpperCase()+f.slice(1));if(btn){btn.classList.remove('btn-primary','btn-ghost');btn.classList.add(filter===f?'btn-primary':'btn-ghost');}});if(sentimentCache)renderSentimentItems(sentimentCache);}
function renderSentimentItems(data){if(historicalItems.length>0)return;var allItems=data.today_items||[];var items;if(sentimentFilter==='pos')items=allItems.filter(function(i){return i.sentiment==='pos'});else if(sentimentFilter==='neg')items=allItems.filter(function(i){return i.sentiment==='neg'});else items=allItems;document.getElementById('sentimentItemCount').textContent=items.length;document.getElementById('sentimentItemTime').textContent=data.latest_date||data.generated||'';var label=document.getElementById('sentimentItemDateLabel');if(label)label.textContent=(data.latest_date||'')+' 舆情明细';var list=document.getElementById('sentimentItemsList');if(items.length===0){list.innerHTML='<div style="text-align:center;padding:20px;color:var(--text-dim)">暂无明细数据</div>';return;}var emoji={pos:'😊',neg:'🔴',neu:'➖'};var html='';items.forEach(function(item){var s=item.sentiment||'';html+='<div style="padding:6px 0;border-bottom:1px solid var(--border);display:flex;gap:8px;align-items:flex-start"><span style="font-size:16px;flex-shrink:0">'+(emoji[s]||'📌')+'</span><div style="flex:1;min-width:0"><div style="font-weight:600;color:var(--text)">'+item.title+'</div><div style="font-size:11px;color:var(--text-dim)">'+item.platform+' · '+item.author+' · '+(item.category||'')+'</div></div>'+(item.url?'<a href="'+item.url+'" target="_blank" style="font-size:11px;color:var(--brand);flex-shrink:0;text-decoration:none">原帖 ↗</a>':'')+'<span onclick="quickStar(this)" data-date="'+item.date+'" data-title="'+item.title.replace(/"/g,'&quot;')+'" data-platform="'+item.platform+'" data-author="'+(item.author||'')+'" data-url="'+(item.url||'')+'" class="star-btn'+(isStarred(item.date,item.title)?' active':'')+'" title="收藏/取消">⭐</span></div>';});list.innerHTML=html;}
function renderSentimentNegList(data){var items=data.negative_items;items.sort(function(a,b){return b.date.localeCompare(a.date)});var list=document.getElementById('sentimentNegList');if(items.length===0){list.innerHTML='<div style="text-align:center;padding:40px;color:var(--text-dim)">✅ 近7天无负面舆情</div>';return;}var html='';items.slice(0,15).forEach(function(item){html+='<div style="padding:8px 0;border-bottom:1px solid var(--border)"><div style="font-weight:600;color:var(--text);margin-bottom:2px">['+item.platform+'] '+item.title+'</div><div style="font-size:11px;color:var(--text-dim)">'+item.date+' · '+(item.category||'')+(item.url?' · <a href="'+item.url+'" target="_blank" style="color:var(--brand);text-decoration:none">原帖 ↗</a>':'')+'</div></div>';});list.innerHTML=html;}
function updateOverviewSentiment(data){var cards=document.querySelectorAll('#page-overview .kpi');if(cards.length>=1){var c1=cards[0];c1.querySelector('.kpi-value').innerHTML=data.today.total+'<span class="kpi-change flat">条</span>';c1.querySelector('.kpi-sub').textContent=data.latest_date+' · 正面'+data.today.pos+' · 负面'+data.today.neg;}}
function updateSentimentBadge(data){var b=document.getElementById('sentimentBadge');if(data.today.neg>0){b.textContent=data.today.neg;b.classList.add('show');}else if(data.last_7d.neg>0){b.textContent='!';b.classList.add('show');}}

// ═══════ STAR ═══════
function getStars(){try{return JSON.parse(localStorage.getItem('qg_stars')||'[]');}catch(e){return[];}}
function saveStars(s){localStorage.setItem('qg_stars',JSON.stringify(s));}
function isStarred(date,title){return getStars().some(function(s){return s.date===date&&s.title===title;});}
function quickStar(el){var date=el.dataset.date;var title=el.dataset.title;var platform=el.dataset.platform;var author=el.dataset.author;var url=el.dataset.url;var stars=getStars();var idx=stars.findIndex(function(s){return s.date===date&&s.title===title;});if(idx>=0){stars.splice(idx,1);el.classList.remove('active');}else{stars.push({date:date,title:title,platform:platform,author:author,url:url,savedAt:new Date().toISOString()});el.classList.add('active');}saveStars(stars);renderStarPage();toast(idx>=0?'已取消收藏':'⭐ 已收藏');}
function clearStars(){if(confirm('确定清空所有精选正面素材?')){localStorage.removeItem('qg_stars');renderStarPage();toast('已清空');}}
function exportStarsJSON(){
  var stars=getStars();
  if(stars.length===0){toast('暂无收藏可导出');return;}
  var blob=new Blob([JSON.stringify(stars,null,2)],{type:'application/json'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='qg_stars_export.json';
  a.click();
  toast('📤 已导出 '+stars.length+' 条收藏 → 下载文件夹\n然后终端运行 python3 download_stars.py');
  // Also try to save to workspace folder via fetch (if local server)
  try{
    fetch('/qg_stars_export.json',{method:'PUT',body:JSON.stringify(stars)});
  }catch(e){}
}
function renderStarPage(){var stars=getStars();var el=document.getElementById('starContent');if(!el)return;if(stars.length===0){el.innerHTML='<div style="text-align:center;padding:60px;color:var(--text-dim)"><div style="font-size:40px;margin-bottom:12px">⭐</div>暂无精选素材<br><span style="font-size:12px">在舆情明细-正面列表中点 ⭐ 即可收藏</span></div>';return;}stars.sort(function(a,b){return b.date.localeCompare(a.date)});var html='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px">';stars.forEach(function(s){html+='<div style="background:var(--brand-light);border-radius:var(--radius-sm);padding:14px;border:1px solid var(--brand);position:relative"><span data-date="'+s.date+'" data-title="'+s.title.replace(/"/g,'&quot;')+'" onclick="unstarItem(this.dataset.date,this.dataset.title)" style="position:absolute;top:8px;right:10px;cursor:pointer;font-size:16px">⭐</span><div style="font-weight:600;color:var(--text);font-size:13px;margin-bottom:6px;padding-right:24px">'+s.title+'</div><div style="font-size:11px;color:var(--text-dim);margin-bottom:6px">'+s.platform+' · '+s.author+' · '+s.date+'</div>'+(s.url?'<a href="'+s.url+'" target="_blank" style="font-size:11px;color:var(--brand);text-decoration:none">查看原帖 ↗</a>':'')+'</div>';});html+='</div>';el.innerHTML=html;}
function unstarItem(date,title){var stars=getStars();var idx=stars.findIndex(function(x){return x.date===date&&x.title===title;});if(idx>=0){stars.splice(idx,1);saveStars(stars);renderStarPage();toast('已取消收藏');}}

// ═══════ PRODUCTS ═══════
var productData=null;
function loadProducts(){var el=document.getElementById('productsGrid');fetch('product_library.json?v='+Date.now()).then(function(r){return r.json()}).then(function(d){productData=d;document.getElementById('productMeta').textContent=d.total_products+'个SKU · 来源: '+d.source;document.getElementById('productUpdateTime').textContent='最近更新: '+d.updated.substring(0,16);var sel=document.getElementById('productCat');sel.innerHTML='<option value="all">全部分类</option>';(d.categories||[]).forEach(function(c){sel.innerHTML+='<option value="'+c+'">'+c+'</option>';});renderProducts();}).catch(function(){el.innerHTML='<div style="text-align:center;padding:60px;color:var(--text-dim)"><div style="font-size:40px;margin-bottom:12px">📦</div>产品库建设中<br><span style="font-size:12px">将订单表放入「产品表」文件夹后自动生成</span></div>';document.getElementById('productUpdateTime').textContent='';});}
function renderProducts(){if(!productData)return;var search=(document.getElementById('productSearch').value||'').toLowerCase();var cat=document.getElementById('productCat').value;var items=productData.items.filter(function(p){if(search&&!p.name.toLowerCase().includes(search))return false;if(cat!=='all'&&p.category!==cat)return false;return true;});var maxSales=items.length>0?items[0].sales:1;var html='';items.slice(0,80).forEach(function(p,i){var w=Math.round(p.sales/maxSales*100);var rank=i+1;var medal=rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':rank;html+='<div style="display:grid;grid-template-columns:40px 1fr 100px 80px 100px;gap:0;padding:8px;border-bottom:1px solid var(--border);align-items:center;'+(rank<=3?'background:var(--brand-light)':'')+'" title="'+p.name+' · '+p.spec+'"><div style="text-align:center;font-weight:700;color:'+(rank<=3?'var(--brand)':'var(--text-dim)')+'">'+medal+'</div><div><div style="font-weight:600;color:var(--text)">'+p.name+'</div><div style="font-size:11px;color:var(--text-dim)">'+p.spec+'</div><div style="height:3px;background:var(--border);border-radius:2px;margin-top:3px"><div style="height:3px;width:'+w+'%;background:'+(rank<=3?'var(--brand)':'#c8e6c9')+';border-radius:2px;min-width:2px"></div></div></div><div style="font-size:11px;color:var(--text-dim)">'+p.category+'</div><div style="text-align:right;font-weight:700;color:var(--text)">¥'+p.price+'</div><div style="text-align:right"><span style="font-weight:700;color:var(--text)">'+p.sales+'</span><span style="font-size:10px;color:var(--text-dim)">份</span></div></div>';});document.getElementById('productsGrid').innerHTML+=html||'<div style="text-align:center;padding:40px;color:var(--text-dim)">无匹配产品</div>';}

// ═══════ HOTSPOT ═══════
function refreshHotspot(){var el=document.getElementById('hotspotContent');el.innerHTML='<div style="text-align:center;padding:40px;color:var(--text-dim)">🔄 刷新中...</div>';var btn=document.getElementById('hotspotRefreshBtn');if(btn){btn.textContent='⏳';btn.disabled=true;}setTimeout(function(){renderHotspot();if(btn){btn.textContent='🔄 刷新';btn.disabled=false;}},500);}
function renderHotspot(){var el=document.getElementById('hotspotContent');fetch('hotspot.json?v='+Date.now()).then(function(r){return r.json()}).then(function(d){document.getElementById('hotspotDate').textContent=d.date;var items=d.items||[];if(items.length===0){el.innerHTML='<div style="text-align:center;padding:40px;color:var(--text-dim)">暂无热点数据<br><span style="font-size:12px">每天12:00自动更新</span></div>';return;}var emoji={'🍉果切相关':'🍉',娱乐:'🎬',美食:'🍜',生活:'🏠',品牌:'🏷️',节日:'🎉',综合:'📌'};var html='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px">';items.forEach(function(item){html+='<div style="background:var(--bg);border-radius:var(--radius-sm);padding:10px 12px;border:1px solid var(--border)"><span style="font-size:11px;color:var(--text-dim)">'+(emoji[item.category]||'📌')+' '+item.source+' · '+item.category+'</span><div style="font-weight:600;color:var(--text);font-size:13px;margin-top:2px;margin-bottom:4px">'+item.word+'</div><div style="display:flex;gap:8px;font-size:11px">'+(item.url?'<a href="'+item.url+'" target="_blank" style="color:var(--brand);text-decoration:none">查看原帖 ↗</a>':'')+'<span onclick="copyHotspot(this)" data-word="'+item.word+'" style="color:var(--text-dim);cursor:pointer">📋 复制</span></div></div>';});html+='</div>';el.innerHTML=html;}).catch(function(){el.innerHTML='<div style="text-align:center;padding:40px;color:var(--text-dim)">热点数据加载中...</div>';});}
function copyHotspot(el){var word=el.dataset.word;navigator.clipboard.writeText(word).then(function(){toast('📋 已复制: '+word);}).catch(function(){});}

// ═══════ COPY ═══════
var CopyConfig={priceMode:'unified',delivery:'free30',deliveryCustomVal:'',linkMeituan:true,linkEleme:true,linkMini:true,direction:'auto'};
function loadCopyConfig(){try{var saved=JSON.parse(localStorage.getItem('qg_copy_config')||'{}');for(var k in saved){if(CopyConfig.hasOwnProperty(k))CopyConfig[k]=saved[k];}}catch(e){}applyCopyConfig();}
function saveCopyConfig(){localStorage.setItem('qg_copy_config',JSON.stringify(CopyConfig));}
function setCopyConfig(key,val){CopyConfig[key]=val;saveCopyConfig();applyCopyConfig();}
function applyCopyConfig(){document.getElementById('priceUnified').className='btn '+(CopyConfig.priceMode==='unified'?'btn-primary':'btn-ghost');document.getElementById('priceRegional').className='btn '+(CopyConfig.priceMode==='regional'?'btn-primary':'btn-ghost');document.getElementById('delivery30').className='btn '+(CopyConfig.delivery==='free30'?'btn-primary':'btn-ghost');document.getElementById('deliveryCustom').className='btn '+(CopyConfig.delivery==='custom'?'btn-primary':'btn-ghost');document.getElementById('deliveryCustomVal').style.display=CopyConfig.delivery==='custom'?'':'none';document.getElementById('deliveryCustomVal').value=CopyConfig.deliveryCustomVal||'';var links=document.querySelectorAll('#copyLinks label input');if(links.length>=3){links[0].checked=CopyConfig.linkMeituan;links[1].checked=CopyConfig.linkEleme;links[2].checked=CopyConfig.linkMini;}document.getElementById('copyDirection').value=CopyConfig.direction;}
function initCopyDay(){var now=new Date();var day=now.getDay();var label='';if(day===2){label='周二 · 生活关怀';document.getElementById('linkMiniapp').style.display='';}else if(day===3){label='周三 · 会员日88折';document.getElementById('linkMiniapp').style.display='';}else if(day===4){label='周四 · 特价';document.getElementById('linkMiniapp').style.display='none';CopyConfig.linkMini=false;}else if(day===5){label='周五 · 周末场景';document.getElementById('linkMiniapp').style.display='';}else if(day===6){label='周六 · 轮换种草';document.getElementById('linkMiniapp').style.display='';}else{label='今天无推送';}document.getElementById('copyDayLabel').textContent=label;var festToday='';var todayKey=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');try{var yearFests=FESTIVAL_DATA?FESTIVAL_DATA[String(now.getFullYear())]||{}:{};var mmdd=String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');if(yearFests[mmdd])festToday=' 🎋 '+yearFests[mmdd];}catch(e){}document.getElementById('copyWeather').innerHTML='📅 '+now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日'+festToday;}
function loadCopyHotspots(){var el=document.getElementById('copyHotspotBar');fetch('hotspot.json?v='+Date.now()).then(function(r){return r.json()}).then(function(d){var items=(d.items||[]).slice(0,5);if(items.length===0){el.innerHTML='<span style="color:var(--text-dim)">暂无热点数据</span>';return;}var html='';items.forEach(function(item){html+='<span style="background:var(--brand-light);color:var(--brand);padding:3px 8px;border-radius:12px;cursor:pointer;white-space:nowrap" title="'+item.word+'">'+(item.category||'')+' '+item.word.substring(0,15)+'</span>';});el.innerHTML=html;}).catch(function(){el.innerHTML='<span style="color:var(--text-dim)">热点加载中...</span>';});}
function generateCopy(){var dir=document.getElementById('copyDirection').value;var dirName=document.getElementById('copyDirection').selectedOptions[0].text;document.getElementById('copyV1').innerHTML='版本一 · '+dirName+'<br><br><span style="color:var(--text-dim)">生成中...</span>';document.getElementById('copyV2').innerHTML='版本二 · '+dirName+'<br><br><span style="color:var(--text-dim)">生成中...</span>';document.getElementById('copyV3').innerHTML='版本三 · '+dirName+'<br><br><span style="color:var(--text-dim)">生成中...</span>';toast('🚀 文案生成功能建设中...');}

// ═══════ COMMUNITY ═══════
function renderWeeklyReports(){var kpi='<div class="kpi accent-green"><div class="kpi-label">👥 群客户数</div><div class="kpi-value">33,321<span class="kpi-change flat">人</span></div><div class="kpi-sub">712群 · 682门店 · 渗透92.5%</div></div>';kpi+='<div class="kpi accent-teal"><div class="kpi-label">📈 本周入群</div><div class="kpi-value">391<span class="kpi-change up">+47.0%</span></div><div class="kpi-sub">07/13-07/19</div></div>';kpi+='<div class="kpi accent-red"><div class="kpi-label">📉 本周退群</div><div class="kpi-value">502<span class="kpi-change down">-11.9%</span></div><div class="kpi-sub">环比改善+193</div></div>';kpi+='<div class="kpi accent-amber"><div class="kpi-label">📊 本周净增</div><div class="kpi-value">-111<span class="kpi-change flat">改善中</span></div><div class="kpi-sub">退群率>10%: 3家</div></div>';document.getElementById('communityDataKPI').innerHTML=kpi;var weeks=[{label:'07/13-07/19',file:'社群周报看板_20260713-0719.html'},{label:'07/06-07/12',file:'社群周报看板_20260706-0712.html'},{label:'06/29-07/05',file:'社群周报看板_20260629-0705.html'},{label:'06/22-06/28',file:'社群周报看板_20260622-0628.html'},{label:'06/15-06/21',file:'社群周报看板_20260615-0621.html'}];var h='';weeks.forEach(function(w){h+='<div><a href="#" data-type="weekly" data-file="'+w.file+'" onclick="openReport(this.dataset.type,this.dataset.file);return false" style="color:var(--brand);font-size:13px">📄 '+w.label+' 社群周报</a></div>';});document.getElementById('weeklyReportsList').innerHTML=h;var months=[{label:'2026年6月',file:'社群月报看板_202606.html'},{label:'2026年5月',file:'社群月报看板_202605.html'}];var m='';months.forEach(function(mo){m+='<div><a href="#" data-type="monthly" data-file="'+mo.file+'" onclick="openReport(this.dataset.type,this.dataset.file);return false" style="color:var(--brand);font-size:13px">📄 '+mo.label+' 社群月报</a></div>';});document.getElementById('monthlyReportsList').innerHTML=m;}
function openReport(type,id){var url;if(type==='weekly')url='社群周报/'+id;else if(type==='monthly')url=id;else url='社群半年报_2026H1.html';window.open(url,'_blank');}
var MEMBER_DATA={"2026-07-15":{prev:"2026-07-08",orders:707,prevOrders:712,sales:19680.83,prevSales:21098.59,stores:334,prevStores:325,couponUseRate:31.5,prevCouponUseRate:29.9,members:702,deliveryOrders:61,prevDeliveryOrders:56,unitPrice:14.83,prevUnitPrice:15.32,customerPrice:27.84,prevCustomerPrice:29.63,conclusion:"量稳价跌：订单持平，销售额因团餐基数回落↓6.7%。北部大区暴雨重创（↓17.5%），华东高温逆势增长（↑10.8%）。"},"2026-07-08":{prev:"2026-07-01",orders:712,prevOrders:696,sales:21098.59,prevSales:19561.80,stores:325,prevStores:320,couponUseRate:29.9,prevCouponUseRate:33.6,members:700,deliveryOrders:56,prevDeliveryOrders:52,unitPrice:15.32,prevUnitPrice:14.80,customerPrice:29.63,prevCustomerPrice:28.10,conclusion:"含团餐大宗订单拉高基数，剔除后实际持平。券核销率微降，需关注。"},"2026-07-01":{prev:"2026-06-24",orders:696,prevOrders:650,sales:19561.80,prevSales:18300,stores:320,prevStores:310,couponUseRate:33.6,prevCouponUseRate:32.0,members:680,deliveryOrders:52,prevDeliveryOrders:48,unitPrice:14.80,prevUnitPrice:14.50,customerPrice:28.10,prevCustomerPrice:28.15,conclusion:"暑期首周平稳开局，订单↑7%，券核销率小幅改善。"}};
function renderMemberDay(){var date=document.getElementById('memberDateSelect').value;var d=MEMBER_DATA[date];if(!d)return;var wow=function(cur,prev){var pct=prev?((cur-prev)/prev*100):0;var cls=pct>0.5?'up':pct<-0.5?'down':'flat';var arrow=pct>0.5?'↑':pct<-0.5?'↓':'→';return '<span style="color:'+(cls==='up'?'#2e7d32':cls==='down'?'var(--red)':'var(--amber)')+'">'+arrow+Math.abs(pct).toFixed(1)+'%</span>';};var html='<div class="card"><div class="card-header"><div class="card-title">📊 核心指标（'+date.slice(5)+' vs '+d.prev.slice(5)+'）</div></div><div style="font-size:13px;line-height:2.2;color:var(--text-dim)"><div>📦 有效订单 <b style="color:var(--text)">'+d.orders+'</b>（←'+d.prevOrders+'，'+wow(d.orders,d.prevOrders)+'）</div><div>💰 有效销售额 <b style="color:var(--text)">¥'+d.sales.toLocaleString()+'</b>（←¥'+d.prevSales.toLocaleString()+'，'+wow(d.sales,d.prevSales)+'）</div><div>🏪 动销门店 <b style="color:var(--text)">'+d.stores+'</b>（←'+d.prevStores+'，'+wow(d.stores,d.prevStores)+'）</div><div>🎫 券核销率 <b style="color:var(--text)">'+d.couponUseRate+'%</b>（←'+d.prevCouponUseRate+'%）</div><div>👤 新增会员 <b style="color:var(--text)">'+d.members+'</b>人</div><div>🛵 外卖订单 <b style="color:var(--text)">'+d.deliveryOrders+'</b>（←'+d.prevDeliveryOrders+'）</div><div>💵 客单价 <b style="color:var(--text)">¥'+d.customerPrice+'</b>（←¥'+d.prevCustomerPrice+'）</div></div></div><div class="card"><div class="card-header"><div class="card-title">📋 复盘结论</div></div><div style="font-size:12px;color:var(--text-dim);line-height:1.8">'+d.conclusion+'</div></div>';document.getElementById('memberDayContent').innerHTML=html;}
function switchActTab(tab){['Member','Weekend','Monthly'].forEach(function(t){var c=document.getElementById('actContent'+t);if(c)c.style.display=(t.toLowerCase()===tab)?'':'none';var b=document.getElementById('actBtn'+t);if(b){b.classList.remove('btn-primary','btn-ghost');b.classList.add(t.toLowerCase()===tab?'btn-primary':'btn-ghost');}});}
function renderAcquisition(){var kpi='<div class="kpi accent-blue"><div class="kpi-label">📣 随单卡 · 本周扫码</div><div class="kpi-value">140<span class="kpi-change up">+4.6%</span></div><div class="kpi-sub">累计3,216 · 活码171家</div></div>';kpi+='<div class="kpi accent-teal"><div class="kpi-label">📥 本周进群</div><div class="kpi-value">107<span class="kpi-change flat">人</span></div><div class="kpi-sub">进群率76.4% · 历史77.9%</div></div>';kpi+='<div class="kpi accent-red"><div class="kpi-label">📤 本周流失</div><div class="kpi-value">35<span class="kpi-change down">+118.8%</span></div><div class="kpi-sub">需关注</div></div>';kpi+='<div class="kpi accent-green"><div class="kpi-label">👥 累计进群</div><div class="kpi-value">2,506<span class="kpi-change flat">人</span></div><div class="kpi-sub">扫码→进群转化78%</div></div>';document.getElementById('acquisitionKPI').innerHTML=kpi;var funnel='<div style="background:var(--bg);border-radius:8px;padding:16px"><div style="display:flex;align-items:center;gap:0;font-size:13px;margin-bottom:8px"><div style="background:var(--brand);color:#fff;padding:8px 0;text-align:center;border-radius:6px 0 0 6px;flex:1">扫码 140</div><div style="padding:0 4px;font-size:18px;color:var(--text-dim)">→</div><div style="background:#00897b;color:#fff;padding:8px 0;text-align:center;flex:1">加好友 140<span style="font-size:10px;opacity:.7"> 100%</span></div><div style="padding:0 4px;font-size:18px;color:var(--text-dim)">→</div><div style="background:var(--blue);color:#fff;padding:8px 0;text-align:center;border-radius:0 6px 6px 0;flex:1">进群 107<span style="font-size:10px;opacity:.7"> 76.4%</span></div></div><div style="font-size:11px;color:var(--text-dim)">本周进群率 76.4% · 历史累计进群率 77.9% · 171家门店 · 31家有扫码</div></div>';document.getElementById('communityFunnel').innerHTML=funnel;var ret='<div style="display:flex;gap:16px"><div style="flex:1;text-align:center;background:var(--brand-light);border-radius:8px;padding:16px"><div style="font-size:28px;font-weight:800;color:var(--brand)">90.7%</div><div style="font-size:11px;color:var(--text-dim)">24h留存</div><div style="font-size:10px;color:var(--red)">-0.3pp</div></div><div style="flex:1;text-align:center;background:#e0f2f1;border-radius:8px;padding:16px"><div style="font-size:28px;font-weight:800;color:#00897b">89.4%</div><div style="font-size:11px;color:var(--text-dim)">7天留存</div><div style="font-size:10px;color:var(--red)">-0.4pp</div></div><div style="flex:1;text-align:center;background:var(--bg);border-radius:8px;padding:16px"><div style="font-size:28px;font-weight:800;color:var(--text)">77.9%</div><div style="font-size:11px;color:var(--text-dim)">历史进群率</div><div style="font-size:10px;color:var(--text-dim)">累计2,506人</div></div></div>';document.getElementById('communityRetention').innerHTML=ret;}

// ═══════ INIT ═══════
renderSchedule();renderWeeklyReports();loadSentimentData();renderStarPage();renderMemberDay();renderAcquisition();loadCopyConfig();applyCopyConfig();
setInterval(function(){loadSentimentData();},30*60*1000);
document.getElementById('noteModal').addEventListener('click',function(e){if(e.target===this)closeNoteModal();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeNoteModal();});
