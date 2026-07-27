function getStars(){try{return JSON.parse(localStorage.getItem('qg_stars')||'[]');}catch(e){return[];}}
function saveStars(s){localStorage.setItem('qg_stars',JSON.stringify(s));}
function isStarred(date,title){return getStars().some(function(s){return s.date===date&&s.title===title;});}
function quickStar(el){var date=el.dataset.date;var title=el.dataset.title;var platform=el.dataset.platform;var author=el.dataset.author;var url=el.dataset.url;var stars=getStars();var idx=stars.findIndex(function(s){return s.date===date&&s.title===title;});if(idx>=0){stars.splice(idx,1);el.classList.remove('active');}else{stars.push({date:date,title:title,platform:platform,author:author,url:url,savedAt:new Date().toISOString()});el.classList.add('active');}saveStars(stars);renderStarPage();
renderAcquisition();toast(idx>=0?'已取消收藏':'⭐ 已收藏');}
function clearStars(){if(confirm('确定清空所有精选正面素材?')){localStorage.removeItem('qg_stars');renderStarPage();
renderAcquisition();toast('已清空');}}
function renderStarPage(){
  var stars=getStars();var el=document.getElementById('starContent');if(!el)return;
  if(stars.length===0){el.innerHTML='<div style="text-align:center;padding:60px;color:var(--text-dim)"><div style="font-size:40px;margin-bottom:12px">\u2b50</div>\u6682\u65e0\u7cbe\u9009\u7d20\u6750<br><span style="font-size:12px">\u5728\u8206\u60c5\u660e\u7ec6-\u6b63\u9762\u5217\u8868\u4e2d\u70b9 \u2b50 \u5373\u53ef\u6536\u85cf</span></div>';return;}
  stars.sort(function(a,b){return b.date.localeCompare(a.date)});
  var html='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px">';
  stars.forEach(function(s){
    html+='<div style="background:var(--brand-light);border-radius:var(--radius-sm);padding:14px;border:1px solid var(--brand);position:relative"><span data-date="'+s.date+'" data-title="'+s.title.replace(/"/g,'&quot;')+'" onclick="unstarItem(this.dataset.date,this.dataset.title)" style="position:absolute;top:8px;right:10px;cursor:pointer;font-size:16px">\u2b50</span><div style="font-weight:600;color:var(--text);font-size:13px;margin-bottom:6px;padding-right:24px">'+s.title+'</div><div style="font-size:11px;color:var(--text-dim);margin-bottom:6px">'+s.platform+' \u00b7 '+s.author+' \u00b7 '+s.date+'</div>'+(s.url?'<a href="'+s.url+'" target="_blank" style="font-size:11px;color:var(--brand);text-decoration:none">\u67e5\u770b\u539f\u5e16 \u2197</a>':'')+'</div>';
  });
  html+='</div>';el.innerHTML=html;
}
function unstarItem(date,title){
  var stars=getStars();var idx=stars.findIndex(function(x){return x.date===date&&x.title===title;});
  if(idx>=0){stars.splice(idx,1);saveStars(stars);renderStarPage();toast('\u5df2\u53d6\u6d88\u6536\u85cf');}
}
// ═══════ REPORTS ═══════
function renderWeeklyReports(){
  var kpi='<div class="kpi accent-green"><div class="kpi-label">👥 群客户数</div><div class="kpi-value">33,321<span class="kpi-change flat">人</span></div><div class="kpi-sub">712群 · 682门店 · 渗透92.5%</div></div>';
  kpi+='<div class="kpi accent-teal"><div class="kpi-label">📈 本周入群</div><div class="kpi-value">391<span class="kpi-change up">+47.0%</span></div><div class="kpi-sub">07/13-07/19</div></div>';
  kpi+='<div class="kpi accent-red"><div class="kpi-label">📉 本周退群</div><div class="kpi-value">502<span class="kpi-change down">-11.9%</span></div><div class="kpi-sub">环比改善+193</div></div>';
  kpi+='<div class="kpi accent-amber"><div class="kpi-label">📊 本周净增</div><div class="kpi-value">-111<span class="kpi-change flat">改善中</span></div><div class="kpi-sub">退群率>10%: 3家</div></div>';
  document.getElementById('communityDataKPI').innerHTML=kpi;
  
  var weeks=[{label:'07/13-07/19',file:'社群周报看板_20260713-0719.html'},{label:'07/06-07/12',file:'社群周报看板_20260706-0712.html'},{label:'06/29-07/05',file:'社群周报看板_20260629-0705.html'},{label:'06/22-06/28',file:'社群周报看板_20260622-0628.html'},{label:'06/15-06/21',file:'社群周报看板_20260615-0621.html'}];var h='';weeks.forEach(function(w){h+='<div><a href="#" data-type="weekly" data-file="'+w.file+'" onclick="openReport(this.dataset.type,this.dataset.file);return false" style="color:var(--brand);font-size:13px">📄 '+w.label+' 社群周报</a></div>';});document.getElementById('weeklyReportsList').innerHTML=h;var months=[{label:'2026年6\u6708',file:'社群月报看板_202606.html'},{label:'2026年5\u6708',file:'社群月报看板_202605.html'}];var m='';months.forEach(function(mo){m+='<div><a href="#" data-type="monthly" data-file="'+mo.file+'" onclick="openReport(this.dataset.type,this.dataset.file);return false" style="color:var(--brand);font-size:13px">📄 '+mo.label+' 社群月报</a></div>';});document.getElementById('monthlyReportsList').innerHTML=m;
}
function renderAcquisition(){
  var kpi='<div class="kpi accent-blue"><div class="kpi-label">📣 随单卡 · 本周扫码</div><div class="kpi-value">140<span class="kpi-change up">+4.6%</span></div><div class="kpi-sub">累计3,216 · 活码171家</div></div>';
  kpi+='<div class="kpi accent-teal"><div class="kpi-label">📥 本周进群</div><div class="kpi-value">107<span class="kpi-change flat">人</span></div><div class="kpi-sub">进群率76.4% · 历史77.9%</div></div>';
  kpi+='<div class="kpi accent-red"><div class="kpi-label">📤 本周流失</div><div class="kpi-value">35<span class="kpi-change down">+118.8%</span></div><div class="kpi-sub">需关注</div></div>';
  kpi+='<div class="kpi accent-green"><div class="kpi-label">👥 累计进群</div><div class="kpi-value">2,506<span class="kpi-change flat">人</span></div><div class="kpi-sub">扫码→进群转化78%</div></div>';
  document.getElementById('acquisitionKPI').innerHTML=kpi;
  
  var funnel='<div style="background:var(--bg);border-radius:8px;padding:16px">';
  funnel+='<div style="display:flex;align-items:center;gap:0;font-size:13px;margin-bottom:8px">';
  funnel+='<div style="background:var(--brand);color:#fff;padding:8px 0;text-align:center;border-radius:6px 0 0 6px;flex:1">扫码 140</div>';
  funnel+='<div style="padding:0 4px;font-size:18px;color:var(--text-dim)">→</div>';
  funnel+='<div style="background:#00897b;color:#fff;padding:8px 0;text-align:center;flex:1">加好友 140<span style="font-size:10px;opacity:.7"> 100%</span></div>';
  funnel+='<div style="padding:0 4px;font-size:18px;color:var(--text-dim)">→</div>';
  funnel+='<div style="background:var(--blue);color:#fff;padding:8px 0;text-align:center;border-radius:0 6px 6px 0;flex:1">进群 107<span style="font-size:10px;opacity:.7"> 76.4%</span></div>';
  funnel+='</div>';
  funnel+='<div style="font-size:11px;color:var(--text-dim)">本周进群率 76.4% · 历史累计进群率 77.9% · 171家门店 · 31家有扫码</div>';
  funnel+='</div>';
  document.getElementById('communityFunnel').innerHTML=funnel;
  
  var ret='<div style="display:flex;gap:16px">';
  ret+='<div style="flex:1;text-align:center;background:var(--brand-light);border-radius:8px;padding:16px"><div style="font-size:28px;font-weight:800;color:var(--brand)">90.7%</div><div style="font-size:11px;color:var(--text-dim)">24h留存</div><div style="font-size:10px;color:var(--red)">-0.3pp</div></div>';
  ret+='<div style="flex:1;text-align:center;background:#e0f2f1;border-radius:8px;padding:16px"><div style="font-size:28px;font-weight:800;color:#00897b">89.4%</div><div style="font-size:11px;color:var(--text-dim)">7天留存</div><div style="font-size:10px;color:var(--red)">-0.4pp</div></div>';
  ret+='<div style="flex:1;text-align:center;background:var(--bg);border-radius:8px;padding:16px"><div style="font-size:28px;font-weight:800;color:var(--text)">77.9%</div><div style="font-size:11px;color:var(--text-dim)">历史进群率</div><div style="font-size:10px;color:var(--text-dim)">累计2,506人</div></div>';
  ret+='</div>';
  document.getElementById('communityRetention').innerHTML=ret;
}

function openReport(type,id){var url;if(type==='weekly')url='社群周报/'+id;else if(type==='monthly')url=id;else url='社群半年报_2026H1.html';window.open(url,'_blank');}

// ═══════ ACTIVITIES ═══════
function switchActTab(tab){['Member','Weekend','Monthly'].forEach(function(t){var c=document.getElementById('actContent'+t);if(c)c.style.display=(t.toLowerCase()===tab)?'':'none';var b=document.getElementById('actBtn'+t);if(b){b.classList.remove('btn-primary','btn-ghost');b.classList.add(t.toLowerCase()===tab?'btn-primary':'btn-ghost');}});}
var MEMBER_DATA={"2026-07-15":{prev:"2026-07-08",orders:707,prevOrders:712,sales:19680.83,prevSales:21098.59,stores:334,prevStores:325,couponUseRate:31.5,prevCouponUseRate:29.9,members:702,deliveryOrders:61,prevDeliveryOrders:56,unitPrice:14.83,prevUnitPrice:15.32,customerPrice:27.84,prevCustomerPrice:29.63,conclusion:"量稳价跌：订单持平，销售额因团餐基数回落↓6.7%。北部大区暴雨重创（↓17.5%），华东高温逆势增长（↑10.8%）。"},"2026-07-08":{prev:"2026-07-01",orders:712,prevOrders:696,sales:21098.59,prevSales:19561.80,stores:325,prevStores:320,couponUseRate:29.9,prevCouponUseRate:33.6,members:700,deliveryOrders:56,prevDeliveryOrders:52,unitPrice:15.32,prevUnitPrice:14.80,customerPrice:29.63,prevCustomerPrice:28.10,conclusion:"含团餐大宗订单拉高基数，剔除后实际持平。券核销率微降，需关注。"},"2026-07-01":{prev:"2026-06-24",orders:696,prevOrders:650,sales:19561.80,prevSales:18300,stores:320,prevStores:310,couponUseRate:33.6,prevCouponUseRate:32.0,members:680,deliveryOrders:52,prevDeliveryOrders:48,unitPrice:14.80,prevUnitPrice:14.50,customerPrice:28.10,prevCustomerPrice:28.15,conclusion:"暑期首周平稳开局，订单↑7%，券核销率小幅改善。"}};
function renderMemberDay(){var date=document.getElementById('memberDateSelect').value;var d=MEMBER_DATA[date];if(!d)return;var wow=function(cur,prev){var pct=prev?((cur-prev)/prev*100):0;var cls=pct>0.5?'up':pct<-0.5?'down':'flat';var arrow=pct>0.5?'↑':pct<-0.5?'↓':'→';return '<span style="color:'+(cls==='up'?'#2e7d32':cls==='down'?'var(--red)':'var(--amber)')+'">'+arrow+Math.abs(pct).toFixed(1)+'%</span>';};var html='<div class="card"><div class="card-header"><div class="card-title">📊 核心指标（'+date.slice(5)+' vs '+d.prev.slice(5)+'）</div></div><div style="font-size:13px;line-height:2.2;color:var(--text-dim)"><div>📦 有效订单 <b style="color:var(--text)">'+d.orders+'</b>（←'+d.prevOrders+'，'+wow(d.orders,d.prevOrders)+'）</div><div>💰 有效销售额 <b style="color:var(--text)">¥'+d.sales.toLocaleString()+'</b>（←¥'+d.prevSales.toLocaleString()+'，'+wow(d.sales,d.prevSales)+'）</div><div>🏪 动销门店 <b style="color:var(--text)">'+d.stores+'</b>（←'+d.prevStores+'，'+wow(d.stores,d.prevStores)+'）</div><div>🎫 券核销率 <b style="color:var(--text)">'+d.couponUseRate+'%</b>（←'+d.prevCouponUseRate+'%）</div><div>👤 新增会员 <b style="color:var(--text)">'+d.members+'</b>人</div><div>🛵 外卖订单 <b style="color:var(--text)">'+d.deliveryOrders+'</b>（←'+d.prevDeliveryOrders+'）</div><div>💵 客单价 <b style="color:var(--text)">¥'+d.customerPrice+'</b>（←¥'+d.prevCustomerPrice+'）</div></div></div><div class="card"><div class="card-header"><div class="card-title">📋 复盘结论</div></div><div style="font-size:12px;color:var(--text-dim);line-height:1.8">'+d.conclusion+'</div></div>';document.getElementById('memberDayContent').innerHTML=html;}


// ═══════ INIT ═══════
renderWeeklyReports();
loadSentimentData();
renderStarPage();
renderAcquisition();
renderMemberDay();
setInterval(function(){loadSentimentData();},30*60*1000);




