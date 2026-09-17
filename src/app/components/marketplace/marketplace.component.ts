import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface MarketItem {
  id: number;
  name: string;
  category: 'Weapons' | 'Armors' | 'Pets' | 'Consumables' | 'Contraband';
  weaponType?: 'Sword' | 'Gun' | 'Experimental';
  seller: string;
  basePrice: number;
  price: number;
  image: string;
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Illegal';
  traded?: boolean;
  description: string;
  isContraband?: boolean;
  stats: {
    damage: number;
    fireRate?: number;
    durability?: number;
    accuracy?: number;
  };
}

interface Vendor {
  name: string;
  reputation: string;
  trustScore: number;
  status: string;
  avatar: string;
}

interface TradeLog {
  type: 'BUY' | 'SELL';
  itemName: string;
  price: number;
  date: Date;
}

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit, OnDestroy {
  categories = ['All', 'Weapons', 'Armors', 'Pets', 'Consumables'];
  activeCategory = 'All';
  currentView: 'market' | 'history' | 'inventory' = 'market';
  
  userCredits = 9999;
  transactionMessage = '';
  transactionStatus: 'success' | 'error' | '' = '';
  
  selectedItem: MarketItem | null = null;
  tradeHistory: TradeLog[] = [];
  
  // New features state
  searchQuery = '';
  sortOption = 'none';
  selectedVendor: Vendor | null = null;
  marketTicker = 'MARKET ONLINE // AWAITING DATA...';
  unlockedContraband = false;
  secretClicks = 0;
  marketInterval: any;

  vendors: Vendor[] = [
    { name: 'ZeroCool', reputation: 'Elite', trustScore: 98, status: 'Active', avatar: 'Z' },
    { name: 'CrashOverride', reputation: 'Renegade', trustScore: 85, status: 'Active', avatar: 'C' },
    { name: 'AcidBurn', reputation: 'Ghost', trustScore: 70, status: 'Hidden', avatar: 'A' },
    { name: 'CerealKiller', reputation: 'Wildcard', trustScore: 45, status: 'Erratic', avatar: 'K' },
    { name: 'LordNikon', reputation: 'Corporate Rat', trustScore: 92, status: 'Active', avatar: 'L' },
    { name: 'PhantomPhreak', reputation: 'Shadow Broker', trustScore: 99, status: 'Encrypted', avatar: 'P' },
    { name: 'UNKNOWN', reputation: 'REDACTED', trustScore: 0, status: 'OFFLINE', avatar: '?' }
  ];

  items: MarketItem[] = [
    { id: 1, name: 'Plasma Claymore', category: 'Weapons', weaponType: 'Sword', seller: 'ZeroCool', basePrice: 1200, price: 1200, image: '/assets/1.gif', rarity: 'Legendary', description: 'A massive heavy blade enveloped in superheated plasma.', stats: { damage: 150, durability: 80 } },
    { id: 2, name: 'Neon Katana', category: 'Weapons', weaponType: 'Sword', seller: 'CrashOverride', basePrice: 1500, price: 1500, image: '/assets/2.gif', rarity: 'Rare', description: 'A lightweight katana forged from neon-infused carbon fiber.', stats: { damage: 95, durability: 60 } },
    { id: 3, name: 'Glitch Blade', category: 'Weapons', weaponType: 'Sword', seller: 'AcidBurn', basePrice: 950, price: 950, image: '/assets/3.gif', rarity: 'Rare', description: 'An unstable sword that occasionally phases through physical matter.', stats: { damage: 110, durability: 45 } },
    { id: 4, name: 'Void Edge', category: 'Weapons', weaponType: 'Sword', seller: 'CerealKiller', basePrice: 2500, price: 2500, image: '/assets/4.gif', rarity: 'Legendary', description: 'A weapon forged in the void. Leaves no trace of its cut.', stats: { damage: 180, durability: 95 } },
    
    { id: 5, name: 'Pulse Pistol', category: 'Weapons', weaponType: 'Gun', seller: 'LordNikon', basePrice: 300, price: 300, image: '/assets/1g.gif', rarity: 'Common', description: 'Standard issue pulse pistol. Reliable sidearm.', stats: { damage: 25, fireRate: 60, accuracy: 85 } },
    { id: 6, name: 'Mag-Rifle', category: 'Weapons', weaponType: 'Gun', seller: 'PhantomPhreak', basePrice: 850, price: 850, image: '/assets/2g.gif', rarity: 'Rare', description: 'Magnetic acceleration rifle firing solid slugs at hypersonic speeds.', stats: { damage: 75, fireRate: 30, accuracy: 92 } },
    { id: 7, name: 'Laser Blaster', category: 'Weapons', weaponType: 'Gun', seller: 'ZeroCool', basePrice: 450, price: 450, image: '/assets/3g.gif', rarity: 'Common', description: 'Basic laser-based projectile weapon.', stats: { damage: 35, fireRate: 75, accuracy: 70 } },
    { id: 8, name: 'Heavy Auto-Cannon', category: 'Weapons', weaponType: 'Gun', seller: 'CrashOverride', basePrice: 1800, price: 1800, image: '/assets/4g.gif', rarity: 'Legendary', description: 'Shoulder-mounted heavy ordinance. Destroys everything.', stats: { damage: 250, fireRate: 15, accuracy: 60 } },
    { id: 9, name: 'Ion Shotgun', category: 'Weapons', weaponType: 'Gun', seller: 'AcidBurn', basePrice: 600, price: 600, image: '/assets/5g.gif', rarity: 'Common', description: 'Fires scattered ion bursts. Devastating at close range.', stats: { damage: 120, fireRate: 20, accuracy: 40 } },
    { id: 10, name: 'Railgun Prototype', category: 'Weapons', weaponType: 'Gun', seller: 'CerealKiller', basePrice: 3200, price: 3200, image: '/assets/6g.gif', rarity: 'Legendary', description: 'Experimental prototype. Fires a single armor-piercing round.', stats: { damage: 500, fireRate: 5, accuracy: 99 } },
    { id: 11, name: 'Cyber SMG', category: 'Weapons', weaponType: 'Gun', seller: 'LordNikon', basePrice: 400, price: 400, image: '/assets/7g.gif', rarity: 'Common', description: 'High-capacity submachine gun for spray and pray tactics.', stats: { damage: 18, fireRate: 150, accuracy: 55 } },
    { id: 12, name: 'Fusion Sniper', category: 'Weapons', weaponType: 'Gun', seller: 'PhantomPhreak', basePrice: 2100, price: 2100, image: '/assets/8g.gif', rarity: 'Rare', description: 'Long-range engagement fusion rifle with thermal scope.', stats: { damage: 220, fireRate: 10, accuracy: 98 } },
    { id: 13, name: 'Plasma Repeater', category: 'Weapons', weaponType: 'Gun', seller: 'ZeroCool', basePrice: 1100, price: 1100, image: '/assets/9g.gif', rarity: 'Rare', description: 'Rapidly fires superheated plasma orbs. Overheats quickly.', stats: { damage: 45, fireRate: 90, accuracy: 75 } },
    { id: 14, name: 'Nanite Rifle', category: 'Weapons', weaponType: 'Gun', seller: 'CrashOverride', basePrice: 1550, price: 1550, image: '/assets/10g.gif', rarity: 'Rare', description: 'Shoots swarms of corrosive nanites that eat through armor.', stats: { damage: 85, fireRate: 40, accuracy: 80 } },
    { id: 15, name: 'Photon Launcher', category: 'Weapons', weaponType: 'Gun', seller: 'AcidBurn', basePrice: 2800, price: 2800, image: '/assets/11g.gif', rarity: 'Legendary', description: 'Fires explosive photon blasts that deal area-of-effect damage.', stats: { damage: 300, fireRate: 12, accuracy: 65 } },
    { id: 16, name: 'Disintegrator', category: 'Weapons', weaponType: 'Gun', seller: 'CerealKiller', basePrice: 4500, price: 4500, image: '/assets/12g.gif', rarity: 'Legendary', description: 'Alien technology adapted for human use. Vaporizes targets instantly.', stats: { damage: 999, fireRate: 2, accuracy: 90 } },
    
    // Contraband Items (Hidden Initially)
    { id: 991, name: 'Black Hole Grenade', category: 'Contraband', weaponType: 'Experimental', seller: 'UNKNOWN', basePrice: 15000, price: 15000, image: 'https://via.placeholder.com/300x150/000000/ff0000?text=VOID', rarity: 'Illegal', description: 'WARNING: ILLEGAL ORDINANCE. Creates a localized singularity that consumes matter within a 50m radius.', isContraband: true, stats: { damage: 9999, fireRate: 1 } },
    { id: 992, name: 'Mind-Hack Neurotoxin', category: 'Contraband', weaponType: 'Experimental', seller: 'UNKNOWN', basePrice: 8500, price: 8500, image: 'https://via.placeholder.com/300x150/000000/ff0000?text=TOXIN', rarity: 'Illegal', description: 'Overwrites target neural pathways, turning enemies into temporary allies.', isContraband: true, stats: { damage: 0, accuracy: 100 } }
  ];

  filteredItems: MarketItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.applyFilters();
    // Simulate dynamic market prices every 5 seconds
    this.marketInterval = setInterval(() => {
      this.fluctuatePrices();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.marketInterval) {
      clearInterval(this.marketInterval);
    }
  }

  fluctuatePrices() {
    let tickerString = 'MARKET FLUCTUATIONS // ';
    
    // Pick 3 random items to fluctuate
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * this.items.length);
      const item = this.items[idx];
      
      // Random change between -5% and +5%
      const fluctuation = 1 + (Math.random() * 0.1 - 0.05); 
      const newPrice = Math.round(item.basePrice * fluctuation);
      const diff = newPrice - item.price;
      
      item.price = newPrice;
      
      if (diff !== 0) {
        const sign = diff > 0 ? '+' : '';
        tickerString += `[${item.name}: ${sign}${diff} CR] `;
      }
    }
    
    this.marketTicker = tickerString || 'MARKET STABLE...';
  }

  unlockContraband() {
    this.secretClicks++;
    if (this.secretClicks === 3 && !this.unlockedContraband) {
      this.unlockedContraband = true;
      this.categories.push('Contraband');
      this.showToast('WARNING: ENCRYPTED NETWORK ACCESSED', 'error');
    }
  }

  playTabSound() {
    const audio = new Audio('/assets/clicktabsfx.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => {});
  }

  filterByCategory(category: string) {
    this.playTabSound();
    this.currentView = 'market';
    this.activeCategory = category;
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.items];

    // Filter by Category
    if (this.activeCategory !== 'All') {
      result = result.filter(item => item.category === this.activeCategory);
    } else {
      result = result.filter(item => !item.isContraband);
    }

    if (!this.unlockedContraband) {
      result = result.filter(item => !item.isContraband);
    }

    if (this.searchQuery) {
      const lowerQ = this.searchQuery.toLowerCase();
      result = result.filter(item => item.name.toLowerCase().includes(lowerQ));
    }

    switch (this.sortOption) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'damage':
        result.sort((a, b) => (b.stats.damage || 0) - (a.stats.damage || 0));
        break;
      case 'rarity':
        const rarityVal: any = { 'Common': 1, 'Rare': 2, 'Legendary': 3, 'Illegal': 4 };
        result.sort((a, b) => rarityVal[b.rarity] - rarityVal[a.rarity]);
        break;
    }

    this.filteredItems = result;
  }

  showInventory() {
    this.playTabSound();
    this.currentView = 'inventory';
    this.filteredItems = this.items.filter(item => item.traded);
  }

  showHistory() {
    this.playTabSound();
    this.currentView = 'history';
  }

  logout() {
    this.playTabSound();
    this.router.navigate(['/']);
  }

  openItemDetails(item: MarketItem) {
    this.selectedItem = item;
  }

  closeItemDetails() {
    this.selectedItem = null;
  }

  openVendorProfile(sellerName: string, event?: Event) {
    if (event) event.stopPropagation();
    const v = this.vendors.find(x => x.name === sellerName);
    if (v) {
      this.selectedVendor = v;
    }
  }

  closeVendorProfile() {
    this.selectedVendor = null;
  }

  getVendorItems(sellerName: string): MarketItem[] {
    return this.items.filter(i => i.seller === sellerName && !i.traded);
  }

  buyItem(item: MarketItem, event?: Event) {
    if (event) event.stopPropagation();
    
    if (item.traded) return;

    if (this.userCredits >= item.price) {
      this.userCredits -= item.price;
      item.traded = true;
      this.tradeHistory.unshift({
        type: 'BUY',
        itemName: item.name,
        price: item.price,
        date: new Date()
      });
      this.showToast(`TRANSACTION SUCCESS: Acquired ${item.name}`, 'success');
      
      // Remove from view if filtering by contraband and we buy it (optional, let's keep it visible as OWNED)
    } else {
      this.showToast(`TRANSACTION FAILED: INSUFFICIENT CREDITS`, 'error');
    }
  }

  sellItem(item: MarketItem, event?: Event) {
    if (event) event.stopPropagation();

    if (!item.traded) return;

    const sellValue = Math.floor(item.price * 0.6); // 60% liquidation value
    this.userCredits += sellValue;
    item.traded = false;
    
    this.tradeHistory.unshift({
      type: 'SELL',
      itemName: item.name,
      price: sellValue,
      date: new Date()
    });
    
    this.showToast(`LIQUIDATED: ${item.name} for ${sellValue} CR`, 'success');
    
    // Refresh inventory view
    if (this.currentView === 'inventory') {
      this.showInventory();
    }
  }
  
  showToast(msg: string, status: 'success' | 'error') {
    this.transactionMessage = msg;
    this.transactionStatus = status;
    setTimeout(() => {
      this.transactionMessage = '';
      this.transactionStatus = '';
    }, 3000);
  }
}
