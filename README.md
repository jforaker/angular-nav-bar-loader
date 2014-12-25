# Angularjs Contextual loading spinner

This is a simple AngularJS directive that wires itself into your app's httpinterceptors. <br>
By adding the attribute
```
jf-loader
```
to an element, it will show a spinner animation upon each http request made via that element, <br>
and the spinner will hide upon completion of the request.

### Dependencies:
jQuery <br>
[animate.css](https://github.com/daneden/animate.css) <br>

### Options
Optional attributes include any animate.css class, to be passed in like so: <br>
```
<button class="btn btn-info" jf-loader animate-class="swing">Fetch data</button>
```

### License
MIT
