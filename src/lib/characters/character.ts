export class Character {
  id: string;
  name: string;
  experience: number;

  constructor(id: string, name: string, experience: number = 0) {
    this.id = id;
    this.name = name;
    this.experience = experience;
  }

  get level(): number {
    // level 1 = 0-99 experience
    // level 2 = 100-399 experience
    // level 3 = 400-899 experience
    // level 4 = 900-1599 experience
    return Math.floor(Math.sqrt(this.experience / 100)) + 1;
  }

  xpForNextLevel(): number {
    const startXPForNext = this.level * this.level * 100;
    return startXPForNext - this.experience;
  }
}
