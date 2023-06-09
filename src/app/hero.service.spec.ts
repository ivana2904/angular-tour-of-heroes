import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';

describe('HeroService', () => {
  let heroService: HeroService;
  let httpTestingController: HttpTestingController;
  let messageService: MessageService;
  let heroesUrl: string;
  let mockData = HEROES as Hero[];
  let mockHeroes: Hero[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessageService, HeroService],
    });

    heroService = TestBed.inject(HeroService);
    httpTestingController = TestBed.inject(HttpTestingController);
    messageService = TestBed.inject(MessageService);

    mockHeroes = [...mockData];
    heroesUrl = heroService['heroesUrl'];
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(heroService).toBeTruthy();
  });

  describe('getHeroes', () => {
    it('should return mock heroes', () => {
      heroService.getHeroes().subscribe({
        next: (heroes) => expect(heroes.length).toEqual(mockHeroes.length),
        error: fail,
      });

      const req = httpTestingController.expectOne(heroesUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(mockHeroes);

      expect(messageService.messages[0]).toEqual('HeroService: Fetched heroes');
    });

    it('should fail on error', () => {
      heroService.getHeroes().subscribe({
        next: (heroes) => expect(heroes).toEqual([]),
        error: fail,
      });

      const req = httpTestingController.expectOne(heroesUrl);
      req.flush('Invalid request parameters', {
        status: 404,
        statusText: 'Bad Request',
      });

      expect(messageService.messages[0]).toEqual(
        `HeroService: getHeroes failed: Http failure response for ${heroesUrl}: 404 Bad Request`
      );
    });
  });

  describe('getHero', () => {
    it('should return single hero (id)', () => {
      const mockHero = mockHeroes[3];
      const expectedHero = { id: 4, name: 'Celeritas' };

      heroService.getHero(mockHero.id).subscribe({
        next: (response) => {
          expect(response).toEqual(expectedHero);
        },
        error: fail,
      });

      const req = httpTestingController.expectOne(
        `${heroesUrl}/${mockHero.id}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockHero);

      expect(messageService.messages[0]).toEqual(
        `HeroService: Fetched hero with id ${expectedHero.id}`
      );
    });

    it('should fail on error', () => {
      const mockHero = mockHeroes[3];
      heroService.getHero(mockHero.id).subscribe({
        next: (response) => expect(response).toBeUndefined(),
        error: fail,
      });
      const req = httpTestingController.expectOne(
        `${heroesUrl}/${mockHero.id}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush('Invalid request parameters', {
        status: 404,
        statusText: 'Bad Request',
      });

      expect(messageService.messages[0]).toEqual(
        `HeroService: getHero with id ${mockHero.id} failed: Http failure response for ${heroesUrl}/${mockHero.id}: 404 Bad Request`
      );
    });
  });

  describe('getHeroByName', () => {
    it('should return single hero (name)', () => {
      const mockHero = mockHeroes[3];
      const expectedHero = { id: 4, name: 'Celeritas' };

      heroService.getHeroByName(mockHero.name).subscribe({
        next: (response) => {
          expect(response[mockHeroes.indexOf(mockHero)]).toEqual(expectedHero);
        },
        error: fail,
      });

      const req = httpTestingController.expectOne(
        `${heroesUrl}?name=${expectedHero.name}`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(mockHeroes);

      expect(messageService.messages[0]).toEqual(
        `HeroService: Fetched hero with name ${expectedHero.name}`
      );
    });

    it('should fail on error', () => {
      const mockHero = mockHeroes[3];

      heroService.getHeroByName(mockHero.name).subscribe({
        next: (response) => expect(response).toBeUndefined(),
        error: fail,
      });

      const req = httpTestingController.expectOne(
        `${heroesUrl}?name=${mockHero.name}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush('Invalid request parameters', {
        status: 404,
        statusText: 'Bad Request',
      });

      expect(messageService.messages[0]).toEqual(
        `HeroService: getHero with name ${mockHero.name} failed: Http failure response for ${heroesUrl}?name=${mockHero.name}: 404 Bad Request`
      );
    });
  });

  describe('updateHero', () => {
    it('should update a hero', () => {
      const heroWithNewName = { id: 4, name: 'NewCeleritas' };

      heroService.updateHero(heroWithNewName).subscribe({
        next: (response) => {
          expect(response).toEqual(heroWithNewName);
        },
        error: fail,
      });

      const req = httpTestingController.expectOne(`${heroesUrl}`);
      expect(req.request.method).toEqual('PUT');
      req.flush(heroWithNewName);

      expect(messageService.messages[0]).toEqual(
        `HeroService: Updated hero with id ${heroWithNewName.id}`
      );
    });

    it('should fail on error', () => {
      const heroWithNewName = { id: 4, name: 'NewCeleritas' };

      heroService.updateHero(heroWithNewName).subscribe({
        next: (response) => {
          expect(response).toBeUndefined();
        },
        error: fail,
      });

      const req = httpTestingController.expectOne(`${heroesUrl}`);
      expect(req.request.method).toEqual('PUT');
      req.flush('Invalid request parameters', {
        status: 404,
        statusText: 'Bad Request',
      });

      expect(messageService.messages[0]).toEqual(
        `HeroService: updateHero with id ${heroWithNewName.id} failed: Http failure response for ${heroesUrl}: 404 Bad Request`
      );
    });
  });

  describe('addHero', () => {
    it('should add a hero', () => {
      const newHero = { id: 30, name: 'NewEntry' };

      heroService.addHero(newHero).subscribe({
        next: (response) => {
          expect(response).toEqual(newHero);
        },
        error: fail,
      });

      const req = httpTestingController.expectOne(`${heroesUrl}`);
      expect(req.request.method).toEqual('POST');
      req.flush(newHero);

      expect(messageService.messages[0]).toEqual(
        `HeroService: Added hero with id ${newHero.id}`
      );
    });

    it('should fail on error', () => {
      const newHero = { id: 30, name: 'NewEntry' };

      heroService.addHero(newHero).subscribe({
        next: (response) => {
          expect(response).toBeUndefined();
        },
        error: fail,
      });

      const req = httpTestingController.expectOne(`${heroesUrl}`);
      expect(req.request.method).toEqual('POST');
      req.flush('Invalid request parameters', {
        status: 404,
        statusText: 'Bad Request',
      });

      expect(messageService.messages[0]).toEqual(
        `HeroService: addHero with id ${newHero.id} failed: Http failure response for ${heroesUrl}: 404 Bad Request`
      );
    });
  });

  describe('deleteHero', () => {
    it('should delete hero', () => {
      const heroToDelete = { id: 36, name: 'BadHero' };

      heroService.deleteHero(heroToDelete.id).subscribe({
        next: (response) => {
          expect(response).toEqual(heroToDelete);
        },
        error: fail,
      });

      const req = httpTestingController.expectOne(
        `${heroesUrl}/${heroToDelete.id}`
      );
      expect(req.request.method).toEqual('DELETE');
      req.flush(heroToDelete);

      expect(messageService.messages[0]).toEqual(
        `HeroService: Deleted hero with id ${heroToDelete.id}`
      );
    });

    it('should fail on error', () => {
      const heroToDelete = { id: 36, name: 'BadHero' };

      heroService.deleteHero(heroToDelete.id).subscribe({
        next: (response) => {
          expect(response).toBeUndefined();
        },
        error: fail,
      });

      const req = httpTestingController.expectOne(
        `${heroesUrl}/${heroToDelete.id}`
      );
      expect(req.request.method).toEqual('DELETE');

      req.flush('Invalid request parameters', {
        status: 404,
        statusText: 'Bad Request',
      });

      expect(messageService.messages[0]).toEqual(
        `HeroService: deleteHero with id ${heroToDelete.id} failed: Http failure response for ${heroesUrl}/${heroToDelete.id}: 404 Bad Request`
      );
    });
  });

  describe('searchHeroes', () => {
    it('should search heroes matching a term', () => {
      const termToSearch = 'Ma';
      const foundHeroes = [
        { id: 5, name: 'Magneta' },
        { id: 6, name: 'RubberMan' },
        { id: 7, name: 'Dynama' },
        { id: 9, name: 'Magma' },
      ];

      heroService.searchHeroes(termToSearch).subscribe({
        next: (heroes) => expect(heroes.length).toEqual(foundHeroes.length),
        error: fail,
      });

      const req = httpTestingController.expectOne(
        `${heroesUrl}?name=${termToSearch}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(foundHeroes);

      expect(messageService.messages[0]).toEqual(
        `HeroService: Matches for heroes containing term ${termToSearch}: ${foundHeroes.length}`
      );
    });

    it('should not find heroes if none is matching a term', () => {
      const termToSearch = 'xxxx';

      heroService.searchHeroes(termToSearch).subscribe({
        next: (heroes) => expect(heroes).toEqual([]),
        error: fail,
      });

      const req = httpTestingController.expectOne(
        `${heroesUrl}?name=${termToSearch}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush([]);

      expect(messageService.messages[0]).toEqual(
        `HeroService: No matches for heroes containing term ${termToSearch}`
      );
    });

    it('should return empty array if no term has been passed', () => {
      const termToSearch = '';

      heroService.searchHeroes(termToSearch).subscribe({
        next: (heroes) => expect(heroes).toEqual([]),
        error: fail,
      });

      const req = httpTestingController.expectNone(
        `${heroesUrl}?name=${termToSearch}`
      );
    });

    it('should fail on error', () => {
      const termToSearch = 'r';

      heroService.searchHeroes(termToSearch).subscribe({
        next: (heroes) => expect(heroes).toEqual([]),
        error: fail,
      });

      const req = httpTestingController.expectOne(
        `${heroesUrl}?name=${termToSearch}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush('Invalid request parameters', {
        status: 404,
        statusText: 'Bad Request',
      });

      expect(messageService.messages[0]).toEqual(
        `HeroService: searchHeroes failed: Http failure response for ${heroesUrl}?name=${termToSearch}: 404 Bad Request`
      );
    });
  });

  describe('log', () => {
    it('should log a success message', () => {
      const logSpy = spyOn<any>(heroService, 'log').and.callThrough();

      const mockHero = mockHeroes[3];

      heroService.getHero(mockHero.id).subscribe({
        next: (response) => expect(response).toEqual(mockHero),
        error: fail,
      });

      const req = httpTestingController.expectOne(
        `${heroesUrl}/${mockHero.id}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockHero);

      expect(messageService.messages[0]).toEqual(
        `HeroService: Fetched hero with id ${mockHero.id}`
      );
      expect(logSpy).toHaveBeenCalledTimes(1);
    });

    it('should log an error message', () => {
      const logSpy = spyOn<any>(heroService, 'log').and.callThrough();

      const mockHero = mockHeroes[3];

      heroService.getHero(mockHero.id).subscribe({
        next: (response) => expect(response).toBeUndefined(),
        error: fail,
      });

      const req = httpTestingController.expectOne(
        `${heroesUrl}/${mockHero.id}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush('Invalid request parameters', {
        status: 404,
        statusText: 'Bad Request',
      });

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(messageService.messages[0]).toEqual(
        `HeroService: getHero with id ${mockHero.id} failed: Http failure response for ${heroesUrl}/${mockHero.id}: 404 Bad Request`
      );
    });
  });

  describe('handleError', () => {
    it('should handle error', () => {
      const errorSpy = spyOn<any>(heroService, 'handleError').and.callThrough();
      const logSpy = spyOn<any>(heroService, 'log').and.callThrough();
      spyOn(console, 'error');

      const mockHero = mockHeroes[3];

      heroService.getHero(mockHero.id).subscribe({
        next: (response) => expect(response).toBeUndefined(),
        error: fail,
      });

      const req = httpTestingController.expectOne(
        `${heroesUrl}/${mockHero.id}`
      );
      expect(req.request.method).toEqual('GET');
      req.flush('Invalid request parameters', {
        status: 404,
        statusText: 'Bad Request',
      });

      expect(errorSpy.calls.any()).toBeTruthy();
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });
});
