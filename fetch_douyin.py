#!/usr/bin/env python3
"""抓取抖音热榜（热点榜+种草榜+挑战榜），保存到 hotspot.json"""
import json, urllib.request, os, re
from pathlib import Path

WORKSPACE = Path.home() / "Desktop" / "切果NOW工作台"
HOTSPOT_FILE = WORKSPACE / "hotspot.json"

# Douyin hot list API
DOUYIN_API = "https://www.douyin.com/aweme/v1/web/hot/search/list/?detail_list=1&source=0"

def fetch_douyin():
    """抓取抖音热榜"""
    req = urllib.request.Request(DOUYIN_API, headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://www.douyin.com/',
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        return data
    except Exception as e:
        print(f"❌ 抖音API请求失败: {e}")
        return None

def parse_hotlist(data, category_name):
    """解析热榜数据"""
    items = []
    # Try known structures
    word_list = data.get('data', {}).get('word_list', [])
    if not word_list:
        # Try alternative: trending list
        trending = data.get('data', {}).get('trending_list', [])
        word_list = trending
    
    for item in word_list:
        word = item.get('word', '') or item.get('title', '')
        if not word:
            continue
        hot_value = item.get('hot_value', 0) or item.get('video_count', 0)
        items.append({
            'word': word,
            'source': f'抖音{category_name}',
            'url': item.get('share_url', '') or f'https://www.douyin.com/search/{word}',
            'category': category_name
        })
    return items

def main():
    print("📡 抓取抖音热榜...")
    
    existing = {'items': [], 'date': ''}
    if HOTSPOT_FILE.exists():
        with open(HOTSPOT_FILE) as f:
            existing = json.load(f)
    
    data = fetch_douyin()
    if not data:
        print("❌ 抓取失败，保持现有数据")
        return
    
    # Parse different hot lists
    douyin_items = parse_hotlist(data, '热榜')
    
    if not douyin_items:
        print("⚠️ 未解析到数据，查看返回结构...")
        print(f"  keys: {list(data.keys())[:10]}")
        if 'data' in data:
            print(f"  data keys: {list(data['data'].keys())[:10]}")
        return
    
    # Keep existing Baidu/Weibo items, replace only Douyin
    other_items = [i for i in existing.get('items', []) if '抖音' not in i.get('source', '')]
    
    from datetime import datetime
    existing['date'] = datetime.now().strftime('%Y-%m-%d %H:%M')
    existing['items'] = douyin_items + other_items
    
    with open(HOTSPOT_FILE, 'w') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 已保存 {len(existing['items'])} 条热点 ({len(douyin_items)} 条抖音)")

if __name__ == '__main__':
    main()
