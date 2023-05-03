import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  private heroesUrl = 'api/heroes'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getHeroes(): Observable<Hero[]> {
    // const heroes = of(HEROES);
    // this.messageService.add('HeroService: Fetched Heroes!');
    const heroes = this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_) => this.log('Fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
    return heroes;
  }

  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url).pipe(
      map((heroes) => heroes[0]), // returns a {0|1} element array
      tap((h) => {
        const outcome = h ? 'fetched' : 'did not find';
        this.log(`${outcome} hero id=${id}`);
      }),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  getHero(id: number): Observable<Hero> {
    // const hero = HEROES.find((h) => h.id === id)!;
    // this.messageService.add(`HeroService: Fetched Hero with name ${id}!`);
    // return of(hero);
    const url = `${this.heroesUrl}/${id}`;
    const hero = this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`Fetched hero with id ${id}`)),
      catchError(this.handleError<Hero>(`getHero with id ${id}`))
    );
    return hero;
  }

  getHeroByName(name: string): Observable<Hero[]> {
    // const hero = HEROES.find((h) => h.name === name)!;
    // return of(hero);
    const url = `${this.heroesUrl}?name=${name}`;
    const hero = this.http.get<Hero[]>(url).pipe(
      tap((_) => this.log(`Fetched hero with name ${name}`)),
      catchError(this.handleError<Hero[]>(`getHero with name ${name}`))
    );
    // var actualHero: Hero;
    // hero.subscribe((hero) => (actualHero = hero[0]));
    // hero.subscribe((hero: Hero[]) => console.log(hero[0]));
    return hero;
  }

  updateHero(hero: Hero): Observable<any> {
    const url = `${this.heroesUrl}`;
    return this.http.put(url, hero, this.httpOptions).pipe(
      tap((_) => this.log(`Updated hero with id ${hero.id}`)),
      catchError(this.handleError<any>(`updateHero with id ${hero.id}`))
    );
  }
  addHero(hero: Hero): Observable<Hero> {
    const url = `${this.heroesUrl}`;
    return this.http.post<Hero>(url, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`Added hero with id w/ ${newHero.id}`)),
      catchError(this.handleError<Hero>(`addHero`))
    );
  }
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`Deleted hero with id ${id}`)),
      catchError(this.handleError<any>(`updateHero with id ${id}`))
    );
  }
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    const url = `${this.heroesUrl}?name=${term}`;
    const heroes = this.http.get<Hero[]>(url).pipe(
      tap((x) =>
        x.length
          ? this.log(`Matches for heroes containing term ${term}: ${x.length}`)
          : this.log(`No matches for heroes containing term ${term}`)
      ),
      catchError(this.handleError<Hero[]>(`searchHeroes`, []))
    );
    return heroes;
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // getHeroes(): Hero[] {
  //   return HEROES;
  // }
}
