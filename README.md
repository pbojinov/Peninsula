![Peninsula Logo](http://i.imgur.com/jmrx99y.png)

## About 

Peninsula is a collection of commonly resuable client-side functions. It was born to prevent copying and pasting frequently used common functions from project to project.

## Getting Started

Install using Bower 

```
bower install peninsula
```


Install using NPM
```
npm install peninsula
```

Or by placing the `src/peninsula.js` file in your project.

```html
<script type="text/javascript" src="src/peninsula.js"/>
```

## Running Tests

```
npm install
npm test
```

## API Reference

### Functions

---

Peninsula.encode

Peninsula.decode

Peninsula.contains

Peninsula.typeOf

Peninsula.isInteger

Peninsula.isEmpty

Peninsula.isUrl

Peninsula.loadScript

Peninsula.bindEvent

Peninsula.getInjectedScripts

Peninsula.getInjectedStyles

Peninsula.getInjectedStylesSheets

Peninsula.getScripts

Peninsula.getStyles

Peninsula.cformat

Peninsula.first

Peninsula.merge

Peninsula.shuffle

Peninsula.select

Peninsula.renameProperty

Peninsula.token

Peninsula.trim

Peninsula.uuid

Peninsula.now

Peninsula.convertMS

Peninsula.preloadImages

Peninsula.multiLine

Peninsula.injectHTML

Peninsula.injectCSS

Peninsula.injectStylesheetet;

Peninsula.inIframe

Peninsula.isTouchDevice

### Properties

---

Peninsula._version

Peninsula._baseUrl

## Module forms

Peninusla is currently not available in AMD, CommonJS or other modules. Please file an issue or submit a PR if you need support for other module formats.

## Release History

* **v0.2.6** - 2015-03-31
	- Add support for AMD and CommonJS style module importing

* **v0.2.4** - 2015-03-23
	- Fix issue with wrong library source in the `/src` folder
	- Remove library from the root

* **v0.2.2** - 2015-03-23
	- Register with Bower
	- Fix some errors courtesy of jshint

* **v0.2.1** - 2015-03-23
	- Update docs
	- Add new logo
	- Clean up tests directory
	- Fix `npm tetst` so it works now
	- Add new karma.conf for testing

* **v0.1.0** - 2013-09-05
	- Initial release

## License

The MIT License (MIT)

Copyright (C) 2015 Petar Bojinov (petarbojinov@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/pbojinov/peninsula/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

