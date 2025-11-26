export interface Animal {
       id: string,
    nombre: string,
    peso: number,
    raza: string,
    sexo: string,
    edad: number,
    especie: string,
    estado: string,
    fechaSalida?: Date | null,
    urlImage: string
}