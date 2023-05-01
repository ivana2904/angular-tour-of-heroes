import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor() {}
  messages: string[] = [];

  add(message: string): void {
    this.messages.push(message);
  }

  clear(): void {
    this.messages = [];
  }

  // getMessage(): string {
  //   return 'messaggio';
  // }

  // invert(): void {
  //   this.messages.slice().reverse();
  // }

  // getInverted(): string[] {
  //   this.invert();
  //   return this.messages;
  // }
}
