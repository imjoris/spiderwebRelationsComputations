<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
 */

Route::get('/', function () {
  /* return view('index'); */
  return View::make('index');
});

// API ROUTES ==================================
Route::group(array('prefix' => 'api'), function() {
  Route::resource('trees', 'TreesController');
  Route::get('/tree/{id}/nodes', function ($treeid) {
    $tree = Tree::find($treeid);
    $nodes = $tree->nodes()->get();
    return response()->json($nodes);
  });
  Route::resource('nodes', 'NodesController');
});


Route::get('/json/{jsonfile}', function($filename) { 
    $path = storage_path() . "/json/${filename}.json"; // ie: /var/www/laravel/app/storage/json/filename.json
    if (!File::exists($path)) {
        throw new Exception("Invalid File");
    }
    $file = File::get($path); // string
    return $file;

});

/* Route::get('/json/{jsonfile}', array( */
/*     'as' => 'load-json', */
/*     'uses' => 'JSONController@loadJSON' */
/* )); */
