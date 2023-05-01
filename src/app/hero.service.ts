import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(private messageService: MessageService) {}
  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messageService.add('HeroService: Fetched Heroes!');
    return heroes;
  }
  getHero(name: String): Observable<Hero> {
    const hero = HEROES.find((h) => h.name === name)!;
    this.messageService.add(`HeroService: Fetched Hero with name ${name}!`);
    return of(hero);
  }
  // getHeroes(): Hero[] {
  //   return HEROES;
  // }
}
