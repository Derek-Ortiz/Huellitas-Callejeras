import { Injectable } from '@angular/core';
import { Animal } from '../interfaces/animalI';


@Injectable({ providedIn: 'root' })
export class CurrentAnimalStub {
  private readonly animal: Animal = {
    id: 'ed5f8452-c974-495d-b2a7-1f6e9b6f3a7b',
    nombre: 'Perla2',
    peso: 15.5,
    raza: 'Mestizo',
    sexo: 'Macho',
    edad: 2,
    especie: 'Perro',
    estado: 'En recuperación',
    urlImage: 'https://aws-s3-huellitas-callejeras-2.s3.us-east-1.amazonaws.com/animals/65b82e64-335c-4897-a710-91c7031801fc.png',
    rescatistaId: '0ca33c88-ca4e-4e87-9727-58a24dfe5c38'
  };

  getAnimal(): Animal { return this.animal; }
  getAnimalId(): string { return this.animal.id; }
}
