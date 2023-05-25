import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
import './css/normalize.css';
import './css/font-awesome.min.css';
import './css/style.css';
import './css/style-catalogue.css';
import './css/style-favorite.css';
import './css/style-order.css';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import CataloguePage from './components/pages/CataloguePage';
import FavoritesPage from './components/pages/FavoritesPage';
import ProductPage from './components/pages/ProductPage';
import OrderPage from './components/pages/OrderPage';
import Preloader from './components/Preloader'

import {get, localStorageGetParsedPlugin, localStorageSetParsedPlugin} from "./utils/functions";


class App extends Component {
	constructor(props) {
		super(props);

		localStorageGetParsedPlugin();
		localStorageSetParsedPlugin();

		this.api = 'https://api-neto.herokuapp.com/bosa-noga';
		this.baseurl = 'https://api-neto.herokuapp.com/bosa-noga';

		this.newApi = {
			filters: () => `${this.baseurl}/filters`,
			products: queryStr => `${this.baseurl}/products${queryStr ? `/?${queryStr}` : ''}`,

			createCart: () => `${this.baseurl}/cart`,
			getCart: id => `${this.baseurl}/cart/${id}`,
			updateCart: id => `${this.baseurl}/cart/${id}`,

			order: () => `${this.baseurl}/order`
		};

		this.overlookedStorageKey = 'bosanogaOverlooked';
		this.favoriteStorageKey = 'bosanogaFavorite';
		this.cartStorageKey = 'bosanogaCart';

		this.state = {
			fetching: false,
			categories: [],
			favorites: [],
			cartId: undefined,
			cart: [],
			isLoading: true,
			amount:undefined
		};
	}
	
	componentDidMount() {

		
		this.setState({fetching: true}, () => {
			get(`${this.api}/categories`)
					.then(({data}) => {
						this.setState({
							fetching: false,
							categories: data,
							favorites: localStorage.getParsed(this.favoriteStorageKey, []),
							isLoading:false
						})
					})
		});
		this.initCart();

	}

	getChildContext() {
		return {
			api: this.api,
			newApi: this.newApi,
			overlookedStorageKey: this.overlookedStorageKey,
			favoriteStorageKey: this.favoriteStorageKey
		}
	}

	handleFavoriteToggle = favoriteID => {
		const favoritesLS = localStorage.getParsed(this.favoriteStorageKey, []);

		let favorites;

		if (favoritesLS.includes(favoriteID)) {
			favorites = favoritesLS.filter(id => id !== favoriteID);
		} else {
			favorites = favoritesLS.concat([favoriteID]);
		}

		localStorage.setParsed(this.favoriteStorageKey, favorites);
		this.setState({favorites});
	};

	createNewCart = body => {
		const {createCart} = this.newApi;

		return fetch(createCart(), {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})
				.then(responce => responce.json())
				.then(responce => {
					if (responce.status === 'ok') {
						return new Promise(resolve => {
							localStorage.setParsed(this.cartStorageKey, responce.data.id);
							this.setState({
								cartId: responce.data.id,
								cart: [body],
								amount:this.getAmount([body]),
							}, () => resolve());
						})
					} else {
						throw new Error('Create new cart error')
					}
				})
	};

	getAmount = (Arr) => {
		let sum = 0
		for(let i = 0;i<Arr.length;i++) {
			sum = Arr[i].amount + sum
		}
		return sum
	}

	initCart = () => {
		const
			{getCart} = this.newApi,
			storageCartId = localStorage.getParsed(this.cartStorageKey, '');
		return new Promise(resolve => {
			if (storageCartId) {
				return fetch(getCart(storageCartId))
						.then(responce => {
							if (responce.status === 200) {
								return responce.json()
							}
						})		
						.then(json => {
							this.setState({
								cartId: json.data.id,
								cart: json.data.products,
								amount:this.getAmount(json.data.products)
							}, () => resolve());
						})
						.catch(console.error)							
			} else {
				resolve();
			}
		})
	};

	updateCart = body => {
		const
				{updateCart} = this.newApi,
				{cartId} = this.state;

		return new Promise((resolve, reject) => {
			return fetch(updateCart(cartId), {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			})
					.then(responce => responce.json())
					.then(responce => {
						if (responce.status === 'ok') {
							resolve();
						} else {
							reject(new Error('Update cart error'));
						}
					})
		})
	};

	handleUpdateCart = product => {
		const
				{getCart} = this.newApi,
				{cartId} = this.state;

		if (cartId) {
			return this.updateCart(product)
					.then(() => fetch(getCart(cartId)))
					.then(responce => {
						if(responce.status === 404) {
							this.setState({
								cart: [],
								cartId: undefined,
								amount: undefined
							})
						} else {
							
							responce.json()
									.then(({data}) => this.setState({
															cart: data.products,
															amount:this.getAmount(data.products)
														})
									);
						}
					});
		} else {
			return this.createNewCart(product);
		}
	};

	render() {
		const {fetching, categories, favorites, cart, cartId, isLoading, amount} = this.state;
		return (
				<div className="app container">
					{isLoading ? <Preloader /> : null}
					<Header {...this.props} {...this.state}
							fetching={fetching}
							categories={categories}
							handleUpdateCart={this.handleUpdateCart}
							cart={cart}
							amount={amount}
					/>

					<Switch>
						<Route exact path="/" render={props =>
								<HomePage
										fetching={fetching}
										categories={categories}
										favorites={favorites}
										handleFavoriteToggle={this.handleFavoriteToggle}
										{...props}
								/>
						}/>

						<Route
								path="/products"
								render={
									props =>
											categories.length ?
													<CataloguePage
															{...props}
															categories={categories}
															handleFavoriteToggle={this.handleFavoriteToggle}
													/> :
													null
						}/>

						<Route path="/product" render={props =>
								<ProductPage
										{...props}
										handleUpdateCart={this.handleUpdateCart}
										handleFavoriteToggle={this.handleFavoriteToggle}
										favorites={favorites}
								/>
						}/>

						<Route path="/favorites" render={props =>
								<FavoritesPage
										{...props}
										handleFavoriteToggle={this.handleFavoriteToggle}
										favorites={favorites}
								/>}
						/>

						<Route path="/order" render={props =>
							<OrderPage
									{...props}
									cart={cart}
									cartId={cartId}
									handleUpdateCart={this.handleUpdateCart}
							/>}
						/>
					</Switch>

					<Footer/>
				</div>
		);
	}
}

App.childContextTypes = {
	api: PropTypes.string.isRequired,
	newApi: PropTypes.object.isRequired,
	overlookedStorageKey: PropTypes.string.isRequired,
	favoriteStorageKey: PropTypes.string.isRequired,
};

export default App;
