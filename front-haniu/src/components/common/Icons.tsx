'use client';

import React from 'react';
import {
  Search,
  ShoppingCart,
  ShoppingBag,
  Heart,
  User,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Palette,
  Zap,
  Gem,
  Settings,
  Eye,
  X,
  Check,
  Menu,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Cake,
  GraduationCap,
  Flag,
  Users,
  Handshake,
  Gift,
  Hourglass,
  ChevronDown,
  ChevronUp,
  Play,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  PartyPopper,
  Camera,
  Save,
  Sun,
  Moon,
} from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
  className?: string;
}

export default function Icon({ name, size = 16, className = '', ...props }: IconProps) {
  const normName = name.trim();

  // Mapping dict from string keys / emojis to Lucide icons
  switch (normName) {
    case 'search':
    case 'Search':
    case '🔍':
      return <Search size={size} className={className} {...props} />;
    case 'cart':
    case 'Cart':
    case '🛒':
      return <ShoppingCart size={size} className={className} {...props} />;
    case 'bag':
    case 'Bag':
    case '🛍️':
      return <ShoppingBag size={size} className={className} {...props} />;
    case 'heart':
    case 'Heart':
    case '❤️':
      return <Heart size={size} className={className} {...props} />;
    case 'user':
    case 'User':
    case '👤':
    case '👩':
    case '👨':
      return <User size={size} className={className} {...props} />;
    case 'star':
    case 'Star':
    case '★':
      return <Star size={size} className={className} {...props} />;
    case 'truck':
    case 'Truck':
    case '🚚':
      return <Truck size={size} className={className} {...props} />;
    case 'refresh':
    case 'Refresh':
    case '🔄':
      return <RotateCcw size={size} className={className} {...props} />;
    case 'shield':
    case 'Shield':
    case '🛡️':
      return <ShieldCheck size={size} className={className} {...props} />;
    case 'sparkles':
    case 'Sparkles':
    case '✨':
      return <Sparkles size={size} className={className} {...props} />;
    case 'palette':
    case 'Palette':
    case '🎨':
      return <Palette size={size} className={className} {...props} />;
    case 'zap':
    case 'Zap':
    case '🚀':
      return <Zap size={size} className={className} {...props} />;
    case 'gem':
    case 'Gem':
    case '💎':
      return <Gem size={size} className={className} {...props} />;
    case 'gear':
    case 'Gear':
    case 'settings':
    case 'Settings':
    case '⚙️':
      return <Settings size={size} className={className} {...props} />;
    case 'eye':
    case 'Eye':
    case '👁️':
      return <Eye size={size} className={className} {...props} />;
    case 'close':
    case 'Close':
    case 'x':
    case 'X':
    case '✕':
      return <X size={size} className={className} {...props} />;
    case 'check':
    case 'Check':
    case '✓':
      return <Check size={size} className={className} {...props} />;
    case 'menu':
    case 'Menu':
    case '☰':
      return <Menu size={size} className={className} {...props} />;
    case 'plus':
    case 'Plus':
    case '+':
      return <Plus size={size} className={className} {...props} />;
    case 'minus':
    case 'Minus':
    case '-':
      return <Minus size={size} className={className} {...props} />;
    case 'arrow-right':
    case 'ArrowRight':
    case '→':
    case '->':
      return <ArrowRight size={size} className={className} {...props} />;
    case 'arrow-left':
    case 'ArrowLeft':
    case '←':
    case '<-':
    case '⬅️':
      return <ArrowLeft size={size} className={className} {...props} />;
    case 'cake':
    case 'Cake':
    case '🎂':
      return <Cake size={size} className={className} {...props} />;
    case 'heart-love':
    case '💖':
      return <Heart size={size} className={className} {...props} />;
    case 'teacher':
    case 'Graduation':
    case '👨‍🏫':
    case '🧑‍🏫':
    case '👩‍🏫':
      return <GraduationCap size={size} className={className} {...props} />;
    case 'flag':
    case 'Flag':
    case '🇻🇳':
      return <Flag size={size} className={className} {...props} />;
    case 'users':
    case 'Users':
    case '👥':
      return <Users size={size} className={className} {...props} />;
    case 'partner':
    case 'Partner':
    case '🤝':
      return <Handshake size={size} className={className} {...props} />;
    case 'gift':
    case 'Gift':
    case '🎁':
      return <Gift size={size} className={className} {...props} />;
    case 'party':
    case 'Party':
    case '🎉':
      return <PartyPopper size={size} className={className} {...props} />;
    case 'hourglass':
    case 'Hourglass':
    case '⏳':
      return <Hourglass size={size} className={className} {...props} />;
    case 'chevron-down':
    case '▼':
      return <ChevronDown size={size} className={className} {...props} />;
    case 'chevron-up':
    case '▲':
      return <ChevronUp size={size} className={className} {...props} />;
    case 'play':
    case 'Play':
    case '▶':
      return <Play size={size} className={className} {...props} />;
    case 'phone':
    case 'Phone':
    case '📞':
      return <Phone size={size} className={className} {...props} />;
    case 'mail':
    case 'Mail':
    case '✉️':
      return <Mail size={size} className={className} {...props} />;
    case 'map-pin':
    case 'MapPin':
    case '📍':
      return <MapPin size={size} className={className} {...props} />;
    case 'edit':
    case 'Edit':
    case '✏️':
      return <Edit size={size} className={className} {...props} />;
    case 'trash':
    case 'delete':
    case 'Trash2':
    case '🗑️':
      return <Trash2 size={size} className={className} {...props} />;
    case 'camera':
    case 'Camera':
    case '📷':
      return <Camera size={size} className={className} {...props} />;
    case 'save':
    case 'Save':
    case '💾':
      return <Save size={size} className={className} {...props} />;
    case 'sun':
    case 'Sun':
    case '☀️':
      return <Sun size={size} className={className} {...props} />;
    case 'moon':
    case 'Moon':
    case '🌙':
      return <Moon size={size} className={className} {...props} />;
    default:
      // Fallback if no matching Lucide icon is found
      return <span className={`inline-block font-sans ${className}`}>{name}</span>;
  }
}
