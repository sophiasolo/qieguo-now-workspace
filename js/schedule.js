// ═══════════════════════════════════════════
const SCHEDULE_DATA = {
  "2026-04":{labels:"3.30-4.26",weeks:[
    {dates:["3.30","3.31","4.1","4.2","4.3","4.4","4.5"],market:["","下单返利","","","下单返利","淘闪活动",""],program:["免配送费","","会员日","","","",""],brand:["","","","","","","清明节海报"],wechat:["","","✅️","","","","✅️"],festival:["","","","","","","清明节"]},
    {dates:["4.6","4.7","4.8","4.9","4.10","4.11","4.12"],market:["","下单返利","","","下单返利","下单返利",""],program:["","","会员日","","","",""],brand:["","","","","","",""],wechat:["","","✅️","","","",""],festival:["","","","","","",""]},
    {dates:["4.13","4.14","4.15","4.16","4.17","4.18","4.19"],market:["","下单返利","","","下单返利","下单返利",""],program:["海盐青柠券","","57家店20元券包+会员日","","","",""],brand:["","","","","","",""],wechat:["","","✅️","","","",""],festival:["","","","","","","谷雨"]},
    {dates:["4.20","4.21","4.22","4.23","4.24","4.25","4.26"],market:["","下单返利","","","下单返利","下单返利",""],program:["积分兑换","","会员日","","","",""],brand:["","海盐青柠","","","","",""],wechat:["✅️","","✅️","","","",""],festival:["","","","","","",""]}
  ]},
  "2026-05":{labels:"4.27-5.31",weeks:[
    {dates:["4.27","4.28","4.29","4.30","5.1","5.2","5.3"],market:["","外卖品/下单返利","","","","",""],program:["","","会员日全场88折券","","","",""],brand:["海盐青柠杯海报","海盐青柠杯视频+小程序链接","","海盐青柠杯漫改+小程序链接","劳动节海报+AI视频","海盐青柠杯实拍1+外卖链接",""],wechat:["✅️","","✅️","","✅️","",""],festival:["","","","","劳动节","",""]},
    {dates:["5.4","5.5","5.6","5.7","5.8","5.9","5.10"],market:["","","","","","外卖品/下单返利",""],program:["","","会员日全场88折","","","",""],brand:["","","","海盐青柠杯分层海报","海盐青柠杯实拍2","海盐青柠杯实拍3","母亲节海报"],wechat:["","","","","","","✅️"],festival:["","立夏","","","","","母亲节"]},
    {dates:["5.11","5.12","5.13","5.14","5.15","5.16","5.17"],market:["","外卖品/下单返利","","","榴莲上新/下单返利","",""],program:["免配送费","","会员日","充值活动","","",""],brand:["","","","","","",""],wechat:["","","✅️海盐青柠方图","","","",""],festival:["","","","","","",""]},
    {dates:["5.18","5.19","5.20","5.21","5.22","5.23","5.24"],market:["","外卖品/下单返利","","","海盐青柠杯/下单返利","",""],program:["20元券包","","会员日","西瓜桶特价19.8","","",""],brand:["","","520","","","",""],wechat:["","","✅️","","","",""],festival:["","","","","","",""]},
    {dates:["5.25","5.26","5.27","5.28","5.29","5.30","5.31"],market:["","","","","","",""],program:["9块9特价单品","9块9特价单品","9块9特价单品+会员日","","","",""],brand:["","","","","","",""],wechat:["","","✅️","","","",""],festival:["","","","","","",""]}
  ]},
  "2026-06":{labels:"6.1-6.28",weeks:[
    {dates:["6.1","6.2","6.3","6.4","6.5","6.6","6.7"],market:["","","","","","",""],program:["","","会员日","","","",""],brand:["","","","","","",""],wechat:["","","✅️","","","",""],festival:["","","","","","",""]},
    {dates:["6.8","6.9","6.10","6.11","6.12","6.13","6.14"],market:["","","","","","",""],program:["","热销风向标","会员日","","","",""],brand:["","","","","","",""],wechat:["","","✅️","","","",""],festival:["","","","","","",""]},
    {dates:["6.15","6.16","6.17","6.18","6.19","6.20","6.21"],market:["","","","","","",""],program:["","","会员日","","","",""],brand:["","","","","","",""],wechat:["","","✅️","","","",""],festival:["","","","","","",""]},
    {dates:["6.22","6.23","6.24","6.25","6.26","6.27","6.28"],market:["","","","","","",""],program:["","9块9特价单品","9块9特价单品+会员日","","","",""],brand:["","","","","","",""],wechat:["","","✅️","","","",""],festival:["","","","","","",""]}
  ]},
  "2026-07":{labels:"6.29-7.31",weeks:[
    {dates:["6.29","6.30","7.1","7.2","7.3","7.4","7.5"],market:["","","","","","",""],program:["","热销风向标","会员日","","","",""],brand:["","","","","","",""],wechat:["","","✅️","","","",""],festival:["","","","","","",""]},
    {dates:["7.6","7.7","7.8","7.9","7.10","7.11","7.12"],market:["","","","","","",""],program:["","","会员日","","","",""],brand:["","","","","","",""],wechat:["","","✅️","","","",""],festival:["","","","","","",""]},
    {dates:["7.13","7.14","7.15","7.16","7.17","7.18","7.19"],market:["","","","","","",""],program:["","热销风向标","会员日","","","",""],brand:["","","","","","",""],wechat:["","","✅️","","","",""],festival:["","","","","","",""]},
    {dates:["7.20","7.21","7.22","7.23","7.24","7.25","7.26"],market:["","","","","","",""],program:["","","会员日","","","",""],brand:["","","","","","",""],wechat:["","","✅️","","","",""],festival:["","","","","","",""]},
    {dates:["7.27","7.28","7.29","7.30","7.31","",""],market:["","","","","","",""],program:["","9块9特价单品","9块9特价单品+会员日","","","",""],brand:["","","","","","",""],wechat:["","","✅️","","","",""],festival:["","","","","","",""]}
  ]}};

const FESTIVAL_DATA={"2026":{"02-03":"立春","02-18":"春节","03-05":"惊蛰","03-20":"春分","04-04":"清明","04-19":"谷雨","05-05":"立夏","05-20":"小满","06-05":"芒种","06-21":"父亲节","07-06":"小暑","07-22":"大暑","08-07":"立秋","08-22":"处暑","09-07":"白露","09-22":"秋分","10-08":"寒露","10-23":"霜降","11-07":"立冬","11-22":"小雪","12-07":"大雪","12-21":"冬至","01-05":"小寒","01-20":"大寒","01-01":"元旦","02-14":"情人节","03-08":"妇女节","04-01":"愚人节","05-01":"劳动节","06-01":"儿童节","07-01":"建党节","08-01":"建军节","09-10":"教师节","10-01":"国庆节","10-31":"万圣节","11-11":"双十一","12-12":"双十二","12-24":"平安夜","12-25":"圣诞节","05-10":"母亲节","02-17":"除夕","02-19":"初二","02-20":"初三","03-04":"元宵节","04-05":"清明节","06-19":"端午节","08-28":"七夕","10-06":"中秋节","10-27":"重阳节"},"2027":{"02-03":"立春","02-18":"雨水","03-05":"惊蛰","03-20":"春分","04-04":"清明","04-19":"谷雨","05-05":"立夏","05-20":"小满","06-05":"芒种","06-21":"夏至","07-06":"小暑","07-22":"大暑","08-07":"立秋","08-22":"处暑","09-07":"白露","09-22":"秋分","10-08":"寒露","10-23":"霜降","11-07":"立冬","11-22":"小雪","12-07":"大雪","12-21":"冬至","01-05":"小寒","01-20":"大寒","01-01":"元旦","02-14":"情人节","03-08":"妇女节","04-01":"愚人节","05-01":"劳动节","06-01":"儿童节","07-01":"建党节","08-01":"建军节","09-10":"教师节","10-01":"国庆节","10-31":"万圣节","11-11":"双十一","12-12":"双十二","12-24":"平安夜","12-25":"圣诞节","05-09":"母亲节","06-20":"父亲节","02-06":"除夕","02-07":"春节","02-21":"元宵节","04-05":"清明节","06-09":"端午节","08-17":"七夕","09-24":"中秋节","10-16":"重阳节"},"2028":{"02-03":"立春","02-18":"雨水","03-05":"惊蛰","03-20":"春分","04-04":"清明节","04-19":"谷雨","05-05":"立夏","05-20":"小满","06-05":"芒种","06-21":"夏至","07-06":"小暑","07-22":"大暑","08-07":"立秋","08-22":"处暑","09-07":"白露","09-22":"秋分","10-08":"寒露","10-23":"霜降","11-07":"立冬","11-22":"小雪","12-07":"大雪","12-21":"冬至","01-05":"小寒","01-20":"大寒","01-01":"元旦","02-14":"情人节","03-08":"妇女节","04-01":"愚人节","05-01":"劳动节","06-01":"儿童节","07-01":"建党节","08-01":"建军节","09-10":"教师节","10-01":"国庆节","10-31":"万圣节","11-11":"双十一","12-12":"双十二","12-24":"平安夜","12-25":"圣诞节","05-14":"母亲节","06-18":"父亲节","01-26":"除夕","01-27":"春节","02-10":"元宵节","05-28":"端午节","08-04":"七夕","09-13":"中秋节","10-05":"重阳节"},"2029":{"02-03":"立春","02-18":"雨水","03-05":"惊蛰","03-20":"春分","04-04":"清明","04-19":"谷雨","05-05":"立夏","05-20":"小满","06-05":"芒种","06-21":"夏至","07-06":"小暑","07-22":"大暑","08-07":"立秋","08-22":"处暑","09-07":"白露","09-22":"秋分","10-08":"寒露","10-23":"霜降","11-07":"立冬","11-22":"小雪","12-07":"大雪","12-21":"冬至","01-05":"小寒","01-20":"大寒","01-01":"元旦","02-14":"春节","03-08":"妇女节","04-01":"愚人节","05-01":"劳动节","06-01":"儿童节","07-01":"建党节","08-01":"建军节","09-10":"教师节","10-01":"国庆节","10-31":"万圣节","11-11":"双十一","12-12":"双十二","12-24":"平安夜","12-25":"圣诞节","05-13":"母亲节","06-17":"端午节","02-13":"除夕","02-28":"元宵节","04-05":"清明节","08-23":"七夕","10-02":"中秋节","10-24":"重阳节"},"2030":{"02-03":"除夕","02-18":"元宵节","03-05":"惊蛰","03-20":"春分","04-04":"清明","04-19":"谷雨","05-05":"立夏","05-20":"小满","06-05":"芒种","06-21":"夏至","07-06":"小暑","07-22":"大暑","08-07":"立秋","08-22":"处暑","09-07":"白露","09-22":"秋分","10-08":"寒露","10-23":"霜降","11-07":"立冬","11-22":"小雪","12-07":"大雪","12-21":"冬至","01-05":"小寒","01-20":"大寒","01-01":"元旦","02-14":"情人节","03-08":"妇女节","04-01":"愚人节","05-01":"劳动节","06-01":"儿童节","07-01":"建党节","08-01":"建军节","09-10":"教师节","10-01":"国庆节","10-31":"万圣节","11-11":"双十一","12-12":"双十二","12-24":"平安夜","12-25":"圣诞节","05-12":"母亲节","06-16":"父亲节","02-04":"春节","04-05":"清明节","06-07":"端午节","08-13":"七夕","09-21":"中秋节","10-13":"重阳节"},"2031":{"02-03":"立春","02-18":"雨水","03-05":"惊蛰","03-20":"春分","04-04":"清明","04-19":"谷雨","05-05":"立夏","05-20":"小满","06-05":"芒种","06-21":"夏至","07-06":"小暑","07-22":"大暑","08-07":"立秋","08-22":"处暑","09-07":"白露","09-22":"秋分","10-08":"寒露","10-23":"霜降","11-07":"立冬","11-22":"小雪","12-07":"大雪","12-21":"冬至","01-05":"小寒","01-20":"大寒","01-01":"元旦","02-14":"情人节","03-08":"妇女节","04-01":"愚人节","05-01":"劳动节","06-01":"儿童节","07-01":"建党节","08-01":"建军节","09-10":"教师节","10-01":"国庆节","10-31":"万圣节","11-11":"双十一","12-12":"双十二","12-24":"平安夜","12-25":"圣诞节","05-11":"母亲节","06-15":"父亲节","01-23":"除夕","01-24":"春节","02-07":"元宵节","04-05":"清明节","05-27":"端午节","08-31":"七夕","10-10":"中秋节","11-01":"重阳节"},"2032":{"02-03":"立春","02-18":"雨水","03-05":"惊蛰","03-20":"春分","04-04":"清明节","04-19":"谷雨","05-05":"立夏","05-20":"小满","06-05":"芒种","06-21":"夏至","07-06":"小暑","07-22":"大暑","08-07":"立秋","08-22":"处暑","09-07":"白露","09-22":"秋分","10-08":"寒露","10-23":"霜降","11-07":"立冬","11-22":"小雪","12-07":"大雪","12-21":"冬至","01-05":"小寒","01-20":"大寒","01-01":"元旦","02-14":"情人节","03-08":"妇女节","04-01":"愚人节","05-01":"劳动节","06-01":"儿童节","07-01":"建党节","08-01":"建军节","09-10":"教师节","10-01":"国庆节","10-31":"万圣节","11-11":"双十一","12-12":"双十二","12-24":"平安夜","12-25":"圣诞节","05-09":"母亲节","06-20":"父亲节","02-11":"除夕","02-12":"春节","02-26":"元宵节","06-04":"端午节","08-19":"七夕","09-29":"中秋节","10-21":"重阳节"},"2033":{"02-03":"立春","02-18":"雨水","03-05":"惊蛰","03-20":"春分","04-04":"清明节","04-19":"谷雨","05-05":"立夏","05-20":"小满","06-05":"芒种","06-21":"夏至","07-06":"小暑","07-22":"大暑","08-07":"立秋","08-22":"处暑","09-07":"白露","09-22":"秋分","10-08":"寒露","10-23":"霜降","11-07":"立冬","11-22":"小雪","12-07":"大雪","12-21":"冬至","01-05":"小寒","01-20":"大寒","01-01":"元旦","02-14":"情人节","03-08":"妇女节","04-01":"愚人节","05-01":"劳动节","06-01":"儿童节","07-01":"建党节","08-01":"建军节","09-10":"教师节","10-01":"国庆节","10-31":"万圣节","11-11":"双十一","12-12":"双十二","12-24":"平安夜","12-25":"圣诞节","05-08":"母亲节","06-19":"父亲节","01-31":"除夕","02-01":"春节","02-15":"元宵节","06-23":"端午节","08-09":"七夕","09-18":"中秋节","10-10":"重阳节"},"2034":{"02-03":"立春","02-18":"雨水","03-05":"元宵节","03-20":"春分","04-04":"清明","04-19":"谷雨","05-05":"立夏","05-20":"小满","06-05":"芒种","06-21":"夏至","07-06":"小暑","07-22":"大暑","08-07":"立秋","08-22":"处暑","09-07":"白露","09-22":"秋分","10-08":"寒露","10-23":"霜降","11-07":"立冬","11-22":"小雪","12-07":"大雪","12-21":"冬至","01-05":"小寒","01-20":"大寒","01-01":"元旦","02-14":"情人节","03-08":"妇女节","04-01":"愚人节","05-01":"劳动节","06-01":"儿童节","07-01":"建党节","08-01":"建军节","09-10":"教师节","10-01":"国庆节","10-31":"万圣节","11-11":"双十一","12-12":"双十二","12-24":"平安夜","12-25":"圣诞节","05-14":"母亲节","06-18":"父亲节","02-19":"除夕","02-20":"春节","04-05":"清明节","06-13":"端午节","08-28":"七夕","10-07":"中秋节","10-29":"重阳节"},"2035":{"02-03":"立春","02-18":"雨水","03-05":"惊蛰","03-20":"春分","04-04":"清明","04-19":"谷雨","05-05":"立夏","05-20":"小满","06-05":"芒种","06-21":"夏至","07-06":"小暑","07-22":"大暑","08-07":"立秋","08-22":"处暑","09-07":"白露","09-22":"秋分","10-08":"寒露","10-23":"霜降","11-07":"立冬","11-22":"小雪","12-07":"大雪","12-21":"冬至","01-05":"小寒","01-20":"大寒","01-01":"元旦","02-14":"情人节","03-08":"妇女节","04-01":"愚人节","05-01":"劳动节","06-01":"儿童节","07-01":"建党节","08-01":"建军节","09-10":"教师节","10-01":"国庆节","10-31":"万圣节","11-11":"双十一","12-12":"双十二","12-24":"平安夜","12-25":"圣诞节","05-13":"母亲节","06-17":"父亲节","02-08":"除夕","02-09":"春节","02-23":"元宵节","04-05":"清明节","06-03":"端午节","08-17":"七夕","09-26":"中秋节","10-18":"重阳节"},"2036":{"02-03":"立春","02-18":"雨水","03-05":"惊蛰","03-20":"春分","04-04":"清明节","04-19":"谷雨","05-05":"立夏","05-20":"小满","06-05":"芒种","06-21":"夏至","07-06":"小暑","07-22":"大暑","08-07":"立秋","08-22":"处暑","09-07":"白露","09-22":"秋分","10-08":"寒露","10-23":"霜降","11-07":"立冬","11-22":"小雪","12-07":"大雪","12-21":"冬至","01-05":"小寒","01-20":"大寒","01-01":"元旦","02-14":"情人节","03-08":"妇女节","04-01":"愚人节","05-01":"劳动节","06-01":"儿童节","07-01":"建党节","08-01":"建军节","09-10":"教师节","10-01":"国庆节","10-31":"万圣节","11-11":"双十一","12-12":"双十二","12-24":"平安夜","12-25":"圣诞节","05-11":"母亲节","06-15":"父亲节","01-28":"除夕","01-29":"春节","02-12":"元宵节","05-22":"端午节","08-05":"七夕","09-14":"中秋节","10-06":"重阳节"}};

// ═══════════════════════════════════════════
// SECTION 3: SCHEDULE + NOTES
// ═══════════════════════════════════════════
function getNotes(){try{return JSON.parse(localStorage.getItem('qg_workspace_notes')||'{}');}catch(e){return{};}}
function saveNotes(n){localStorage.setItem('qg_workspace_notes',JSON.stringify(n));}
var currentNoteDate=null;
function openNoteModal(dk){currentNoteDate=dk;var n=getNotes();document.getElementById('noteModalTitle').textContent='📝 '+dk+' 备注';document.getElementById('noteTextarea').value=n[dk]||'';document.getElementById('btnDeleteNote').style.display=n[dk]?'':'none';document.getElementById('noteModal').classList.add('show');setTimeout(function(){document.getElementById('noteTextarea').focus()},100);}
function closeNoteModal(){document.getElementById('noteModal').classList.remove('show');currentNoteDate=null;}
function saveNote(){var t=document.getElementById('noteTextarea').value.trim();var n=getNotes();if(t){n[currentNoteDate]=t;}else{delete n[currentNoteDate];}saveNotes(n);closeNoteModal();renderSchedule();toast('✅ 已保存');}
function deleteNote(){var n=getNotes();delete n[currentNoteDate];saveNotes(n);closeNoteModal();renderSchedule();toast('已删除');}

function getOverrides(){try{return JSON.parse(localStorage.getItem('qg_schedule_overrides')||'{}');}catch(e){return{};}}
function saveOverrides(o){localStorage.setItem('qg_schedule_overrides',JSON.stringify(o));}
function clearDateOverrides(dk){var o=getOverrides();delete o[dk];saveOverrides(o);closeNoteModal();renderSchedule();toast('已清除自定义内容');}

function getCellValue(week,di,field,fullDate){
  var overrides=getOverrides();
  if(overrides[fullDate]&&overrides[fullDate][field]!==undefined)return overrides[fullDate][field];
  return (week[field]&&week[field][di])?week[field][di]:'';
}


function openCellEditor(dk){
  currentNoteDate=dk;
  var o=getOverrides();var od=o[dk]||{};
  // Find base values from SCHEDULE_DATA
  var baseF='',baseP='',baseM='',baseB='',baseW='';
  var parts=dk.split('-');var m=parts[1],d=parts[2];
  var months=Object.keys(SCHEDULE_DATA);
  for(var i=0;i<months.length;i++){
    var mk=months[i];var wks=SCHEDULE_DATA[mk].weeks;
    for(var j=0;j<wks.length;j++){
      var wk=wks[j];
      for(var k=0;k<wk.dates.length;k++){
        if(wk.dates[k]===m+'.'+d||wk.dates[k]===parseInt(m)+'.'+parseInt(d)){
          baseF=wk.festival&&wk.festival[k]?wk.festival[k]:'';
          baseP=wk.program&&wk.program[k]?wk.program[k]:'';
          baseM=wk.market&&wk.market[k]?wk.market[k]:'';
          baseB=wk.brand&&wk.brand[k]?wk.brand[k]:'';
          baseW=wk.wechat&&wk.wechat[k]?wk.wechat[k]:'';
        }
      }
    }
  }
  document.getElementById('noteModalTitle').textContent='📝 编辑 '+dk;
  document.getElementById('editProgram').value=od.program!==undefined?od.program:baseP;
  document.getElementById('editMarket').value=od.market!==undefined?od.market:baseM;
  document.getElementById('editBrand').value=od.brand!==undefined?od.brand:baseB;
  document.getElementById('editWechat').value=od.wechat!==undefined?od.wechat:baseW;
  document.getElementById('editFestival').value=od.festival!==undefined?od.festival:baseF;
  document.getElementById('editNote').value=od.note||'';
  document.getElementById('btnDeleteNote').style.display=o[dk]?'':'none';
  document.getElementById('noteModal').classList.add('show');
}

function saveScheduleCell(){
  var o=getOverrides();
  if(!o[currentNoteDate])o[currentNoteDate]={};
  o[currentNoteDate].program=document.getElementById('editProgram').value.trim();
  o[currentNoteDate].market=document.getElementById('editMarket').value.trim();
  o[currentNoteDate].brand=document.getElementById('editBrand').value.trim();
  o[currentNoteDate].wechat=document.getElementById('editWechat').value.trim();
  o[currentNoteDate].festival=document.getElementById('editFestival').value.trim();
  o[currentNoteDate].note=document.getElementById('editNote').value.trim();
  saveOverrides(o);closeNoteModal();renderSchedule();toast('✅ 已保存');
}

function exportScheduleToExcel(){
  var year=getScheduleYear();
  var months=year==='2026'?['04','05','06','07','08','09','10','11','12']:['01','02','03','04','05','06','07','08','09','10','11','12'];
  var weekdays=['周一','周二','周三','周四','周五','周六','周日'];
  var html='<html><head><meta charset="UTF-8"><style>table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px;vertical-align:top;width:14.2%;font-size:11px}th{background:#f0f0f0;text-align:center}.day{min-height:60px}.date-num{font-weight:bold;font-size:12px}.entry{font-size:10px;padding:1px 0;border-left:3px solid #ccc;padding-left:4px;margin:1px 0}.e-prog{border-left-color:#e65100}.e-market{border-left-color:#1565c0}.e-brand{border-left-color:#7b1fa2}.e-wechat{border-left-color:#2e7d32}.e-fest{border-left-color:#c62828}.e-note{border-left-color:#f9a825}h2{font-family:sans-serif}.month-title{background:#2d8a4e;color:#fff;text-align:center;font-size:14px;padding:8px}</style></head><body>';
  
  months.forEach(function(monthKey){
    var data=getScheduleData(year,monthKey);
    if(!data)return;
    html+='<h2>'+year+'年'+parseInt(monthKey)+'月</h2>';
    html+='<table><tr>';
    weekdays.forEach(function(d){html+='<th>'+d+'</th>';});
    html+='</tr>';
    
    data.weeks.forEach(function(week){
      html+='<tr>';
      week.dates.forEach(function(date,di){
        if(!date){html+='<td></td>';return;}
        var parts=date.split('.');var m=parts[0],d=parts[1];
        var fullDate=year+'-'+m.padStart(2,'0')+'-'+d.padStart(2,'0');
        html+='<td><div class="date-num">'+parseInt(m)+'/'+parseInt(d)+'</div>';
        var fest=getCellValue(week,di,'festival',fullDate);
        var prog=getCellValue(week,di,'program',fullDate);
        var mark=getCellValue(week,di,'market',fullDate);
        var bran=getCellValue(week,di,'brand',fullDate);
        var wech=getCellValue(week,di,'wechat',fullDate);
        var note=getCellValue(week,di,'note',fullDate);
        if(fest)html+='<div class="entry e-fest">🎋 '+fest+'</div>';
        if(prog)html+='<div class="entry e-prog">'+prog+'</div>';
        if(mark)html+='<div class="entry e-market">'+mark+'</div>';
        if(bran)html+='<div class="entry e-brand">'+bran+'</div>';
        if(wech)html+='<div class="entry e-wechat">'+wech+'</div>';
        if(note)html+='<div class="entry e-note">📌 '+note+'</div>';
        html+='</td>';
      });
      html+='</tr>';
    });
    html+='</table><br>';
  });
  
  html+='</body></html>';
  var blob=new Blob([html],{type:'text/html;charset=utf-8'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='社群排期表_'+new Date().toISOString().slice(0,10)+'.xls';
  a.click();toast('📥 已导出（Excel可打开）');
}

var currentScheduleYear = '2026';
function getScheduleYear(){ return document.getElementById('scheduleYearSelect')?document.getElementById('scheduleYearSelect').value:'2026'; }

function generateMonthDates(year, month){
  // month is 0-indexed (0=Jan)
  var weeks=[];var d=new Date(year,month,1);
  var startDay=d.getDay();// 0=Sun
  // Adjust to Mon=0
  var mondayOffset=startDay===0?6:startDay-1;
  d.setDate(d.getDate()-mondayOffset);
  var lastDay=new Date(year,month+1,0).getDate();
  var currentWeek=[];
  for(var i=0;i<42;i++){
    var curM=d.getMonth(),curD=d.getDate(),curY=d.getFullYear();
    if(curM===month&&curY===year){
      currentWeek.push(String(month+1)+'.'+String(curD));
    }else{
      currentWeek.push('');
    }
    if(currentWeek.length===7){weeks.push(currentWeek.slice());currentWeek=[];}
    d.setDate(d.getDate()+1);
  }
  // Remove trailing empty weeks
  while(weeks.length>0){
    var last=weeks[weeks.length-1];
    if(last.every(function(x){return x==='';}))weeks.pop();else break;
  }
  return weeks;
}

function getScheduleData(year, monthKey){
  var fullKey = year + '-' + monthKey;
  if(year==='2026'&&SCHEDULE_DATA[fullKey]){
    return {weeks:SCHEDULE_DATA[fullKey].weeks};
  }
  // Auto-generate
  var m=parseInt(monthKey)-1;
  var dates=generateMonthDates(parseInt(year),m);
  return {weeks:dates.map(function(wk){return {dates:wk};})};
}

function renderSchedule(){
  var thisYear=new Date().getFullYear();
  var sel=document.getElementById('scheduleYearSelect');
  sel.innerHTML='';
  for(var y=2026;y<=thisYear+10;y++){
    var opt=document.createElement('option');opt.value=y;opt.textContent=y+'年';
    if(y===thisYear)opt.selected=true;
    sel.appendChild(opt);
  }
  var year=sel.value;currentScheduleYear=year;
  var months=year==='2026'?['04','05','06','07','08','09','10','11','12']:['01','02','03','04','05','06','07','08','09','10','11','12'];
  var navHtml='';
  months.forEach(function(m){
    var nowMonth=String(new Date().getMonth()+1).padStart(2,'0');
    var isActive=(year==='2026'&&m===nowMonth)||(year==='2027'&&m==='01');
    navHtml+='<button class="btn '+(isActive?'btn-primary':'btn-ghost')+'" onclick="renderMonth(\''+m+'\')" style="font-size:12px;padding:6px 14px">'+parseInt(m)+'月</button>';
  });
  document.getElementById('scheduleMonthNav').innerHTML=navHtml;
  var nowMonth=String(new Date().getMonth()+1).padStart(2,'0');
  renderMonth(year==='2026'?nowMonth:'01');
}

function renderMonth(monthKey){
  var year=getScheduleYear();
  var data=getScheduleData(year,monthKey);
  if(!data)return;
  document.querySelectorAll('#scheduleMonthNav .btn').forEach(function(b){b.classList.remove('btn-primary','btn-ghost');if(b.textContent===parseInt(monthKey)+'月'){b.classList.add('btn-primary');b.classList.remove('btn-ghost');}});
  var weekdays=['一','二','三','四','五','六','日'];
  var html='<div class="schedule-grid" style="margin-bottom:4px;font-weight:700;font-size:12px;color:var(--text-dim);text-align:center">';
  weekdays.forEach(function(d,i){html+='<div style="padding:6px 0;'+(i>=5?'color:var(--red)':'')+'">周'+d+'</div>';});
  html+='</div>';
  data.weeks.forEach(function(week){
    html+='<div class="schedule-grid" style="margin-bottom:6px">';
    week.dates.forEach(function(date,di){
      if(!date){html+='<div style="background:#fafafa;border-radius:var(--radius-sm);min-height:100px"></div>';return;}
      var parts=date.split('.');var m=parts[0],d=parts[1];
      var fullDate=year+'-'+m.padStart(2,'0')+'-'+d.padStart(2,'0');
      var isWeekend=di>=5;
      var entries='';
      var fest=getCellValue(week,di,'festival',fullDate);
      if(!fest&&FESTIVAL_DATA[year]&&FESTIVAL_DATA[year][m.padStart(2,'0')+'-'+d.padStart(2,'0')])fest=FESTIVAL_DATA[year][m.padStart(2,'0')+'-'+d.padStart(2,'0')];
      var prog=getCellValue(week,di,'program',fullDate);
      var mark=getCellValue(week,di,'market',fullDate);
      var bran=getCellValue(week,di,'brand',fullDate);
      var wech=getCellValue(week,di,'wechat',fullDate);
      var note=getCellValue(week,di,'note',fullDate);
      if(fest)entries+='<div class="entry entry-bar-festival">🎋 '+fest+'</div>';
      if(prog)entries+='<div class="entry entry-bar-program">'+prog+'</div>';
      if(mark)entries+='<div class="entry entry-bar-market">'+mark+'</div>';
      if(bran)entries+='<div class="entry entry-bar-brand">'+bran+'</div>';
      if(wech)entries+='<div class="entry entry-bar-wechat">'+wech+'</div>';
      if(note)entries+='<div class="entry entry-bar-note">📌 '+note+'</div>';
      if(!entries)entries='<div style="font-size:10px;color:var(--text-muted);padding:4px 0">点击编辑</div>';
      html+='<div class="schedule-day'+(isWeekend?' weekend':'')+'" onclick="openCellEditor(\''+fullDate+'\')" title="点击编辑"><div class="day-num">'+m+'/'+d+'</div>'+entries+'</div>';
    });
    html+='</div>';
  });
  document.getElementById('scheduleContent').innerHTML=html;
}




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
function renderSentimentItems(data){var allItems=data.today_items||[];var items;if(sentimentFilter==='pos')items=allItems.filter(function(i){return i.sentiment==='pos'});else if(sentimentFilter==='neg')items=allItems.filter(function(i){return i.sentiment==='neg'});else items=allItems;document.getElementById('sentimentItemCount').textContent=items.length;document.getElementById('sentimentItemTime').textContent=data.generated;var list=document.getElementById('sentimentItemsList');if(items.length===0){list.innerHTML='<div style="text-align:center;padding:20px;color:var(--text-dim)">暂无明细数据</div>';return;}var emoji={pos:'😊',neg:'🔴',neu:'➖'};var html='';items.forEach(function(item){var s=item.sentiment||'';html+='<div style="padding:6px 0;border-bottom:1px solid var(--border);display:flex;gap:8px;align-items:flex-start"><span style="font-size:16px;flex-shrink:0">'+(emoji[s]||'📌')+'</span><div style="flex:1;min-width:0"><div style="font-weight:600;color:var(--text)">'+item.title+'</div><div style="font-size:11px;color:var(--text-dim)">'+item.platform+' · '+item.author+' · '+(item.category||'')+'</div></div>'+(item.url?'<a href="'+item.url+'" target="_blank" style="font-size:11px;color:var(--brand);flex-shrink:0;text-decoration:none">原帖 ↗</a>':'')+'<span onclick="quickStar(this)" data-date="'+item.date+'" data-title="'+item.title.replace(/"/g,'&quot;')+'" data-platform="'+item.platform+'" data-author="'+(item.author||'')+'" data-url="'+(item.url||'')+'" class="star-btn'+(isStarred(item.date,item.title)?' active':'')+'" title="收藏/取消">⭐</span></div>';});list.innerHTML=html;}
function renderSentimentNegList(data){var items=data.negative_items;items.sort(function(a,b){return b.date.localeCompare(a.date)});var list=document.getElementById('sentimentNegList');if(items.length===0){list.innerHTML='<div style="text-align:center;padding:40px;color:var(--text-dim)">✅ 近7天无负面舆情</div>';return;}var html='';items.slice(0,15).forEach(function(item){html+='<div style="padding:8px 0;border-bottom:1px solid var(--border)"><div style="font-weight:600;color:var(--text);margin-bottom:2px">['+item.platform+'] '+item.title+'</div><div style="font-size:11px;color:var(--text-dim)">'+item.date+' · '+(item.category||'')+(item.url?' · <a href="'+item.url+'" target="_blank" style="color:var(--brand);text-decoration:none">原帖 ↗</a>':'')+'</div></div>';});list.innerHTML=html;}
function updateOverviewSentiment(data){var cards=document.querySelectorAll('#page-overview .kpi');if(cards.length>=1){var c1=cards[0];c1.querySelector('.kpi-value').innerHTML=data.today.total+'<span class="kpi-change flat">条</span>';c1.querySelector('.kpi-sub').textContent=data.latest_date+' · 正面'+data.today.pos+' · 负面'+data.today.neg;}}
function updateSentimentBadge(data){var b=document.getElementById('sentimentBadge');if(data.today.neg>0){b.textContent=data.today.neg;b.classList.add('show');}else if(data.last_7d.neg>0){b.textContent='!';b.classList.add('show');}}

// ═══════ STAR ═══════
// ═══════ COPY CONFIG ═══════
var CopyConfig = {
  priceMode: 'unified',
  delivery: 'free30',
  deliveryCustomVal: '',
  linkMeituan: true,
  linkEleme: true,
  linkMini: true,
  direction: 'auto'
};

function loadCopyConfig(){
  try{
    var saved = JSON.parse(localStorage.getItem('qg_copy_config')||'{}');
    for(var k in saved){ if(CopyConfig.hasOwnProperty(k)) CopyConfig[k] = saved[k]; }
  }catch(e){}
  applyCopyConfig();
}

function saveCopyConfig(){
  localStorage.setItem('qg_copy_config', JSON.stringify(CopyConfig));
}

function setCopyConfig(key, val){
  CopyConfig[key] = val;
  saveCopyConfig();
  applyCopyConfig();
}

function applyCopyConfig(){
  // Price mode
  document.getElementById('priceUnified').className = 'btn '+(CopyConfig.priceMode==='unified'?'btn-primary':'btn-ghost');
  document.getElementById('priceRegional').className = 'btn '+(CopyConfig.priceMode==='regional'?'btn-primary':'btn-ghost');
  // Delivery
  document.getElementById('delivery30').className = 'btn '+(CopyConfig.delivery==='free30'?'btn-primary':'btn-ghost');
  document.getElementById('deliveryCustom').className = 'btn '+(CopyConfig.delivery==='custom'?'btn-primary':'btn-ghost');
  document.getElementById('deliveryCustomVal').style.display = CopyConfig.delivery==='custom'?'':'none';
  document.getElementById('deliveryCustomVal').value = CopyConfig.deliveryCustomVal||'';
  // Links
  if(CopyConfig.linkMini!==undefined){
    document.querySelector('#copyLinks label:nth-child(1) input').checked = CopyConfig.linkMeituan;
    document.querySelector('#copyLinks label:nth-child(2) input').checked = CopyConfig.linkEleme;
    document.querySelector('#copyLinks label:nth-child(3) input').checked = CopyConfig.linkMini;
  }
  // Direction
  document.getElementById('copyDirection').value = CopyConfig.direction;
}

// Day detection
function initCopyDay(){
  var now = new Date();
  var day = now.getDay(); // 0=Sun
  var label = '';
  if(day===2){ label = '周二 · 生活关怀'; document.getElementById('linkMiniapp').style.display=''; }
  else if(day===3){ label = '周三 · 会员日88折'; document.getElementById('linkMiniapp').style.display=''; }
  else if(day===4){ label = '周四 · 特价'; document.getElementById('linkMiniapp').style.display='none'; CopyConfig.linkMini=false; }
  else if(day===5){ label = '周五 · 周末场景'; document.getElementById('linkMiniapp').style.display=''; }
  else if(day===6){ label = '周六 · 轮换种草'; document.getElementById('linkMiniapp').style.display=''; }
  else { label = '今天无推送'; }
  document.getElementById('copyDayLabel').textContent = label;
  
  // Weather + solar term
  var festToday = '';
  var todayKey = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
  try{
    var yearFests = FESTIVAL_DATA ? (FESTIVAL_DATA[String(now.getFullYear())]||{}) : {};
    var mmdd = String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
    if(yearFests[mmdd]) festToday = ' 🎋 '+yearFests[mmdd];
  }catch(e){}
  document.getElementById('copyWeather').innerHTML = '📅 '+now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日'+festToday;
}

// Hotspot bar
function loadCopyHotspots(){
  var el = document.getElementById('copyHotspotBar');
  fetch('hotspot.json?v='+Date.now()).then(function(r){return r.json()}).then(function(d){
    var items = (d.items||[]).slice(0,5);
    if(items.length===0){ el.innerHTML='<span style="color:var(--text-dim)">暂无热点数据</span>'; return; }
    var html = '';
    items.forEach(function(item){
      html += '<span style="background:var(--brand-light);color:var(--brand);padding:3px 8px;border-radius:12px;cursor:pointer;white-space:nowrap" title="'+item.word+'">'+(item.category||'')+' '+item.word.substring(0,15)+'</span>';
    });
    el.innerHTML = html;
  }).catch(function(){ el.innerHTML='<span style="color:var(--text-dim)">热点加载中...</span>'; });
}

// Generate placeholder
function generateCopy(){
  var dir = document.getElementById('copyDirection').value;
  var dirName = document.getElementById('copyDirection').selectedOptions[0].text;
  document.getElementById('copyV1').innerHTML = '版本一 · ' + dirName + '<br><br><span style="color:var(--text-dim)">生成中...</span>';
  document.getElementById('copyV2').innerHTML = '版本二 · ' + dirName + '<br><br><span style="color:var(--text-dim)">生成中...</span>';
  document.getElementById('copyV3').innerHTML = '版本三 · ' + dirName + '<br><br><span style="color:var(--text-dim)">生成中...</span>';
  toast('🚀 文案生成功能建设中...');
}


function refreshHotspot(){
  var el = document.getElementById('hotspotContent');
  el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-dim)">🔄 刷新中...</div>';
  var btn = document.getElementById('hotspotRefreshBtn');
  if(btn){ btn.textContent = '⏳'; btn.disabled = true; }
  setTimeout(function(){
    renderHotspot();
    if(btn){ btn.textContent = '🔄 刷新'; btn.disabled = false; }
  }, 500);
}

// ═══════ PRODUCT LIBRARY ═══════
var productData = null;
function loadProducts(){
  var el = document.getElementById('productsGrid');
  fetch('product_library.json?v='+Date.now()).then(function(r){return r.json()}).then(function(d){
    productData = d;
    document.getElementById('productMeta').textContent = d.total_products+'个SKU · 来源: '+d.source; document.getElementById('productUpdateTime').textContent = '最近更新: '+d.updated.substring(0,16);
    // Build category filter
    var sel = document.getElementById('productCat');
    sel.innerHTML = '<option value="all">全部分类</option>';
    (d.categories||[]).forEach(function(c){
      sel.innerHTML += '<option value="'+c+'">'+c+'</option>';
    });
    renderProducts();
  }).catch(function(){ el.innerHTML='<div style="text-align:center;padding:60px;color:var(--text-dim)"><div style="font-size:40px;margin-bottom:12px">📦</div>产品库建设中<br><span style="font-size:12px">将订单表放入「产品表」文件夹后自动生成</span></div>'; document.getElementById('productUpdateTime').textContent=''; });
}
function renderProducts(){
  if(!productData) return;
  var search = (document.getElementById('productSearch').value||'').toLowerCase();
  var cat = document.getElementById('productCat').value;
  var items = productData.items.filter(function(p){
    if(search && !p.name.toLowerCase().includes(search)) return false;
    if(cat !== 'all' && p.category !== cat) return false;
    return true;
  });
  var maxSales = items.length > 0 ? items[0].sales : 1;
  var html = '';
  items.slice(0,80).forEach(function(p, i){
    var w = Math.round(p.sales / maxSales * 100);
    var rank = i + 1;
    var medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
    html += '<div style="display:grid;grid-template-columns:40px 1fr 100px 80px 100px;gap:0;padding:8px;border-bottom:1px solid var(--border);align-items:center;'+(rank<=3?'background:var(--brand-light)':'')+'" title="'+p.name+' · '+p.spec+'">'+
      '<div style="text-align:center;font-weight:700;color:'+(rank<=3?'var(--brand)':'var(--text-dim)')+'">'+medal+'</div>'+
      '<div><div style="font-weight:600;color:var(--text)">'+p.name+'</div>'+
        '<div style="font-size:11px;color:var(--text-dim)">'+p.spec+'</div>'+
        '<div style="height:3px;background:var(--border);border-radius:2px;margin-top:3px"><div style="height:3px;width:'+w+'%;background:'+(rank<=3?'var(--brand)':'#c8e6c9')+';border-radius:2px;min-width:2px"></div></div>'+
      '</div>'+
      '<div style="font-size:11px;color:var(--text-dim)">'+p.category+'</div>'+
      '<div style="text-align:right;font-weight:700;color:var(--text)">¥'+p.price+'</div>'+
      '<div style="text-align:right"><span style="font-weight:700;color:var(--text)">'+p.sales+'</span><span style="font-size:10px;color:var(--text-dim)">份</span></div>'+
      '</div>';
  });
  document.getElementById('productsGrid').innerHTML += html || '<div style="text-align:center;padding:40px;color:var(--text-dim)">无匹配产品</div>';
}
function copyHotspot(el){
  var word=el.dataset.word;
  navigator.clipboard.writeText(word).then(function(){toast('📋 已复制: '+word);}).catch(function(){});
}
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




