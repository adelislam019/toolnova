import React from 'react';
import {
  FileImage,
  Image,
  Layers,
  Minimize2,
  Maximize2,
  FileCode,
  Camera,
  Palette,
  FileText,
  FilePlus2,
  Scissors,
  Monitor,
  ScanText,
  Crop,
  ShieldCheck,
  QrCode,
  AppWindow,
  Braces,
  Link2,
  Megaphone,
  Wrench,
} from 'lucide-react';
import { ToolIconName } from '../data/toolsConfig';

interface ToolIconProps {
  name: ToolIconName;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'FileImage':
      return <FileImage className={className} aria-hidden="true" />;
    case 'Image':
      return <Image className={className} aria-hidden="true" />;
    case 'Layers':
      return <Layers className={className} aria-hidden="true" />;
    case 'Minimize2':
      return <Minimize2 className={className} aria-hidden="true" />;
    case 'Maximize2':
      return <Maximize2 className={className} aria-hidden="true" />;
    case 'FileCode':
      return <FileCode className={className} aria-hidden="true" />;
    case 'Camera':
      return <Camera className={className} aria-hidden="true" />;
    case 'Palette':
      return <Palette className={className} aria-hidden="true" />;
    case 'FileText':
      return <FileText className={className} aria-hidden="true" />;
    case 'FilePlus2':
      return <FilePlus2 className={className} aria-hidden="true" />;
    case 'Scissors':
      return <Scissors className={className} aria-hidden="true" />;
    case 'Monitor':
      return <Monitor className={className} aria-hidden="true" />;
    case 'ScanText':
      return <ScanText className={className} aria-hidden="true" />;
    case 'Crop':
      return <Crop className={className} aria-hidden="true" />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} aria-hidden="true" />;
    case 'QrCode':
      return <QrCode className={className} aria-hidden="true" />;
    case 'AppWindow':
      return <AppWindow className={className} aria-hidden="true" />;
    case 'Braces':
      return <Braces className={className} aria-hidden="true" />;
    case 'Link2':
      return <Link2 className={className} aria-hidden="true" />;
    case 'Megaphone':
      return <Megaphone className={className} aria-hidden="true" />;
    default:
      return <Wrench className={className} aria-hidden="true" />;
  }
};
