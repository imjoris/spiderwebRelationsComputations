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
        <link rel="stylesheet" type="text/css" href="{{ URL::asset('css/myd3svg.css') }}">

        <!-- JS -->
        <script src="{{ URL::asset('js/d3-all/d3-hierarchy/build/d3-hierarchy.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-scale/build/d3-scale.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3/build/d3.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-dsv/build/d3-dsv.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-chord/build/d3-chord.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-path/build/d3-path.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-quadtree/build/d3-quadtree.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-timer/build/d3-timer.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-transition/build/d3-transition.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-format/build/d3-format.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-request/build/d3-request.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-random/build/d3-random.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-brush/build/d3-brush.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-color/build/d3-color.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-selection/build/d3-selection.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-zoom/build/d3-zoom.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-voronoi/build/d3-voronoi.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-array/build/d3-array.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-force/build/d3-force.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-queue/build/d3-queue.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-interpolate/build/d3-interpolate.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-axis/build/d3-axis.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-geo/build/d3-geo.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-time/build/d3-time.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-shape/build/d3-shape.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-drag/build/d3-drag.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-ease/build/d3-ease.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-dispatch/build/d3-dispatch.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-time-format/build/d3-time-format.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-polygon/build/d3-polygon.js') }}"></script>
        <script src="{{ URL::asset('js/d3-all/d3-collection/build/d3-collection.js') }}"></script>

    </head>

    <!-- <body onload="setupSvg()"> -->

    <body class="main">
        @include('elements/bottombar') @include('elements/sidebar') @include('elements/misc')
    </body>

    <script src="{{ URL::asset('js/bs_leftnavi.js') }}"></script>
    <script src="{{ URL::asset('js/sidebar.js') }}"></script>
    <script src="{{ URL::asset('js/MyGraph2.js') }}"></script>
    <script src="{{ URL::asset('js/myd3svg.js') }}"></script>

    <script src="{{ URL::asset('js/angular/graph/graphCtrl.js') }}"></script>
    <script src="{{ URL::asset('js/angular/graph/graphService.js') }}"></script>
    <script src="{{ URL::asset('js/angular/app.js') }}"></script>
        <!-- <script src="{{ URL::asset('') }}"></script> -->
        <!-- <script src="{{ URL::asset('') }}"></script> -->

</html>
