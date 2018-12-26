import {PLATFORM} from 'aurelia-pal';

export class App {
  constructor() {
    this.message = 'Hello World!';
  }

  configureRouter(config, router) {
    config.title = 'Multi-Mopidy';
    config.map([
      // { route: '',          name: 'home',         moduleId: PLATFORM.moduleName('./home/home'),       nav: true, title: 'Home' },
      { route: ['','home'],  name: 'home',      moduleId: PLATFORM.moduleName('./pages/home/home'),           nav: true, title: 'Home' },
      { route: 'clients',     name: 'clients',   moduleId: PLATFORM.moduleName('./pages/clients/clients'),     nav: true, title: 'Clients' },
      { route: 'broadcasters',     name: 'broadcasters',   moduleId: PLATFORM.moduleName('./pages/broadcasters/broadcasters'),     nav: true, title: 'Broadcasters' },
      { route: 'broadcasters/:id', name: 'broadcaster',   moduleId: PLATFORM.moduleName('./pages/broadcasters/broadcaster'),     nav: false, title: 'Broadcaster' }
    ]);

    this.router = router;
  }
}
