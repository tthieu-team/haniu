import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const CATEGORY_MAP: Record<string, string> = {
  teddy: '🧸 Teddy',
  balloon: '🎈 Bóng & Quà',
  gift: '🎁 Quà tặng',
  cake: '🍰 Bánh ngọt',
  flower: '🌸 Hoa đẹp',
  heart: '💖 Trái tim',
  ribbon: '🎀 Ruy băng & Nơ',
  text: '🔤 Chữ nghệ thuật',
  background: '🖼️ Hình nền',
  frame: '🖼️ Khung ảnh'
};

function formatName(filename: string): string {
  const baseName = filename.substring(0, filename.lastIndexOf('.')) || filename;
  
  let cleaned = baseName
    .replace(/_nobg/g, '')
    .replace(/-nobg/g, '')
    .replace(/_no_bg/g, '')
    .replace(/teddy_bear_/g, '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ');
    
  return cleaned
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim();
}

export async function GET() {
  try {
    const photoboothDir = path.join(process.cwd(), 'public', 'photobooth');
    if (!fs.existsSync(photoboothDir)) {
      return NextResponse.json([]);
    }

    const categories: any[] = [];
    const entries = fs.readdirSync(photoboothDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const catDir = path.join(photoboothDir, entry.name);
        const files = fs.readdirSync(catDir);
        const items = files
          .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext);
          })
          .map(file => {
            const url = `/photobooth/${entry.name}/${file}`;
            const name = formatName(file);
            const item: any = {
              name,
              url
            };
            if (entry.name === 'background') {
              item.type = 'background';
            } else if (entry.name === 'frame') {
              item.type = 'frame';
            } else {
              item.type = 'sticker';
            }
            return item;
          });

        if (items.length > 0) {
          const categoryName = CATEGORY_MAP[entry.name.toLowerCase()] || `📁 ${entry.name}`;
          categories.push({
            category: categoryName,
            items
          });
        }
      }
    }

    const order = ['teddy', 'balloon', 'gift', 'cake', 'flower', 'heart', 'ribbon', 'text', 'background', 'frame'];
    categories.sort((a, b) => {
      const getIndex = (catName: string) => {
        const matchingKey = Object.keys(CATEGORY_MAP).find(key => CATEGORY_MAP[key] === catName);
        return matchingKey ? order.indexOf(matchingKey) : 99;
      };
      return getIndex(a.category) - getIndex(b.category);
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error scanning stickers:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
