<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
/* use Illuminate\Contracts\Validation\Validator; */

use App\Http\Requests;
use App\Tree;
/* use App\Http\Requests\StoreTree; */

class TreesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Tree::get());
      /* return response()->json(['name' => 'Abigail']); */
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        Tree::destroy($id);
    
        return response()->json(array('success' => true));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    /* public function store(Request $request) */

    public function store(Request $request)
    {
      $this->validate($request, [
        'name' => 'required|unique:trees|max:255',
      ]);

      $name = $request->input('name');
      /* return response()->json(array('name' => $name, 'request' => $request)); */
      Tree::create(array(
        'name' => $name
      ));
      return response()->json(array('success' => true));
    }


    /* /** */
    /*  * Show the form for creating a new resource. */
    /*  * */
    /*  * @return \Illuminate\Http\Response */
    /*  *1/ */
    /* public function create() */
    /* { */
    /*     // */
    /* } */

    /* /** */
    /*  * Display the specified resource. */
    /*  * */
    /*  * @param  int  $id */
    /*  * @return \Illuminate\Http\Response */
    /*  *1/ */
    /* public function show($id) */
    /* { */
    /*   $tree = Tree::find($id); */
    /*   $nodes = $tree->nodes->get(); */
    /*   return response()->json(array('tree' => $tree, 'nodes' => $nodes); */ 
    /* } */

    /* public function getNodes($id) */
    /* { */
    /*   $tree = Tree::find($id); */
    /*   return $tree->nodes(); */
    /* } */

    /* /** */
    /*  * Show the form for editing the specified resource. */
    /*  * */
    /*  * @param  int  $id */
    /*  * @return \Illuminate\Http\Response */
    /*  *1/ */
    /* public function edit($id) */
    /* { */
    /*     // */
    /* } */

    /* /** */
    /*  * Update the specified resource in storage. */
    /*  * */
    /*  * @param  \Illuminate\Http\Request  $request */
    /*  * @param  int  $id */
    /*  * @return \Illuminate\Http\Response */
    /*  *1/ */
    /* public function update(Request $request, $id) */
    /* { */
    /*     // */
    /* } */

}
