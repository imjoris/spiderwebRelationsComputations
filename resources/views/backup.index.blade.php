<!DOCTYPE html>
<html lang="en-us">

    <head>
        <meta charset="utf-8" />
        <meta name="author" content="Vincent Link, Steffen Lohmann, Eduard Marbach, Stefan Negru" />
        <meta name="keywords" content="webvowl, vowl, visual notation, web ontology language, owl, rdf, ontology visualization, ontologies, semantic web" />
        <meta name="description" content="WebVOWL - Web-based Visualization of Ontologies" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=1">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <link rel="icon" type="image/png" href="{{ URL::asset('favicon-32x32.png') }}" sizes="32x32" />
        <title>Webbed computations</title>

        @include('main-css')
        @include('main-scripts')
    </head>

    <body>

        <main>
        @include('elements/main-canvas-webvowl')
        @include('elements/main-rightbar-details')
        @include('elements/main-lower-optionbar')
        </main>


    </body>

</html>
