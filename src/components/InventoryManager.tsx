import React, { useMemo, useState } from 'react';
import { ArrowLeft, AlertTriangle, Minus, Plus, RefreshCw, Save } from 'lucide-react';
import { MenuItem } from '../types';

type InventoryManagerProps = {
  items: MenuItem[];
  onBack: () => void;
  onUpdateItem: (id: string, updates: Partial<MenuItem>) => Promise<void>;
  loading: boolean;
};

const InventoryManager: React.FC<InventoryManagerProps> = ({ items, onBack, onUpdateItem, loading }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [pendingChanges, setPendingChanges] = useState<Record<string, Partial<MenuItem>>>({});
  const [isSaving, setIsSaving] = useState(false);

  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    );
  }, [items, query]);

  const adjustStock = (item: MenuItem, delta: number) => {
    // Determine current effective stock (from pending or original)
    const pending = pendingChanges[item.id] || {};
    const currentTrack = pending.trackInventory ?? item.trackInventory;

    if (!currentTrack) return;

    const currentStock = pending.stockQuantity ?? item.stockQuantity ?? 0;
    const next = Math.max(0, currentStock + delta);

    setPendingChanges(prev => ({
      ...prev,
      [item.id]: {
        ...prev[item.id],
        trackInventory: true,
        stockQuantity: next
      }
    }));
  };

  const updateStock = (item: MenuItem, rawValue: string) => {
    const pending = pendingChanges[item.id] || {};
    const currentTrack = pending.trackInventory ?? item.trackInventory;

    if (!currentTrack) return;

    const numeric = Math.max(0, Math.floor(Number(rawValue)) || 0);

    setPendingChanges(prev => ({
      ...prev,
      [item.id]: {
        ...prev[item.id],
        trackInventory: true,
        stockQuantity: numeric
      }
    }));
  };

  const updateThreshold = (item: MenuItem, rawValue: string) => {
    const pending = pendingChanges[item.id] || {};
    const currentTrack = pending.trackInventory ?? item.trackInventory;

    if (!currentTrack) return;

    const numeric = Math.max(0, Math.floor(Number(rawValue)) || 0);

    setPendingChanges(prev => ({
      ...prev,
      [item.id]: {
        ...prev[item.id],
        trackInventory: true,
        lowStockThreshold: numeric
      }
    }));
  };

  const toggleTracking = (item: MenuItem, track: boolean) => {
    setPendingChanges(prev => {
      const currentPending = prev[item.id] || {};
      const stock = currentPending.stockQuantity ?? item.stockQuantity ?? 0;
      const threshold = currentPending.lowStockThreshold ?? item.lowStockThreshold ?? 0;

      return {
        ...prev,
        [item.id]: {
          ...currentPending,
          trackInventory: track,
          stockQuantity: track ? Math.max(0, Math.floor(Number(stock))) : null,
          lowStockThreshold: track ? Math.max(0, Math.floor(Number(threshold))) : 0,
        }
      };
    });
  };

  const handleSave = async () => {
    const idsToUpdate = Object.keys(pendingChanges);
    if (idsToUpdate.length === 0) return;

    setIsSaving(true);
    try {
      // Process updates sequentially to avoid race conditions/overwhelming server
      for (const id of idsToUpdate) {
        setProcessingId(id);
        const updates = pendingChanges[id];

        // Calculate available status based on new values
        const item = items.find(i => i.id === id);
        if (item) {
          const finalStock = updates.stockQuantity ?? item.stockQuantity ?? 0;
          const finalThreshold = updates.lowStockThreshold ?? item.lowStockThreshold ?? 0;
          const finalTrack = updates.trackInventory ?? item.trackInventory;

          if (finalTrack) {
            updates.available = finalStock > finalThreshold;
          }
        }

        await onUpdateItem(id, updates);
      }
      setPendingChanges({});
      alert('All changes saved successfully!');
    } catch (error) {
      console.error('Failed to save changes', error);
      alert('Failed to save some changes. Please try again.');
    } finally {
      setIsSaving(false);
      setProcessingId(null);
    }
  };

  const handleDiscard = () => {
    if (confirm('Discard all unsaved changes?')) {
      setPendingChanges({});
    }
  };

  const isProcessing = (id: string) => processingId === id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              <h1 className="text-2xl font-playfair font-semibold text-black">Inventory Management</h1>
              {Object.keys(pendingChanges).length > 0 && (
                <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Unsaved Changes
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search menu items or categories"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-500">
              Track inventory to automatically disable low-stock items.
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const pending = pendingChanges[item.id] || {};
                  const hasChanges = Object.keys(pending).length > 0;

                  // Merge original item with pending changes
                  const mergedItem = { ...item, ...pending };

                  const tracking = mergedItem.trackInventory ?? false;
                  const stock = tracking ? mergedItem.stockQuantity ?? 0 : null;
                  const threshold = tracking ? mergedItem.lowStockThreshold ?? 0 : null;
                  const low = tracking && stock !== null && threshold !== null && stock <= threshold;
                  return (
                    <tr key={item.id} className={`${low ? 'bg-red-50/40' : ''} ${hasChanges ? 'bg-yellow-50/50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{mergedItem.name}</span>
                          <span className="text-xs text-gray-500">{mergedItem.category}</span>
                          {hasChanges && <span className="text-[10px] text-yellow-600 font-medium">Modified</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <label className="inline-flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={tracking}
                            onChange={(e) => toggleTracking(item, e.target.checked)}
                            disabled={isProcessing(item.id)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-600">{tracking ? 'Enabled' : 'Disabled'}</span>
                        </label>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tracking ? (
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => adjustStock(item, -1)}
                              disabled={isProcessing(item.id) || !tracking || stock === null || stock === 0}
                              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={stock ?? 0}
                              onChange={(e) => updateStock(item, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                              }}
                              disabled={isProcessing(item.id)}
                              className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => adjustStock(item, 1)}
                              disabled={isProcessing(item.id) || !tracking}
                              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Tracking disabled</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tracking ? (
                          <input
                            type="number"
                            min={0}
                            value={threshold ?? 0}
                            onChange={(e) => updateThreshold(item, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                              }
                            }}
                            disabled={isProcessing(item.id)}
                            className="w-24 px-2 py-1.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {tracking ? (
                            low ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Low stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                In stock
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Not tracking
                            </span>
                          )}
                          {mergedItem.autoDisabled && (
                            <span className="inline-flex items-center space-x-1 text-xs text-red-600">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              <span>Disabled</span>
                            </span>
                          )}
                          {isProcessing(item.id) && <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filteredItems.length && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      No menu items found. Try adjusting your search.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      Loading inventory...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Save Changes Floating Bar */}
      {Object.keys(pendingChanges).length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 flex items-center gap-4 z-50 animate-fade-in-up">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {Object.keys(pendingChanges).length} item(s) modified
            </span>
            <span className="text-xs text-gray-500">
              Don't forget to save your changes
            </span>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDiscard}
              disabled={isSaving}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
