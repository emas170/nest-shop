import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export = {
  transport: {
    host: 'localhost:8080',
    port: 2500,
    auth: {
      user: 'admin123',
      pass: 'admin456',
    },
  },
  defaults: {
    from: 'admin@test.example.com',
  },
  template: {
    dir: './templates/email',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
