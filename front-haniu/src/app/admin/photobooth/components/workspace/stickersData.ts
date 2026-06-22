export interface LocalStickerItem {
  name: string;
  url: string;
  type?: 'background' | 'frame' | 'sticker';
}

export interface LocalStickerCategory {
  category: string;
  items: LocalStickerItem[];
}

export const LOCAL_STICKERS: LocalStickerCategory[] = [
  {
    category: '🧸 Teddy',
    items: [
      { name: 'Mũ Sinh Nhật', url: '/photobooth/teddy/teddy_bear_birthday_hat_nobg.png' },
      { name: 'Cầm Hoa Tulip', url: '/photobooth/teddy/teddy_bear_holding_flower_nobg.png' },
      { name: 'Ôm Tim Hồng', url: '/photobooth/teddy/teddy_bear_holding_heart_nobg.png' },
      { name: 'Ôm Gối Ngủ', url: '/photobooth/teddy/teddy_bear_hugging_pillow_nobg.png' },
      { name: 'Ngồi Ngoan', url: '/photobooth/teddy/teddy_bear_sitting_nobg.png' },
      { name: 'Nằm Ngủ', url: '/photobooth/teddy/teddy_bear_sleeping_nobg.png' },
      { name: 'Đứng Chào', url: '/photobooth/teddy/teddy_bear_standing_nobg.png' },
      { name: 'Bên Bánh Kem', url: '/photobooth/teddy/teddy_bear_with_cake_nobg.png' }
    ]
  },
  {
    category: '🎈 Bóng & Quà',
    items: [
      { name: 'Chùm Bóng Pastel', url: '/photobooth/balloon/pastel_balloons_nobg.png' },
      { name: 'Hộp Quà Hồng', url: '/photobooth/gift/pink_gift_box_nobg.png' }
    ]
  },
  {
    category: '🍰 Bánh & Hoa',
    items: [
      { name: 'Bánh Dâu Tây', url: '/photobooth/cake/strawberry_cake_nobg.png' },
      { name: 'Bó Hoa Tulip', url: '/photobooth/flower/tulip_bouquet_nobg.png' }
    ]
  },
  {
    category: '💖 Tim & Ruy Băng',
    items: [
      { name: 'Trái Tim Hồng', url: '/photobooth/heart/pink_heart_nobg.png' },
      { name: 'Nơ Ruy Băng', url: '/photobooth/ribbon/pink_ribbon_bow_nobg.png' }
    ]
  },
  {
    category: '🔤 Chữ Sinh Nhật',
    items: [
      { name: 'Happy Birthday', url: '/photobooth/text/happy_birthday_nobg.png' }
    ]
  },
  {
    category: '🖼️ Khung & Nền',
    items: [
      { name: 'Nền Birthday Pastel', url: '/photobooth/background/birthday_pastel_nobg.png', type: 'background' },
      { name: 'Khung 4 Ô Ảnh', url: '/photobooth/frame/4_photo_strip_nobg.png', type: 'frame' }
    ]
  }
];
