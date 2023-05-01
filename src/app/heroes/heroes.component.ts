import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
// import { HEROES } from '../mock-heroes';
import { HeroService } from '../hero.service';
// import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent implements OnInit {
  constructor(
    private heroService: HeroService
  ) // private messageService: MessageService
  {}

  heroes: Hero[] = [];

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }
}

// heroes = HEROES;
// selectedHero?: Hero;

// onSelect(hero: Hero): void {
//   this.selectedHero = hero;
//   this.messageService.add(`You clicked on ${hero.name.toUpperCase()}.`);
// }
// getHeroes(): void {
//   this.heroes = this.heroService.getHeroes();
// }
