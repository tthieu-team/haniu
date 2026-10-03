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
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Palette,
  Zap,
  Gem,
  Settings,
  Eye,
  EyeOff,
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
  Filter,
  LayoutGrid,
  List,
  Layers,
  Type,
  Square,
  Circle,
  Triangle,
  Cloud,
  Bot,
  Sliders,
  Folder,
  FolderOpen,
  Maximize2,
  Volume2,
  Music,
  Clock,
  Unlock,
  BookOpen,
  Lock,
  Key,
  Crown,
  Copy,
  FileText,
  UserCheck,
  UserX,
  CreditCard,
  Wallet,
  Calendar,
  AlertTriangle,
  Leaf,
  Image,
  Share,
  Video
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
    case 'rotate':
    case 'Rotate':
    case 'rotate-ccw':
    case 'RotateCcw':
    case '🔄':
      return <RotateCcw size={size} className={className} {...props} />;
    case 'refresh-cw':
    case 'RefreshCw':
      return <RefreshCw size={size} className={className} {...props} />;
    case 'key':
    case 'Key':
    case '🔑':
      return <Key size={size} className={className} {...props} />;
    case 'crown':
    case 'Crown':
    case '👑':
      return <Crown size={size} className={className} {...props} />;
    case 'copy':
    case 'Copy':
    case '📋':
      return <Copy size={size} className={className} {...props} />;
    case 'file-text':
    case 'FileText':
    case 'profile':
      return <FileText size={size} className={className} {...props} />;
    case 'user-check':
    case 'UserCheck':
      return <UserCheck size={size} className={className} {...props} />;
    case 'user-x':
    case 'UserX':
      return <UserX size={size} className={className} {...props} />;
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
    case 'leaf':
    case 'Leaf':
    case '🌱':
      return <Leaf size={size} className={className} {...props} />;
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
    case 'image':
    case 'Image':
    case '🖼️':
      return <Image size={size} className={className} {...props} />;
    case 'save':
    case 'Save':
    case '💾':
      return <Save size={size} className={className} {...props} />;
    case 'share':
    case 'Share':
      return <Share size={size} className={className} {...props} />;
    case 'sun':
    case 'Sun':
    case '☀️':
      return <Sun size={size} className={className} {...props} />;
    case 'moon':
    case 'Moon':
    case '🌙':
      return <Moon size={size} className={className} {...props} />;
    case 'filter':
    case 'Filter':
    case 'bộ lọc':
    case 'Bộ lọc':
      return <Filter size={size} className={className} {...props} />;
    case 'grid':
    case 'Grid':
    case 'layout-grid':
    case 'LayoutGrid':
      return <LayoutGrid size={size} className={className} {...props} />;
    case 'list':
    case 'List':
      return <List size={size} className={className} {...props} />;
    case 'book':
    case 'Book':
      return <BookOpen size={size} className={className} {...props} />;
    case 'lock':
    case 'Lock':
    case '🔒':
      return <Lock size={size} className={className} {...props} />;
    case 'credit-card':
    case 'CreditCard':
    case '💳':
    case '🏦':
    case '🌸':
      return <CreditCard size={size} className={className} {...props} />;
    case 'wallet':
    case 'Wallet':
    case '💵':
      return <Wallet size={size} className={className} {...props} />;
    case 'calendar':
    case 'Calendar':
    case '📅':
      return <Calendar size={size} className={className} {...props} />;
    case 'alert':
    case 'Alert':
    case 'alert-triangle':
    case 'AlertTriangle':
    case '⚠️':
      return <AlertTriangle size={size} className={className} {...props} />;
    case 'layers':
    case 'Layers':
    case '📑':
      return <Layers size={size} className={className} {...props} />;
    case 'type':
    case 'Type':
    case 'text':
    case 'Text':
    case '🖋️':
    case '📝':
      return <Type size={size} className={className} {...props} />;
    case 'square':
    case 'Square':
    case 'rect':
    case '■':
      return <Square size={size} className={className} {...props} />;
    case 'circle':
    case 'Circle':
    case '●':
      return <Circle size={size} className={className} {...props} />;
    case 'triangle':
    case 'Triangle':
      return <Triangle size={size} className={className} {...props} />;
    case 'cloud':
    case 'Cloud':
    case '☁️':
      return <Cloud size={size} className={className} {...props} />;
    case 'bot':
    case 'Bot':
    case 'ai':
    case 'AI':
    case '🤖':
      return <Bot size={size} className={className} {...props} />;
    case 'sliders':
    case 'Sliders':
    case 'layout':
    case '📐':
      return <Sliders size={size} className={className} {...props} />;
    case 'folder':
    case 'Folder':
    case '📁':
      return <Folder size={size} className={className} {...props} />;
    case 'folder-open':
    case 'FolderOpen':
    case '📂':
      return <FolderOpen size={size} className={className} {...props} />;
    case 'maximize':
    case 'Maximize':
    case 'fit':
      return <Maximize2 size={size} className={className} {...props} />;
    case 'volume':
    case 'Volume':
    case 'Volume2':
    case '🔊':
      return <Volume2 size={size} className={className} {...props} />;
    case 'music':
    case 'Music':
    case '🎵':
      return <Music size={size} className={className} {...props} />;
    case 'clock':
    case 'Clock':
    case 'time':
    case '⏱️':
      return <Clock size={size} className={className} {...props} />;
    case 'unlock':
    case 'Unlock':
    case '🔓':
      return <Unlock size={size} className={className} {...props} />;
    case 'eye-off':
    case 'EyeOff':
    case '👁️‍🗨️':
      return <EyeOff size={size} className={className} {...props} />;
    case 'video':
    case 'Video':
    case '📹':
    case '🎥':
      return <Video size={size} className={className} {...props} />;
    default:
      // Fallback if no matching Lucide icon is found
      return <span className={`inline-block font-sans ${className}`}>{name}</span>;
  }
}
