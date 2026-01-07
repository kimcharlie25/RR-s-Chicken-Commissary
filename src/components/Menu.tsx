import React from 'react';
import { Search, X } from 'lucide-react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import MenuItemCard from './MenuItemCard';
import MobileNav from './MobileNav';

// Preload images for better performance
const preloadImages = (items: MenuItem[]) => {
  items.forEach(item => {
    if (item.image) {
      const img = new Image();
      img.src = item.image;
    }
  });
};

interface MenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number, variation?: any, addOns?: any[]) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity }) => {
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = React.useState('hot-coffee');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Preload images when menu items change
  React.useEffect(() => {
    if (menuItems.length > 0) {
      // Preload images for visible category first
      const visibleItems = menuItems.filter(item => item.category === activeCategory);
      preloadImages(visibleItems);

      // Then preload other images after a short delay
      setTimeout(() => {
        const otherItems = menuItems.filter(item => item.category !== activeCategory);
        preloadImages(otherItems);
      }, 1000);
    }
  }, [menuItems, activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const headerHeight = 64; // Header height
      const mobileNavHeight = 60; // Mobile nav height
      const offset = headerHeight + mobileNavHeight + 20; // Extra padding
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    if (categories.length > 0) {
      // Set default to dim-sum if it exists, otherwise first category
      const defaultCategory = categories.find(cat => cat.id === 'dim-sum') || categories[0];
      if (!categories.find(cat => cat.id === activeCategory)) {
        setActiveCategory(defaultCategory.id);
      }
    }
  }, [categories, activeCategory]);

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => document.getElementById(cat.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <MobileNav
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-branding-primary mb-4">We're Fri'cken Good!</h2>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative mt-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 transition-colors duration-200 ${searchQuery ? 'text-branding-red' : 'text-gray-400 group-focus-within:text-branding-red'}`} />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-11 py-3.5 bg-white border-2 border-gray-100 rounded-2xl leading-5 text-branding-primary placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-branding-yellow transition-all duration-300 shadow-sm hover:shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70 transition-opacity"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-500 animate-fade-in">
                Found {menuItems.filter(item =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchQuery.toLowerCase())
                ).length} results for "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {categories.map((category) => {
          const categoryItems = menuItems.filter(item => {
            const matchesCategory = item.category === category.id;
            const matchesSearch = !searchQuery ||
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
          });

          if (categoryItems.length === 0) return null;

          return (
            <section key={category.id} id={category.id} className="mb-16">
              <div className="flex items-center mb-8">
                <span className="text-3xl mr-3">{category.icon}</span>
                <h3 className="text-3xl font-bold text-branding-primary">{category.name}</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {categoryItems.map((item) => {
                  const cartItem = cartItems.find(cartItem =>
                    cartItem.menuItemId === item.id &&
                    !cartItem.selectedVariation &&
                    (!cartItem.selectedAddOns || cartItem.selectedAddOns.length === 0)
                  );
                  return (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={addToCart}
                      quantity={cartItem?.quantity || 0}
                      cartItemId={cartItem?.id}
                      onUpdateQuantity={updateQuantity}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* No Search Results State */}
        {searchQuery && categories.every(cat =>
          !menuItems.some(item =>
            item.category === cat.id &&
            (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        ) && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 animate-fade-in">
              <div className="text-6xl mb-4">🔎</div>
              <h3 className="text-xl font-bold text-branding-primary mb-2">No items found</h3>
              <p className="text-gray-500">
                We couldn't find any products matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 text-branding-red font-bold uppercase tracking-widest text-sm hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
      </main>
    </>
  );
};

export default Menu;
