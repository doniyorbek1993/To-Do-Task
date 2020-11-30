<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('/users/update', 'UserController@update');

Route::post('login', 'UserController@login');
Route::post('register', 'UserController@register');
Route::group(['middleware' => ['auth:api']], function () {

    //Users
    Route::get('/users', 'UserController@index');
    Route::get('/users/show', 'UserController@show');
    Route::delete('/users/delete/{id}', 'UserController@destroy');

    //Tasks
    Route::post('/tasks', 'TaskController@index');
    Route::post('/tasks/update', 'TaskController@update');
    Route::get('/tasks/finish/{id}', 'TaskController@finish');
    Route::delete('/tasks/delete/{id}', 'TaskController@destroy');
});
