import {
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CreditCard,
  Edit,
  Eye,
  Hash,
  IndianRupee,
  LifeBuoy,
  ListFilter,
  Loader2,
  Mail,
  Menu,
  MoreHorizontal,
  Package,
  PackageSearch,
  Phone,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Timer,
  Trash,
  Truck,
  User,
  X,
} from "lucide-react";

export function CustomIcon(icon: string) {
  switch (icon) {
    case "User":
      return (
        <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "IndianRupee":
      return (
        <IndianRupee className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Package":
      return (
        <Package className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Phone":
      return (
        <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "ShoppingBag":
      return (
        <ShoppingBag className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Eye":
      return (
        <Eye className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Edit":
      return (
        <Edit className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Trash":
      return (
        <Trash className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Plus":
      return (
        <Plus className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "X":
      return (
        <X className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Check":
      return (
        <Check className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "ChevronDown":
      return (
        <ChevronDown className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "ChevronUp":
      return (
        <ChevronUp className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "ChevronLeft":
      return (
        <ChevronLeft className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "ChevronRight":
      return (
        <ChevronLeft className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground rotate-180" />
      );
    case "ChevronUpDown":
      return (
        <ChevronUp className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground rotate-90" />
      );
    case "Loader2":
      return (
        <Loader2 className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Download":
      return (
        <Loader2 className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Search":
      return (
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "PackageSearch":
      return (
        <PackageSearch className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "ListFilter":
      return (
        <ListFilter className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "MoreHorizontal":
      return (
        <MoreHorizontal className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );

    case "RefreshCw":
      return (
        <RefreshCw className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );

    case "Mail":
      return (
        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Calendar":
      return (
        <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Hash":
      return (
        <Hash className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "CreditCard":
      return (
        <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Printer":
      return (
        <Printer className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Truck":
      return (
        <Truck className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Menu":
      return (
        <Menu className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Timer":
      return (
        <Timer className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Sparkles":
      return (
        <Sparkles className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "Settings":
      return (
        <Settings className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    case "LifeBuoy":
      return (
        <LifeBuoy className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
      );
    default:
      return null;
  }
}
