## Postman Requests (Animales y Tratamientos)

Usa estas muestras en Postman para probar el backend Ktor.

Base URL: `http://localhost:9090/api`

### Crear Animal

POST `http://localhost:9090/api/animales`

Headers:
- `Content-Type: application/json`
- `Authorization: Bearer <TOKEN>` (opcional si tu API lo requiere)

Body (raw JSON):
```
{
	"nombre": "Firulais",
	"peso": 12.5,
	"raza": "Mestizo",
	"sexo": "M",
	"edad": 24,
	"especie": "perro",
	"estado": "rescatado",
	"fechaSalida": null,
	"urlImage": "https://example.com/imagen.jpg",
	"rescatistaId": "0ca33c88-ca4e-4e87-9727-58a24dfe5c38"
}
```

Respuesta esperada:
```
{
	"success": true,
	"message": "Animal creado",
	"data": {
		"id": "<uuid>",
		"nombre": "Firulais",
		"peso": 12.5,
		"raza": "Mestizo",
		"sexo": "M",
		"edad": 24,
		"especie": "perro",
		"estado": "rescatado",
		"fechaSalida": null,
		"urlImage": "https://example.com/imagen.jpg",
		"rescatistaId": "0ca33c88-ca4e-4e87-9727-58a24dfe5c38"
	}
}
```

### Crear Tratamiento

POST `http://localhost:9090/api/tratamientos`

Headers:
- `Content-Type: application/json`
- `Authorization: Bearer <TOKEN>` (opcional)

Body (raw JSON):
```
{
	"fechaInicio": "2025-11-29T12:00:00Z",
	"receta": null,
	"animalId": "<uuid-del-animal>",
	"medicamentos": [
		{
			"nombre": "Amoxicilina",
			"descripcion": "Antibiótico",
			"dosis": "500 mg",
			"cantidad": 10
		}
	]
}
```

Respuesta esperada:
```
{
	"success": true,
	"message": "Tratamiento creado",
	"data": {
		"id": "<uuid>",
		"fechaInicio": "2025-11-29T12:00:00Z",
		"receta": null,
		"animalId": "<uuid-del-animal>",
		"medicamentos": [
			{
				"id": "<uuid>",
				"nombre": "Amoxicilina",
				"descripcion": "Antibiótico",
				"dosis": "500 mg",
				"cantidad": 10
			}
		]
	}
}
```

### cURL (alternativa rápida)

```
curl -X POST http://localhost:9090/api/animales \
	-H "Content-Type: application/json" \
	-d '{
		"nombre":"Firulais","peso":12.5,"raza":"Mestizo","sexo":"M","edad":24,
		"especie":"perro","estado":"rescatado","fechaSalida":null,
		"urlImage":"https://example.com/imagen.jpg","rescatistaId":"0ca33c88-ca4e-4e87-9727-58a24dfe5c38"
	}'

curl -X POST http://localhost:9090/api/tratamientos \
	-H "Content-Type: application/json" \
	-d '{
		"fechaInicio":"2025-11-29T12:00:00Z","receta":null,
		"animalId":"<uuid-del-animal>",
		"medicamentos":[{"nombre":"Amoxicilina","descripcion":"Antibiótico","dosis":"500 mg","cantidad":10}]
	}'
```
# HuellitasCallejeras

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
