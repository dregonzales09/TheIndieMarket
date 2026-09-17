import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Game {
  id: number;
  name: string;
  image: string;
  selected: boolean;
}

@Component({
  selector: 'app-game-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-selection.component.html',
  styleUrls: ['./game-selection.component.css']
})
export class GameSelectionComponent {
  games: Game[] = [
    { id: 1, name: 'Cyber Rogue', image: '/assets/Cyber Rogue.jpg', selected: false },
    { id: 2, name: 'Neon Knights', image: '/assets/Neon Knights.jpg', selected: false },
    { id: 3, name: 'Void Walkers', image: '/assets/Void Walker.jpg', selected: false },
    { id: 4, name: 'Pixel Syndicate', image: '/assets/Pixel Syndicate.jpg', selected: false },
    { id: 5, name: 'Data Phantoms', image: '/assets/Data Phantoms.jpg', selected: false },
    { id: 6, name: 'Glitch Protocol', image: '/assets/Glitch Protocol.jpg', selected: false },
  ];

  selectedCount = 0;
  maxSelection = 3;

  constructor(private router: Router) {}

  toggleSelection(game: Game) {
    if (game.selected) {
      game.selected = false;
      this.selectedCount--;
    } else {
      if (this.selectedCount < this.maxSelection) {
        game.selected = true;
        this.selectedCount++;
      }
    }
  }

  continueToMarket() {
    if (this.selectedCount > 0) {
      this.router.navigate(['/market']);
    }
  }
}
