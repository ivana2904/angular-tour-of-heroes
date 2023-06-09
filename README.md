# Tour Of Heroes

### Development environment configuration

1. install git
2. install docker https://docs.docker.com/get-docker/
3. install node v16 https://nodejs.org/en/ (including windows /mac build tools and npm)
4. clone repository from github: https://github.com/ivana2904/angular-tour-of-heroes.git
5. run `npm i`
6. run `npm start`

### Development server

Run `npm start` or `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Run `npm run build` or `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests (work in progress)

Run `npm run test` or `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Docker image

Run `npm run docker-compose` to create a “ready to deploy” docker image of the project and navigate to `http://localhost:8000/` to see it.

# More about the project

This project is the result of the [Angular tutorial: Tour of Heroes](https://angular.io/tutorial/tour-of-heroes). Following the instructions I created new components, services and modules.

I used the dependency injection to inject the services into the components and both, property and event bindings to connect the application data and the DOM.

I created the AppRoutingModule in order to implement the navigation, which allows to navigate through the project's views: dashboard, heroes and hero detail.

Further i simulate a data server by using the In-memory Web API and imported the HttpClientModule which allowed me to communicate with the simulated remote server over HTTP.

### Unit tests

I tested:

- all the HeroService component's methods
- what should be displayed and rendered in Dashboard and App Components
- only the correct creation of the other components (work in progress)

### Docker image

The Docker image contains the files from the output directory (dist), created by the ng build command. It means it's "static". In order to see what changes we did in the developing mode, we need to use the `npm run test` or `ng serve` command.
