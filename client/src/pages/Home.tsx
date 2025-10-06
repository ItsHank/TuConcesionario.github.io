import { useState, useMemo, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FilterBar from "@/components/FilterBar";
import VehicleCard from "@/components/VehicleCard";
import VIPSelector from "@/components/VIPSelector";
import { vehicles, type VehicleCategory, type PriceRange } from "@shared/schema";
import { dealershipConfig } from "@shared/config";
import type { VIPLevel } from "@/lib/vipDiscounts";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory | "ALL">("ALL");
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">("price-desc");
  const [vipLevel, setVipLevel] = useState<VIPLevel>("NONE");
  
  const catalogRef = useRef<HTMLDivElement>(null);

  const handleExploreClick = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategorySelect = (category: VehicleCategory) => {
    setSelectedCategory(category);
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;

    if (searchQuery) {
      filtered = filtered.filter(v => 
        v.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "ALL") {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }

    if (selectedPriceRange !== "ALL") {
      filtered = filtered.filter(v => v.priceRange === selectedPriceRange);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return a.model.localeCompare(b.model);
    });

    return sorted;
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("ALL");
    setSelectedPriceRange("ALL");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection onExploreClick={handleExploreClick} />
      
      <CategorySection onCategorySelect={handleCategorySelect} />
      
      <div className="py-16 px-6 bg-muted/30" ref={catalogRef}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Catálogo Completo
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {filteredVehicles.length} vehículo{filteredVehicles.length !== 1 ? 's' : ''} disponible{filteredVehicles.length !== 1 ? 's' : ''}
            </p>
            
            <div className="mb-8">
              <VIPSelector selectedLevel={vipLevel} onLevelChange={setVipLevel} />
            </div>
            
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedPriceRange={selectedPriceRange}
              onPriceRangeChange={setSelectedPriceRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
            />
          </div>
          
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl text-muted-foreground">
                No se encontraron vehículos con los filtros seleccionados
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} vipLevel={vipLevel} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <footer className="bg-card border-t py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-2">{dealershipConfig.name}</h3>
          <p className="text-muted-foreground">
            {dealershipConfig.tagline}
          </p>
        </div>
      </footer>
    </div>
  );
}
