export class SelectedAnimalStore {
  private static KEY = 'selected_animal_id';

  static set(id: string) {
    try { localStorage.setItem(SelectedAnimalStore.KEY, id); } catch (e) {}
  }

  static get(): string | null {
    try { return localStorage.getItem(SelectedAnimalStore.KEY); } catch (e) { return null; }
  }

  static clear() {
    try { localStorage.removeItem(SelectedAnimalStore.KEY); } catch (e) {}
  }
}
