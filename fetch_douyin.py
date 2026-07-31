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
    
    cat_keywords = [
        ('🍉果切相关', ['果切','水果','西瓜','榴莲','芒果','凤梨','哈密瓜','葡萄','草莓','荔枝','车厘子','蜜桃','蜜瓜','甜品','零食','解暑','冰镇','冰淇淋','果汁','冰粉','椰','刨冰']),
        ('🎬娱乐', ['明星','演员','歌手','电影','电视剧','综艺','演唱会','官宣','恋情','回','肖战','王','赵','刘','张','杨','周','综艺','真人秀','八卦','演唱','新歌','专辑']),
        ('🍜美食', ['美食','小吃','火锅','烧烤','面','饭','菜','汤','饼','串','螺','粉','鸡','牛','猪肉','食材','餐厅','探店','网红店','外卖']),
        ('🏠生活', ['健康','睡眠','养生','运动','健身','减肥','天气','高温','台风','暴雨','地震','开学','放假','高考','考研','加班','辞职','工资','房子','房租','装修','旅游','出行','机票','酒店']),
        ('🏷️品牌', ['华为','苹果','特斯拉','小米','比亚迪','特斯拉','淘宝','京东','拼多多','抖音','快手','微信','支付宝','美团','饿了么','瑞幸','星巴克','海底捞','奈雪','喜茶','蜜雪冰城']),
        ('🎉节日', ['七夕','中秋','国庆','元旦','春节','端午','清明','劳动节','圣诞','情人节','双十一','618','双十二']),
        ('📌综合', []),  # 兜底
    ]
    
    def categorize(word):
        for cat, keywords in cat_keywords:
            if not keywords:
                continue
            for kw in keywords:
                if kw in word:
                    return cat
        return '📌综合'
    
    for item in word_list:
        word = item.get('word', '') or item.get('title', '')
        if not word:
            continue
        hot_value = item.get('hot_value', 0) or item.get('video_count', 0)
        items.append({
            'word': word,
            'source': f'抖音{category_name}',
            'url': item.get('share_url', '') or f'https://www.douyin.com/search/{word}',
            'category': categorize(word)
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
