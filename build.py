#!/usr/bin/env python3
"""
切果NOW 工作台 - 一键构建脚本
双击或 python3 build.py 运行，生成完整的 index.html
"""
import json, os

BASE = os.path.dirname(os.path.abspath(__file__))

# ============ CSS ============
CSS = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>切果NOW · 运营工作台</title>
<script src="https://cdn.bootcdn.net/ajax/libs/Chart.js/4.4.0/chart.umd.min.js"></script>
<style>
:root{--brand:#2d8a4e;--brand-light:#e8f5e9;--brand-dark:#1b5e2f;--yellow:#f9a825;--yellow-light:#fff8e1;--bg:#f5f7f5;--sidebar-bg:#ffffff;--card:#ffffff;--text:#263238;--text-dim:#6b7c7c;--text-muted:#9eacac;--border:#e8ece8;--shadow:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);--shadow-lg:0 4px 12px rgba(0,0,0,.08);--radius:12px;--radius-sm:8px;--sidebar-width:220px;--header-height:56px;--red:#e53935;--red-light:#ffebee;--amber:#ff8f00;--blue:#1976d2;--teal:#00897b}
*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans SC',sans-serif;background:var(--bg);color:var(--text);display:flex;min-height:100vh;overflow-x:hidden}
.sidebar{width:var(--sidebar-width);min-width:var(--sidebar-width);background:var(--sidebar-bg);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;overflow-y:auto;padding:16px 0}
.sidebar-brand{padding:8px 20px 20px;display:flex;align-items:center;gap:8px}
.sidebar-brand .logo{width:32px;height:32px;background:var(--brand);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:14px}
.sidebar-brand .name{font-weight:700;font-size:16px;color:var(--brand-dark)}.sidebar-brand .name span{color:var(--brand)}
.nav-section{padding:8px 12px;font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 16px;margin:2px 8px;border-radius:var(--radius-sm);cursor:pointer;font-size:13px;font-weight:500;color:var(--text-dim);transition:all .15s;text-decoration:none;position:relative}
.nav-item:hover{background:var(--brand-light);color:var(--brand-dark)}.nav-item.active{background:var(--brand);color:#fff;font-weight:600}
.nav-item.nav-sub{font-size:12px}.nav-item.nav-sub .icon{font-size:14px}
.nav-item .icon{font-size:16px;width:20px;text-align:center;flex-shrink:0}
.nav-item .badge{margin-left:auto;font-size:10px;background:var(--red);color:#fff;border-radius:10px;padding:1px 7px;font-weight:600;display:none}
.nav-item .badge.show{display:inline-block}
.main{flex:1;margin-left:var(--sidebar-width);min-width:0}
.header{height:var(--header-height);background:#fff;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:50}
.header h2{font-size:18px;font-weight:700}.header-actions{display:flex;gap:12px;align-items:center}
.header-actions .date{font-size:13px;color:var(--text-dim)}
.content{padding:20px 24px;max-width:1440px}.page{display:none}.page.active{display:block}
.card{background:var(--card);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow);border:1px solid var(--border);margin-bottom:16px}
.card-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.card-title{font-size:15px;font-weight:700}.card-sub{font-size:12px;color:var(--text-dim)}
.kpi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:20px}
.kpi{background:#fff;border-radius:var(--radius);padding:16px;box-shadow:var(--shadow);border:1px solid var(--border);border-left:4px solid var(--brand)}.kpi:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg)}
.kpi .kpi-label{font-size:11px;color:var(--text-dim);margin-bottom:4px;text-transform:uppercase}.kpi .kpi-value{font-size:26px;font-weight:700;line-height:1.1}
.kpi .kpi-sub{font-size:11px;color:var(--text-dim);margin-top:4px}.kpi .kpi-change{font-size:12px;font-weight:600;margin-left:4px}
.kpi .kpi-change.up{color:#2e7d32}.kpi .kpi-change.down{color:var(--red)}.kpi .kpi-change.flat{color:var(--amber)}
.kpi.accent-green{border-left-color:var(--brand)}.kpi.accent-yellow{border-left-color:var(--yellow)}.kpi.accent-red{border-left-color:var(--red)}.kpi.accent-blue{border-left-color:var(--blue)}.kpi.accent-teal{border-left-color:var(--teal)}.kpi.accent-amber{border-left-color:var(--amber)}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.star-btn{cursor:pointer;font-size:14px;opacity:.3;transition:opacity .15s;flex-shrink:0;margin-left:4px}.star-btn.active{opacity:1}
.schedule-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.schedule-day{background:#fff;border-radius:var(--radius-sm);padding:6px;min-height:100px;border:1px solid var(--border);position:relative;cursor:pointer;transition:all .15s;font-size:11px;overflow:hidden}
.schedule-day:hover{border-color:var(--brand);box-shadow:var(--shadow-lg)}.schedule-day.weekend{background:#fafafa}
.schedule-day .day-num{font-size:13px;font-weight:700;color:var(--text-dim);margin-bottom:3px;line-height:1}
.schedule-day .entry{font-size:10px;padding:1px 2px 1px 6px;margin-bottom:1px;border-radius:2px;border-left:3px solid #ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.5}
.entry-bar-program{border-left-color:#e65100;background:#fff3e0}.entry-bar-market{border-left-color:#1565c0;background:#e3f2fd}.entry-bar-brand{border-left-color:#7b1fa2;background:#f3e5f5}.entry-bar-wechat{border-left-color:#2e7d32;background:#e8f5e9}.entry-bar-festival{border-left-color:#c62828;background:#fce4ec}.entry-bar-note{border-left-color:#f9a825;background:#fff9c4}
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:200;justify-content:center;align-items:center}.modal-overlay.show{display:flex}
.modal{background:#fff;border-radius:var(--radius);padding:24px;max-width:480px;width:90%;box-shadow:var(--shadow-lg)}
.modal h3{font-size:16px;margin-bottom:12px;color:var(--brand-dark)}
.modal textarea{width:100%;min-height:80px;border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px;font-size:13px;font-family:inherit;resize:vertical}.modal textarea:focus{outline:none;border-color:var(--brand)}
.modal .btn-row{display:flex;gap:8px;justify-content:flex-end;margin-top:12px}
.btn{padding:8px 18px;border-radius:var(--radius-sm);border:none;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s}.btn-primary{background:var(--brand);color:#fff}.btn-primary:hover{background:var(--brand-dark)}.btn-ghost{background:transparent;color:var(--text-dim)}.btn-ghost:hover{background:var(--bg)}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--text);color:#fff;padding:10px 24px;border-radius:20px;font-size:13px;z-index:300;animation:toastIn .3s ease;pointer-events:none}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}}
.empty-state{text-align:center;padding:60px 20px;color:var(--text-dim)}.empty-state .icon{font-size:48px;margin-bottom:12px}
@media(max-width:1024px){.grid2,.grid3{grid-template-columns:1fr}.sidebar{width:60px;min-width:60px;padding:12px 0}.sidebar .nav-item{padding:10px 14px;justify-content:center}.sidebar .nav-item span:not(.icon){display:none}.sidebar .nav-section{display:none}.sidebar-brand{padding:8px 12px 16px;justify-content:center}.sidebar-brand .name{display:none}.main{margin-left:60px}}
</style>
</head>
<body>
'''

# ============ SIDEBAR ============
SIDEBAR = '''<aside class="sidebar">
  <div class="sidebar-brand"><div class="logo">🍉</div><div class="name">切果<span>NOW</span></div></div>
  <div class="nav-section">核心</div>
  <div class="nav-item active" data-page="overview"><span class="icon">🏠</span><span>总览</span></div>
  <div class="nav-section">监控</div>
  <div class="nav-item" data-page="sentiment"><span class="icon">🛡️</span><span>舆情监控</span><span class="badge" id="sentimentBadge">3</span></div>
  <div class="nav-item nav-sub" data-page="star"><span class="icon">⭐</span><span>精选正面</span></div>
  <div class="nav-section">运营</div>
  <div class="nav-item" data-page="community"><span class="icon">📅</span><span>社群运营</span></div>
  <div class="nav-item" data-page="communitydata"><span class="icon">👥</span><span>社群数据</span></div>
  <div class="nav-item" data-page="acquisition"><span class="icon">🔗</span><span>社群引流</span></div>
  <div class="nav-item" data-page="activities"><span class="icon">🎯</span><span>小程序活动</span></div>
  <div class="nav-section">创作</div>
  <div class="nav-item" data-page="products"><span class="icon">📦</span><span>产品库</span></div>
  <div class="nav-item" data-page="hotspot"><span class="icon">📡</span><span>热点捕捉</span></div>
  <div class="nav-item" data-page="copy"><span class="icon">✍️</span><span>文案创作</span></div>
  <div class="nav-item" data-page="prompt"><span class="icon">🎨</span><span>配图Prompt</span></div>
  <div class="nav-item" data-page="inspiration"><span class="icon">📚</span><span>素材灵感库</span></div>
  <div class="nav-item" data-page="ailearn"><span class="icon">💡</span><span>AI前沿案例</span></div>
  <div class="nav-item" data-page="portfolio"><span class="icon">🖼️</span><span>作品集</span></div>
</aside>
<div class="main"><header class="header"><h2 id="pageTitle">🏠 总览</h2><div class="header-actions"><span class="date" id="currentDate"></span><div class="user">U</div></div></header><div class="content">
'''

print("HTML chunk 1 written")
# Continue in next steps...
