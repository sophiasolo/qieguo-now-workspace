// ═══════ VARIABLES & DATA ═══════
var productData=null;
var sentimentFilter='all';
var currentNoteDate=null;

var CopyConfig={priceMode:'unified',customPrice:'',delivery:'free30',deliveryCustomVal:'',linkMeituan:true,linkEleme:true,linkMini:true,direction:'auto'};

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
  if(sentimentCache&&sentimentCache.today){
    updateOverviewSentiment(sentimentCache);
    updateSentimentBadge(sentimentCache);
  }
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
document.querySelectorAll('.nav-item').forEach(function(item){item.addEventListener('click',function(){var page=item.dataset.page;document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active')});document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active')});item.classList.add('active');document.getElementById('page-'+page).classList.add('active');document.getElementById('pageTitle').textContent=PAGE_TITLES[page];if(page==='community')setTimeout(renderSchedule,50);if(page==='star')renderStarPage();if(page==='hotspot')renderHotspot();if(page==='products')loadProducts();if(page==='copy'){initCopyPage();}if(page==='acquisition')renderAcquisition();});});
var now=new Date();document.getElementById('currentDate').textContent=now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日 '+['日','一','二','三','四','五','六'][now.getDay()]+'曜日';
function toast(msg){var el=document.createElement('div');el.className='toast';el.textContent=msg;document.body.appendChild(el);setTimeout(function(){el.remove()},2000);}


// ═══════ SENTIMENT ═══════
var sentimentCache=null;
function loadSentimentData(){
  fetch('sentiment_summary.json?v='+Date.now()).then(function(r){return r.json()}).then(function(data){
    // Normalize: new format (stats) → old format (today)
    if(data.stats&&!data.today){
      data.today={
        total:data.stats.total||0,
        pos:data.stats.pos||0,
        neg:data.stats.neg||0,
        neu:data.stats.neu||0,
        pos_pct:data.stats.pos_pct||0,
        neg_pct:data.stats.neg_pct||0
      };
      data.today_items=data.stats.today_items||[];
      // 汇总7天负面（不只是今天）
      var allNeg=[];
      if(data.daily_trend){
        data.daily_trend.forEach(function(d){
          (d.negatives||d.negative_items||[]).forEach(function(n){
            if(!n.date)n.date=d.date||'';
            allNeg.push(n);
          });
        });
      }
      data.negative_items=allNeg;
      data.generated=data.updated||'';
      // Compute last_7d from daily_trend
      if(data.daily_trend&&data.daily_trend.length>0){
        var t7={total:0,pos:0,neg:0};
        data.daily_trend.forEach(function(d){t7.total+=d.total||0;t7.pos+=d.pos||0;t7.neg+=d.neg||0;});
        data.last_7d=t7;
        data.date_range=data.daily_trend[0].date+' ~ '+data.daily_trend[data.daily_trend.length-1].date;
      }
    }
    data.today_items=data.today_items||[];
    data.negative_items=data.negative_items||[];
    data.last_7d=data.last_7d||{total:0,pos:0,neg:0};
    data.date_range=data.date_range||'';
    data.generated=data.generated||data.updated||'';
    sentimentCache=data;
    try{renderSentimentKPIs(data);}catch(e){console.log('KPI error:',e.message);}
    try{renderSentimentTrend(data);}catch(e){console.log('Trend error:',e.message);}
    try{renderSentimentNegList(data);}catch(e){console.log('NegList error:',e.message);}
    try{renderSentimentItems(data);}catch(e){console.log('Items error:',e.message);}
    try{updateOverviewSentiment(data);updateSentimentBadge(data);}catch(e){console.log('Overview error:',e.message);}
    populateSentimentDates();
  }).catch(function(e){console.log('Fetch error:',e.message);});
}
function refreshSentimentLive(){
  toast('🔄 正在刷新数据...');
  loadSentimentData();
  setTimeout(function(){if(sentimentCache)toast('✅ 已更新 ('+sentimentCache.today.total+'条)');},1000);
}
function renderSentimentKPIs(data){if(!data||!data.today)return;var t=data.today;var h='<div class="kpi accent-green"><div class="kpi-label">📊 今日舆情总量</div><div class="kpi-value">'+t.total+'<span class="kpi-change flat">条</span></div><div class="kpi-sub">'+data.latest_date+'</div></div>'+'<div class="kpi accent-teal"><div class="kpi-label">😊 正面</div><div class="kpi-value">'+t.pos+'<span class="kpi-change up">'+(t.pos_pct||0).toFixed(0)+'%</span></div><div class="kpi-sub">口碑健康</div></div>'+'<div class="kpi '+(t.neg>0?'accent-red':'accent-green')+'"><div class="kpi-label">⚠️ 负面</div><div class="kpi-value">'+t.neg+'<span class="kpi-change '+(t.neg>0?'down':'flat')+'">'+(t.neg>0?'需关注':'✅')+'</span></div><div class="kpi-sub">近7天累计 '+data.last_7d.neg+' 条</div></div>'+'<div class="kpi accent-blue"><div class="kpi-label">📊 7天总量</div><div class="kpi-value">'+data.last_7d.total+'<span class="kpi-change flat">条</span></div><div class="kpi-sub">'+data.daily_trend[0].date+' ~ '+data.daily_trend[data.daily_trend.length-1].date+'</div></div>';document.getElementById('sentimentKPI').innerHTML=h;document.getElementById('sentimentMeta').textContent='数据源: master_data.json ('+data.date_range+')';}
function renderSentimentTrend(data){var trend=data.daily_trend;var ctx=document.getElementById('sentimentTrendChart');if(!ctx)return;new Chart(ctx,{type:'line',data:{labels:trend.map(function(d){return d.date.slice(5)}),datasets:[{label:'总量',data:trend.map(function(d){return d.total}),borderColor:'#2d8a4e',backgroundColor:'rgba(45,138,78,.1)',borderWidth:2,pointRadius:3,fill:true,tension:.3},{label:'正面',data:trend.map(function(d){return d.pos}),borderColor:'#4caf50',borderWidth:1.5,pointRadius:2,tension:.3,borderDash:[3,2]},{label:'负面',data:trend.map(function(d){return d.neg}),borderColor:'#e53935',borderWidth:1.5,pointRadius:3,pointBackgroundColor:'#e53935',tension:.3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{usePointStyle:true,boxWidth:6,font:{size:10}}}},scales:{x:{ticks:{font:{size:10}},grid:{display:false}},y:{beginAtZero:true,ticks:{font:{size:10}},grid:{color:'#e8ece8'}}}}});}
var sentimentFilter='all';

function updateSentimentBadge(data){var b=document.getElementById('sentimentBadge');if(data.today.neg>0){b.textContent=data.today.neg;b.classList.add('show');}else if(data.last_7d.neg>0){b.textContent='!';b.classList.add('show');}}

// ═══════ STAR ═══════
function getStars(){try{return JSON.parse(localStorage.getItem('qg_stars')||'[]');}catch(e){return[];}}
function saveStars(s){localStorage.setItem('qg_stars',JSON.stringify(s));}
function isStarred(date,title){return getStars().some(function(s){return s.date===date&&s.title===title;});}
function quickStar(el){var date=el.dataset.date;var title=el.dataset.title;var platform=el.dataset.platform;var author=el.dataset.author;var url=el.dataset.url;var stars=getStars();var idx=stars.findIndex(function(s){return s.date===date&&s.title===title;});if(idx>=0){stars.splice(idx,1);el.classList.remove('active');}else{stars.push({date:date,title:title,platform:platform,author:author,url:url,savedAt:new Date().toISOString()});el.classList.add('active');}saveStars(stars);renderStarPage();toast(idx>=0?'已取消收藏':'⭐ 已收藏');}
function clearStars(){if(confirm('确定清空所有精选正面素材?')){localStorage.removeItem('qg_stars');renderStarPage();toast('已清空');}}
function importStarsJSON(){
  var input=document.createElement('input');
  input.type='file';input.accept='.json';
  input.onchange=function(){
    var file=input.files[0];
    if(!file)return;
    var reader=new FileReader();
    reader.onload=function(e){
      try{
        var data=JSON.parse(e.target.result);
        if(!Array.isArray(data)){toast('格式错误：需为JSON数组');return;}
        var existing=getStars();
        var added=0;
        data.forEach(function(s){
          if(!existing.some(function(x){return x.date===s.date&&x.title===s.title})){
            existing.push(s);added++;
          }
        });
        saveStars(existing);
        renderStarPage();
        toast('📥 导入完成：新增 '+added+' 条，共 '+existing.length+' 条');
      }catch(err){toast('解析失败：'+err.message);}
    };
    reader.readAsText(file);
  };
  input.click();
}
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
var CopyConfig={priceMode:'unified',customPrice:'',delivery:'free30',deliveryCustomVal:'',linkMeituan:true,linkEleme:true,linkMini:true,direction:'auto'};
function loadCopyConfig(){try{var saved=JSON.parse(localStorage.getItem('qg_copy_config')||'{}');for(var k in saved){if(CopyConfig.hasOwnProperty(k))CopyConfig[k]=saved[k];}}catch(e){}applyCopyConfig();}
function saveCopyConfig(){localStorage.setItem('qg_copy_config',JSON.stringify(CopyConfig));}
function setCopyConfig(key,val){CopyConfig[key]=val;saveCopyConfig();applyCopyConfig();}
function applyCopyConfig(){document.getElementById('priceUnified').className='btn '+(CopyConfig.priceMode==='unified'?'btn-primary':'btn-ghost');document.getElementById('priceRegional').className='btn '+(CopyConfig.priceMode==='regional'?'btn-primary':'btn-ghost');document.getElementById('delivery30').className='btn '+(CopyConfig.delivery==='free30'?'btn-primary':'btn-ghost');document.getElementById('deliveryCustom').className='btn '+(CopyConfig.delivery==='custom'?'btn-primary':'btn-ghost');document.getElementById('deliveryCustomVal').style.display=CopyConfig.delivery==='custom'?'':'none';var pi=document.getElementById('priceCustomVal');if(pi)pi.value=CopyConfig.customPrice||'';document.getElementById('deliveryCustomVal').value=CopyConfig.deliveryCustomVal||'';var links=document.querySelectorAll('#copyLinks label input');if(links.length>=3){links[0].checked=CopyConfig.linkMeituan;links[1].checked=CopyConfig.linkEleme;links[2].checked=CopyConfig.linkMini;}document.getElementById('copyDirection').value=CopyConfig.direction;}
function initCopyDay(){var now=new Date();var day=now.getDay();var label='';if(day===2){label='周二 · 生活关怀';document.getElementById('linkMiniapp').style.display='';}else if(day===3){label='周三 · 会员日88折';document.getElementById('linkMiniapp').style.display='';}else if(day===4){label='周四 · 特价';document.getElementById('linkMiniapp').style.display='none';CopyConfig.linkMini=false;}else if(day===5){label='周五 · 周末场景';document.getElementById('linkMiniapp').style.display='';}else if(day===6){label='周六 · 轮换种草';document.getElementById('linkMiniapp').style.display='';}else{label='今天无推送';}document.getElementById('copyDayLabel').textContent=label;var festToday='';var todayKey=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');try{var yearFests=FESTIVAL_DATA?FESTIVAL_DATA[String(now.getFullYear())]||{}:{};var mmdd=String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');if(yearFests[mmdd])festToday=' 🎋 '+yearFests[mmdd];}catch(e){}document.getElementById('copyWeather').innerHTML='📅 '+now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日'+festToday;}
function loadCopyHotspots(){var el=document.getElementById('copyHotspotBar');fetch('hotspot.json?v='+Date.now()).then(function(r){return r.json()}).then(function(d){var items=(d.items||[]).slice(0,5);if(items.length===0){el.innerHTML='<span style="color:var(--text-dim)">暂无热点数据</span>';return;}var html='';items.forEach(function(item){html+='<span style="background:var(--brand-light);color:var(--brand);padding:3px 8px;border-radius:12px;cursor:pointer;white-space:nowrap" title="'+item.word+'">'+(item.category||'')+' '+item.word.substring(0,15)+'</span>';});el.innerHTML=html;}).catch(function(){el.innerHTML='<span style="color:var(--text-dim)">热点加载中...</span>';});}

// ═══════ COPY GENERATOR ═══════

var HUA_ZI_POOLS = {"thu": ["🛵外卖特价｜", "🛵外卖专享｜", "🔥今日外卖活动品｜", "📱外卖特惠｜", "🛵鲜切直达｜", "💨外卖速递｜", "🧊冰凉到家｜", "⚡外卖限定｜", "📱动动手指｜", "🛵一键下单｜", "🔥外卖专享价｜", "💨30分钟冰鲜到家｜", "🧊冰镇", "🛵"], "fri": ["😆周五福来day！追剧搭档已就位🍉", "周末宅家公式：沙发🛋️+空调❄️+", "🎉周五解放日｜", "🎮周五开黑夜，", "✨周五了！", "周末模式开启🔛", "TGIF！", "一周辛苦结束，", "🔓周五解放倒计时｜", "周末追剧神器｜", "🍿周末宅家必备｜", "周五啦.ᐟ.ᐟ", "🎬周末片单+", "周五下班快乐水｜"], "tue": ["🌡️热到不想动？试试", "☀️35°C+的夏天，你需要", "💼周二工作日的解暑方案｜", "🧊打败高温的快乐源泉｜", "🍃三伏天的续命果切｜", "💦高温天的清爽选择｜", "一周过半⏳该奖励自己了", "😴➡🍉😋 .ᐟ.ᐟ", "🤔今日诊断：你缺一份鲜果切", "📋今日处方：冰镇西瓜×1 即刻服用", "🥱😪➡😋🤩✨", "一周快过半了！拿什么犒劳自己？"], "sat": ["𝐒𝐚𝐭𝐮𝐫𝐝𝐚𝐲｜周末门面担当🍉", "🤔周六冷知识：原来", "🎬周末追剧人的充电方案：", "周末诊断书：你缺一份", "周六懒day，", "⋆⁺₊☾ 周六限定｜", "周末进度 50%｜", "周六下午茶｜", "🌿周末好时光｜", "🔍正在搜索：这个周末吃什么→", "周六放松模式｜", "周末就是要"]};

var CTA_POOLS = {"thu": ["🛵 动动手指，鲜切到家", "💨 鲜切直达，比外卖小哥还快", "🧊 冰凉一夏，从这一单开始", "📱 戳一下，冰鲜马上到", "⚡ 限时特价，手慢无", "🍉 今天不吃，明天就没有这个价了", "💨 鲜切外卖，30分钟到家", "🔥 特价只在今天"], "fri": ["🛋️ 周末快乐入口", "🎬 追剧搭子已就位，就差你下单", "✨ 快乐周末，果切先行", "🍿 周末模式，一键开启", "🎉 周五解放，从这一盒开始"], "tue": ["🛵 冰鲜直达，点一下就到", "🍉 热天也要对自己好一点", "🧊 一键降温，鲜切到家", "💆 犒赏周二的自己", "💚 新鲜直达，今天不将就"], "sat": ["🌟 发现一份好吃的", "💫 周末小惊喜，藏在链接里", "✨ 舌尖上的新鲜感，一键解锁", "🔍 探索周末美味"]};

var PRODUCT_SELLING = {"西瓜": "麒麟瓜正值甜度巅峰🍉冰甜多汁超解渴", "哈密瓜": "蜜甜脆爽🍈冰镇一下绝了", "芒果": "肉厚核薄🥭甜到心里", "凤梨": "酸甜刚好🍍不涩口不麻嘴", "乌梅": "酸甜开胃🫐一粒一粒停不下来", "榴莲": "金枕肉厚香甜💛冰镇像吃冰淇淋", "青柠": "酸甜清爽🍋夏天的味道", "葡萄": "颗颗脆甜🍇带着花香", "default": "当季鲜切🍉冰一下更好吃"};

var copyProducts=[];
var allProductsData=[];

// ─── Product Selector ───
function loadCopyProducts(){
  var el=document.getElementById('copyProducts');
  if(!el)return;
  fetch('product_library.json?v='+Date.now()).then(function(r){return r.json()}).then(function(d){
    allProductsData=d.items||[];
    renderCopyProductSelector();
  }).catch(function(){
    el.innerHTML='<span style="color:var(--text-dim)">产品库加载失败</span>';
  });
}

function renderCopyProductSelector(){
  var el=document.getElementById('copyProducts');
  if(!el)return;
  var order=['🔥 引流爆品','🎯 当家爆款','🆕 网红创新','🥗 拼盘套餐','💎 高客单','📦 经典果切'];
  var grouped={};
  allProductsData.forEach(function(p){
    var cat=p.category||'📦 经典果切';
    if(!grouped[cat])grouped[cat]=[];
    grouped[cat].push(p);
  });
  var html='<input id="copyProductSearch" oninput="filterCopyProducts()" placeholder="🔍 搜索产品..." style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:4px;font-size:11px;margin-bottom:8px">';
  html+='<div id="copyProductList" style="max-height:200px;overflow-y:auto;font-size:11px">';
  order.forEach(function(cat){
    var items=grouped[cat]||[];
    if(items.length===0)return;
    html+='<div style="font-weight:700;color:var(--text-dim);padding:4px 0 2px;font-size:10px">'+cat+' ('+items.length+')</div>';
    items.slice(0,5).forEach(function(p){
      var checked=copyProducts.indexOf(p.name)>=0?'checked':'';
      html+='<label style="display:flex;align-items:center;gap:4px;padding:2px 4px;cursor:pointer"><input type="checkbox" '+checked+' onchange="toggleCopyProduct(this,\''+p.name.replace(/'/g,"\'")+'\')"><span>'+p.name+'</span><span style="color:var(--text-dim);margin-left:auto">¥'+p.price+'</span></label>';
    });
  });
  html+='</div><div style="font-size:10px;color:var(--text-muted);margin-top:4px">已选 <span id="copyProductCount">'+copyProducts.length+'</span> 款</div>';
  el.innerHTML=html;
}

function filterCopyProducts(){
  var q=(document.getElementById('copyProductSearch').value||'').toLowerCase();
  document.querySelectorAll('#copyProductList label').forEach(function(l){
    l.style.display=(!q||l.textContent.toLowerCase().indexOf(q)>=0)?'flex':'none';
  });
}

function toggleCopyProduct(cb,name){
  if(cb.checked){if(copyProducts.indexOf(name)<0)copyProducts.push(name);}
  else{copyProducts=copyProducts.filter(function(p){return p!==name});}
  document.getElementById('copyProductCount').textContent=copyProducts.length;
}

// ─── 花字引擎 ───
function pickHuaZi(poolKey,storageKey,avoidCount){
  var pool=HUA_ZI_POOLS[poolKey]||[];
  if(!pool.length)return '';
  var used=[];
  try{used=JSON.parse(localStorage.getItem(storageKey)||'[]');}catch(e){}
  var candidates=[];
  for(var i=0;i<pool.length;i++){if(used.indexOf(i)<0)candidates.push(i);}
  if(!candidates.length){candidates=[];for(var j=0;j<pool.length;j++)candidates.push(j);}
  var pick=candidates[Math.floor(Math.random()*candidates.length)];
  used.push(pick);
  while(used.length>avoidCount)used.shift();
  localStorage.setItem(storageKey,JSON.stringify(used));
  return pool[pick];
}

function pickCTA(dayKey,storageKey){
  var pool=CTA_POOLS[dayKey]||CTA_POOLS['thu'];
  var used=[];
  try{used=JSON.parse(localStorage.getItem(storageKey)||'[]');}catch(e){}
  var candidates=[];
  for(var i=0;i<pool.length;i++){if(used.indexOf(i)<0)candidates.push(i);}
  if(!candidates.length){for(var j=0;j<pool.length;j++)candidates.push(j);}
  var pick=candidates[Math.floor(Math.random()*candidates.length)];
  used.push(pick);
  while(used.length>3)used.shift();
  localStorage.setItem(storageKey,JSON.stringify(used));
  return pool[pick];
}

// ─── 品类卖点 ───
function getSellingPoint(productName){
  if(!productName)return PRODUCT_SELLING['default'];
  for(var k in PRODUCT_SELLING){if(k==='default')continue;if(productName.indexOf(k)>=0)return PRODUCT_SELLING[k];}
  return PRODUCT_SELLING['default'];
}

// ─── 行处理（铁律：≤20字，emoji行尾）───
function wrapLine(text){
  if(!text)return '';
  if(text.length<=20)return text;
  var result=[];
  var current='';
  for(var i=0;i<text.length;i++){
    current+=text[i];
    if(current.length>=18||'，。！？、｜'.indexOf(text[i])>=0){
      if(current.trim())result.push(current.trim());
      current='';
    }
  }
  if(current.trim())result.push(current.trim());
  if(!result.length)result=[text];
  return result;
}

function eji(line){
  if(!line||!line.trim())return line;
  if(line.charAt(0)==='#'||line.indexOf('http')===0||line.indexOf('//')===0)return line;
  if(/[\u{1F300}-\u{1FAFF}]/u.test(line))return line;
  return line+'🍉';
}

function linesToCopy(lines){
  var out=[];
  lines.forEach(function(l){
    if(!l||!l.trim()){out.push('');return;}
    var parts=wrapLine(l);
    if(typeof parts==='string'){out.push(eji(parts));}
    else{parts.forEach(function(p){out.push(eji(p));});}
  });
  return out.join('\n').replace(/\n\n\n+/g,'\n\n');
}

// ─── 缩短产品名 ───
function shortName(name){
  return name.replace(/【[^】]*】/g,'').replace(/[（(].*[）)]/g,'').trim()||name;
}

// ═══════ 三日文案生成器 ═══════

// ─── 周四 · 三版差异化 ───
function genThuV1(product,short,dir,hotspot){
  var hz=pickHuaZi('thu','thuHuaUsed',3)+short;
  var sellPoint=getSellingPoint(product);
  var selling=wrapLine(sellPoint);
  var cta=pickCTA('thu','ctaUsed_thu');
  var price=formatPrice(CopyConfig.customPrice,product);
  var dirHook=getDirectionHook(dir,product,short,'thu');
  var lines=[hz,'','🔥 '+product,price,''];
  if(typeof selling==='string')lines.push(selling);else selling.forEach(function(s){lines.push(s);});
  if(dirHook)lines.push(dirHook);
  if(hotspot)lines.push(hotspot);
  lines.push('');lines.push(cta);lines.push('');lines.push('🟡美团：#小程序://美团闪购/qLu5ftvWrGfSQbK');lines.push('🔵饿了么：https://tb.ele.me/wow/alsc/mod/434a9c968141f59617ecb89b');
  return linesToCopy(lines);
}

function genThuV2(product,short,dir,hotspot){
  var hz='⚡限时特价｜'+short;
  var cta='💨 30分钟冰鲜到家🍉';
  var lines=[hz,'','🔥 '+product,formatPrice(CopyConfig.customPrice,product),'',getSellingPoint(product),'',cta,'','🟡美团：#小程序://美团闪购/qLu5ftvWrGfSQbK','🔵饿了么：https://tb.ele.me/wow/alsc/mod/434a9c968141f59617ecb89b'];
  return linesToCopy(lines);
}

function genThuV3(product,short,dir,hotspot){
  var hz=pickHuaZi('thu','thuHuaUsed2',2)+short;
  var cta='🧊 冰镇鲜切🍉外卖直达';
  var lines=[hz,'','📦 '+product,formatPrice(CopyConfig.customPrice,product),'',getSellingPoint(product),'',cta,'','🟡美团：#小程序://美团闪购/qLu5ftvWrGfSQbK','🔵饿了么：https://tb.ele.me/wow/alsc/mod/434a9c968141f59617ecb89b'];
  return linesToCopy(lines);
}

// ─── 周五 · 三版差异化 ───
function genFriV1(product,short,dir,hotspot){
  var hz='😆周五福来day🍉'+short+'已就位';
  var cta=pickCTA('fri','ctaUsed_fri');
  var lines=[hz,'','追剧·宅家·聚会🥳',short+'清爽不脏手🍴','边看边叉着吃',cta,'','👆小程序下单直送到手👇','#小程序://切果NOW/LFtIEeLhMcgq0Rx'];
  return linesToCopy(lines);
}

function genFriV2(product,short,dir,hotspot){
  var hz='周末宅家公式🏠：沙发🛋️+'+short;
  var cta='🛋️ 周末快乐入口🍉';
  var lines=[hz,'','空调房里一口冰果切🍃','谁还要出门呀',cta,'','👆小程序下单直送到手👇','#小程序://切果NOW/LFtIEeLhMcgq0Rx'];
  return linesToCopy(lines);
}

function genFriV3(product,short,dir,hotspot){
  var hz='🎉周五解放日🍉'+short;
  var cta=pickCTA('fri','ctaUsed_fri2');
  var lines=[hz,'','朋友局上少了它就离谱😤','分享装一人一口刚好🍴',cta,'','👆小程序下单直送到手👇','#小程序://切果NOW/LFtIEeLhMcgq0Rx'];
  return linesToCopy(lines);
}

// ─── 周二 · 三版差异化 ───
function genTueV1(product,short,dir,hotspot){
  var hz=pickHuaZi('tue','tueHuaUsed',6)+short;
  var cta=pickCTA('tue','ctaUsed_tue');
  var lines=[hz,'','🔥 '+product,formatPrice(CopyConfig.customPrice,product),'',getSellingPoint(product),'',cta,'','#小程序://切果NOW/LFtIEeLhMcgq0Rx'];
  return linesToCopy(lines);
}

function genTueV2(product,short,dir,hotspot){
  var hz='🤔今日诊断🍉你缺一份'+short;
  var cta='💆 犒赏周二的自己🍉';
  var lines=[hz,'','📋处方：冰镇'+short+'×1','即刻服用⚡',getSellingPoint(product),'',cta,'','#小程序://切果NOW/LFtIEeLhMcgq0Rx'];
  return linesToCopy(lines);
}

function genTueV3(product,short,dir,hotspot){
  var hz='一周过半⏳该奖励自己了🥝';
  var cta=pickCTA('tue','ctaUsed_tue2');
  var lines=[hz,'','🔥 '+product,formatPrice(CopyConfig.customPrice,product),'',getSellingPoint(product),'',cta,'','#小程序://切果NOW/LFtIEeLhMcgq0Rx'];
  return linesToCopy(lines);
}

// ─── 周六 · 三版差异化 ───
function genSatV1(product,short,dir,hotspot){
  var hz=pickHuaZi('sat','satHuaUsed',3)+short;
  var cta=pickCTA('sat','ctaUsed_sat');
  var lines=[hz,'','这款宝藏果切我不允许你不知道😤',getSellingPoint(product),cta,'','👉小程序下单👇','#小程序://切果NOW/LFtIEeLhMcgq0Rx'];
  return linesToCopy(lines);
}

function genSatV2(product,short,dir,hotspot){
  var hz='⋆⁺₊☾ 周六限定🍉'+short;
  var cta='💫 周末小惊喜在这里✨';
  var lines=[hz,'','吃过一次就回不去了🤤',getSellingPoint(product),cta,'','👉小程序下单👇','#小程序://切果NOW/LFtIEeLhMcgq0Rx'];
  return linesToCopy(lines);
}

function genSatV3(product,short,dir,hotspot){
  var hz='周末就是要🍉'+short+'自由';
  var cta=pickCTA('sat','ctaUsed_sat2');
  var lines=[hz,'','周末的快乐就是它给的🥰',getSellingPoint(product),cta,'','👉小程序下单👇','#小程序://切果NOW/LFtIEeLhMcgq0Rx'];
  return linesToCopy(lines);
}

// ─── 主生成函数 ───

// ─── 最终注入方向话术+热点 ───
// Inject方向+热点，n=1/2/3对应版本号
function injectExtras(text,dir,hotspot,n){
  var extra=[];
  if(dir&&dir!=='auto'){
    var dh=getDirectionHookPlain(dir,n);
    if(dh)extra.push(dh);
  }
  // 热点：从关键词中提取可融入的自然句，不硬插
  if(hotspot){
    var hl=makeHotspotLine(hotspot);
    if(hl)extra.push(hl);
  }
  if(extra.length===0)return text;
  var lines=text.split('\n');
  var insertAt=-1;
  for(var i=lines.length-1;i>=0;i--){
    if(lines[i].indexOf('🟡')>=0||lines[i].indexOf('🔵')>=0||lines[i].indexOf('#小程序')>=0){
      insertAt=i;break;
    }
  }
  if(insertAt>0){
    var before=lines.slice(0,insertAt);
    var after=lines.slice(insertAt);
    return before.concat([''],extra,['']).concat(after).join('\n');
  }
  return text;
}

function makeHotspotLine(raw){
  if(!raw)return '';
  // 去掉分类前缀，只取纯关键词
  var kw=raw.replace(/^(果切相关|娱乐|美食|生活|品牌|节日|综合|科技|体育|财经|社会|\\s)*/,'').trim().substring(0,15);
  if(!kw||kw.length<2)return '';
  // 天气关键词→自然融入
  var weatherWords=['高温','暴雨','台风','降温','热','冷','闷热','潮湿','干燥','防晒','中暑','三伏','立秋','处暑','入伏'];
  for(var i=0;i<weatherWords.length;i++){
    if(kw.indexOf(weatherWords[i])>=0){
      return '🌡️'+kw+'🍉冰镇果切续命中';
    }
  }
  // 水果/食物关键词
  if(/[瓜果莓桃梨橘橙柚柿葡榴芒椰]/.test(kw)){
    return '🍉'+kw+'的季节来啦';
  }
  // 其他：用轻松语气融入
  if(kw.length>=3){
    return '🍉今日份 '+kw;
  }
  return '';
}
function getDirectionHookPlain(dir, variant){
  var hooks={
    'scene':[
      '下午茶时间到🕒办公室人手一盒',
      '追剧搭档已就位🍿就差这一盒',
      '聚会桌上少了它就离谱😤',
    ],
    'emotion':[
      '心情不好？来一份甜甜的🥰',
      '工作累了😮‍💨犒赏自己一下',
      '今天不开心？果切治愈你🍉',
    ],
    'data':[
      '回购率超高📊大家嘴巴很诚实',
      '群里都在回购的一款🤤',
      '销量说明一切🔥不解释',
    ],
    'health':[
      '每天维C补给💪比喝饮料健康',
      '一份满足一天水果摄入🍃',
      '比奶茶健康多了🥤维C满满',
    ],
    'habit':[
      '每天下午的快乐源泉🍉',
      '一周的仪式感从今天开始✨',
      '午后果切时间到⏰已成习惯',
    ],
    'lazy':[
      '不用洗不用切🍉打开就吃',
      '懒人福音😴冰箱拿出来就吃',
      '切好的水果🍉直接上嘴',
    ],
    'seasonal':[
      '当季限定⏳错过等明年',
      '这个季节的甜🍈都在这一盒里',
      '时令鲜果🍑正当季最好吃',
    ],
    'surprise':[
      '今天有个隐藏福利🎁',
      '打开有惊喜✨这盒不一般',
      '偷偷告诉你🤫今天有彩蛋',
    ],
    'hotspot':[
      '全网都在吃的同款🔥',
      '最近刷屏的一款🍉忍不住下单',
      '抖音上都在吃🤤跟风了',
    ],
    'social':[
      '@你那个爱吃水果的朋友🥝一起拼',
      '拼单更划算👥叫上同事一起',
      '分享装🍱一人一口刚好',
    ],
    'contrast':[
      '比一杯奶茶还便宜🥤不香吗',
      '外面X元这里Y元💰香太多了',
      '同样的钱💸这里多一倍分量',
    ],
    'member':[
      '会员价到手👑省下的都是赚的',
      '今日会员专享🎫不买就亏了',
      '会员特权✨今日份福利请查收',
    ],
    'direct':[
      '直接说重点👇今日特价',
      '不绕弯子⚡开门见山',
      '一句话总结📢今天这个必看',
    ],
  };
  var pool=hooks[dir]||hooks['scene'];
  var idx=Math.min(variant||1,pool.length)-1;
  return pool[idx]||pool[0];
}

// ─── 价格格式化 ───
function formatPrice(customPrice,productName){
  if(customPrice&&customPrice.trim()){
    return '💰 ¥'+customPrice.trim();
  }
  // Auto-detect from product library
  if(allProductsData.length>0){
    for(var i=0;i<allProductsData.length;i++){
      if(allProductsData[i].name===productName&&allProductsData[i].price){
        return '💰 ¥'+allProductsData[i].price;
      }
    }
  }
  return '📱 各区域以平台实际价格为准';
}

// ─── 方向话术生成 ───
function getDirectionHook(dir,product,short,dayKey){
  if(dir==='auto')return '';
  var hooks={
    'habit':['每天下午的快乐源泉🍉','一周的仪式感从今天开始✨'],
    'emotion':['工作日的救命稻草🍉','心情不好？来一份甜甜的'],
    'seasonal':['当季限定⏳错过等明年','这一季的甜🍈都在这一盒里'],
    'scene':['下午茶时间到🕒','办公室人手一盒的快乐🥰'],
    'data':['回购率超高的一款📊','大家嘴巴很诚实🤤回购说明一切'],
    'social':['和同事拼单更划算👥','@你那个爱吃水果的朋友🥝'],
    'surprise':['今天有个隐藏福利🎁','解锁一份今日惊喜✨'],
    'hotspot':['全网都在吃的同款🔥','刷到就忍不住下单了🤤'],
    'health':['每天一份维C补给💪','比喝饮料健康多了🍃'],
    'contrast':['比一杯奶茶还便宜🥤','外面X元这里Y元💰不香吗'],
    'lazy':['不用洗不用切🍉打开就吃','懒人福音😴冰箱拿出来就吃'],
    'member':['今日会员专享🎫','会员价到手👑省下的都是赚的'],
    'direct':['直接说重点👇','不绕弯子⚡今日特价'],
  };
  var pool=hooks[dir]||hooks['scene'];
  return pool[Math.floor(Math.random()*pool.length)];
}

// 存储当前3版文案纯文本
var currentCopyTexts=[];

function copyVersion(idx){
  var text=currentCopyTexts[idx-1]||'';
  text=text.replace(/<br>/g,'\n').replace(/<[^>]*>/g,'');
  navigator.clipboard.writeText(text).then(function(){toast('📋 版本'+idx+'已复制');}).catch(function(){toast('复制失败');});
}

function generateCopy(){
  var now=new Date();
  var dir=CopyConfig.direction||'auto';
  
  // Get hotspot keywords for injection
  var hotspotWords=[];
  try{
    var hotspotEls=document.querySelectorAll('#copyHotspotBar span');
    hotspotEls.forEach(function(s){var w=s.textContent.trim();if(w)hotspotWords.push(w);});
  }catch(e){}
  var hotspotLine='';
  if(hotspotWords.length>0){
    var hw=hotspotWords[Math.floor(Math.random()*Math.min(3,hotspotWords.length))];
    hotspotLine=hw; // 原样传给makeHotspotLine处理
  }
  var day=now.getDay();
  if(copyProducts.length===0){
    if(allProductsData.length>0)copyProducts=[allProductsData[0].name];
    else copyProducts=['招牌鲜果切'];
  }
  var product=copyProducts[0];
  var short=shortName(product);
  
  var v1='',v2='',v3='';
  var labels=['版本一','版本二','版本三'];
  
  if(day===4){ // Thursday
    v1=genThuV1(product,short,dir,hotspotLine);v2=genThuV2(product,short,dir,hotspotLine);v3=genThuV3(product,short,dir,hotspotLine);
    labels=['版本一 · 外卖特价','版本二 · 限时紧迫','版本三 · 冰鲜直达'];
  }else if(day===5){ // Friday
    v1=genFriV1(product,short,dir,hotspotLine);v2=genFriV2(product,short,dir,hotspotLine);v3=genFriV3(product,short,dir,hotspotLine);
    labels=['版本一 · 追剧场景','版本二 · 宅家公式','版本三 · 聚会分享'];
  }else if(day===2){ // Tuesday
    v1=genTueV1(product,short,dir,hotspotLine);v2=genTueV2(product,short,dir,hotspotLine);v3=genTueV3(product,short,dir,hotspotLine);
    labels=['版本一 · 生活共鸣','版本二 · 诊断处方','版本三 · 犒赏自己'];
  }else if(day===6){ // Saturday
    v1=genSatV1(product,short,dir,hotspotLine);v2=genSatV2(product,short,dir,hotspotLine);v3=genSatV3(product,short,dir,hotspotLine);
    labels=['版本一 · 宝藏安利','版本二 · 周末限定','版本三 · 快乐自由'];
  }else{
    v1=genThuV1(product,short,dir,hotspotLine);v2=genFriV1(product,short,dir,hotspotLine);v3=genTueV1(product,short,dir,hotspotLine);
    labels=['版本一 · 外卖','版本二 · 场景','版本三 · 关怀'];
  }
  
  // Inject direction hook + hotspot into each variant
  v1=injectExtras(v1,dir,hotspotLine,1);
  v2=injectExtras(v2,dir,hotspotLine,2);
  v3=injectExtras(v3,dir,hotspotLine,3);
  
  var dirLabel=document.getElementById('copyDirection').selectedOptions[0].text;document.getElementById('copyV1').innerHTML='<strong>'+labels[0]+' · '+dirLabel+'</strong><br><br>'+v1.replace(/\n/g,'<br>');
  document.getElementById('copyV2').innerHTML='<strong>'+labels[1]+' · '+dirLabel+'</strong><br><br>'+v2.replace(/\n/g,'<br>');
  document.getElementById('copyV3').innerHTML='<strong>'+labels[2]+' · '+dirLabel+'</strong><br><br>'+v3.replace(/\n/g,'<br>');
  
  document.querySelectorAll('.copy-actions').forEach(function(a){a.style.display='flex';});
  
  currentCopyTexts=[v1,v2,v3];
  saveCopyHistory(product,[v1,v2,v3]);
  toast('🚀 已生成 3 版文案');
}

// ─── History ───
function saveCopyHistory(product,versions){
  var history=[];
  try{history=JSON.parse(localStorage.getItem('qg_copy_history')||'[]');}catch(e){}
  history.unshift({time:new Date().toISOString(),product:product,v1:versions[0],v2:versions[1],v3:versions[2]});
  if(history.length>20)history=history.slice(0,20);
  localStorage.setItem('qg_copy_history',JSON.stringify(history));
  renderCopyHistory();
}

function renderCopyHistory(){
  var el=document.getElementById('copyHistory');
  if(!el)return;
  var history=[];
  try{history=JSON.parse(localStorage.getItem('qg_copy_history')||'[]');}catch(e){}
  if(!history.length){el.innerHTML='<div style="padding:4px 0">暂无记录</div>';return;}
  var html='';
  history.forEach(function(h,i){
    html+='<div style="padding:6px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="loadCopyHistory('+i+')"><div style="font-size:10px;color:var(--text-muted)">'+h.time.substring(5,16).replace('T',' ')+'</div><div style="font-size:11px;color:var(--text)">'+h.product+'</div></div>';
  });
  el.innerHTML=html;
}

function loadCopyHistory(idx){
  var history=[];
  try{history=JSON.parse(localStorage.getItem('qg_copy_history')||'[]');}catch(e){}
  if(idx>=history.length)return;
  var h=history[idx];
  document.getElementById('copyV1').innerHTML='<strong>版本一 · 历史</strong><br><br>'+h.v1.replace(/\n/g,'<br>');
  document.getElementById('copyV2').innerHTML='<strong>版本二 · 历史</strong><br><br>'+h.v2.replace(/\n/g,'<br>');
  document.getElementById('copyV3').innerHTML='<strong>版本三 · 历史</strong><br><br>'+h.v3.replace(/\n/g,'<br>');
  document.querySelectorAll('.copy-actions').forEach(function(a){a.style.display='flex';});
}

// ─── Init ───
function initCopyPage(){initCopyDay();loadCopyConfig();applyCopyConfig();loadCopyHotspots();loadCopyProducts();renderCopyHistory();}

function initCopyPage(){
  initCopyDay();
  loadCopyConfig();
  applyCopyConfig();
  loadCopyHotspots();
  loadCopyProducts();
  renderCopyHistory();
}


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
