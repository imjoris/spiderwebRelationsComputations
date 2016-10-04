#!/bin/bash

for i in $(find . \
    -mindepth 1 \
    -maxdepth 1 \
    -type d \
    -name "d3*"); do 
    jsFile="${i:2}"'/build/'"${i:2}"'.js';
    echo '<script src="{{ URL::asset('"'"'js/d3-all/'"$jsFile'"') }}"></script>'

    # <script src="{{ URL::asset('js/d3/d3.js') }}"></script>
done
