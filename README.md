<p align="center">
  <picture>
    <img alt="Medusa marketing logo" src="https://raw.githubusercontent.com/RSC-Labs/medusa-marketing/main/docs/medusa-marketing-logo.png">
  </picture>
</p>

# Medusa Marketing

<h2>
  Note: This plugin will be migrated to Medusa v2, when v2 will reach production readiness.
</h2>

## What is it?

Medusa Marketing is a plugin which provides a framework for sending emails based on the user's actions.

## How to install?

1. Install the package with `yarn add @rsc-labs/medusa-marketing` or `npm i @rsc-labs/medusa-marketing`.
2. In `medusa-config.js`, add the plugin to the `plugins` array and set `enableUI`

```js
const plugins = [
  // ... other plugins
  {
    resolve: `@rsc-labs/medusa-marketing`,
    options: {
      enableUI: true
    }
  }
]
```

3. Run migrations, e.g. `npx medusa migrations run` (see: https://docs.medusajs.com/development/entities/migrations/overview) as plugin uses new tables.

## Getting started

You can run a Medusa after plugin installation, but without email configuration you won't be able to send emails. 

### Before running a Medusa

Firstly, you need to configure email transport. You need to modify `medusa-config.js` and under plugin section add the email transport configuration. The example looks like this:

```js
  {
    resolve: "@rsc-labs/medusa-marketing",
    options: {
      enableUI: true,
    },
    email_transports: [
        {
          name: 'smtp',
          configuration: {
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "user@gmail.com",
              pass: "app-password"
            }
          }
        }
      ]
  }
```

In the above example, we have configured SMTP transport. Firstly you need to provide a unique name (e.g. `smtp`) and configuration assigned to this name. Name is then used on the frontend to choose the transport. Under the hood, plugin uses https://github.com/forwardemail/email-templates, which means it accepts every configuration which is supported by https://nodemailer.com (see: https://github.com/forwardemail/email-templates?tab=readme-ov-file#basic) .The example of SMTP follows example here: https://nodemailer.com/about/#example.

In a plugin, you may have many email transports, but today we support only `smtp`.

#### Templates

To create an email content, plugin uses templates. At this moment, plugin supports two kind of templates - `html` and `pug`. For simplicitly, we provide basic examples under `/assets/email-templates`.

If you would like to create your own templates, create a new directory somewhere and set this directory as `templateDir` parameter in `medusa-config.js`. It needs to be relative to `/dist` folder. For example, if you create directory called `my-email-templates` on the same level as `/dist` then you need to configure it like:
```js
  templateDir: `../my-email-templates`
```

If you do not set it, plugin uses default templates.

Your directory needs to follow below structure (see example here: https://raw.githubusercontent.com/RSC-Labs/medusa-marketing/main/src/assets):

```sh
.
└── my-email-templates
    └── html
        └── <template-name>
            └──html.html
    └── pug
        └── <template-name>
          ├── html.pug
          └── subject.pug
```

Under `my-email-templates` you need to indicate the kind of template (`html` or `pug`). Under kind of template you need to put your template name (e.g. my-super-template-name). Under `<template-name>` create proper files (`html.html` for `html` kind and two files - `html.pug` and `subject.pug` for `pug`).


### After configuration

Finally we configured our plugin! Now, we can run Medusa application and play around with the frontend :)

After running Medusa, you will see new option on the sidebar named `Marketing`. This will lead you to such view:

<p align="center">
  <picture>
    <img alt="Medusa marketing dashboard" src="https://raw.githubusercontent.com/RSC-Labs/medusa-marketing/main/docs/medusa-marketing-1.png">
  </picture>
</p>


This is a view of configured emails and useful statistics. Let's now describe it shortly:
- `Welcome` and `Back in stock` cards indicates two actions which can be configured. There can be more in the future. You can notice there following information:
  - status of action - first time you see `Undefined`, but when you will configure it, then you will see `Enabled` or `Disabled`
  - emails processed - this stat describes how many emails have been processed under this action
  - subscriptions - this stat describes how many subscribtions this action has
- `Recent activity` card shows the processed or failed emails.

#### Processed and failed emails

The plugin provides a framework for configuring actions, which are transformed to emails. However, the plugin itself does not send emails - it uses different email transports (e.g. SMTP) to send messages. Plugin is not able to tell if email has been delivered to the user, because it is under transport responsibility. In short, it looks like this:

**Plugin** -> **Email transport** -> **User**

The only thing which we can check is `Plugin -> Email transport` relation. Because of that, `Processed` status means that it has been succesfully moved from `Plugin` to `Email transport`. `Failed` status means that there was an issue by moving the message to `Email transport` - it can be a misconfiguration or a bug.


### Settings

To configure action, you need to firstly go to `Settings`. As an example, let's use `Back in stock`.

Let's go through every setting:
- `See trigger and parameters` - click on the icon and you will see what is a exact trigger and what parameters you can use in your templates.
- `Enable....` - simply - enable or disable sending messages
- `Email subject` - subject of an email, which will be send
- `Choose template for email` - if you properly configured a plugin (see [Before running a Medusa](#before-running-a-medusa)), you shall be able to choose a predefined template.

After choosing a template, you will see an email preview. Preview is based on the last entities from database (e.g. if template has parameters related to product, then preview takes the last product from database as an example).

Now, you can click save and if you enabled the action, then messages will be send automatically to clients.

### Subscriptions

Some actions (like `back in stock`) requires subscribers. In other words - customer needs subscribe for the action to get an email. We expose APIs which can be used in your Storefront. For more info please check: [Store API](./src/api/store/README.md)

## Q&A

### Why it is so complicated?

We try to keep plugin as much flexible as possible - that's why you need to configure your transport and create your own templates. We do not try to implement our own SendGrid portal - it will be to much. We just want to provide a bridge between Medusa and sending emails. 

What is more, we want to keep plugin vendor-agnostic, so that's why we support very low level configuration of email transport. However, we might consider supporting Brevo or SendGrid in the futurea as out of the box transports.


## Proposals, bugs, improvements

If you have an idea, what could be the next highest priority functionality, do not hesistate raise issue here: [Github issues](https://github.com/RSC-Labs/medusa-marketing/issues)

## License

MIT

---

© 2024 RSC https://rsoftcon.com/
