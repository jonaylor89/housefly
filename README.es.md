![Logotipo de Housefly](/apps/tutorial/public/housefly-logo.png)

# Housefly: Un Entorno Práctico para Web Scraping

Housefly es un proyecto de aprendizaje interactivo diseñado para enseñar web scraping a través de desafíos estructurados. Cada capítulo incluye un sitio web complementario construido específicamente para ser raspado, lo que te permite practicar en un entorno controlado.

## Características

* Desafíos Realistas de Web Scraping – Trabaja con sitios web diseñados con un propósito específico.
* Aprendizaje Estructurado – Progresa a través de ejercicios guiados.
* Verificación Automatizada de Soluciones – Verifica tus scrapers con las salidas esperadas.

## Comenzando

1. Clona el Repositorio

```sh
git clone https://github.com/jonaylor89/housefly.git
cd housefly
```

2. Navega al Capítulo 1

Cada capítulo contiene un sitio web simple para raspar, junto con un archivo `expected.txt` que define la salida correcta.

3. Escribe Tu Scraper

Implementa tu solución dentro del directorio correspondiente `solution{number}/`.

4. Verifica Tu Respuesta

Ejecuta el script de validación para comparar la salida de tu scraper con expected.txt:

```sh
# npx install playwright (opcionalmente para algunos ejercicios)
npm run ca 1
```

5. Agrega Variables de Entorno (Opcional)

Algunos de los desafíos requieren APIs de terceros, por ejemplo, OpenAI, y para esos, hay un archivo `.env.template` que puedes completar y renombrar a `.env` para usarlos

```
mv .env.template .env
```

## Estructura del Proyecto

```
housefly/
├── apps/
│   ├── chapter1/  # Sitio web para el Capítulo 1
│   │   ├── index.html
│   │   ├── package.json
│   ├── chapter2/
│   ├── chapter3/
│   ├── solution1/  # Coloca tu solución para el Capítulo 1 aquí
│   │   ├── expected.(txt, csv, json)
│   │   ├── index.ts
│   │   ├── package.json
├── scripts/
│   ├── check_answers.sh  # Script para validar soluciones
```

## Contribuciones

¡Las pull requests y sugerencias son bienvenidas! No dudes en abrir issues para reportar bugs o solicitar nuevas funcionalidades.

## Licencia

Licencia MIT

## ¿Listo para Comenzar a Scrapear?

👉 [Prueba Housefly Ahora](https://housefly.cc)


## Descargo de Responsabilidad

Esto es para fines educativos y el web scraping en sitios web que no quieren que lo hagas puede violar los Términos de Servicio y potencialmente causarte problemas si se hace a escala industrial