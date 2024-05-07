# Test Healthcare App in Typescript

Example web application with built-in security flaws to demonstrate the capabilities of 
[HoundDog.ai code scanner](https://hounddog.ai). This fictitious application written in Typescript 
allows doctors to manage information about their patients during their visits.

## Tech Stack
- Typescript
- Remix (React Framework)

## Usage

Clone the repository and `cd` into it:
```sh
git clone https://github.com/hounddogai/hounddog-test-government-app.git
cd hounddog-test-healthcare-app
```

Install dependencies:
```sh
npm install
```

To run the dev server:

```sh
npm run dev
```

To run in Docker:

```sh
# Build the Docker image
docker build -t test-healthcare-app .

# Run the Docker container at localhost:5173
docker run --rm -p 5173:5173 --name test-healthcare-app test-healthcare-app
```

Access the application at [http://localhost:5173](http://localhost:5173).
