#!/usr/bin/env python3
"""
切果NOW 精选正面素材下载打包工具
用法: python3 download_stars.py
会自动下载所有收藏帖子的图片和视频，打包成 zip 放桌面
"""
import json, os, re, sys, shutil, zipfile, subprocess
from pathlib import Path
from datetime import datetime

# ═══ 配置 ═══
WORKSPACE = Path.home() / "Desktop" / "切果NOW工作台"
STARS_DIR = WORKSPACE / "精选正面素材"           # 素材子文件夹
STARS_DIR.mkdir(parents=True, exist_ok=True)
DOWNLOAD_DIR = STARS_DIR / "_temp_download"       # 临时下载目录
STARS_FILE = STARS_DIR / "qg_stars_export.json"   # 导出JSON放这里
STARS_FILE_ALT = Path.home() / "Downloads" / "qg_stars_export.json"
STARS_FILE_ALT2 = Path.home() / "Downloads" / "qg_stars_export (1).json"
MASTER_FILE = WORKSPACE / "master_data.json"
DOWNLOADED_LOG = STARS_DIR / "downloaded.json"    # 去重记录也放这里

def load_stars():
    for path in [STARS_FILE, STARS_FILE_ALT, STARS_FILE_ALT2]:
        if path.exists():
            print(f"📂 读取收藏: {path}")
            with open(path) as f:
                data = json.load(f)
            # 如果不是在子文件夹，复制一份过去
            if path != STARS_FILE:
                import shutil
                shutil.copy2(path, STARS_FILE)
                print(f"📋 已同步到: {STARS_FILE}")
            return data
    print(f"❌ 找不到 qg_stars_export.json")
    print(f"   请先在切果NOW工作台 → 精选正面 → 点击「📤 导出JSON」")
    print(f"   然后把下载的文件拖到桌面「切果NOW工作台」文件夹")
    return None

def load_master():
    if not MASTER_FILE.exists():
        print(f"❌ 找不到 {MASTER_FILE}")
        return {}
    with open(MASTER_FILE) as f:
        return json.load(f)

# ═══ 匹配媒体 ═══
def find_media(stars, master):
    """为每条收藏找到对应的媒体URL"""
    results = []
    for star in stars:
        title = star.get("title", "")
        date_str = star.get("date", "")  # 2026-07-19
        dk = date_str.replace("-", "")
        
        media = {"title": title, "date": date_str, "platform": star.get("platform", ""),
                 "url": star.get("url", ""), "imgs": [], "video_url": None}
        
        # 从 master_data 找匹配
        day_data = master.get(dk, {})
        for item in day_data.get("data", []):
            if item.get("t", "") == title:
                media["_imgs"] = item.get("_imgs", [])
                media["post_url"] = item.get("url", star.get("url", ""))
                media["type"] = "video" if "video" in item.get("url","") else "image"
                break
        
        results.append(media)
    
    return results

# ═══ 下载 ═══
def download_douyin(post_url, output_dir, idx):
    """用 yt-dlp + Chrome cookies 下载抖音视频/图文"""
    safe_name = f"{idx:03d}"
    print(f"  [{idx}] 抖音: {post_url[:60]}...")
    
    try:
        cmd = [
            "python3", "-m", "yt_dlp",
            "--cookies-from-browser", "chrome",
            "--no-playlist",
            "--no-check-certificates",
            "-o", f"{output_dir}/{safe_name}_%(title).100s.%(ext)s",
            "--restrict-filenames",
            post_url
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode == 0:
            # Find downloaded file
            for f in sorted(output_dir.glob(f"{safe_name}_*")):
                print(f"    ✅ {f.name}")
            return True
        else:
            err = result.stderr[-200:] if result.stderr else result.stdout[-200:]
            print(f"    ⚠️ yt-dlp失败: {err}")
            return False
    except subprocess.TimeoutExpired:
        print("    ⚠️ 超时")
        return False

def download_image(img_url, output_dir, idx, img_idx):
    """直接下载图片"""
    import urllib.request
    ext = ".jpg"
    if ".png" in img_url: ext = ".png"
    if ".webp" in img_url: ext = ".webp"
    
    fname = output_dir / f"{idx:03d}_{img_idx:02d}{ext}"
    try:
        urllib.request.urlretrieve(img_url, fname)
        print(f"    🖼️ {fname.name}")
        return True
    except Exception as e:
        print(f"    ⚠️ 图片下载失败: {e}")
        return False

# ═══ 打包 ═══
def pack_zip(output_dir):
    zip_name = STARS_DIR / f"精选素材_{datetime.now().strftime('%m%d_%H%M')}.zip"
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zf:
        for f in sorted(output_dir.rglob("*")):
            if f.is_file() and f.suffix != '.zip':
                zf.write(f, f.relative_to(output_dir))
    size_mb = os.path.getsize(zip_name) / 1024 / 1024
    print(f"\n📦 打包完成: {zip_name} ({size_mb:.1f}MB)")
    return zip_name

# ═══ 去重 ═══
def load_downloaded():
    if DOWNLOADED_LOG.exists():
        with open(DOWNLOADED_LOG) as f:
            return json.load(f)
    return {}

def save_downloaded(record):
    with open(DOWNLOADED_LOG, 'w') as f:
        json.dump(record, f, ensure_ascii=False, indent=2)

def item_key(item):
    """唯一标识：日期+标题"""
    return f"{item.get('date','')}||{item.get('title','')[:80]}"

# ═══ 主流程 ═══
def main():
    print("═" * 50)
    print("  切果NOW 精选正面素材下载工具")
    print("═" * 50)
    
    # 加载数据
    stars = load_stars()
    if not stars or len(stars) == 0:
        print("❌ 没有收藏数据")
        return
    
    print(f"\n📋 共 {len(stars)} 条收藏")
    
    # 去重检查
    downloaded = load_downloaded()
    new_stars = []
    skipped = 0
    for s in stars:
        key = item_key(s)
        if key in downloaded:
            skipped += 1
        else:
            new_stars.append(s)
    
    if skipped > 0:
        print(f"⏭️ 跳过已下载: {skipped} 条")
    
    if len(new_stars) == 0:
        print("✅ 所有收藏均已下载，无需重复导出")
        return
    
    print(f"🆕 新增待下载: {len(new_stars)} 条\n")
    
    master = load_master()
    media_list = find_media(new_stars, master)
    
    # 按平台分组
    douyin_items = [m for m in media_list if m["platform"] == "抖音"]
    other_items = [m for m in media_list if m["platform"] != "抖音"]
    
    # 清理/创建下载目录
    if DOWNLOAD_DIR.exists():
        shutil.rmtree(DOWNLOAD_DIR)
    DOWNLOAD_DIR.mkdir(parents=True)
    
    # 下载抖音素材
    if douyin_items:
        print(f"\n🎬 下载抖音素材 ({len(douyin_items)}条)...")
        for i, item in enumerate(douyin_items):
            url = item.get("post_url") or item.get("url")
            if url:
                download_douyin(url, DOWNLOAD_DIR, i+1)
    else:
        print("\n🎬 无抖音素材")
    
    # 下载图片
    img_count = 0
    for item in media_list:
        for img_url in item.get("_imgs", []):
            if img_url:
                img_count += 1
                download_image(img_url, DOWNLOAD_DIR, 0, img_count)
    
    if img_count == 0:
        print("\n🖼️ 无直接图片URL（已通过yt-dlp下载）")
    
    # 保存链接清单
    txt_path = DOWNLOAD_DIR / "原帖链接清单.txt"
    with open(txt_path, 'w') as f:
        f.write("切果NOW 精选正面素材 - 原帖链接\n")
        f.write(f"导出时间: {datetime.now()}\n")
        f.write("=" * 50 + "\n\n")
        for i, item in enumerate(media_list):
            f.write(f"[{i+1}] {item['date']} | {item['platform']}\n")
            f.write(f"    标题: {item['title']}\n")
            f.write(f"    链接: {item.get('url') or item.get('post_url', '无')}\n\n")
    print(f"\n📝 链接清单: {txt_path}")
    
    # 记录已下载
    for s in new_stars:
        downloaded[item_key(s)] = datetime.now().isoformat()
    save_downloaded(downloaded)
    print(f"💾 去重记录已更新 ({len(downloaded)} 条)")
    
    # 打包
    zip_path = pack_zip(DOWNLOAD_DIR)
    
    # 清理临时目录
    shutil.rmtree(DOWNLOAD_DIR)
    
    print(f"\n✅ 完成！zip 包: {zip_path.name}")
    print(f"   位置: {STARS_DIR}")

if __name__ == "__main__":
    main()
