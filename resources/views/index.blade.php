<!DOCTYPE html>
<html>

<head lang="en">
    <meta charset="UTF-8">

    <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/png" href="{{ URL::asset('favicon-32x32.png') }}" sizes="32x32" />
        <title>Webbed computations</title>


        <script src="https://d3js.org/d3.v4.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>

        <!-- CSS -->
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css">

        <link rel="stylesheet" type="text/css" href="{{ URL::asset('css/bs_leftnavi.css') }}">
        <link rel="stylesheet" type="text/css" href="{{ URL::asset('css/bottombar.css') }}">
        <link rel="stylesheet" type="text/css" href="{{ URL::asset('css/misc.css') }}">

        <!-- JS -->
        <script src="{{ URL::asset('js/bs_leftnavi.js') }}"></script>


    </head>

    <body>

<!-- ################################################## -->
<!-- # To play with the lower right corner -->
<!-- ################################################## -->
    <div class="miscspacetotoywith"></div>

    @include('elements/bottombar')
    @include('elements/sidebar')
    @include('elements/main')

    </body>

</html>
