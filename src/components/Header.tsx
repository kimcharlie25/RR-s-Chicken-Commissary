import React from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useCategories } from '../hooks/useCategories';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onOrderTrackingClick?: () => void;
  onCategoryClick?: (categoryId: string) => void;
  selectedCategory?: string;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick, onOrderTrackingClick, onCategoryClick, selectedCategory }) => {
  const { siteSettings, loading } = useSiteSettings();
  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <header className="sticky top-0 z-50 bg-branding-yellow shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={onMenuClick}
            className="flex items-center space-x-2 text-branding-primary hover:opacity-80 transition-opacity duration-200"
          >
            {loading ? (
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            ) : (
              <img
                src={siteSettings?.site_logo || "/logo.jpg"}
                alt={siteSettings?.site_name || "Beracah Cafe"}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            )}
            <h1 className="text-2xl font-bold tracking-tight">
              {loading ? (
                <div className="w-24 h-6 bg-yellow-400/50 rounded animate-pulse" />
              ) : (
                siteSettings?.site_name || "Beracah Cafe"
              )}
            </h1>
          </button>

          <div className="flex-1 overflow-x-auto mx-4 scrollbar-hide">
            <nav className="flex items-center space-x-6 min-w-max px-2">
              {categoriesLoading ? (
                <div className="flex space-x-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onCategoryClick?.('all')}
                    className={`transition-all duration-200 whitespace-nowrap text-sm uppercase tracking-wider font-bold ${selectedCategory === 'all' || !selectedCategory
                      ? 'text-branding-red border-b-2 border-branding-red'
                      : 'text-branding-primary/80 hover:text-branding-red'
                      }`}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onCategoryClick?.(category.id)}
                      className={`flex items-center space-x-1 transition-all duration-200 whitespace-nowrap text-sm uppercase tracking-wider font-bold ${selectedCategory === category.id
                        ? 'text-branding-red border-b-2 border-branding-red'
                        : 'text-branding-primary/80 hover:text-branding-red'
                        }`}
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            {/*<button
              onClick={onOrderTrackingClick}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              <Package className="h-5 w-5" />
              <span className="hidden sm:inline">Track Order</span>
            </button>*/}
            <button
              onClick={onCartClick}
              className="relative p-2 text-branding-primary hover:bg-white/20 rounded-full transition-all duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-branding-red text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg transform scale-110">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;