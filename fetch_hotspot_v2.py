#!/usr/bin/env python3
"""小H 热搜抓取 v2 —— 百度 + 微博 + 抖音三平台实时热搜
功能：
  1. 抓取百度热搜榜（top.baidu.com API）
  2. 抓取微博热搜榜（weibo.com/ajax/side/hotSearch）
  3. 抓取抖音热榜（douyin.com/aweme/v1/web/hot/search/list）
  4. 合并去重（模糊匹配）
  5. 关键词分类（果切相关优先，窄而准）
  6. 数据保护：去重后少于 10 条不写入
  7. 写入 hotspot.json 并自动 git push
"""
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

import requests

WORKSPACE = Path.home() / "Desktop" / "切果NOW工作台"
HOTSPOT_FILE = WORKSPACE / "hotspot.json"

# 数据保护阈值：去重后条目少于该值，不写入文件
MIN_ITEMS = 10

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
}

BAIDU_API = "https://top.baidu.com/api/board?platform=wise&tab=realtime"
WEIBO_API = "https://weibo.com/ajax/side/hotSearch"
DOUYIN_API = "https://www.douyin.com/aweme/v1/web/hot/search/list/?detail_list=1&source=0"


# ── 抓取 ──────────────────────────────────────────────────
def fetch_baidu():
    """抓取百度热搜榜，返回 [{"word", "url"}, ...]"""
    try:
        r = requests.get(BAIDU_API, headers={**HEADERS, "Referer": "https://top.baidu.com/"},
                         timeout=15)
        r.raise_for_status()
        d = r.json()
    except Exception as e:
        print(f"❌ 百度抓取失败: {e}")
        return []

    cards = d.get("data", {}).get("cards", [])
    items = []

    def collect(obj):
        if isinstance(obj, dict):
            if obj.get("word") and obj.get("url"):
                items.append({"word": obj["word"].strip(), "url": obj["url"]})
            for v in obj.values():
                collect(v)
        elif isinstance(obj, list):
            for v in obj:
                collect(v)

    collect(cards)
    # 按出现顺序去重
    seen = set()
    uniq = []
    for it in items:
        if it["word"] and it["word"] not in seen:
            seen.add(it["word"])
            uniq.append(it)
    return uniq


def fetch_weibo():
    """抓取微博热搜榜，返回 [{"word", "num"}, ...]"""
    try:
        r = requests.get(WEIBO_API, headers={**HEADERS, "Referer": "https://weibo.com/"},
                         timeout=15)
        r.raise_for_status()
        d = r.json()
    except Exception as e:
        print(f"❌ 微博抓取失败: {e}")
        return []

    realtime = d.get("data", {}).get("realtime", [])
    items = []
    for it in realtime:
        word = (it.get("word") or "").strip()
        if word:
            items.append({"word": word, "num": it.get("num", 0)})
    return items


def fetch_douyin():
    """抓取抖音热榜（热点榜 word_list），返回 [{"word"}, ...]。
    该接口为公开热榜 API，无需登录 cookie 即可返回完整榜单。"""
    try:
        r = requests.get(DOUYIN_API, headers={**HEADERS, "Referer": "https://www.douyin.com/"},
                         timeout=15)
        r.raise_for_status()
        d = r.json()
    except Exception as e:
        print(f"❌ 抖音抓取失败: {e}")
        return []

    word_list = d.get("data", {}).get("word_list", [])
    items = []
    for it in word_list:
        word = (it.get("word") or "").strip()
        if word:
            items.append({"word": word})
    return items


# ── 去重 ──────────────────────────────────────────────────
def normalize(word):
    """去除标点符号和空格，用于模糊去重"""
    return re.sub(r"[^\u4e00-\u9fa5a-zA-Z0-9]", "", word).lower()


# ── 分类 ──────────────────────────────────────────────────
CATEGORY_KEYWORDS = {
    # 果切相关：严格限定为「水果品种 + 果切核心词 + 清凉解暑卖点」，
    # 不再混入季节/天气/娱乐泛词（凉鞋、暑期档、夏天、高温等）以免误伤。
    "🍉果切相关": [
        "水果", "果切", "鲜切", "现切", "鲜榨", "果汁", "果盘", "果篮",
        "西瓜", "芒果", "葡萄", "阳光玫瑰", "麒麟瓜", "榴莲", "凤梨",
        "哈密瓜", "荔枝", "车厘子", "蜜桃", "蜜瓜", "草莓", "椰子",
        "椰青", "蓝莓", "桑葚", "火龙果", "猕猴桃", "橙子", "柑橘",
        "柚子", "枇杷", "杨梅", "山竹", "龙眼", "香蕉", "苹果", "梨",
        "消暑", "解暑", "冰镇", "清凉", "解渴",
    ],
    "🎬娱乐": [
        "明星", "演员", "歌手", "电影", "电视剧", "综艺", "演唱会",
        "官宣", "恋情", "真人秀", "八卦", "演唱", "新歌", "专辑",
        "撤档", "定档", "杀青", "首映", "票房", "男团", "女团",
    ],
    "🍜美食": [
        "美食", "小吃", "火锅", "烧烤", "餐厅", "探店", "网红店",
        "外卖", "食材", "食安", "添加剂", "餐饮", "零食", "夜市",
    ],
    "🏠生活": [
        "健康", "睡眠", "养生", "运动", "健身", "减肥", "天气", "高温",
        "台风", "暴雨", "地震", "开学", "放假", "高考", "考研", "加班",
        "辞职", "工资", "房子", "房租", "装修", "旅游", "出行", "机票",
        "酒店", "存款", "产假", "安全", "消防",
    ],
    "🏷️品牌": [
        "华为", "苹果", "特斯拉", "小米", "比亚迪", "淘宝", "京东",
        "拼多多", "抖音", "快手", "支付宝", "美团", "饿了么",
        "瑞幸", "星巴克", "海底捞", "奈雪", "喜茶", "蜜雪冰城",
        "上市", "市值", "新品发布", "融资", "联名",
    ],
    "🎉节日": [
        "七夕", "中秋", "国庆", "元旦", "春节", "端午", "清明",
        "劳动节", "圣诞", "情人节", "双十一", "618", "双十二",
    ],
}


# 否定词：命中这些短语时，即使包含该分类关键词也不归入该类（规避比喻/多义误伤）
NEGATIVE_EXCLUDE = {
    "🏠生活": ["人事地震"],  # “人事地震”是人事变动的比喻，非自然灾害
    # “新闻发布会”是政府/灾害新闻发布，非品牌产品发布会
    "🏷️品牌": ["新闻发布会", "发布会现场"],
    # 果切相关：严格规避「水果品种词」的多义误伤，勿把国名/公司/医学术语当水果
    "🍉果切相关": [
        "葡萄牙",      # 「葡萄牙」是国名（含“葡萄”二字），非水果
        "葡萄球菌",    # 医学名词（含“葡萄”）
        "葡萄糖",      # 化学名词（含“葡萄”）
        "苹果发布会",  # 苹果公司新品发布会，非水果
        "苹果手机", "苹果新品", "苹果公司", "苹果官网", "苹果股价",
        "苹果市值", "苹果耳机", "苹果电脑", "苹果笔记本", "苹果生态",
        "苹果税", "苹果表",
        "梨园",        # 「梨园」指戏曲界，非水果
        "库克",        # 苹果CEO人名（“库克任苹果CEO”等苹果公司新闻，非水果）
        "安卓",        # Android 系统，与苹果并列的科技语境（“安卓 苹果”），非水果
        "特努斯",      # 苹果新任CEO（“苹果迈入特努斯时代”），非水果
    ],
}


# 否定正则：命中即从该分类排除（处理「苹果+数字型号」「芒果TV/台/夜」等无法穷举的多义品牌词）
NEGATIVE_REGEX = {
    "🍉果切相关": [
        re.compile(r"苹果\s*\d+", re.IGNORECASE),            # 苹果18/苹果17 等 iPhone 型号
        re.compile(r"芒果(?:夜|台|tv|视频|网络|超媒|娱乐)", re.IGNORECASE),  # 芒果TV/芒果台/青春芒果夜 等品牌
        # 苹果公司科技语境：苹果与手机/数码/发布/新品等词同现（非连续），规避「苹果首款折叠屏手机」类误伤
        re.compile(
            r"苹果.{0,8}(?:手机|折叠|屏幕|屏|新品|发布|电脑|笔记本|平板|手表|耳机|芯片|系统|"
            r"汽车|首款|新款|亮相|上新|系列|官方|官网|股价|市值|税|表|Pro|Max|Ultra|iPhone)",
            re.IGNORECASE,
        ),
        # 反向顺序：手机/折叠屏/新品等词在前、苹果在后（如「折叠屏苹果」）
        re.compile(
            r"(?:手机|折叠屏|折叠|电脑|平板|手表|耳机|芯片|发布|新品|首款|新款).{0,8}苹果",
            re.IGNORECASE,
        ),
        # 科技品牌并列：苹果与华为/小米/三星等科技公司同现，判定为科技语境非水果
        re.compile(
            r"(?:华为|小米|三星|OPPO|vivo|荣耀|魅族).{0,8}苹果|苹果.{0,8}(?:华为|小米|三星|OPPO|vivo|荣耀|魅族)",
            re.IGNORECASE,
        ),
        # 苹果公司CEO语境（“苹果CEO”“苹果新任CEO”等，非水果）
        re.compile(r"苹果.{0,8}CEO|CEO.{0,8}苹果", re.IGNORECASE),
    ],
}


def classify(word):
    """按优先级匹配分类，果切相关优先，命中否定词/否定正则则跳过，未命中归入综合"""
    for cat, kws in CATEGORY_KEYWORDS.items():
        if any(neg in word for neg in NEGATIVE_EXCLUDE.get(cat, [])):
            continue
        if any(rx.search(word) for rx in NEGATIVE_REGEX.get(cat, [])):
            continue
        for kw in kws:
            if kw in word:
                return cat
    return "📌综合"


# ── 主流程 ────────────────────────────────────────────────
def main():
    print("📡 抓取百度热搜 ...")
    baidu = fetch_baidu()
    print(f"   百度: {len(baidu)} 条")

    print("📡 抓取微博热搜 ...")
    weibo = fetch_weibo()
    print(f"   微博: {len(weibo)} 条")

    print("📡 抓取抖音热榜 ...")
    douyin = fetch_douyin()
    print(f"   抖音: {len(douyin)} 条")

    # 合并去重：先放百度，微博/抖音做宽松包含去重
    merged = []
    seen_norm = set()

    for it in baidu:
        n = normalize(it["word"])
        if n and n not in seen_norm:
            seen_norm.add(n)
            merged.append({
                "word": it["word"],
                "source": "百度",
                "url": f"https://www.baidu.com/s?wd={urllib.request.quote(it['word'])}",
            })

    for it in weibo:
        n = normalize(it["word"])
        if not n:
            continue
        is_dup = any(n in s or s in n for s in seen_norm)
        if not is_dup:
            seen_norm.add(n)
            merged.append({
                "word": it["word"],
                "source": "微博",
                "url": f"https://s.weibo.com/weibo?q={urllib.request.quote(it['word'])}",
            })

    for it in douyin:
        n = normalize(it["word"])
        if not n:
            continue
        is_dup = any(n in s or s in n for s in seen_norm)
        if not is_dup:
            seen_norm.add(n)
            merged.append({
                "word": it["word"],
                "source": "抖音",
                "url": f"https://www.douyin.com/search/{urllib.request.quote(it['word'])}",
            })

    # 分类
    for item in merged:
        item["category"] = classify(item["word"])

    total = len(merged)
    print(f"\n🔗 合并去重后共 {total} 条")

    # ── 数据保护：少于 MIN_ITEMS 条不写入 ──────────────────
    if total < MIN_ITEMS:
        print(f"⚠️ 数据保护：去重后仅 {total} 条（< {MIN_ITEMS}），跳过写入，保持现有数据不变。")
        return 0

    # ── 写入 hotspot.json ──────────────────────────────────
    tz = timezone(timedelta(hours=8))
    now = datetime.now(tz)
    result = {
        "date": now.strftime("%Y-%m-%d %H:%M"),
        "items": merged,
    }
    HOTSPOT_FILE.write_text(json.dumps(result, ensure_ascii=False, indent=2),
                            encoding="utf-8")
    print(f"✅ 已写入 {HOTSPOT_FILE}（{total} 条）")

    # 分类统计
    from collections import Counter
    cat_count = Counter(i["category"] for i in merged)
    for cat in ["🍉果切相关", "🎬娱乐", "🍜美食", "🏠生活", "🏷️品牌", "🎉节日", "📌综合"]:
        if cat_count.get(cat):
            print(f"   {cat}: {cat_count[cat]} 条")

    # ── git push ───────────────────────────────────────────
    git_push(total)
    return 0


def git_push(total):
    """提交并推送 hotspot.json（仅提交本文件，避免夹带无关改动）"""
    import subprocess
    try:
        subprocess.run(["git", "add", "--", str(HOTSPOT_FILE)], cwd=WORKSPACE, check=True)
        commit_msg = f"🔥 热搜更新: {datetime.now(timezone(timedelta(hours=8))).strftime('%Y-%m-%d %H:%M')} ({total}条)"
        r = subprocess.run(["git", "commit", "-m", commit_msg], cwd=WORKSPACE,
                           capture_output=True, text=True)
        if r.returncode == 0:
            print(f"✅ git commit: {commit_msg}")
        else:
            out = (r.stdout + r.stderr).strip()
            if "nothing to commit" in out or "nothing added" in out:
                print("ℹ️ 无变更，跳过 commit")
            else:
                print(f"⚠️ git commit 未成功: {out}")
                return
        push = subprocess.run(["git", "push"], cwd=WORKSPACE, capture_output=True, text=True, timeout=60)
        print(push.stdout.strip() or push.stderr.strip())
        if push.returncode == 0:
            print("✅ git push 成功")
        else:
            print(f"⚠️ git push 失败: {(push.stderr or push.stdout).strip()}")
    except subprocess.TimeoutExpired:
        print("⚠️ git push 超时")
    except Exception as e:
        print(f"⚠️ git 操作异常: {e}")


if __name__ == "__main__":
    sys.exit(main())
