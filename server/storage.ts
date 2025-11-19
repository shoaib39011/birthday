import { type BirthdayMessage } from "@shared/schema";

export interface IStorage {
  getMessage(): Promise<BirthdayMessage>;
  updateMessage(message: BirthdayMessage): Promise<BirthdayMessage>;
}

export class MemStorage implements IStorage {
  private message: BirthdayMessage;

  constructor() {
    this.message = {
      message: `You bring so much joy and happiness into this world. On your special day, I want you to know how incredibly amazing you are. May this year bring you endless smiles, unforgettable moments, and all the love your heart can hold. You deserve every wonderful thing that comes your way. Here's to celebrating YOU today and always!`,
      recipientName: undefined,
    };
  }

  async getMessage(): Promise<BirthdayMessage> {
    return this.message;
  }

  async updateMessage(message: BirthdayMessage): Promise<BirthdayMessage> {
    this.message = message;
    return this.message;
  }
}

export const storage = new MemStorage();
