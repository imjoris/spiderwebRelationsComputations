<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tree extends Model
{
  protected $fillable = array('id', 'name');
  protected $table = 'trees';
  public function nodes() {
    /* return $this->hasMany('Node', 'tree_id'); */
    return $this->hasMany('App\Node', 'tree_id');
  }
}
