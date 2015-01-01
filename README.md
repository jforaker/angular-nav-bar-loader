# Angularjs Contextual loading spinner

This is a simple AngularJS attribute directive that wires itself into your app's httpinterceptors. <br><br>
By adding the attribute
```
jf-loader
```
to an element, it will show a spinner animation upon each http request made via that element, and the spinner will hide upon completion of the request.

### Dependencies:
jQuery <br>

### Options
Add [animate.css](https://github.com/daneden/animate.css) and pass in any of its classes to the `animateClass` attr for extra effects like so: <br>
```
<button class="btn btn-info" jf-loader animate-class="swing">Fetch data</button>
```

## [Demo](http://jforaker.github.io/angular-contextual-spinner/demo/demo.html)
### License
MIT
