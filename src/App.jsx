import React from 'react'
import Login from './components/login';
import Signup from './components/Signup';
import Home from './components/Home';
import Change from './components/Change';
import {Route,Routes, BrowserRouter} from 'react-router-dom';

export default function App() {
	return (
		// <h1>Hello</h1>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Login/>} />
				<Route path='/signup' element={<Signup/>} />
				<Route path='/home' element={<Home/>} />
				<Route path='/change' element={<Change/>} />
			</Routes>
		</BrowserRouter>
	)

}
