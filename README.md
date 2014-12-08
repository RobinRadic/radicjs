radicjs
=============
**version:** 0.0.1

A modular Javascript library builder using RequireJS optimizer. 
Provides my projects with commonly used functionality while maintaining the ability to keep the library as small as possible.
It uses some of lodash functions. 
  
  
## Requirements
- jQuery


## Getting Started
Add a build to your liking using the _config.yml
```yaml
tmp: ./tmp

app: src
dest: dist


modules_external_deps:
  github/oauthio: oauthio
  spinner: spinner
  template: handlebars

default: small
builds:
  small:
    filename: radic.small
    modules: [ base, core ]
    lodash: [ omit, pick, values, keys, where, cloneDeep, isUndefined ]
  all:
    filename: radic.all
    modules: [ base, core,
              async/waterfall, async/each, cookie, crypt, github, github/oauthio, github/sync, json, # sdf
              spinner, sprintf, storage, template, template/general, template/comparisons, widgets, widgets/base, wordwrap,
              exports/amd, exports/global ]
    lodash: [ omit, pick, values, keys, where, cloneDeep, isUndefined ]
```

#### Run it
```bash
grunt radic:help

grunt radic:custom --filename customized --modules base,core,async/waterfall --lodash omit,pick,values,keys,where

grunt radic:small

grunt radic:small --filename mysmall
```

## License
Copyright 2014 Robin Radic 

[MIT Licensed](http://radic.mit-license.org)

