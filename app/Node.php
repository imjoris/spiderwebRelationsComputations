<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Tree;

class Node extends Model
{
  protected $fillable = array('id', 'tree_id', 'email', 'node_id', 'revenue');
  protected $table = 'nodes';
  public function tree() {
    return $this->belongsTo('Tree', 'tree_id');
  }
  public function parentnode() {
    return $this->hasOne('Node', 'node_id');
  }
}
