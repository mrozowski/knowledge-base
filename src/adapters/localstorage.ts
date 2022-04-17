export class Storage {

    private static basePrefix: string = "KnowladgeBase.";
    private static loginPrefix: string = `${this.basePrefix}login.`;

    static find(key: string): string | null {
        return localStorage.getItem(`${this.basePrefix}${key}`)
    }

    static save(key: string, value: any): void {
        localStorage.setItem(`${this.basePrefix}${key}`, value);
    }

    static remove(key: string): void {
        localStorage.removeItem(`${this.basePrefix}${key}`);
    }

    static setAsLoggedIn(email: string): void {
        localStorage.setItem(`${this.loginPrefix}`, email);
    }

    static getLoggedInUser(): string | null {
        return localStorage.getItem(this.loginPrefix);
    }

    static setAsLoggedOut(): void {
        localStorage.removeItem(this.loginPrefix);
    }
}