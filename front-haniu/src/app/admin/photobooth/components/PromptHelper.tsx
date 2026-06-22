'use client';

import React, { useState } from 'react';
import Icon from '@/components/common/Icons';

interface PromptItem {
  name: string;
  prompt: string;
}

interface Collection {
  id: string;
  name: string;
  icon: string;
  items: PromptItem[];
}

const PROMPT_COLLECTIONS: Collection[] = [
  {
    id: 'teddy',
    name: 'Teddy Bear (Gấu Bông)',
    icon: 'cake',
    items: [
      { name: 'Teddy bear standing', prompt: 'Cute standing teddy bear sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear sitting', prompt: 'Cute sitting teddy bear sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear holding heart', prompt: 'Cute teddy bear holding a big pink heart sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear holding flower', prompt: 'Cute teddy bear holding a pastel tulip sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear birthday hat', prompt: 'Cute teddy bear wearing a colorful cone party hat sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear with cake', prompt: 'Cute teddy bear sitting next to a tiny birthday cake with one candle sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear with gift box', prompt: 'Cute teddy bear hugging a small wrapped gift box with a bow sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear hugging pillow', prompt: 'Cute teddy bear hugging a fluffy star-shaped pillow sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear sleeping', prompt: 'Cute sleeping teddy bear under a small pastel blanket with Zzz bubbles sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear waving', prompt: 'Cute teddy bear waving its paw in greeting sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear with balloon', prompt: 'Cute teddy bear holding a floating pastel pink balloon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear celebrating', prompt: 'Cute teddy bear with confetti and hands up celebrating sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear with ribbon', prompt: 'Cute teddy bear wearing a big red ribbon bow on its neck sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear with crown', prompt: 'Cute teddy bear wearing a tiny shiny gold crown sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear smiling', prompt: 'Cute happy smiling teddy bear face sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear blushing', prompt: 'Cute blushing teddy bear with rosy pink cheeks sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear with chocolate', prompt: 'Cute teddy bear holding a tiny heart-shaped chocolate bar sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear holding star', prompt: 'Cute teddy bear holding a glowing pastel yellow star sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear couple', prompt: 'Two cute teddy bears sitting together side by side sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear love pose', prompt: 'Cute teddy bear making a finger-heart gesture sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' }
    ]
  },
  {
    id: 'heart',
    name: 'Heart (Trái Tim)',
    icon: 'palette',
    items: [
      { name: 'Red heart', prompt: 'Cute simple red heart sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Pink heart', prompt: 'Cute simple soft pink heart sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Pastel heart', prompt: 'Cute pastel purple and mint gradient heart sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart with wings', prompt: 'Cute pink heart with tiny fluffy white angel wings sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart ribbon', prompt: 'Cute heart wrapped in a beautiful ribbon bow sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Glitter heart', prompt: 'Cute heart sticker with subtle glowing sparkles and stars, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Kawaii heart', prompt: 'Cute heart with a happy smiley face and blushing cheeks sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Double heart', prompt: 'Two overlapping cute pink and lavender hearts sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Love heart', prompt: 'Cute puffy 3D-effect pastel pink love heart sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart frame', prompt: 'Cute hollow heart-shaped outline frame sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart balloon', prompt: 'Cute heart-shaped helium balloon with a string sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart gift', prompt: 'Cute heart-shaped gift box with a cute bow sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart flower', prompt: 'Cute heart design made entirely of tiny pastel flowers sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart sparkle', prompt: 'Cute pink heart surrounded by mini yellow sparkles sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart sticker', prompt: 'Cute peeling corner heart sticker design, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart candy', prompt: 'Cute sweet conversation heart candy sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart bow', prompt: 'Cute hair bow clip shaped like two hearts joined sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart star', prompt: 'Cute heart and star cluster sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart confetti', prompt: 'Cute scattered small pastel hearts confetti sticker pack, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart pastel set', prompt: 'Cute bundle of three small differently colored pastel hearts sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' }
    ]
  },
  {
    id: 'flower',
    name: 'Flower (Hoa)',
    icon: 'image',
    items: [
      { name: 'Rose bouquet', prompt: 'Cute mini pink rose bouquet wrapped in brown paper with a bow sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Tulip bouquet', prompt: 'Cute pastel tulip bouquet sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Baby flower bouquet', prompt: 'Cute baby\'s breath flower bouquet sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Sunflower bouquet', prompt: 'Cute bright sunflower bouquet sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Lavender bouquet', prompt: 'Cute lavender sprigs bouquet tied with a purple ribbon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Pink flower', prompt: 'Cute pink cherry blossom flower sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'White flower', prompt: 'Cute white daisy flower sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Pastel flower', prompt: 'Cute fantasy pastel gradient flower sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Flower basket', prompt: 'Cute wooden flower basket filled with colorful pastel blossoms sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Flower ribbon', prompt: 'Cute single rose tied with a flowing satin ribbon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Flower wreath', prompt: 'Cute circular flower wreath made of pastel buds sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Flower branch', prompt: 'Cute small tree branch with tiny green leaves and pink blossoms sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Flower corner', prompt: 'Cute floral corner decoration sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Flower decoration', prompt: 'Cute trailing floral vine decoration sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Korean flower style', prompt: 'Cute minimalist Korean-style flat flower sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Kawaii flower', prompt: 'Cute daisy flower with a happy smiling face in the middle sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Romantic flower', prompt: 'Cute red rose with falling petals sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Cute flower pack', prompt: 'Cute mini flower pack consisting of four tiny flowers sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Flower sticker', prompt: 'Cute hand-drawn style cartoon blossom sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Floral decoration', prompt: 'Cute modern floral line art decoration sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' }
    ]
  },
  {
    id: 'balloon',
    name: 'Balloon (Bóng Bay)',
    icon: 'grid',
    items: [
      { name: 'Pink balloon', prompt: 'Cute single shiny pink helium balloon with a curly string sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Blue balloon', prompt: 'Cute single pastel blue helium balloon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Birthday balloon', prompt: 'Cute festive birthday balloon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart balloon', prompt: 'Cute heart-shaped shiny pink balloon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Star balloon', prompt: 'Cute pastel yellow star-shaped foil balloon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Balloon bundle', prompt: 'Cute bunch of three floating pastel balloons tied together sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Pastel balloons', prompt: 'Cute pastel color balloon bundle sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Balloon arch', prompt: 'Cute curved decorative balloon arch sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Balloon ribbon', prompt: 'Cute balloon with a long flowing ribbon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Cute balloon set', prompt: 'Cute cluster of colorful balloons sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Korean balloon style', prompt: 'Cute minimalist Korean pastel helium balloon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Celebration balloon', prompt: 'Cute party celebration balloons with gold confetti sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Balloon decoration', prompt: 'Cute balloon border decoration sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Balloon gift', prompt: 'Cute gift box with a giant balloon popping out sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Balloon sparkle', prompt: 'Cute balloons with magical sparkles sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Balloon sticker', prompt: 'Cute simple cartoon-style balloon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Balloon confetti', prompt: 'Cute balloons floating amidst colorful confetti rain sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Balloon cluster', prompt: 'Cute dense cluster of colorful balloons sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Balloon frame decoration', prompt: 'Cute balloon layout frame corner decoration sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Balloon party set', prompt: 'Cute birthday party balloons set sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' }
    ]
  },
  {
    id: 'cake',
    name: 'Cake (Bánh Sinh Nhật)',
    icon: 'cake',
    items: [
      { name: 'Birthday cake pink', prompt: 'Cute pink frosted double-tier birthday cake sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Birthday cake blue', prompt: 'Cute pastel blue birthday cake with cream frosting sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Strawberry cake', prompt: 'Cute cake topped with fresh strawberries and whipped cream sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Chocolate cake', prompt: 'Cute chocolate fudge cake with chocolate chips sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart cake', prompt: 'Cute heart-shaped romantic cake sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Korean cake', prompt: 'Cute minimalist Korean bento box cake with simple aesthetics sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Mini cake', prompt: 'Cute tiny cupcake-sized bento cake sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Cute cake', prompt: 'Cute smiling cartoon cake sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Teddy bear cake', prompt: 'Cute cake decorated with a mini teddy bear topper sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Celebration cake', prompt: 'Cute celebratory double decker party cake sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Pastel cake', prompt: 'Cute pastel rainbow layered cake sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Cake with candle', prompt: 'Cute cake with a single glowing birthday candle sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Cake slice', prompt: 'Cute slice of cake with colorful layers sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Cake gift set', prompt: 'Cute cake next to a small gift box sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Luxury cake', prompt: 'Cute elegant tier cake with gold flakes sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Floral cake', prompt: 'Cute cake adorned with beautiful edible flowers sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Kawaii cake', prompt: 'Cute cake with cartoon eyes and blushing cheeks sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Cake sticker', prompt: 'Cute classic cartoon vector cake sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Birthday dessert', prompt: 'Cute dessert plate with macaron and a mini cake sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Party cake', prompt: 'Cute birthday party cake with sparkles sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' }
    ]
  },
  {
    id: 'gift',
    name: 'Gift Box (Hộp Quà)',
    icon: 'list',
    items: [
      { name: 'Pink gift box', prompt: 'Cute pink gift box tied with a satin ribbon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Blue gift box', prompt: 'Cute pastel blue gift box with white bow sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Red gift box', prompt: 'Cute red gift box with a big gold ribbon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Luxury gift box', prompt: 'Cute premium gold and black gift box sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Cute gift box', prompt: 'Cute cartoon gift box sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Ribbon gift box', prompt: 'Cute gift box wrapped in massive ribbons sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart gift box', prompt: 'Cute heart-shaped gift box sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Flower gift box', prompt: 'Cute gift box adorned with a small flower bouquet sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Korean gift box', prompt: 'Cute minimalist Korean-style gift packaging sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Surprise gift box', prompt: 'Cute slightly opened gift box with sparkles popping out sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Birthday gift', prompt: 'Cute birthday present wrapped in festive paper sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Valentine gift', prompt: 'Cute romantic Valentine gift box with hearts sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Pastel gift box', prompt: 'Cute lavender and cream pastel gift box sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Gift basket', prompt: 'Cute woven gift basket filled with treats sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Gift package', prompt: 'Cute wrapped mail package with a cute label sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Gift decoration', prompt: 'Cute gift boxes stacked together sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Gift sticker', prompt: 'Cute classic cartoon gift sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Luxury package', prompt: 'Cute high-end designer looking gift box sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Present box', prompt: 'Cute ribbon-wrapped holiday present sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Celebration gift', prompt: 'Cute graduation or party gift box with confetti sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' }
    ]
  },
  {
    id: 'ribbon',
    name: 'Ribbon & Bow (Ruy Băng)',
    icon: 'settings',
    items: [
      { name: 'Pink ribbon', prompt: 'Cute pink satin ribbon bow sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Red ribbon', prompt: 'Cute classic red ribbon bow sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Gold ribbon', prompt: 'Cute shiny gold ribbon bow sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Pastel ribbon', prompt: 'Cute lavender and mint pastel ribbon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Heart ribbon', prompt: 'Cute ribbon bow with a little heart in the center sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Korean ribbon', prompt: 'Cute minimalist Korean hair bow style sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Cute bow', prompt: 'Cute cartoon bow tie sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Luxury bow', prompt: 'Cute elegant velvet-style premium bow sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Gift ribbon', prompt: 'Cute decorative curly ribbon for gifts sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Birthday ribbon', prompt: 'Cute festive birthday present ribbon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Flower ribbon', prompt: 'Cute ribbon bow with a daisy in the middle sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Decorative ribbon', prompt: 'Cute curly pastel ribbon decoration sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Celebration ribbon', prompt: 'Cute celebratory streaming ribbon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Love ribbon', prompt: 'Cute pink ribbon shaped like a heart sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Elegant ribbon', prompt: 'Cute soft-draped elegant ribbon sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Satin bow', prompt: 'Cute shiny pink satin fabric bow sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Kawaii bow', prompt: 'Cute polka dot kawaii bow sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Sticker ribbon', prompt: 'Cute peeling sticker of a ribbon bow, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Sparkle ribbon', prompt: 'Cute ribbon bow with gold sparkles sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' },
      { name: 'Ribbon decoration', prompt: 'Cute hanging ribbon banner decoration sticker, korean photobooth style, kawaii style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no text, no watermark, high quality' }
    ]
  },
  {
    id: 'text',
    name: 'Text Sticker (Nhãn Chữ)',
    icon: 'edit',
    items: [
      { name: 'Happy Birthday', prompt: 'Cute text sticker with the text "Happy Birthday", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Love', prompt: 'Cute text sticker with the text "Love", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'I Love You', prompt: 'Cute text sticker with the text "I Love You", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Congrats', prompt: 'Cute text sticker with the text "Congrats", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Best Wishes', prompt: 'Cute text sticker with the text "Best Wishes", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Forever', prompt: 'Cute text sticker with the text "Forever", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Sweet Moment', prompt: 'Cute text sticker with the text "Sweet Moment", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Happy Day', prompt: 'Cute text sticker with the text "Happy Day", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Cute', prompt: 'Cute text sticker with the text "Cute", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Smile', prompt: 'Cute text sticker with the text "Smile", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Dream', prompt: 'Cute text sticker with the text "Dream", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Celebrate', prompt: 'Cute text sticker with the text "Celebrate", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Special Day', prompt: 'Cute text sticker with the text "Special Day", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Thank You', prompt: 'Cute text sticker with the text "Thank You", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'With Love', prompt: 'Cute text sticker with the text "With Love", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Be Happy', prompt: 'Cute text sticker with the text "Be Happy", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Good Luck', prompt: 'Cute text sticker with the text "Good Luck", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Graduation', prompt: 'Cute text sticker with the text "Graduation", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Merry Christmas', prompt: 'Cute text sticker with the text "Merry Christmas", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' },
      { name: 'Happy New Year', prompt: 'Cute text sticker with the text "Happy New Year", cute kawaii bubble letter font, korean photobooth style, clean vector illustration, soft pastel colors, white outline border, transparent background, isolated object, no watermark, high quality' }
    ]
  },
  {
    id: 'background',
    name: 'Background (Hình Nền)',
    icon: 'image',
    items: [
      { name: 'Birthday pastel', prompt: 'Korean photobooth background template, birthday theme, pastel confetti and party balloons on edges, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Birthday pink', prompt: 'Korean photobooth background template, pink pastel theme, birthday candles and cake illustrations on borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Birthday blue', prompt: 'Korean photobooth background template, baby blue pastel theme, birthday party hats and stars on edges, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Birthday teddy bear', prompt: 'Korean photobooth background template, birthday theme, cute teddy bears wearing party hats on borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Valentine romantic', prompt: 'Korean photobooth background template, Valentine romantic theme, soft rose petals and heart shapes on borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Valentine pink', prompt: 'Korean photobooth background template, pastel pink Valentine theme, cute hearts and love letters on corners, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Valentine heart', prompt: 'Korean photobooth background template, pink heart pattern along borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Graduation theme', prompt: 'Korean photobooth background template, graduation theme, small graduation caps and scrolls on edges, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Graduation blue', prompt: 'Korean photobooth background template, pastel blue graduation theme, celebration sparkles and diplomas on borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Graduation gold', prompt: 'Korean photobooth background template, elegant soft gold graduation theme, confetti and star lights on borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Christmas red', prompt: 'Korean photobooth background template, pastel red Christmas theme, cute holly and ornaments on borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Christmas green', prompt: 'Korean photobooth background template, pastel green Christmas theme, cute pine branches and gold stars on borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Christmas snow', prompt: 'Korean photobooth background template, Christmas winter theme, soft snow falling and snowman on edges, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'National Day Vietnam', prompt: 'Korean photobooth background template, Vietnam National Day theme, stylized pastel red and yellow ribbons on borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Vietnam red and yellow', prompt: 'Korean photobooth background template, Vietnam colors red and yellow themed aesthetic, cute clean vector style borders, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Lotus background', prompt: 'Korean photobooth background template, Vietnam National theme, stylized pink lotus flowers on borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Korean pastel', prompt: 'Korean photobooth background template, classic minimalist Korean pastel colors gradient, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Korean kawaii', prompt: 'Korean photobooth background template, cute Korean kawaii character sticker patterns along borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Y2K pink', prompt: 'Korean photobooth background template, Y2K pink theme, retro cyber sparkles and butterfly patterns on borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Y2K purple', prompt: 'Korean photobooth background template, Y2K purple theme, retro starbursts and metallic-style curves on edges, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Vintage paper', prompt: 'Korean photobooth background template, vintage paper textures with cute pastel accents, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Vintage flower', prompt: 'Korean photobooth background template, vintage cottagecore floral borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Cute cloud', prompt: 'Korean photobooth background template, fluffy pastel sky clouds on borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Cute star', prompt: 'Korean photobooth background template, twinkling yellow star constellations on edges, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Cute rainbow', prompt: 'Korean photobooth background template, soft pastel rainbow arch on borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Teddy theme', prompt: 'Korean photobooth background template, cute teddy bear patterns all over the borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Floral theme', prompt: 'Korean photobooth background template, elegant soft floral border, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Gift theme', prompt: 'Korean photobooth background template, small gift box patterns on borders, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Celebration theme', prompt: 'Korean photobooth background template, champagne bubble sparkles and party hats on edges, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' },
      { name: 'Minimal pastel', prompt: 'Korean photobooth background template, simple aesthetic solid light pastel beige, cute and clean design, empty center space for photo frames, soft lighting, high resolution, no people, no text' }
    ]
  },
  {
    id: 'frame',
    name: 'Frame (Khung Ảnh)',
    icon: 'palette',
    items: [
      { name: '2 photo strip frame', prompt: 'Cute photobooth frame template with 2 empty transparent vertical slots for photos, pastel pink borders with tiny hearts, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: '3 photo strip frame', prompt: 'Cute photobooth frame template with 3 empty transparent vertical slots for photos, lavender borders, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: '4 photo strip frame', prompt: 'Cute photobooth frame template with 4 empty transparent vertical slots for photos, pastel blue borders with sparkles, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: '6 photo strip frame', prompt: 'Cute photobooth frame template with 6 empty transparent rectangular slots for photos grid layout, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Polaroid frame', prompt: 'Cute classic polaroid-style photo frame template, empty transparent square slot in center, wide pastel bottom margin, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Korean frame', prompt: 'Cute minimalist Korean-style photo frame template, empty transparent rectangular slots, pastel peach border, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Birthday frame', prompt: 'Cute birthday photo frame template with empty transparent photo slots, decorated with balloons and candles on borders, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Valentine frame', prompt: 'Cute Valentine photo frame template with empty transparent photo slots, decorated with red roses and pink hearts, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Graduation frame', prompt: 'Cute graduation photo frame template with empty transparent photo slots, decorated with blue mortarboards and gold stars, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Christmas frame', prompt: 'Cute Christmas photo frame template with empty transparent photo slots, decorated with pinecones, holly, and snow, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'National Day frame', prompt: 'Cute Vietnam National Day photo frame template with empty transparent photo slots, decorated with red and yellow ribbons and lotus flowers, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Teddy frame', prompt: 'Cute teddy bear photo frame template with empty transparent photo slots, decorated with cute cartoon teddy bears on borders, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Floral frame', prompt: 'Cute floral photo frame template with empty transparent photo slots, decorated with pastel flower bouquets, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Ribbon frame', prompt: 'Cute ribbon bow photo frame template with empty transparent photo slots, decorated with elegant pastel bows, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Heart frame', prompt: 'Cute heart-shaped photo frame template with empty transparent photo slots, decorated with small pastel hearts, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Kawaii frame', prompt: 'Cute kawaii characters photo frame template with empty transparent photo slots, decorated with smiling pastel clouds and stars, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Y2K frame', prompt: 'Cute Y2K retro photo frame template with empty transparent photo slots, decorated with cyber butterfly motifs and pink sparkles, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Vintage frame', prompt: 'Cute vintage-style paper texture photo frame template with empty transparent photo slots, cottagecore flowers, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Minimal frame', prompt: 'Cute minimal solid pastel beige photo frame template with empty transparent photo slots, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' },
      { name: 'Premium frame', prompt: 'Cute premium quality photo frame template with empty transparent photo slots, soft gold borders and subtle glow sparkles, korean photobooth style, kawaii style, clean vector illustration, isolated asset on transparent background, no text, no watermark, high quality' }
    ]
  }
];

export const PromptHelper: React.FC = () => {
  const [activeColId, setActiveColId] = useState<string>('teddy');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const activeCol = PROMPT_COLLECTIONS.find(c => c.id === activeColId) || PROMPT_COLLECTIONS[0];

  const handleCopy = (promptText: string, id: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const allFilteredItems = PROMPT_COLLECTIONS.flatMap(col => 
    col.items
      .filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(item => ({ ...item, colName: col.name, colId: col.id }))
  );

  return (
    <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-5 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div>
          <h4 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-200 flex items-center gap-2">
            ✨ Trợ Lý Tạo Asset AI (Midjourney & DALL-E)
          </h4>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">
            Tra cứu và sao chép nhanh Prompt chuẩn hóa cho 210 loại sticker, khung ảnh và hình nền photobooth Hàn Quốc.
          </p>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-4 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs bg-white dark:bg-zinc-850 text-slate-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-rose-500 w-full md:w-60"
          />
          <div className="absolute left-2.5 top-2.5 text-slate-400">
            <Icon name="grid" size={12} />
          </div>
        </div>
      </div>

      {searchQuery ? (
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Kết quả tìm kiếm ({allFilteredItems.length} kết quả)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
            {allFilteredItems.length > 0 ? (
              allFilteredItems.map((item, idx) => (
                <div 
                  key={`${item.colId}-${idx}`} 
                  className="bg-white dark:bg-zinc-850 border border-slate-150 dark:border-zinc-800 p-3.5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-slate-850 dark:text-zinc-200">{item.name}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                        {item.colName}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 break-words leading-relaxed select-all">
                      {item.prompt}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(item.prompt, `${item.colId}-${idx}`)}
                    className={`mt-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider w-full transition-all duration-200 active:scale-95 cursor-pointer ${
                      copiedIndex === `${item.colId}-${idx}`
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600'
                    }`}
                  >
                    <Icon name={copiedIndex === `${item.colId}-${idx}` ? 'list' : 'palette'} size={12} />
                    {copiedIndex === `${item.colId}-${idx}` ? 'Đã sao chép!' : 'Sao chép Prompt'}
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-slate-400 dark:text-zinc-500 text-xs">
                Không tìm thấy prompt nào phù hợp.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1.5 lg:border-r border-slate-200 dark:border-zinc-800 pr-0 lg:pr-4 scrollbar-none">
            {PROMPT_COLLECTIONS.map((col) => (
              <button
                key={col.id}
                onClick={() => setActiveColId(col.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider cursor-pointer whitespace-nowrap transition-all duration-200 w-full text-left ${
                  activeColId === col.id
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/10 scale-[1.02]'
                    : 'bg-white dark:bg-zinc-850 text-slate-650 dark:text-zinc-400 border border-slate-150 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon name={col.icon} size={12} />
                <span className="truncate">{col.name}</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="bg-rose-500/5 border border-rose-500/10 p-3.5 rounded-2xl">
              <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">
                💡 Lưu ý kỹ thuật cho bộ sưu tập này
              </p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                {activeColId === 'background'
                  ? 'Bản thiết kế background có khung trống ở giữa, viền trang trí xung quanh. Cân nhắc tỷ lệ khung --ar 3:4 hoặc 4:6.'
                  : activeColId === 'frame'
                  ? 'Bản thiết kế khung có ô cutout trong suốt (transparent cutout slots) để lồng ảnh chụp. Chạy đầu ra dạng PNG.'
                  : activeColId === 'text'
                  ? 'Bản thiết kế text sticker sử dụng phông chữ bong bóng dễ thương (bubble letter font) và có viền bao quanh (white outline border).'
                  : 'Sticker có viền màu trắng dày (white outline border) với nền trong suốt (transparent background) để dễ dàng kéo thả và trang trí trong Canva Studio.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {activeCol.items.map((item, idx) => (
                <div 
                  key={`${activeCol.id}-${idx}`} 
                  className="bg-white dark:bg-zinc-850 border border-slate-150 dark:border-zinc-800 p-3.5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-1.5">
                    <span className="text-xs font-black text-slate-800 dark:text-zinc-200">{item.name}</span>
                    <p className="text-[10px] font-mono bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 break-words leading-relaxed select-all">
                      {item.prompt}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(item.prompt, `${activeCol.id}-${idx}`)}
                    className={`mt-3 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider w-full transition-all duration-200 active:scale-95 cursor-pointer ${
                      copiedIndex === `${activeCol.id}-${idx}`
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600'
                    }`}
                  >
                    <Icon name={copiedIndex === `${activeCol.id}-${idx}` ? 'list' : 'palette'} size={12} />
                    {copiedIndex === `${activeCol.id}-${idx}` ? 'Đã sao chép!' : 'Sao chép Prompt'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
